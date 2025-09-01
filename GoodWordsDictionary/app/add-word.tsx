import { Text, View, TouchableOpacity, StyleSheet, TextInput, Alert, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const API_BASE_URL = 'http://localhost:3001/api';
const DICTIONARY_API_KEY = 'fe32eda5-af52-4576-94a4-f24ea5e76075';

export default function AddWord() {
  const router = useRouter();
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [autoFetchDefinition, setAutoFetchDefinition] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoHome = () => {
    router.push("/");
  };

  const fetchDefinitionFromAPI = async (wordToLookup: string) => {
    try {
      const response = await fetch(
        `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${encodeURIComponent(wordToLookup)}?key=${DICTIONARY_API_KEY}`
      );
      const data = await response.json();
      
      if (data && data.length > 0 && data[0].shortdef && data[0].shortdef.length > 0) {
        return data[0].shortdef[0]; // Return first definition
      }
      return null;
    } catch (error) {
      console.error("Error fetching definition:", error);
      return null;
    }
  };

  const handleSaveWord = async () => {
    if (!word.trim()) {
      Alert.alert("Error", "Please enter a word");
      return;
    }

    setIsLoading(true);
    let finalDefinition = definition.trim();

    try {
      // If auto-fetch is enabled and no definition provided, try to fetch from API
      if (autoFetchDefinition && !finalDefinition) {
        const apiDefinition = await fetchDefinitionFromAPI(word.trim());
        if (apiDefinition) {
          finalDefinition = apiDefinition;
        } else {
          setIsLoading(false);
          Alert.alert(
            "Something went wrong", 
            "Could not find definition for this word. Please enter a definition manually.",
            [{ text: "OK" }]
          );
          return;
        }
      }

      // If still no definition, require manual input
      if (!finalDefinition) {
        setIsLoading(false);
        Alert.alert("Error", "Please enter a definition");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/words`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: word.trim().toLowerCase(),
          definition: finalDefinition
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
    } finally {
      setIsLoading(false);
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
        
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Auto-fetch definition</Text>
          <Switch
            value={autoFetchDefinition}
            onValueChange={setAutoFetchDefinition}
            trackColor={{ false: "#767577", true: "#007AFF" }}
            thumbColor={autoFetchDefinition ? "#ffffff" : "#f4f3f4"}
          />
        </View>
        
        <TextInput
          style={[styles.input, styles.definitionInput]}
          placeholder={autoFetchDefinition ? "Enter definition (optional)" : "Enter definition"}
          value={definition}
          onChangeText={setDefinition}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleSaveWord}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Adding Word..." : "Save Word"}
          </Text>
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
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
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
