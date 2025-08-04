import MyButton from "@/components/MyButton";
import { useStore } from "@/state/zustand";
import colors from "@/styles/colors";
import defaultStyles from "@/styles/defaultStyles";
import poppins from "@/styles/fonts";
import { User } from "@/utils/sbMethods";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get the createAccount function from the store
  const createAccount = useStore((state) => state.createAccount);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSignUp = async () => {
    // Reset error message
    setError("");

    // Validate inputs
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);

      const user: User = {
        id: -1, // Temporary ID, will be replaced by the database
        email: email,
        password: password,
        games: [],
      };

      // Call the createAccount function from the store
      const success = await createAccount(user);

      if (success) {
        // Wait a brief moment to ensure state is updated
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Navigate to home page on success
        router.replace({ pathname: "/(screens)/home" });
      } else {
        // If createAccount returns false, show error message
        setError("Account creation failed. Email may already be in use.");
      }
    } catch (e) {
      console.log("Error during signup:", e);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <Text style={[defaultStyles.heading, styles.heading]}>
        Create Account
      </Text>
      <Text style={[defaultStyles.darkText, styles.subtitle]}>
        Create an account so you can analyze all your chess games.
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
        <TextInput
          style={defaultStyles.textInput}
          placeholder={"Confirm Password"}
          placeholderTextColor={"#626262"}
          value={confirmPassword}
          onChangeText={(it) => setConfirmPassword(it)}
          textContentType="password"
          secureTextEntry={true}
        />
      </View>
      <MyButton
        title={isLoading ? "Creating..." : "Sign Up"}
        onPress={onSignUp}
        width={330}
        marginBottom={40}
      />
      <TouchableWithoutFeedback
        onPress={() => router.push({ pathname: "/(screens)/login" })}
      >
        <Text style={[defaultStyles.darkText, styles.createAccount]}>
          Already have an account
        </Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  heading: {
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: poppins.medium,
    textAlign: "center",
    marginHorizontal: 16,
    marginBottom: 30,
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
