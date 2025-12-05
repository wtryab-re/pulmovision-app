import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function PatientCasesScreen() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.name}>{}</Text>
        <Text style={styles.id}>{}</Text>
      </View>
    </SafeAreaProvider>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  id: {
    fontSize: 18,
    color: "#666",
  },
});
