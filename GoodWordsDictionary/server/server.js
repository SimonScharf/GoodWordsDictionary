const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to the dictionary file
const dictionaryPath = path.join(__dirname, '../assets/dictionary.json');

// GET /api/words - Get all words from dictionary
app.get('/api/words', (req, res) => {
  try {
    const data = fs.readFileSync(dictionaryPath, 'utf8');
    const dictionary = JSON.parse(data);
    res.json(dictionary);
  } catch (error) {
    console.error('Error reading dictionary:', error);
    res.status(500).json({ error: 'Failed to read dictionary' });
  }
});

// POST /api/words - Add a new word to dictionary
app.post('/api/words', (req, res) => {
  try {
    const { word, definition } = req.body;
    
    if (!word || !definition) {
      return res.status(400).json({ error: 'Word and definition are required' });
    }

    // Read current dictionary
    const data = fs.readFileSync(dictionaryPath, 'utf8');
    const dictionary = JSON.parse(data);
    
    // Check if word already exists
    const existingWord = dictionary.words.find(w => w.word.toLowerCase() === word.toLowerCase());
    if (existingWord) {
      return res.status(409).json({ error: 'Word already exists in dictionary' });
    }
    
    // Add new word
    const newWord = {
      word: word.trim().toLowerCase(),
      definition: definition.trim()
    };
    
    dictionary.words.push(newWord);
    
    // Write back to file
    fs.writeFileSync(dictionaryPath, JSON.stringify(dictionary, null, 2));
    
    res.json({ 
      message: 'Word added successfully', 
      word: newWord,
      totalWords: dictionary.words.length 
    });
    
  } catch (error) {
    console.error('Error adding word:', error);
    res.status(500).json({ error: 'Failed to add word' });
  }
});

// GET /api/words/random - Get a random word
app.get('/api/words/random', (req, res) => {
  try {
    const data = fs.readFileSync(dictionaryPath, 'utf8');
    const dictionary = JSON.parse(data);
    const randomIndex = Math.floor(Math.random() * dictionary.words.length);
    const randomWord = dictionary.words[randomIndex];
    
    res.json(randomWord);
  } catch (error) {
    console.error('Error getting random word:', error);
    res.status(500).json({ error: 'Failed to get random word' });
  }
});

// GET /api/health - Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dictionary server is running' });
});

app.listen(PORT, () => {
  console.log(`Dictionary server running on http://localhost:${PORT}`);
  console.log(`Dictionary file: ${dictionaryPath}`);
});
