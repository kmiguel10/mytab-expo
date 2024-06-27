import { View, Text, YStack, useWindowDimensions, SizableText } from "tamagui";
import React from "react";
import { StyledInput } from "@/components/input/input";

/**
 * 1. Provide email to send code
 * 2. receive code in email
 * 3. Provide code
 * 4. Enter new password
 *
 * How many states?
 * 1. Enter email
 * 2. Enter code
 * 3. Enter new password
 *
 */
export const ResetPassword = () => {
  /********** States and variables ************/
  const { width, height } = useWindowDimensions();

  return (
    <View backgroundColor={"white"} height={"100%"}>
      <SizableText>Enter your email address:</SizableText>
      <YStack width={width * 0.9}>
        <StyledInput />
      </YStack>
    </View>
  );
};

export default ResetPassword;
