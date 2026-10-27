import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Property from '../models/Property.js';
import { getIsMongoConnected } from '../config/db.js';
import { getSeedData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'local_db.json');

// Helper to read local json file
const readLocalDB = async () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = await getSeedData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading local db:', err);
    return { users: [], properties: [] };
  }
};

// Helper to write local json file
const writeLocalDB = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local db:', err);
  }
};

// Auto-seed if MongoDB is connected and empty
export const initializeData = async () => {
  if (getIsMongoConnected()) {
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Seeding initial data into MongoDB...');
        const { users, properties } = await getSeedData();
        await User.insertMany(users);
        await Property.insertMany(properties);
        console.log('✅ MongoDB successfully seeded with sample properties and users!');
      }
    } catch (err) {
      console.error('Failed to seed MongoDB:', err);
    }
  } else {
    // Ensure local DB is ready
    await readLocalDB();
  }
};

export const storage = {
  // Find user by email
  async findUserByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (getIsMongoConnected()) {
      return await User.findOne({ email: cleanEmail });
    }
    const db = await readLocalDB();
    return db.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  },

  // Find user by ID
  async findUserById(id) {
    if (getIsMongoConnected()) {
      return await User.findById(id).select('-password');
    }
    const db = await readLocalDB();
    const user = db.users.find((u) => String(u._id) === String(id));
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  // Create user
  async createUser(userData) {
    if (getIsMongoConnected()) {
      const user = await User.create(userData);
      return user;
    }
    const db = await readLocalDB();
    const newUser = {
      _id: 'user_' + Date.now() + Math.random().toString(36).substring(2, 7),
      ...userData,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeLocalDB(db);
    return newUser;
  },

  // Get properties with filtering and sorting
  async getProperties(filters = {}) {
    const { type, minRent, maxRent, furnishing, bedrooms, search, sort } = filters;

    if (getIsMongoConnected()) {
      let query = {};

      if (type && type !== 'All') {
        query.propertyType = type;
      }
      if (furnishing && furnishing !== 'All') {
        query.furnishing = furnishing;
      }
      if (bedrooms && bedrooms !== 'All') {
        if (bedrooms === '4+') {
          query.bedrooms = { $gte: 4 };
        } else {
          query.bedrooms = Number(bedrooms);
        }
      }
      if (minRent || maxRent) {
        query.rent = {};
        if (minRent) query.rent.$gte = Number(minRent);
        if (maxRent) query.rent.$lte = Number(maxRent);
      }
      if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { location: regex }, { city: regex }];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'rent_asc') sortOption = { rent: 1 };
      if (sort === 'rent_desc') sortOption = { rent: -1 };
      if (sort === 'oldest') sortOption = { createdAt: 1 };

      return await Property.find(query).sort(sortOption);
    }

    // Local DB fallback
    const db = await readLocalDB();
    let list = [...db.properties];

    if (type && type !== 'All') {
      list = list.filter((p) => p.propertyType.toLowerCase() === type.toLowerCase());
    }
    if (furnishing && furnishing !== 'All') {
      list = list.filter((p) => p.furnishing.toLowerCase() === furnishing.toLowerCase());
    }
    if (bedrooms && bedrooms !== 'All') {
      if (bedrooms === '4+') {
        list = list.filter((p) => p.bedrooms >= 4);
      } else {
        list = list.filter((p) => Number(p.bedrooms) === Number(bedrooms));
      }
    }
    if (minRent) {
      list = list.filter((p) => p.rent >= Number(minRent));
    }
    if (maxRent) {
      list = list.filter((p) => p.rent <= Number(maxRent));
    }
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.location && p.location.toLowerCase().includes(q)) ||
          (p.city && p.city.toLowerCase().includes(q))
      );
    }

    if (sort === 'rent_asc') {
      list.sort((a, b) => a.rent - b.rent);
    } else if (sort === 'rent_desc') {
      list.sort((a, b) => b.rent - a.rent);
    } else if (sort === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  },

  // Get single property by ID
  async getPropertyById(id) {
    if (getIsMongoConnected()) {
      return await Property.findById(id).populate('owner', 'name email phone');
    }
    const db = await readLocalDB();
    return db.properties.find((p) => String(p._id) === String(id)) || null;
  },

  // Get properties belonging to specific retailer
  async getPropertiesByOwner(ownerId) {
    if (getIsMongoConnected()) {
      return await Property.find({ owner: ownerId }).sort({ createdAt: -1 });
    }
    const db = await readLocalDB();
    return db.properties.filter((p) => String(p.owner) === String(ownerId));
  },

  // Create property
  async createProperty(propertyData) {
    if (getIsMongoConnected()) {
      return await Property.create(propertyData);
    }
    const db = await readLocalDB();
    const newProp = {
      _id: 'prop_' + Date.now() + Math.random().toString(36).substring(2, 7),
      ...propertyData,
      createdAt: new Date().toISOString()
    };
    db.properties.unshift(newProp);
    writeLocalDB(db);
    return newProp;
  },

  // Update property
  async updateProperty(id, updateData, ownerId) {
    if (getIsMongoConnected()) {
      const prop = await Property.findOne({ _id: id, owner: ownerId });
      if (!prop) return null;
      Object.assign(prop, updateData);
      return await prop.save();
    }
    const db = await readLocalDB();
    const index = db.properties.findIndex(
      (p) => String(p._id) === String(id) && String(p.owner) === String(ownerId)
    );
    if (index === -1) return null;
    db.properties[index] = {
      ...db.properties[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    writeLocalDB(db);
    return db.properties[index];
  },

  // Delete property
  async deleteProperty(id, ownerId) {
    if (getIsMongoConnected()) {
      const result = await Property.findOneAndDelete({ _id: id, owner: ownerId });
      return !!result;
    }
    const db = await readLocalDB();
    const initialLength = db.properties.length;
    db.properties = db.properties.filter(
      (p) => !(String(p._id) === String(id) && String(p.owner) === String(ownerId))
    );
    if (db.properties.length < initialLength) {
      writeLocalDB(db);
      return true;
    }
    return false;
  },

  // Stats for category counters and retailer dashboard
  async getStats() {
    const properties = await this.getProperties();
    const houseCount = properties.filter((p) => p.propertyType === 'House').length;
    const flatCount = properties.filter((p) => p.propertyType === 'Flat').length;
    const apartmentCount = properties.filter((p) => p.propertyType === 'Apartment').length;

    return {
      total: properties.length,
      houses: houseCount,
      flats: flatCount,
      apartments: apartmentCount
    };
  }
};
