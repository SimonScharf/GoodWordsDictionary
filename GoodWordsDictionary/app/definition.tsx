import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Ionicons name="home" size={24} color="#ffffff" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Ionicons name="book-outline" size={70} color="#ffffff" style={styles.bookIcon} />
          <Text style={styles.word}>{word}</Text>
        </View>
        
        <View style={styles.definitionCard}>
          <View style={styles.labelContainer}>
            <Ionicons name="information-circle" size={24} color="#666" style={styles.infoIcon} />
            <Text style={styles.definitionLabel}>Definition</Text>
          </View>
          <Text style={styles.definition}>{definition}</Text>
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
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  bookIcon: {
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
  word: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    textTransform: "capitalize",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  definitionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    maxWidth: 350,
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 8,
  },
  definitionLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  definition: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "400",
  },
});
