import React, { useState } from "react";
import { Alert, StyleSheet, AppState } from "react-native";
import { supabase } from "@/lib/supabase";
//import { Button } from "react-native-elements";
import { Separator, Text, View, XStack, YStack, Input } from "tamagui";
import { Auth as AppleAuth } from "@/components/auth/Auth.native";
import { StyledButton } from "../button/button";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      setEmail("");
      setPassword("");
    }
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

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
          // label="Email"
          // leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
        <Input
          // label="Password"
          // leftIcon={{ type: "font-awesome", name: "lock" }}
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
          onPress={() => signInWithEmail()}
        >
          Sign in
        </StyledButton>
        <StyledButton
          active={!loading && !!email && !!password}
          disabled={loading || !email || !password}
          onPress={() => signUpWithEmail()}
        >
          Sign up
        </StyledButton>
      </YStack>
    </YStack>
  );
}
