import { Auth as AppleAuth } from "@/components/auth/Auth.native";
import { signInWithEmail, signUpWithEmail } from "@/lib/api";
import React, { useState } from "react";
import { Alert, Text } from "react-native";
import {
  Input,
  Separator,
  Sheet,
  SizableText,
  Spinner,
  XStack,
  YStack,
} from "tamagui";
import { StyledButton } from "../button/button";
import { isLoaded } from "expo-font";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SignIn: React.FC<Props> = ({ open, setOpen }) => {
  /** States and Variables */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(0);

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

  const handleOpenChange = () => {
    if (open) {
      setOpen(false);
      setEmail("");
      setPassword("");
    }
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

  return (
    <Sheet
      forceRemoveScrollEnabled={true}
      modal={true}
      open={open}
      onOpenChange={handleOpenChange}
      snapPoints={[90]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame
        padding="$4"
        justifyContent="flex-start"
        alignItems="center"
        gap="$5"
      >
        {loading ? (
          <YStack justifyContent="center" height={"93%"}>
            <Spinner size="large" color="$green10Light" />
          </YStack>
        ) : (
          <YStack
            backgroundColor={"$backgroundTransparent"}
            height={"100%"}
            gap="$4"
            paddingHorizontal="$6"
          >
            <XStack paddingBottom="$4" paddingTop="$4">
              <SizableText size="$8">Sign in</SizableText>
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
            <YStack gap={"$4"}>
              <StyledButton
                active={!loading && !!email && !!password}
                disabled={loading || !email || !password}
                onPress={handleSignIn}
              >
                Sign in
              </StyledButton>
              <SizableText>Forgot Password?</SizableText>
            </YStack>
            <XStack alignItems="center" gap="$2">
              <Separator />
              <Text> or </Text>
              <Separator />
            </XStack>
            <XStack justifyContent="center">
              {<AppleAuth isLoading={setLoading} />}
            </XStack>
          </YStack>
        )}
      </Sheet.Frame>
    </Sheet>
  );
};

export default SignIn;
