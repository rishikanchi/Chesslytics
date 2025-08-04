import { Dimensions, StyleSheet, Text, View, Alert } from "react-native";
import React, { useCallback } from "react";
import defaultStyles from "@/styles/defaultStyles";
import MyButton from "@/components/MyButton";
import poppins from "@/styles/fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SettingsNavbar from "@/components/SettingsNavbar";
import { useRouter } from "expo-router";
import { useStore } from "@/state/zustand";

const width = Dimensions.get("window").width;

const Settings = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const buttonSpacing = 30;
  const buttonHeight = 100;
  
  // Correctly access store with stable references
  const logout = useStore(state => state.logout);
  const resetAccount = useStore(state => state.resetAccount);
  const deleteAccount = useStore(state => state.deleteAccount);

  // Handle logout
  const handleLogout = useCallback(async () => {
    // Call the logout function from the store
    const success = await logout();
    
    if (success) {
      // Navigate to the login screen
      router.push({ pathname: "/(screens)/login" });
    }
  }, [logout, router]);

  // Handle delete account
  const handleDeleteAccount = useCallback(() => {
    // Show a confirmation dialog
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Show a second confirmation
            Alert.alert(
              "Final Confirmation",
              "All your data will be permanently deleted. Continue?",
              [
                {
                  text: "No, Keep My Account",
                  style: "cancel"
                },
                {
                  text: "Yes, Delete Everything",
                  style: "destructive",
                  onPress: async () => {
                    // Delete account using the store function
                    const success = await deleteAccount();
                    
                    if (success) {
                      // Navigate to the login screen
                      router.push({ pathname: "/(screens)/login" });
                      
                      // Show a success message
                      setTimeout(() => {
                        Alert.alert(
                          "Account Deleted",
                          "Your account has been successfully deleted."
                        );
                      }, 500);
                    } else {
                      // Show an error message
                      Alert.alert(
                        "Error",
                        "Failed to delete account. Please try again later."
                      );
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  }, [deleteAccount, router]);

  // Handle reset account
  const handleResetAccount = useCallback(() => {
    Alert.alert(
      "Reset Account",
      "This will delete all your games and analysis data. Your account will remain, but all progress will be lost. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            // Reset account using the store function
            const success = await resetAccount();
            
            if (success) {
              Alert.alert(
                "Account Reset",
                "Your account data has been reset successfully."
              );
            } else {
              Alert.alert(
                "Error",
                "Failed to reset account. Please try again later."
              );
            }
          }
        }
      ]
    );
  }, [resetAccount]);

  return (
    <>
      <SettingsNavbar />
      <View
        style={[
          defaultStyles.pageContainer,
          styles.mainContainer,
          // To make navbar flush with top
          { paddingTop: insets.top + 56 + 15 },
        ]}
      >
        <MyButton
          title="Log Out"
          onPress={handleLogout}
          width={0.9 * width}
          fontSize={28}
          height={buttonHeight}
          marginBottom={buttonSpacing}
        />
        <MyButton
          title="Change Username"
          onPress={() => Alert.alert("Coming Soon", "This feature will be available in a future update.")}
          width={0.9 * width}
          backgroundColor="#CBD6FF"
          fontColor={"black"}
          fontSize={28}
          height={buttonHeight}
          marginBottom={buttonSpacing}
          dropShadow={false}
        />
        <MyButton
          title="Change Password"
          onPress={() => Alert.alert("Coming Soon", "This feature will be available in a future update.")}
          width={0.9 * width}
          backgroundColor="#CBD6FF"
          fontColor={"black"}
          fontSize={28}
          height={buttonHeight}
          marginBottom={buttonSpacing}
          dropShadow={false}
        />
        <MyButton
          title="Reset Account"
          onPress={handleResetAccount}
          width={0.9 * width}
          backgroundColor="rgba(0, 0, 0, 0)"
          fontColor="#d0342c"
          fontSize={28}
          height={60}
          marginBottom={buttonSpacing}
          dropShadow={false}
        />
        <MyButton
          title="Delete Account"
          onPress={handleDeleteAccount}
          width={0.9 * width}
          backgroundColor="rgba(0, 0, 0, 0)"
          fontColor="#d0342c"
          fontSize={28}
          height={60}
          marginBottom={buttonSpacing}
          dropShadow={false}
        />
      </View>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "flex-start",
  },
});
