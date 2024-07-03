import { Auth as AppleAuth } from "@/components/auth/Auth.native";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { AppState, useWindowDimensions } from "react-native";
import {
  Card,
  Input,
  Separator,
  SizableText,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui";
import validator from "validator";
import { StyledButton } from "../button/button";

interface Props {
  emailError: string;
}

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

export const Auth: React.FC<Props> = ({ emailError }) => {
  /** States and Variables */
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [openSignInSheet, setOpenSignInSheet] = useState(false);
  const [openSignUpSheet, setOpenSignUpSheet] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isSendError, setIsSendError] = useState(false);
  const [isSendSuccess, setIsSendSuccess] = useState(false);
  const [titlePadding, setTitlePadding] = useState("$10");
  const { width, height } = useWindowDimensions();
  const errorMessage = "Something went wrong. Please try again.";
  const successMessage =
    "A link is sent to your email. Please close this app before clicking the link.";

  /** Functions and Handlers */

  const handleSignInWithMagicLink = async () => {
    if (validator.isEmail(email)) {
      try {
        const { data, error } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            emailRedirectTo: "https://owemee.app/",
          },
        });

        if (error) {
          console.log("Error:", error);
          setIsSendError(true);
          return;
        }
        setIsSendSuccess(true);
        console.log("Success sending link", data);
      } catch (error) {
        setIsSendError(true);
      }
      //
    } else {
      setIsSendError(true);
      setIsEmailError(true);
    }
  };

  const onEmailChange = (_email: string) => {
    setIsEmailError(false);
    setIsSendError(false);
    setIsSendSuccess(false);
    setEmail(_email);
  };

  /** useState */
  useEffect(() => {
    if (isSendError === true || isSendSuccess === true || !!emailError) {
      setTitlePadding("$6");
    }
  }, [isSendError, isSendSuccess]);

  return (
    <YStack
      backgroundColor={"white"}
      height={"100%"}
      gap="$4"
      justifyContent="space-between"
    >
      {loading ? (
        <YStack justifyContent="center" height={"90%"}>
          <Spinner size="large" color="$green10Light" />
        </YStack>
      ) : (
        <>
          {(isSendError || isSendSuccess) && (
            <XStack justifyContent="center" paddingTop="$2">
              <Card
                backgroundColor={isSendError ? "$red5Light" : "$green5Light"}
                width={width * 0.9}
              >
                <Card.Header>
                  <SizableText
                    color={isSendError ? "$red10Light" : "$green10Light"}
                  >
                    {isSendError ? errorMessage : successMessage}
                  </SizableText>
                </Card.Header>
              </Card>
            </XStack>
          )}
          {!!emailError && (
            <XStack justifyContent="center" paddingTop="$2">
              <Card backgroundColor={"$red5Light"} width={width * 0.9}>
                <Card.Header>
                  <SizableText color={"$red10Light"}>
                    {emailError}. Please try again
                  </SizableText>
                </Card.Header>
              </Card>
            </XStack>
          )}
          <XStack justifyContent="center" paddingVertical={titlePadding}>
            <SizableText size="$9" color={"$green10Light"}>
              Owemee
            </SizableText>
          </XStack>

          <YStack
            backgroundColor={"$backgroundTransparent"}
            height={"100%"}
            gap="$4"
            paddingHorizontal="$7"
          >
            <YStack gap={"$2"}>
              {isEmailError && (
                <Text style={{ color: "red" }}>Invalid email address</Text>
              )}
              <Input
                onChangeText={onEmailChange}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={"none"}
                autoFocus={true}
                disabled={isSendSuccess}
              />
            </YStack>
            {!isSendSuccess && (
              <>
                <YStack gap={"$4"}>
                  <StyledButton
                    active={!loading && !!email}
                    disabled={loading || !email || isSendSuccess}
                    onPress={handleSignInWithMagicLink}
                  >
                    Sign in with Magic Link
                  </StyledButton>
                </YStack>
                <XStack alignItems="center" gap="$2">
                  <Separator />
                  <Text> or </Text>
                  <Separator />
                </XStack>
                <XStack justifyContent="center">
                  {<AppleAuth isLoading={setLoading} />}
                </XStack>
              </>
            )}
          </YStack>
        </>
      )}
    </YStack>
  );
};

export default Auth;
