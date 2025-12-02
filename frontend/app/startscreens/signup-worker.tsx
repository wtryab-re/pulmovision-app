import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_ENDPOINTS, apiCall } from "../api";

const { width, height } = Dimensions.get("window");

// New Error Component
const ErrorText = ({ message }) => {
  if (!message) return null;
  return <Text style={styles.errorText}>{message}</Text>;
};

const WorkerSignupScreen = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [workplace, setWorkplace] = useState("");
  const [jobtitle, setJobTitle] = useState("");
  const [workId, setWorkId] = useState("");
  // New State for Validation Errors
  const [errors, setErrors] = useState({});

  const validateField = (fieldName, value) => {
    let error = null;

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          error = "Name is required.";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = "Email is required.";
        } else if (!emailRegex.test(value.trim())) {
          error = "Please enter a valid email address.";
        }
        break;
      case "age":
        const ageNum = parseInt(value);
        if (!value) {
          error = "Age is required.";
        } else if (isNaN(ageNum) || ageNum < 20 || ageNum > 130) {
          error = "Please enter a valid age (20-130).";
        }
        break;
      case "gender":
        if (!value) {
          error = "Gender is required.";
        }
        break;
      case "phoneNumber":
        const cleanedPhone = value.replace(/\D/g, "");
        if (!value) {
          error = "Phone number is required.";
        } else if (cleanedPhone.length !== 11) {
          error = "Phone number must be exactly 11 digits.";
        }
        break;
      case "cnic":
        if (!value) {
          error = "CNIC is required.";
        } else if (!/^\d{13}$/.test(value)) {
          error = "CNIC must be exactly 13 digits.";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required.";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters long.";
        }
        // Also validate confirm password if password changes
        if (confirmPassword && value !== confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords do not match.",
          }));
        } else if (confirmPassword && value === confirmPassword) {
          setErrors((prev) => ({ ...prev, confirmPassword: null }));
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Confirm password is required.";
        } else if (value !== password) {
          error = "Passwords do not match.";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error; // Return error status
  };

  const validateAllFields = () => {
    // You can call validateField for all states and check for errors in the `errors` state,
    // but for simplicity and to match the original logic, we'll re-call them.
    const fieldsToValidate = [
      validateField("name", name),
      validateField("email", email),
      validateField("age", age),
      validateField("gender", gender),
      validateField("phoneNumber", phoneNumber),
      validateField("cnic", cnic),
      validateField("password", password),
      validateField("confirmPassword", confirmPassword),
    ];

    return fieldsToValidate.every((error) => !error);
  };

  const handleSignUp = async () => {
    if (!validateAllFields()) {
      Alert.alert(
        "Validation Error",
        "Please correct the errors shown below each field before continuing."
      );
      return;
    }

    setLoading(true);

    try {
      const cleanedPhone = phoneNumber.replace(/\D/g, "");
      const ageNum = parseInt(age);

      const payload = {
        name: name.trim(),
        age: ageNum,
        gender,
        phoneNumber: cleanedPhone,
        cnic,
        email: email.trim().toLowerCase(),
        password,
        role: "worker",
      };
      //jobtitle: jobtitle,
      //workplace: workplace
      //workId:workId

      const result = await apiCall(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setLoading(false);

      if (result.success) {
        setShowSuccessPopup(true);
      } else {
        const errorLower = (result.error || "").toLowerCase();
        let errorTitle = "Registration Failed";
        let errorMessage =
          result.error || "Unable to create account. Please try again.";

        // Consolidated Error Mapping
        const errorMap = {
          email: {
            title: "Email Already Registered",
            message:
              "This email is already registered. Please use a different email or try logging in.",
          },
          cnic: {
            title: "CNIC Already Registered",
            message:
              "This CNIC is already registered in our system. Please contact support if you think this is an error.",
          },
          phone: {
            title: "Phone Number Already Registered",
            message:
              "This phone number is already registered. Please use a different number or contact support.",
          },
          network: {
            title: "Network Error",
            message: "Please check your internet connection and try again.",
          },
          connection: {
            title: "Network Error",
            message: "Please check your internet connection and try again.",
          },
          timeout: {
            title: "Connection Timeout",
            message: "Please check your internet connection and try again.",
          },
          validation: {
            title: "Invalid Information",
            message:
              "Some information provided is invalid. Please check all fields and try again.",
          },
          invalid: {
            title: "Invalid Information",
            message:
              "Some information provided is invalid. Please check all fields and try again.",
          },
        };

        const matchingKey = Object.keys(errorMap).find((key) =>
          errorLower.includes(key)
        );

        if (matchingKey) {
          // Check for "already" as a secondary condition for duplicate errors
          if (
            ["email", "cnic", "phone"].includes(matchingKey) &&
            errorLower.includes("already")
          ) {
            errorTitle = errorMap[matchingKey].title;
            errorMessage = errorMap[matchingKey].message;
          } else if (!["email", "cnic", "phone"].includes(matchingKey)) {
            // Apply network/validation errors regardless of "already"
            errorTitle = errorMap[matchingKey].title;
            errorMessage = errorMap[matchingKey].message;
          }
        }

        Alert.alert(errorTitle, errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.error("Signup error:", error);
      Alert.alert(
        "Network Error",
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    }
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    router.replace("/startscreens/workerlogin");
  };

  const handleLoginRedirect = () => {
    router.replace("/startscreens/workerlogin");
  };

  // Keep formatting functions, but integrate live validation
  const formatCNIC = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const limited = cleaned.slice(0, 13);
    setCnic(limited);
    validateField("cnic", limited);
  };

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const limited = cleaned.slice(0, 11);
    setPhoneNumber(limited);
    validateField("phoneNumber", limited);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Added specific platform behavior for better consistency
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={router.back}>
            <Ionicons
              name="chevron-back-outline"
              size={width * 0.08}
              color="#333"
            />
          </TouchableOpacity>
          <Text style={styles.heading}>Worker Signup</Text>
          <View style={{ width: width * 0.08 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Input Fields Section */}
          {/**MAKE A WORKID, WORKPLACE AND JOBTITLE FIELD */}
          <View style={styles.inputSection}>
            {/* Name Input Field */}
            <View>
              <View style={styles.fieldview}>
                <Ionicons
                  name="person-outline"
                  size={width * 0.06}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="gray"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    validateField("name", text);
                  }}
                />
              </View>
              <ErrorText message={errors.name} />
            </View>

            {/* Email Input Field */}
            <View>
              <View style={styles.fieldview}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={width * 0.06}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="gray"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    validateField("email", text);
                  }}
                />
              </View>
              <ErrorText message={errors.email} />
            </View>

            {/* Age Input Field */}
            <View>
              <View style={styles.fieldview}>
                <MaterialCommunityIcons
                  name="calendar-range-outline"
                  size={width * 0.06}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your age"
                  placeholderTextColor="gray"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={(text) => {
                    // Only allow digits for age
                    const cleaned = text.replace(/\D/g, "");
                    setAge(cleaned);
                    validateField("age", cleaned);
                  }}
                />
              </View>
              <ErrorText message={errors.age} />
            </View>

            {/* Gender Input Field */}
            <View>
              <TouchableOpacity
                style={styles.fieldview}
                onPress={() => setShowGenderPicker(true)}
              >
                <Ionicons
                  name="person-outline"
                  size={width * 0.06}
                  color="gray"
                  style={styles.inputIcon}
                />
                <Text style={[styles.input, !gender && styles.placeholder]}>
                  {gender || "Select your gender"}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={width * 0.05}
                  color="gray"
                />
              </TouchableOpacity>
              <ErrorText message={errors.gender} />
            </View>

            {/* Phone Input Field */}
            <View>
              <View style={styles.fieldview}>
                <FontAwesome
                  name="phone"
                  size={width * 0.06}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone (11 digits)"
                  placeholderTextColor="gray"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={formatPhoneNumber} // formatPhoneNumber calls validateField
                  maxLength={11}
                />
              </View>
              <ErrorText message={errors.phoneNumber} />
            </View>

            {/* CNIC Input Field */}
            <View>
              <View style={styles.fieldview}>
                <AntDesign
                  name="idcard"
                  size={width * 0.06}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your CNIC (13 digits)"
                  placeholderTextColor="gray"
                  keyboardType="numeric"
                  value={cnic}
                  onChangeText={formatCNIC} // formatCNIC calls validateField
                  maxLength={13}
                />
              </View>
              <ErrorText message={errors.cnic} />
            </View>

            {/* Create New Password Field */}
            <View>
              <View style={styles.fieldview}>
                <FontAwesome
                  name="lock"
                  size={width * 0.06}
                  color={"gray"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Create new password (min 6 characters)"
                  placeholderTextColor="gray"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    validateField("password", text);
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off" : "eye"}
                    size={width * 0.06}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <ErrorText message={errors.password} />
            </View>

            {/* Confirm Password Field */}
            <View>
              <View style={styles.fieldview}>
                <FontAwesome
                  name="lock"
                  size={width * 0.06}
                  color={"gray"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="gray"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    validateField("confirmPassword", text);
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.passwordToggle}
                >
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={width * 0.06}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <ErrorText message={errors.confirmPassword} />
            </View>
          </View>

          {/* Terms and Privacy Policy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              I agree to the Pulmovision{" "}
              <Text style={styles.termsLink}>ToS</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Already have an account? Login */}
          <View style={styles.loginRedirectContainer}>
            <Text style={styles.loginRedirectText}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={handleLoginRedirect}>
              <Text style={styles.loginRedirectLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Picker Modal */}
      <Modal
        visible={showGenderPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setShowGenderPicker(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                <Ionicons name="close" size={width * 0.07} color="#333" />
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => {
                setGender(itemValue);
                validateField("gender", itemValue); // Live validation for gender
                setShowGenderPicker(false);
              }}
            >
              <Picker.Item label="Select Gender" value="" enabled={!gender} />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Success Popup Modal */}
      <Modal visible={showSuccessPopup} transparent={true} animationType="fade">
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons
                name="checkmark-circle"
                size={width * 0.15}
                color="#4CAF50"
              />
            </View>
            <Text style={styles.successTitle}>Registration Successful!</Text>
            <Text style={styles.successMessage}>
              Your account has been created successfully! Please wait for
              administrator approval before you can log in. You will be notified
              once your account is approved.
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessPopupClose}
            >
              <Text style={styles.successButtonText}>Continue to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WorkerSignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.03,
    alignItems: "center",
  },
  inputSection: {
    width: "100%",
    marginBottom: height * 0.02,
  },
  fieldview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
    paddingHorizontal: width * 0.04,
    height: height * 0.07,
    marginBottom: height * 0.015,
    width: "100%",
  },
  inputIcon: {
    marginRight: width * 0.03,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#333",
    paddingVertical: 0,
    fontFamily: "Poppins_Regular",
  },
  placeholder: {
    color: "gray",
  },
  passwordToggle: {
    paddingLeft: width * 0.02,
  },
  termsContainer: {
    width: "100%",
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.02,
  },
  termsText: {
    fontSize: width * 0.035,
    color: "#555",
    textAlign: "center",
    lineHeight: width * 0.05,
  },
  termsLink: {
    color: "#1a78d2",
    fontWeight: "bold",
  },
  signUpButton: {
    backgroundColor: "#1a78d2",
    width: "100%",
    paddingVertical: height * 0.02,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  loginRedirectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  loginRedirectText: {
    fontSize: width * 0.04,
    color: "#555",
  },
  loginRedirectLink: {
    fontSize: width * 0.04,
    color: "#1a78d2",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: height * 0.03,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
  },
  successModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: width * 0.05,
  },
  successModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: width * 0.06,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: height * 0.02,
  },
  successTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.015,
    textAlign: "center",
  },
  successMessage: {
    fontSize: width * 0.04,
    color: "#555",
    textAlign: "center",
    lineHeight: width * 0.06,
    marginBottom: height * 0.03,
  },
  successButton: {
    backgroundColor: "#1a78d2",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  successButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  // New Style for Error Text
  errorText: {
    color: "#FF3B30", // Red color
    fontSize: width * 0.035,
    marginLeft: width * 0.04,
    marginBottom: height * 0.02, // Add some space below the error message
    marginTop: height * 0.005,
  },
});
