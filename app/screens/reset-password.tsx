import { StyledButton } from "@/components/button/button";
import { StyledInput } from "@/components/input/input";
import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import {
  Card,
  SizableText,
  Text,
  View,
  XStack,
  YStack,
  useWindowDimensions,
} from "tamagui";
import validator from "validator";

/**
Reset email component
 */
export const ResetPassword = () => {
  /********** States and variables ************/
  const { width, height } = useWindowDimensions();
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [isErrorEmailSent, setIsErrorEmailSent] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const successMessage = `SUCCESS: Check your inbox for ${email} and click the link to reset your password`;

  const errorMessage = `ERROR: There is an issue sending the link to your email.`;

  /********** Function ************/
  const handleEmailChange = (email: string) => {
    setIsError(false);
    setEmail(email);
  };

  const handleSendLink = async () => {
    if (validator.isEmail(email)) {
      // Handle sending the reset email link - set email success or error here
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: "https://owemee.app/screens/new-password",
          }
        );
        if (data) {
          console.log("success email sent", data);
          setIsError(false);
          setIsEmailSent(true);
        }

        if (error) {
          console.log("Error email sent", error.message);
          setIsErrorEmailSent(true);
        }
      } catch (error) {
        setIsErrorEmailSent(true);
      }
    } else {
      setIsError(true);
    }
  };

  /********** UseEffect ************/

  return (
    <View
      backgroundColor={"white"}
      height={"100%"}
      alignContent="center"
      padding={"$4"}
      gap={"$4"}
    >
      {isEmailSent && (
        <Card backgroundColor={"$green5Light"}>
          <Card.Header>
            <SizableText color={"$green10Light"} fontWeight={400}>
              {successMessage}
            </SizableText>
          </Card.Header>
        </Card>
      )}
      {isErrorEmailSent && (
        <Card backgroundColor={"$red5Light"}>
          <Card.Header>
            <SizableText color={"$red10Light"}>{errorMessage}</SizableText>
          </Card.Header>
        </Card>
      )}
      <YStack width={width * 0.9} justifyContent="center" gap={"$2"}>
        <SizableText size="$4">Enter your email address:</SizableText>
        <StyledInput
          autoFocus={true}
          value={email}
          onChangeText={handleEmailChange}
          placeholder="Email"
          disabled={isEmailSent}
        />
        {isError && <Text style={{ color: "red" }}>Invalid email address</Text>}
      </YStack>
      {!isEmailSent && (
        <XStack justifyContent="flex-end" width={width * 0.9}>
          <StyledButton
            active={email.length > 0}
            onPress={handleSendLink}
            disabled={email.length === 0}
          >
            Send Link
          </StyledButton>
        </XStack>
      )}
    </View>
  );
};

export default ResetPassword;
