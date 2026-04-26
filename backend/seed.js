import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const PRESET_BOOKS = [
  { id: "b1", title: "1984", author: "George Orwell", genres: ["Dystopian", "Sci-Fi", "Classic"] },
  { id: "b2", title: "To Kill a Mockingbird", author: "Harper Lee", genres: ["Classic", "Historical"] },
  { id: "b3", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genres: ["Classic", "Romance"] },
  { id: "b4", title: "Pride and Prejudice", author: "Jane Austen", genres: ["Classic", "Romance"] },
  { id: "b5", title: "Dune", author: "Frank Herbert", genres: ["Sci-Fi", "Fantasy"] },
  { id: "b6", title: "The Hobbit", author: "J.R.R. Tolkien", genres: ["Fantasy", "Adventure", "Classic"] },
  { id: "b7", title: "Project Hail Mary", author: "Andy Weir", genres: ["Sci-Fi", "Thriller"] },
  { id: "b8", title: "The Alchemist", author: "Paulo Coelho", genres: ["Philosophy", "Adventure"] },
  { id: "b9", title: "Sapiens", author: "Yuval Noah Harari", genres: ["Non-fiction", "Historical"] },
  { id: "b10", title: "Atomic Habits", author: "James Clear", genres: ["Non-fiction", "Self-help"] },
  { id: "b11", title: "The Hunger Games", author: "Suzanne Collins", genres: ["Dystopian", "Young Adult"] },
  { id: "b12", title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genres: ["Fantasy", "Young Adult", "Adventure"] }
];

const booksById = (ids) => PRESET_BOOKS.filter(b => ids.includes(b.id));

const mockUsers = [
  {
    id: "u1",
    name: "Alice Waverly",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "Sci-Fi enthusiast & tech geek. Love exploring possible futures.",
    favoriteBooks: booksById(["b1", "b5", "b7"]),
    favoriteGenres: ["Sci-Fi", "Dystopian", "Thriller"]
  },
  {
    id: "u2",
    name: "Brandon Styles",
    avatar: "https://i.pravatar.cc/150?img=11",
    bio: "History buff. I like old books and cold weather.",
    favoriteBooks: booksById(["b2", "b3", "b9"]),
    favoriteGenres: ["Classic", "Historical", "Non-fiction"]
  },
  {
    id: "u3",
    name: "Chloe Summers",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Romantic at heart. Always looking for my Mr. Darcy.",
    favoriteBooks: booksById(["b3", "b4", "b8"]),
    favoriteGenres: ["Romance", "Classic", "Philosophy"]
  },
  {
    id: "u4",
    name: "David Chen",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Self-improvement addict and productivity nerd.",
    favoriteBooks: booksById(["b9", "b10", "b7"]),
    favoriteGenres: ["Non-fiction", "Self-help", "Thriller"]
  },
  {
    id: "u5",
    name: "Emma Woodhouse",
    avatar: "https://i.pravatar.cc/150?img=9",
    bio: "Fantasy worlds > Real world.",
    favoriteBooks: booksById(["b5", "b6", "b12"]),
    favoriteGenres: ["Fantasy", "Adventure", "Young Adult"]
  },
  {
    id: "u6",
    name: "Finnick O.",
    avatar: "https://i.pravatar.cc/150?img=13",
    bio: "If it's dystopian, I've read it. May the odds be ever in your favor.",
    favoriteBooks: booksById(["b1", "b11", "b12"]),
    favoriteGenres: ["Dystopian", "Young Adult", "Sci-Fi"]
  },
  {
    id: "u7",
    name: "Giselle B.",
    avatar: "https://i.pravatar.cc/150?img=20",
    bio: "Seeking the meaning of life, one book at a time.",
    favoriteBooks: booksById(["b8", "b10", "b9"]),
    favoriteGenres: ["Philosophy", "Self-help", "Non-fiction"]
  },
  {
    id: "u8",
    name: "Henry Cavil",
    avatar: "https://i.pravatar.cc/150?img=15",
    bio: "Huge nerd. Fantasy and Sci-Fi only.",
    favoriteBooks: booksById(["b5", "b6", "b12"]),
    favoriteGenres: ["Fantasy", "Sci-Fi", "Adventure"]
  },
  {
    id: "u9",
    name: "Isabella Swan",
    avatar: "https://i.pravatar.cc/150?img=16",
    bio: "Classics and young adult fiction are my escape.",
    favoriteBooks: booksById(["b4", "b2", "b11"]),
    favoriteGenres: ["Romance", "Classic", "Young Adult"]
  },
  {
    id: "u10",
    name: "Jack Torrance",
    avatar: "https://i.pravatar.cc/150?img=53",
    bio: "Thriller and suspense. Keep me on the edge of my seat.",
    favoriteBooks: booksById(["b7", "b1", "b10"]),
    favoriteGenres: ["Thriller", "Sci-Fi", "Self-help"]
  }
];

const seedDB = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    console.log('Users Collection Cleared.');

    await User.insertMany(mockUsers);
    console.log('Database Seeded with Mock Users!');

    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

seedDB();
