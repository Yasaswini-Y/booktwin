export const calculateJaccardSimilarity = (listA, listB) => {
  if (!listA || !listB || (listA.length === 0 && listB.length === 0)) return 0;
  const setA = new Set(listA);
  const setB = new Set(listB);
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
};

export const getCompatibilityScore = (userA, userB) => {
  const booksA = userA.favoriteBooks.map(b => b.id);
  const booksB = userB.favoriteBooks.map(b => b.id);
  
  const booksScore = calculateJaccardSimilarity(booksA, booksB);
  const genresScore = calculateJaccardSimilarity(userA.favoriteGenres, userB.favoriteGenres);
  
  // Weight books more since they are specific
  const totalScore = (booksScore * 0.6) + (genresScore * 0.4);
  
  return Math.round(totalScore * 100);
}

export const getSharedItems = (userA, userB) => {
  const booksA = userA.favoriteBooks.map(b => b.id);
  const booksB = userB.favoriteBooks.map(b => b.id);
  const sharedBookIds = booksA.filter(id => booksB.includes(id));
  
  return {
    books: userA.favoriteBooks.filter(b => sharedBookIds.includes(b.id)),
    genres: userA.favoriteGenres.filter(g => userB.favoriteGenres.includes(g))
  };
}
