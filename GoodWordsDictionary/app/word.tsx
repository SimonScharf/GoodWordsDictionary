import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";

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
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Ionicons name="home" size={24} color="#ffffff" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Ionicons name="calendar" size={70} color="#ffffff" style={styles.calendarIcon} />
          <Text style={styles.title}>Your Word of the Day</Text>
        </View>
        
        <View style={styles.wordCard}>
          <Text style={styles.word}>{currentWord.word}</Text>
          
          {wordStats && (
            <Text style={styles.progressText}>
              Word {wordStats.shownToday} of {wordStats.totalWords} • {wordStats.currentDate}
            </Text>
          )}
          
          <Button
            title="See Definition"
            onPress={handleSeeDefinition}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            icon={<Ionicons name="eye" size={20} color="#ffffff" style={{ marginRight: 8 }} />}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  homeButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  calendarIcon: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  wordCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
    minWidth: 300,
  },
  word: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
    textTransform: "capitalize",
  },
  progressText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "500",
  },
});
