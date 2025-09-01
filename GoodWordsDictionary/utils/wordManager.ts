interface WordData {
  word: string;
  definition: string;
}

interface WordHistory {
  date: string;
  shownWords: string[];
  currentWordIndex?: number;
}

// Global storage for word history (in a real app, you'd use AsyncStorage)
let wordHistory: WordHistory[] = [];

// Get today's date as a string (YYYY-MM-DD)
const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Get all available words (original + custom)
const getAllWords = (): WordData[] => {
  const originalWords = require("../assets/dictionary.json").words;
  // Import custom words from add-word module
  try {
    const { getAllWords } = require("../app/add-word");
    return getAllWords();
  } catch {
    return originalWords;
  }
};

// Get today's word history or create new one
const getTodayHistory = (): WordHistory => {
  const today = getTodayString();
  let todayHistory = wordHistory.find(h => h.date === today);
  
  if (!todayHistory) {
    todayHistory = {
      date: today,
      shownWords: [],
      currentWordIndex: undefined
    };
    wordHistory.push(todayHistory);
  }
  
  return todayHistory;
};

// Get word of the day
export const getWordOfTheDay = (): WordData => {
  const allWords = getAllWords();
  const todayHistory = getTodayHistory();
  
  // If we already have a word for today, return it
  if (todayHistory.currentWordIndex !== undefined) {
    return allWords[todayHistory.currentWordIndex];
  }
  
  // Get words that haven't been shown yet
  const availableWords = allWords.filter((_, index) => 
    !todayHistory.shownWords.includes(allWords[index].word)
  );
  
  // If all words have been shown, reset the pool
  if (availableWords.length === 0) {
    todayHistory.shownWords = [];
    // Start fresh with all words available
    const randomIndex = Math.floor(Math.random() * allWords.length);
    const selectedWord = allWords[randomIndex];
    
    todayHistory.currentWordIndex = randomIndex;
    todayHistory.shownWords.push(selectedWord.word);
    
    return selectedWord;
  }
  
  // Select a random word from available words
  const randomAvailableIndex = Math.floor(Math.random() * availableWords.length);
  const selectedWord = availableWords[randomAvailableIndex];
  
  // Find the actual index in the full array
  const actualIndex = allWords.findIndex(w => w.word === selectedWord.word);
  
  todayHistory.currentWordIndex = actualIndex;
  todayHistory.shownWords.push(selectedWord.word);
  
  return selectedWord;
};

// Check if it's a new day and reset current word
export const checkAndResetForNewDay = (): void => {
  const today = getTodayString();
  const todayHistory = wordHistory.find(h => h.date === today);
  
  if (!todayHistory) {
    // It's a new day, the next call to getWordOfTheDay will create new history
    return;
  }
};

// Get statistics for debugging
export const getWordStats = () => {
  const allWords = getAllWords();
  const todayHistory = getTodayHistory();
  
  return {
    totalWords: allWords.length,
    shownToday: todayHistory.shownWords.length,
    remainingWords: allWords.length - todayHistory.shownWords.length,
    currentDate: getTodayString()
  };
};
