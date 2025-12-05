import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const StatusScreen = () => {
  //retrieve patient status data (hardcoded for now)
  const patientStatus = {
    name: "Ali Hassan",
    id: "P–5632–8",
    xrayImage: require("../../assets/placeholders/Xrayimage.jpeg"),
    classificationResult: "Pneumonia",
    diagnosisDate: "April 6, 2025",
    caseStatus: "Reviewed",
    reviewStatus: "Reviewed by Doctor",
    time: "03:47 PM",
    submittedBy: "Mahnoor",
    submitterId: "HW–2345–67",
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.patientName}>Ali Hassan</Text>
            <Text style={styles.patientId}>P–5632–8</Text>
          </View>
        </View>

        {/* X-ray and Classification Result */}
        <View style={styles.resultCard}>
          <Image
            source={require("../../assets/placeholders/Xrayimage.jpeg")}
            style={styles.xrayImage}
          />
          <View style={styles.resultTextContainer}>
            <Text style={styles.resultLabel}>Classification Result</Text>
            <Text style={styles.resultValue}>Pneumonia</Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <DetailRow label="Diagnosis Date" value="April 6, 2025" />
          <DetailRow label="Case Status" value="Reviewed" />
          <DetailRow label="Review Status" value="Reviewed by Doctor" />
          <DetailRow label="Time" value="03:47 PM" />
          <DetailRow label="Was submitted by" value="Mahnoor" />
          <DetailRow label="" value="HW–2345–67" />
        </View>

        {/* Back to Home button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/startscreens/patientDashboard" as any)}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <View style={styles.navbar}>
          <Icon name="home" size={26} color="#2974f0" />
          <Icon name="folder-outline" size={26} color="#ccc" />
          <Icon name="person-outline" size={26} color="#ccc" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type DetailRowProps = {
  label: string;
  value: string;
};

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default StatusScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.09,
  },
  patientName: { fontSize: width * 0.05, fontWeight: "bold", color: "#333" },
  patientId: { fontSize: width * 0.04, color: "#333", fontWeight: "600" },
  profileImage: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: (width * 0.2) / 2,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    margin: width * 0.05,
    borderRadius: 15,
    padding: width * 0.04,
  },
  xrayImage: { width: width * 0.32, height: width * 0.32, borderRadius: 10 },
  resultTextContainer: { marginLeft: width * 0.05 },
  resultLabel: { fontSize: width * 0.045, color: "#333" },
  resultValue: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  detailsContainer: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: width * 0.05,
    borderRadius: 15,
    padding: width * 0.04,
    marginTop: height * 0.02,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.025,
  },
  detailLabel: { fontSize: width * 0.04, color: "#555" },
  detailValue: {
    fontSize: width * 0.04,
    color: "#333",
    fontWeight: "600",
    textAlign: "left",
  },
  backButton: {
    backgroundColor: "#1a78d2",
    borderRadius: 30,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.3,
    alignSelf: "center",
    marginTop: height * 0.03,
  },
  backButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    verticalAlign: "bottom",
    paddingVertical: height * 0.015,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    marginTop: height * 0.1,
  },
});
