import { Text, View, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CUSTOM_WORDS_KEY = 'customWords';

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
      // Get existing custom words from AsyncStorage
      const existingCustomWords = await AsyncStorage.getItem(CUSTOM_WORDS_KEY);
      const customWords = existingCustomWords ? JSON.parse(existingCustomWords) : [];
      
      // Add new word
      const newWord = {
        word: word.trim().toLowerCase(),
        definition: definition.trim()
      };
      
      customWords.push(newWord);
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(customWords));
      
      Alert.alert("Success", "Word added successfully!", [
        { text: "OK", onPress: () => router.push("/") }
      ]);
      
    } catch (error) {
      Alert.alert("Error", "Failed to save word. Please try again.");
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

// Export function to get all words (original + custom)
export const getAllWords = async () => {
  const originalWords = require("../assets/dictionary.json").words;
  
  try {
    const existingCustomWords = await AsyncStorage.getItem(CUSTOM_WORDS_KEY);
    const customWords = existingCustomWords ? JSON.parse(existingCustomWords) : [];
    return [...originalWords, ...customWords];
  } catch (error) {
    console.error("Error loading custom words:", error);
    return originalWords;
  }
};
