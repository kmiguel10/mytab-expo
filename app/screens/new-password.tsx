import { Text, useWindowDimensions, Linking } from "react-native";
import React, { useState, useEffect } from "react";
import { Card, SizableText, View, XStack, YStack } from "tamagui";
import { StyledInput } from "@/components/input/input";
import { StyledButton } from "@/components/button/button";
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { supabase } from "@/lib/supabase";

const NewPassword = () => {
  const { width } = useWindowDimensions();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordSent, setIsPasswordSent] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordsMatch, setIsPasswordsMatch] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    // Check if the component was opened via Universal Link
    handleUniversalLink();
  }, []);

  const handleUniversalLink = async () => {
    const url = await Linking.getInitialURL();
    if (url) {
      // Ensure that the URL is properly parsed and processed
      const params = parseUrlParameters(url);
      console.log("Params from universal link:", params);
      //   if (params && params.token) {
      //     console.log("Received token:", params.token);
      //     handlePasswordUpdate(params.token); // Assuming this function handles token update
      //   }
    }
  };

  const parseUrlParameters = (url: string) => {
    const queryString = url.split("?")[1];
    if (!queryString) {
      return {}; // Return an empty object if no query parameters found
    }
    const searchParams = new URLSearchParams(queryString);
    const token = searchParams.get("token");
    return { token }; // Ensure that token is returned as an object property
  };

  const handlePasswordUpdate = async () => {
    try {
      await supabase.auth.updateUser({ password: password });

      // Perform actions with token, update state, etc.
      setIsPasswordSent(true);
      setErrorMessage("");
      setIsError(false);
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setIsError(true);
    }
  };

  const validatePasswords = () => {
    if (password === confirmPassword && password.length > 0) {
      setIsPasswordsMatch(true);
      setErrorMessage("");
      setIsError(false);
    } else {
      setIsPasswordsMatch(false);
      setErrorMessage("Passwords do not match");
      setIsError(true);
    }
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    setIsError(false);
  };

  const handleConfirmPasswordChange = (password: string) => {
    setConfirmPassword(password);
    setIsError(false);
  };

  useEffect(() => {
    setIsButtonDisabled(!(password === confirmPassword && password.length > 0));
  }, [password, confirmPassword]);

  const navigateToScreen = () => {
    // Implement navigation logic if needed
    // Example: Use React Navigation to navigate to another screen
  };

  return (
    <View
      backgroundColor={"white"}
      height={"100%"}
      alignContent="center"
      padding={"$4"}
      gap={"$4"}
    >
      <YStack width={width * 0.9} justifyContent="center" gap={"$2"}>
        {isError && (
          <Card backgroundColor={"$red5Light"}>
            <Card.Header>
              <SizableText color={"$red10Light"}>{errorMessage}</SizableText>
            </Card.Header>
          </Card>
        )}
        <View>
          <SizableText size="$4" paddingBottom={"$2"}>
            Enter new password:
          </SizableText>
          <XStack width={"100%"} justifyContent="space-between">
            <StyledInput
              autoFocus={true}
              value={password}
              onChangeText={handlePasswordChange}
              placeholder="New Password"
              disabled={isPasswordSent}
              secureTextEntry={!showPassword}
              width={width * 0.7}
            />
            <StyledButton
              icon={showPassword ? <EyeOff size={"$1"} /> : <Eye size={"$1"} />}
              onPress={() => setShowPassword(!showPassword)}
            />
          </XStack>
        </View>
        <View paddingTop={"$2"}>
          <SizableText size="$4" paddingBottom={"$2"}>
            Confirm new password:
          </SizableText>
          <StyledInput
            autoFocus={false}
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            onBlur={validatePasswords}
            placeholder="Confirm New Password"
            disabled={isPasswordSent}
            secureTextEntry={!showPassword}
            width={width * 0.7}
          />
        </View>
        <XStack justifyContent="flex-end" width={width * 0.9} paddingTop={"$4"}>
          <StyledButton
            active={!isButtonDisabled}
            onPress={handlePasswordUpdate}
            disabled={isButtonDisabled}
          >
            Create Password
          </StyledButton>
        </XStack>
      </YStack>
    </View>
  );
};

export default NewPassword;
