import { supabase } from "@/lib/supabase";
import * as AppleAuthentication from "expo-apple-authentication";
import React from "react";
import { Platform, useWindowDimensions } from "react-native";
import "react-native-url-polyfill/auto";

interface Props {
  isLoading: (loading: boolean) => void;
  setAreNamesSaved: (flag: boolean) => void;
}

export const Auth: React.FC<Props> = ({ isLoading, setAreNamesSaved }) => {
  const { width, height } = useWindowDimensions();

  const appleButtonWidth = width * 0.76;
  const appleButtonHeight = height * 0.045;

  const saveUserToSupabase = async (
    userId: string,
    email: string,
    firstName: string | null,
    lastName: string | null
  ) => {
    try {
      const { data, error } = await supabase.from("profiles").upsert(
        {
          id: userId,
          email: email,
          firstName: firstName,
          lastName: lastName,
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("Error saving user to Supabase:", error);
      } else {
        console.log("User saved to Supabase:", data);
      }
    } catch (error) {
      console.error("Error saving user to Supabase:", error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      isLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("credentials: ", credential);

      if (credential.identityToken) {
        const {
          error,
          data: { user },
        } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });

        console.log(JSON.stringify({ error, user }, null, 2));

        if (!error && user) {
          const firstName = credential.fullName?.givenName || null;
          const lastName = credential.fullName?.familyName || null;
          // const firstName = "Kobe";
          // const lastName = "Bryant";
          const email = credential.email || user.email;

          // Only save firstName and lastName if they exist (initial login)
          if (firstName && lastName) {
            await saveUserToSupabase(
              user.id,
              email?.toString() || "",
              firstName,
              lastName
            );
            setAreNamesSaved(true);
          }
          isLoading(false);
          // User is signed in.
        } else {
          isLoading(false);
          console.error("Error during sign-in with Supabase:", error);
        }
      } else {
        isLoading(false);
        throw new Error("No identityToken.");
      }
    } catch (e: any) {
      isLoading(false);
      if (e.code === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
        console.error("Errors", e);
      }
    }
  };

  if (Platform.OS === "ios") {
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: appleButtonWidth, height: appleButtonHeight }}
        onPress={handleAppleSignIn}
      />
    );
  }

  return null; // Or implement Android Auth options.
};

export default Auth;
