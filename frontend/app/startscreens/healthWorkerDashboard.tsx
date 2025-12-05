import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

import { router } from "expo-router"; // Added for navigation

const { width, height } = Dimensions.get("window");

const HealthWorkerDashboard = () => {
  const [currentUser, setCurrentUser] = useState("");
  const userInfo = async () => {
    //fetch user information from secure store
    //setCurrentUser(user);
    try {
      await SecureStore.getItemAsync("user").then((userInfo) => {
        const user = userInfo ? JSON.parse(userInfo) : null;
        if (userInfo) {
          setCurrentUser(user);
        }
      });
    } catch (error) {}
  };
  useEffect(() => {
    userInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hwName}>{currentUser.name}</Text>
          <Text style={styles.hwId}>{currentUser.id}</Text>
        </View>

        <Image
          source={require("../../assets/placeholders/9.jpeg")} // Correct local image path
          style={styles.profileImage}
        />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search patient by ID"
          placeholderTextColor="gray"
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Ionicons name="search" size={width * 0.06} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Submit New Case */}
      <TouchableOpacity
        style={styles.submitCaseContainer}
        onPress={() => router.push("/startscreens/newCase")}
      >
        <View style={styles.submitCaseContent}>
          <Text style={styles.submitCaseTitle}>
            Submit New{"\n"}Case Report
          </Text>
          <Image
            source={require("../../assets/images/newCase.png")} // Adjust path as per your structure
            style={styles.customImageStyle} // Define a separate style for this image
          />
        </View>
        <TouchableOpacity
          style={styles.newCaseButton}
          onPress={() => router.push("/startscreens/newCase")} // Adjust path if needed
        >
          <Text style={styles.newCaseButtonText}>New Case</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Recent Records */}
      <View style={styles.recentRecordsHeader}>
        <Text style={styles.recentRecordsTitle}>Recent Records</Text>
        <TouchableOpacity
          onPress={() => router.push("/startscreens/patientHistory")}
        >
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: width * 0.05,
          marginTop: height * 0.02,
        }}
      >
        <View style={styles.recordCardHorizontal}>
          <Image
            source={require("../../assets/placeholders/1.png")}
            style={styles.recordImage}
          />
          <Text style={styles.recordName}>Hamza Ali</Text>
          <Text style={styles.recordId}>P-1041-1</Text>
          <Text style={styles.recordStatus}>Pending...</Text>
        </View>

        <View style={styles.recordCardHorizontal}>
          <Image
            source={require("../../assets/placeholders/3.jpeg")}
            style={styles.recordImage}
          />
          <Text style={styles.recordName}>Ayaan Tahir</Text>
          <Text style={styles.recordId}>P-3401-8</Text>
          <Text style={styles.recordStatus}>Pending...</Text>
        </View>

        <View style={styles.recordCardHorizontal}>
          <Image
            source={require("../../assets/placeholders/4.jpeg")}
            style={styles.recordImage}
          />
          <Text style={styles.recordName}>Ayesha</Text>
          <Text style={styles.recordId}>P-5671-8</Text>
          <Text style={styles.recordStatus}>Pending...</Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => router.push("/startscreens/healthWorkerDashboard")}
        >
          <Ionicons name="home" size={width * 0.07} color="#1a78d2" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("./notifications")}>
          <Ionicons
            name="notifications-outline"
            size={width * 0.07}
            color="#999"
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="person-outline" size={width * 0.07} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HealthWorkerDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.11,
    // marginTop: height * 0,
  },
  hwName: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
  },
  hwId: {
    fontSize: width * 0.04,
    color: "#333",
    fontWeight: "600",
  },
  profileImage: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: (width * 0.2) / 2,
    // marginLeft: width * 0.08,
    // paddingLeft: width * 0.08,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0eeee",
    borderRadius: 30,
    margin: width * 0.05,
    paddingHorizontal: width * 0,
    marginVertical: width * 0.07,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#333",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
  },
  searchIcon: {
    backgroundColor: "#1a78d2",
    borderRadius: 30,
    padding: width * 0.025,
  },
  submitCaseContainer: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: width * 0.05,
    borderRadius: 20,
    padding: width * 0.05,
    marginBottom: height * 0.03,
  },
  submitCaseContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submitCaseTitle: {
    fontSize: width * 0.06,
    fontWeight: "800",
    color: "#333",
    // paddingHorizontal: width * 0.0,
  },
  newCaseButton: {
    backgroundColor: "#1a78d2",
    borderRadius: 20,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    alignSelf: "flex-start",
    marginTop: height * 0.01,
    marginLeft: width * 0.01,
  },
  newCaseButtonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "700",
  },
  customImageStyle: {
    width: width * 0.3,
    height: width * 0.22,
    top: height * 0.03,
  },
  recentRecordsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.07,
    alignItems: "center",
  },
  recentRecordsTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: width * 0.035,
    color: "#1a78d2",
    fontWeight: "800",
    // textDecorationLine: 'underline',
    borderBottomWidth: 1, // Simulates underline
    borderBottomColor: "#1a78d2",
  },
  recordCard: {
    flex: 1,
    width: "50%",
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    marginBottom: height * 0.015,
    paddingVertical: height * 0.015,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  recordImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    marginBottom: height * 0.01,
  },
  recordName: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#333",
  },
  recordId: {
    fontSize: width * 0.03,
    color: "#333",
  },
  recordStatus: {
    fontSize: width * 0.03,
    color: "#999",
  },
  recordCardHorizontal: {
    width: width * 0.28,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: height * 0.015,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: height * 0.08, // fixed height
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: 30,
  },
});
