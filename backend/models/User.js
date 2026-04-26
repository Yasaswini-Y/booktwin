import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  id: String,
  title: String,
  author: String,
  coverUrl: String
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    // No longer required at creation time so we can register first, onboard later.
  },
  avatar: {
    type: String,
  },
  tagline: {
    type: String,
  },
  bio: {
    type: String,
  },
  favoriteBooks: [bookSchema],
  favoriteGenres: [String],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
