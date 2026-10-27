import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6
    },
    phone: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
      trim: true
    },
    role: {
      type: String,
      enum: ['tenant', 'retailer', 'owner'],
      default: 'tenant'
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
