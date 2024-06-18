import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { Alert, AppState } from "react-native";
import { Auth as AppleAuth } from "@/components/auth/Auth.native";
import { Input, Separator, Text, XStack, YStack } from "tamagui";
import { StyledButton } from "../button/button";
import { signInWithEmail, signUpWithEmail } from "@/lib/api";

/**
 * Tells Supabase Auth to continuously refresh the session automatically if the app is in the foreground. When this is added, you will continue to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event if the user's session is terminated. This should only be registered once.
 */

// Auto refresh state listener
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  /** States and Variables */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /** Functions and Handlers */
  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithEmail(email, password);

    if (error) {
      Alert.alert(error.message);
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { session, error } = await signUpWithEmail(email, password);

    if (error) {
      Alert.alert(error.message);
      setEmail("");
      setPassword("");
    }
    if (session) {
      Alert.alert("Please check your inbox for email verification!");
    }
    setLoading(false);
  };

  //** Edit this later using tamagui */
  return (
    <YStack
      backgroundColor={"white"}
      height={"100%"}
      gap="$4"
      paddingHorizontal="$8"
    >
      <XStack justifyContent="center" paddingTop={"$10"} paddingBottom={"$10"}>
        <Text>My Tab</Text>
      </XStack>
      <XStack justifyContent="center">
        <AppleAuth />
      </XStack>
      <XStack alignItems="center" gap="$2">
        <Separator />
        <Text> or </Text>
        <Separator />
      </XStack>
      <YStack gap={"$2"}>
        <Input
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
        <Input
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </YStack>
      <YStack gap={"$2"}>
        <StyledButton
          active={!loading && !!email && !!password}
          disabled={loading || !email || !password}
          onPress={handleSignIn}
        >
          Sign in
        </StyledButton>
        <StyledButton
          active={!loading && !!email && !!password}
          disabled={loading || !email || !password}
          onPress={handleSignUp}
        >
          Sign up
        </StyledButton>
      </YStack>
    </YStack>
  );
}
