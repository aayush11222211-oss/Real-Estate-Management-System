import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type (House, Flat, or Apartment)'],
      enum: ['House', 'Flat', 'Apartment']
    },
    location: {
      type: String,
      required: [true, 'Please provide a location/address'],
      trim: true
    },
    city: {
      type: String,
      default: ''
    },
    rent: {
      type: Number,
      required: [true, 'Please provide the monthly rent amount'],
      min: [0, 'Rent must be a positive number']
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify number of bedrooms'],
      min: 1
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
      min: 1
    },
    furnishing: {
      type: String,
      required: [true, 'Please specify furnishing status'],
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished']
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone number'],
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
      trim: true
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    },
    description: {
      type: String,
      default: ''
    },
    amenities: {
      type: [String],
      default: ['Water Supply', 'Electricity Backup', 'Car Parking']
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ownerName: {
      type: String,
      default: 'Property Owner'
    }
  },
  {
    timestamps: true
  }
);

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
export default Property;
