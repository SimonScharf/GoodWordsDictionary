import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text, Card, Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Ionicons name="book" size={80} color="#ffffff" style={styles.dictionaryIcon} />
        <Text style={styles.title}>Good Words Dictionary</Text>
        <Text style={styles.subtitle}>Expand your vocabulary daily</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <View style={styles.card}>
          <Button
            title="Word of the Day"
            onPress={handleWordOfTheDay}
            buttonStyle={[styles.button, styles.primaryButton]}
            titleStyle={styles.buttonText}
            icon={<Ionicons name="calendar-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />}
          />
        </View>
        
        <View style={styles.card}>
          <Button
            title="Add New Word"
            onPress={handleAddWord}
            buttonStyle={[styles.button, styles.secondaryButton]}
            titleStyle={styles.buttonText}
            icon={<Ionicons name="add-circle-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />}
          />
        </View>
        
        <View style={styles.card}>
          <Button
            title="Show Entire Dictionary"
            onPress={handleShowDictionary}
            buttonStyle={[styles.button, styles.tertiaryButton]}
            titleStyle={styles.buttonText}
            icon={<Ionicons name="library-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  dictionaryIcon: {
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
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 350,
  },
  card: {
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: "#FF6B6B",
  },
  secondaryButton: {
    backgroundColor: "#4ECDC4",
  },
  tertiaryButton: {
    backgroundColor: "#45B7D1",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
