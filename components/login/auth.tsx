import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { Alert, AppState } from "react-native";
import { Auth as AppleAuth } from "@/components/auth/Auth.native";
import { Input, Separator, SizableText, Text, XStack, YStack } from "tamagui";
import { StyledButton } from "../button/button";
import { signInWithEmail, signUpWithEmail } from "@/lib/api";
import SignIn from "./sign-in-sheet";
import SignUp from "./sign-up-sheet";

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
  const [openSignInSheet, setOpenSignInSheet] = useState(false);
  const [openSignUpSheet, setOpenSignUpSheet] = useState(false);

  /** Functions and Handlers */

  const handleSignInSheet = () => {
    setOpenSignInSheet(true);
  };

  const handleSignUpSheet = () => {
    setOpenSignUpSheet(true);
  };

  //** Edit this later using tamagui */
  return (
    <YStack
      backgroundColor={"white"}
      height={"100%"}
      gap="$4"
      paddingHorizontal="$6"
      justifyContent="space-between"
    >
      <XStack justifyContent="center" paddingTop={"$10"} paddingBottom={"$10"}>
        <SizableText size="$8">Owemee</SizableText>
      </XStack>
      <YStack gap={"$2"} paddingBottom="$8">
        <StyledButton active={true} onPress={handleSignInSheet}>
          Sign in
        </StyledButton>
        <StyledButton onPress={handleSignUpSheet}>Sign up</StyledButton>
      </YStack>
      <SignIn open={openSignInSheet} setOpen={setOpenSignInSheet} />
      <SignUp open={openSignUpSheet} setOpen={setOpenSignUpSheet} />
    </YStack>
  );
}
