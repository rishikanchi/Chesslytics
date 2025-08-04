import MyButton from "@/components/MyButton";
import { useStore } from "@/state/zustand";
import colors from "@/styles/colors";
import defaultStyles from "@/styles/defaultStyles";
import poppins from "@/styles/fonts";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get the login function from the store
  const login = useStore((state) => state.login);

  const handleLogin = async () => {
    console.log("Starting login process...");
    // Reset error message
    setError("");

    // Validate inputs
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Calling login function with email:", email);

      // Call the login function from the store
      const success = await login(email, password);
      console.log("Login function returned:", success);

      if (success) {
        console.log("Login successful, waiting for state update...");
        // Wait a brief moment to ensure state is updated
        await new Promise((resolve) => setTimeout(resolve, 100));
        console.log("Attempting navigation to home...");
        // Navigate to home page on success
        router.replace({ pathname: "/(screens)/home" });
        console.log("Navigation command executed");
      } else {
        // If login returns false, show error message
        setError("Invalid email or password");
      }
    } catch (e) {
      console.log("Error during login:", e);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <Text style={[defaultStyles.heading, styles.heading]}>Login here</Text>
      <Text style={[defaultStyles.darkText, styles.subtitle]}>
        Login so you can analyze all your chess games, new and old.
      </Text>

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.inputCont}>
        <TextInput
          style={defaultStyles.textInput}
          placeholder="Email"
          placeholderTextColor={"#626262"}
          value={email}
          onChangeText={(it) => setEmail(it)}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={defaultStyles.textInput}
          placeholder={"Password"}
          placeholderTextColor={"#626262"}
          value={password}
          onChangeText={(it) => setPassword(it)}
          textContentType="password"
          secureTextEntry={true}
        />
      </View>
      <MyButton
        title={isLoading ? "Signing In..." : "Sign In"}
        onPress={handleLogin}
        width={330}
        marginBottom={40}
      />
      <TouchableWithoutFeedback
        onPress={() => router.push({ pathname: "/(screens)/signup" })}
      >
        <Text style={[defaultStyles.darkText, styles.createAccount]}>
          Create new account
        </Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  heading: {
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: poppins.medium,
    textAlign: "center",
    marginHorizontal: 16,
    marginBottom: 70,
  },
  inputCont: {
    marginBottom: 60,
  },
  createAccount: {
    fontFamily: poppins.semiBold,
    color: "#494949",
  },
  errorText: {
    color: colors.blunder,
    fontFamily: poppins.medium,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    marginHorizontal: 20,
  },
});
