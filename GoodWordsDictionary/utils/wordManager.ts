import AsyncStorage from '@react-native-async-storage/async-storage';

interface WordData {
  word: string;
  definition: string;
}

interface WordHistory {
  date: string;
  shownWords: string[];
  currentWordIndex?: number;
}

const WORD_HISTORY_KEY = 'wordHistory';

// Get today's date as a string (YYYY-MM-DD)
const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Get all available words (original + custom)
const getAllWords = async (): Promise<WordData[]> => {
  try {
    const { getAllWords } = require("../app/add-word");
    return await getAllWords();
  } catch (error) {
    console.error("Error loading words:", error);
    // Fallback to original dictionary
    const originalWords = require("../assets/dictionary.json").words;
    return originalWords;
  }
};

// Load word history from AsyncStorage
const loadWordHistory = async (): Promise<WordHistory[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(WORD_HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error loading word history:', error);
    return [];
  }
};

// Save word history to AsyncStorage
const saveWordHistory = async (history: WordHistory[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(WORD_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving word history:', error);
  }
};

// Get today's word history or create new one
const getTodayHistory = async (): Promise<WordHistory> => {
  const today = getTodayString();
  const wordHistory = await loadWordHistory();
  let todayHistory = wordHistory.find((h: WordHistory) => h.date === today);
  
  if (!todayHistory) {
    todayHistory = {
      date: today,
      shownWords: [],
      currentWordIndex: undefined
    };
    wordHistory.push(todayHistory);
    await saveWordHistory(wordHistory);
  }
  
  return todayHistory;
};

// Get word of the day
export const getWordOfTheDay = async (): Promise<WordData> => {
  const allWords = await getAllWords();
  const todayHistory = await getTodayHistory();
  
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
    
    // Save updated history
    const wordHistory = await loadWordHistory();
    const historyIndex = wordHistory.findIndex((h: WordHistory) => h.date === todayHistory.date);
    if (historyIndex >= 0) {
      wordHistory[historyIndex] = todayHistory;
    }
    await saveWordHistory(wordHistory);
    
    return selectedWord;
  }
  
  // Select a random word from available words
  const randomAvailableIndex = Math.floor(Math.random() * availableWords.length);
  const selectedWord = availableWords[randomAvailableIndex];
  
  // Find the actual index in the full array
  const actualIndex = allWords.findIndex(w => w.word === selectedWord.word);
  
  todayHistory.currentWordIndex = actualIndex;
  todayHistory.shownWords.push(selectedWord.word);
  
  // Save updated history
  const wordHistory = await loadWordHistory();
  const historyIndex = wordHistory.findIndex((h: WordHistory) => h.date === todayHistory.date);
  if (historyIndex >= 0) {
    wordHistory[historyIndex] = todayHistory;
  }
  await saveWordHistory(wordHistory);
  
  return selectedWord;
};

// Check if it's a new day and reset current word
export const checkAndResetForNewDay = async (): Promise<void> => {
  const today = getTodayString();
  const wordHistory = await loadWordHistory();
  const todayHistory = wordHistory.find((h: WordHistory) => h.date === today);
  
  if (!todayHistory) {
    // It's a new day, the next call to getWordOfTheDay will create new history
    return;
  }
};

// Get statistics for debugging
export const getWordStats = async () => {
  const allWords = await getAllWords();
  const todayHistory = await getTodayHistory();
  
  return {
    totalWords: allWords.length,
    shownToday: todayHistory.shownWords.length,
    remainingWords: allWords.length - todayHistory.shownWords.length,
    currentDate: getTodayString()
  };
};

// Clear all word history (useful for testing)
export const clearWordHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(WORD_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing word history:', error);
  }
};
