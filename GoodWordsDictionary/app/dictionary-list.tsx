import { Text, View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

interface WordData {
  word: string;
  definition: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

export default function DictionaryList() {
  const router = useRouter();
  const [words, setWords] = useState<WordData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleWordPress = (word: WordData) => {
    router.push({
      pathname: "/definition",
      params: { word: word.word, definition: word.definition }
    });
  };

  useEffect(() => {
    const loadAllWords = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/words`);
        const data = await response.json();
        setWords(data.words);
      } catch (error) {
        console.error("Error loading words:", error);
        // Fallback to local dictionary
        const originalWords = require("../assets/dictionary.json").words;
        setWords(originalWords);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllWords();
  }, []);

  const renderWordItem = ({ item }: { item: WordData }) => (
    <TouchableOpacity style={styles.wordItem} onPress={() => handleWordPress(item)}>
      <Text style={styles.wordText}>{item.word}</Text>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading dictionary...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Ionicons name="home" size={24} color="#007AFF" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>Complete Dictionary</Text>
        <Text style={styles.subtitle}>{words.length} words</Text>
        
        <FlatList
          data={words}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.word}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
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
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  list: {
    flex: 1,
  },
  wordItem: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  wordText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    textTransform: "capitalize",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
});
