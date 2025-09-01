import { Text, View, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const API_BASE_URL = 'http://localhost:3001/api';

export default function AddWord() {
  const router = useRouter();
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");

  const handleGoHome = () => {
    router.push("/");
  };

  const handleSaveWord = async () => {
    if (!word.trim() || !definition.trim()) {
      Alert.alert("Error", "Please enter both a word and definition");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/words`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: word.trim().toLowerCase(),
          definition: definition.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", `Word added successfully! Total words: ${data.totalWords}`, [
          { text: "OK", onPress: () => router.push("/") }
        ]);
      } else {
        Alert.alert("Error", data.error || "Failed to add word");
      }
      
    } catch (error) {
      Alert.alert("Error", "Failed to connect to server. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Ionicons name="home" size={24} color="#007AFF" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>Add New Word</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter word"
          value={word}
          onChangeText={setWord}
          autoCapitalize="none"
        />
        
        <TextInput
          style={[styles.input, styles.definitionInput]}
          placeholder="Enter definition"
          value={definition}
          onChangeText={setDefinition}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleSaveWord}>
          <Text style={styles.buttonText}>Save Word</Text>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  definitionInput: {
    height: 100,
    textAlignVertical: "top",
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
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

// Export function to get all words from backend API
export const getAllWords = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/words`);
    const data = await response.json();
    return data.words;
  } catch (error) {
    console.error("Error loading words from API:", error);
    // Fallback to local dictionary
    const originalWords = require("../assets/dictionary.json").words;
    return originalWords;
  }
};
