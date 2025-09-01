import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Definition() {
  const router = useRouter();
  const { word, definition } = useLocalSearchParams<{
    word: string;
    definition: string;
  }>();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Ionicons name="home" size={24} color="#007AFF" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.word}>{word}</Text>
        <Text style={styles.definitionLabel}>Definition:</Text>
        <Text style={styles.definition}>{definition}</Text>
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
  word: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 30,
    textAlign: "center",
  },
  definitionLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  definition: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 10,
  },
});
