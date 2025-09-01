import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

interface WordData {
  word: string;
  definition: string;
}

export default function Word() {
  const router = useRouter();
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [wordStats, setWordStats] = useState<any>(null);

  useEffect(() => {
    const loadTodaysWord = async () => {
      try {
        const { getWordOfTheDay, checkAndResetForNewDay, getWordStats } = require("../utils/wordManager");
        await checkAndResetForNewDay();
        const todaysWord = await getWordOfTheDay();
        const stats = await getWordStats();
        setCurrentWord(todaysWord);
        setWordStats(stats);
      } catch (error) {
        console.error("Error loading word of the day:", error);
        // Fallback to original dictionary
        const dictionaryData = require("../assets/dictionary.json");
        const randomIndex = Math.floor(Math.random() * dictionaryData.words.length);
        setCurrentWord(dictionaryData.words[randomIndex]);
      }
    };

    loadTodaysWord();
  }, []);

  const handleSeeDefinition = () => {
    if (currentWord) {
      router.push({
        pathname: "/definition",
        params: { word: currentWord.word, definition: currentWord.definition }
      });
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };


  if (!currentWord) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Ionicons name="home" size={24} color="#007AFF" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>Your Word of the Day</Text>
        <Text style={styles.word}>{currentWord.word}</Text>
        
        {wordStats && (
          <Text style={styles.progressText}>
            Word {wordStats.shownToday} of {wordStats.totalWords} • {wordStats.currentDate}
          </Text>
        )}
        
        <TouchableOpacity style={styles.button} onPress={handleSeeDefinition}>
          <Text style={styles.buttonText}>See Definition</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  homeButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
    textAlign: "center",
  },
  word: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 20,
    textAlign: "center",
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
