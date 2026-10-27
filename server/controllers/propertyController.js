import { storage } from '../data/storage.js';

// @desc    Get all properties with filtering, searching, and sorting
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const { type, minRent, maxRent, furnishing, bedrooms, search, sort } = req.query;

    const properties = await storage.getProperties({
      type,
      minRent,
      maxRent,
      furnishing,
      bedrooms,
      search,
      sort
    });

    return res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('getProperties error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve properties.'
    });
  }
};

// @desc    Get recent properties for homepage
// @route   GET /api/properties/recent
// @access  Public
export const getRecentProperties = async (req, res) => {
  try {
    const all = await storage.getProperties({ sort: 'newest' });
    const recent = all.slice(0, 6);
    return res.json({
      success: true,
      count: recent.length,
      data: recent
    });
  } catch (error) {
    console.error('getRecentProperties error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve recent properties.'
    });
  }
};

// @desc    Get stats (counts of House, Flat, Apartment, Total)
// @route   GET /api/properties/stats
// @access  Public
export const getPropertyStats = async (req, res) => {
  try {
    const stats = await storage.getStats();
    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('getPropertyStats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve property statistics.'
    });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const property = await storage.getPropertyById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.'
      });
    }

    return res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('getPropertyById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve property details.'
    });
  }
};

// @desc    Get properties listed by the logged in retailer
// @route   GET /api/properties/my/listings
// @access  Private (Retailer only)
export const getMyProperties = async (req, res) => {
  try {
    const properties = await storage.getPropertiesByOwner(req.user.id || req.user._id);

    return res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('getMyProperties error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch your property listings.'
    });
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Retailer only)
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      propertyType,
      location,
      city,
      rent,
      bedrooms,
      bathrooms,
      furnishing,
      phone,
      imageUrl,
      description,
      amenities
    } = req.body;

    // Validation
    if (!title || !propertyType || !location || !rent || !bedrooms || !bathrooms || !furnishing) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory details (title, type, location, rent, bedrooms, bathrooms, furnishing).'
      });
    }

    // Default image if not provided
    const defaultImages = {
      House: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      Flat: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      Apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
    };

    const finalImage = imageUrl && imageUrl.trim() !== '' ? imageUrl.trim() : (defaultImages[propertyType] || defaultImages.Apartment);

    // Process amenities array if passed as comma separated or array
    let processedAmenities = ['Water Supply', 'Car Parking'];
    if (Array.isArray(amenities)) {
      processedAmenities = amenities;
    } else if (typeof amenities === 'string' && amenities.trim() !== '') {
      processedAmenities = amenities.split(',').map((a) => a.trim()).filter(Boolean);
    }

    // Validate 10-digit phone number
    const rawPhone = phone || req.user.phone || '';
    const cleanPhone = rawPhone.toString().replace(/\D/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Contact phone number must be exactly 10 digits (e.g. 9876543210).'
      });
    }

    const newProperty = await storage.createProperty({
      title: title.trim(),
      propertyType,
      location: location.trim(),
      city: (city || '').trim(),
      rent: Number(rent),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      furnishing,
      phone: cleanPhone,
      imageUrl: finalImage,
      description: (description || '').trim(),
      amenities: processedAmenities,
      owner: req.user.id || req.user._id,
      ownerName: req.user.name
    });

    return res.status(201).json({
      success: true,
      message: 'Property listed successfully!',
      data: newProperty
    });
  } catch (error) {
    console.error('createProperty error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create property listing. Please try again.'
    });
  }
};

// @desc    Update a property listing
// @route   PUT /api/properties/:id
// @access  Private (Retailer only - must own property)
export const updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const ownerId = req.user.id || req.user._id;

    const existing = await storage.getPropertyById(propertyId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.'
      });
    }

    const existingOwnerId = existing.owner?._id || existing.owner;
    if (String(existingOwnerId) !== String(ownerId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this property listing.'
      });
    }

    const {
      title,
      propertyType,
      location,
      city,
      rent,
      bedrooms,
      bathrooms,
      furnishing,
      phone,
      imageUrl,
      description,
      amenities
    } = req.body;

    let processedAmenities = existing.amenities;
    if (Array.isArray(amenities)) {
      processedAmenities = amenities;
    } else if (typeof amenities === 'string') {
      processedAmenities = amenities.split(',').map((a) => a.trim()).filter(Boolean);
    }

    let cleanPhoneUpdate;
    if (phone !== undefined) {
      cleanPhoneUpdate = phone.toString().replace(/\D/g, '');
      if (!/^\d{10}$/.test(cleanPhoneUpdate)) {
        return res.status(400).json({
          success: false,
          message: 'Contact phone number must be exactly 10 digits (e.g. 9876543210).'
        });
      }
    }

    const updateData = {
      ...(title && { title: title.trim() }),
      ...(propertyType && { propertyType }),
      ...(location && { location: location.trim() }),
      ...(city !== undefined && { city: city.trim() }),
      ...(rent !== undefined && { rent: Number(rent) }),
      ...(bedrooms !== undefined && { bedrooms: Number(bedrooms) }),
      ...(bathrooms !== undefined && { bathrooms: Number(bathrooms) }),
      ...(furnishing && { furnishing }),
      ...(cleanPhoneUpdate && { phone: cleanPhoneUpdate }),
      ...(imageUrl && { imageUrl: imageUrl.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(amenities !== undefined && { amenities: processedAmenities })
    };

    const updated = await storage.updateProperty(propertyId, updateData, ownerId);

    return res.json({
      success: true,
      message: 'Property updated successfully!',
      data: updated
    });
  } catch (error) {
    console.error('updateProperty error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update property.'
    });
  }
};

// @desc    Delete a property listing
// @route   DELETE /api/properties/:id
// @access  Private (Retailer only - must own property)
export const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const ownerId = req.user.id || req.user._id;

    const existing = await storage.getPropertyById(propertyId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.'
      });
    }

    const existingOwnerId = existing.owner?._id || existing.owner;
    if (String(existingOwnerId) !== String(ownerId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property listing.'
      });
    }

    const deleted = await storage.deleteProperty(propertyId, ownerId);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: 'Could not delete property.'
      });
    }

    return res.json({
      success: true,
      message: 'Property deleted successfully!'
    });
  } catch (error) {
    console.error('deleteProperty error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete property.'
    });
  }
};
