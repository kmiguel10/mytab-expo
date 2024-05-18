import { Platform, useWindowDimensions } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "@/lib/supabase";

import "react-native-url-polyfill/auto";

// const supabase = createClient(
//   "https://xstshtvdjvmzebjctwmn.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzdHNodHZkanZtemViamN0d21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNzg3MjgsImV4cCI6MjAyMjg1NDcyOH0.TZ5cmTcEW_1NKson2Wk6ZTq8mQTkCcZazam7IyZL9HI",
//   {
//     auth: {
//       storage: AsyncStorage,
//       autoRefreshToken: true,
//       persistSession: true,
//       detectSessionInUrl: false,
//     },
//   }
// );

export function Auth() {
  const { width, height } = useWindowDimensions();

  const appleButtonWidth = width * 0.76;
  const appleButtonHeight = height * 0.045;

  if (Platform.OS === "ios")
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: appleButtonWidth, height: appleButtonHeight }}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            console.log("credentials: ", credential);
            // Sign in via Supabase Auth.
            if (credential.identityToken) {
              const {
                error,
                data: { user },
              } = await supabase.auth.signInWithIdToken({
                provider: "apple",
                token: credential.identityToken,
              });
              console.log(JSON.stringify({ error, user }, null, 2));
              console.log("ERRORR, ", error);
              if (!error) {
                // User is signed in.
              }
            } else {
              throw new Error("No identityToken.");
            }
          } catch (e: any) {
            if (e.code === "ERR_REQUEST_CANCELED") {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
              console.log("Errors", e);
            }
          }
        }}
      />
    );
  return <>{/* Implement Android Auth options. */}</>;
}
