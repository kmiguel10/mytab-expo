import { StyledButton } from "@/components/button/button";
import { StyledInput } from "@/components/input/input";
import { supabase } from "@/lib/supabase"; // Adjust this path as per your setup
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Card, SizableText, View, XStack, YStack } from "tamagui";

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
  const [access_token, setAccessToken] = useState("");
  const [refresh_token, setRefreshToken] = useState("");

  const router = useRouter();

  useEffect(() => {
    handleUniversalLink();
  }, []);

  const handleUniversalLink = async () => {
    const url = await Linking.getInitialURL();

    if (url) {
      const params = parseUrlParameters(url);
      if (params.access_token) {
        setAccessToken(params.access_token);
        setRefreshToken(params.refresh_token);
        authenticateUser(params.access_token, params.refresh_token);
      }
    }
  };

  const parseUrlParameters = (url: string) => {
    const queryString = url.split("#")[1];
    if (!queryString) {
      return {};
    }
    const searchParams = new URLSearchParams(queryString);
    return Object.fromEntries(searchParams.entries());
  };

  const authenticateUser = async (_token: string, _refresh_token: string) => {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: _token,
        refresh_token: _refresh_token, // If you have a refresh token, you can include it here
      });

      if (error) {
        setErrorMessage(
          "An error occurred while authenticating user. Please try again and request another link."
        );
        throw error;
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while authenticating user. Please try again and request another link."
      );
      setIsError(true);
      console.error("Password update error:", error);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (!access_token) {
        throw new Error("Access token is missing.");
      }

      // Proceed with password update
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      // Handle successful password update
      setIsPasswordSent(true);
      setErrorMessage("");
      setIsError(false);

      router.push("/");
    } catch (error) {
      setErrorMessage(
        "An error occurred while updating password. Please try again and request another link."
      );
      setIsError(true);
      console.error("Password update error:", error);
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
          <XStack justifyContent="space-between">
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
