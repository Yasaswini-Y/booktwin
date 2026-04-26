import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Message from './models/Message.js';
import { protect } from './middleware/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Jaccard Similarity Logic
const calculateJaccardSimilarity = (listA, listB) => {
  if (!listA || !listB || (listA.length === 0 && listB.length === 0)) return 0;
  const setA = new Set(listA);
  const setB = new Set(listB);
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
};

const getCompatibilityScore = (userA, userB) => {
  const booksA = userA.favoriteBooks.map(b => b.id);
  const booksB = userB.favoriteBooks.map(b => b.id);
  
  const booksScore = calculateJaccardSimilarity(booksA, booksB);
  const genresScore = calculateJaccardSimilarity(userA.favoriteGenres, userB.favoriteGenres);
  
  const totalScore = (booksScore * 0.6) + (genresScore * 0.4);
  return Math.round(totalScore * 100);
};

const getSharedItems = (userA, userB) => {
  const booksA = userA.favoriteBooks.map(b => b.id);
  const booksB = userB.favoriteBooks.map(b => b.id);
  const sharedBookIds = booksA.filter(id => booksB.includes(id));
  
  return {
    books: userA.favoriteBooks.filter(b => sharedBookIds.includes(b.id)),
    genres: userA.favoriteGenres.filter(g => userB.favoriteGenres.includes(g))
  };
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'booktwin_secret_key', {
    expiresIn: '30d',
  });
};

// AUTH ENDPOINTS
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
    });
    
    console.log("Registered User:", user);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("Database User Found:", user);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        favoriteBooks: user.favoriteBooks,
        favoriteGenres: user.favoriteGenres,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PROFILE ENDPOINTS
app.get('/api/profile', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/profile', protect, async (req, res) => {
  try {
    const { name, avatar, bio, favoriteBooks, favoriteGenres } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      user.bio = bio || user.bio;
      user.favoriteBooks = favoriteBooks || user.favoriteBooks;
      user.favoriteGenres = favoriteGenres || user.favoriteGenres;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MATCHES ENDPOINT
app.get('/api/matches', protect, async (req, res) => {
  try {
    const currentUser = req.user;
    
    // We only want to show matches to users who have completed onboarding
    if (!currentUser.favoriteBooks || currentUser.favoriteBooks.length === 0) {
      return res.json([]);
    }

    const otherUsers = await User.find({ _id: { $ne: currentUser._id } });

    const usersWithScores = otherUsers
      .filter(u => u.favoriteBooks && u.favoriteBooks.length > 0) // only match fully onboarded users
      .map(u => {
        const score = getCompatibilityScore(currentUser, u);
        const shared = getSharedItems(currentUser, u);
        return { ...u.toObject(), score, shared };
      });

    const sortedMatches = usersWithScores.sort((a, b) => b.score - a.score);
    res.json(sortedMatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MESSAGES ENDPOINTS
app.post('/api/messages', protect, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Missing receiverId or content' });
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/messages/:userId', protect, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
