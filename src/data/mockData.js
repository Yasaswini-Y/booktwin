import { PRESET_BOOKS } from './constants';

const booksById = (ids) => PRESET_BOOKS.filter(b => ids.includes(b.id));

export const mockUsers = [
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
