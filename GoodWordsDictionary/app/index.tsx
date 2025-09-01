import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const handleWordOfTheDay = () => {
    router.push("/word");
  };

  const handleAddWord = () => {
    router.push("/add-word");
  };

  const handleShowDictionary = () => {
    router.push("/dictionary-list");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Good Words Dictionary</Text>
      <TouchableOpacity style={styles.button} onPress={handleWordOfTheDay}>
        <Text style={styles.buttonText}>See the word of the day!</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryButton} onPress={handleAddWord}>
        <Text style={styles.secondaryButtonText}>Add New Word</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tertiaryButton} onPress={handleShowDictionary}>
        <Text style={styles.tertiaryButtonText}>Show Entire Dictionary</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
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
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  tertiaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#666",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  tertiaryButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
