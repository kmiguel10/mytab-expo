import React, { useState, useEffect } from "react";
import { Spinner, View, YStack } from "tamagui";
import Auth from "@/components/login/auth";
import Onboard from "@/components/login/onboard";
import { getProfileInfo } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { ProfileInfo } from "@/types/global";
import { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

/**
 * User will be directed to Onboard if not signed up
 *
 * Needs to be able to handle receiving data from Magic link
 */
const Page = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [areNamesSaved, setAreNamesSaved] = useState(false);

  /** Functions and handlers */
  const handleUniversalLink = async () => {
    setIsLoading(true);
    const url = await Linking.getInitialURL();

    if (url) {
      const params = parseUrlParameters(url);
      console.log("Handling universal links: ", params);
      if (params.access_token) {
        authenticateUser(params.access_token, params.refresh_token);
      }
      if (params.error_description) {
        setEmailError(params.error_description);
      }
    }
    setIsLoading(false);
  };

  const parseUrlParameters = (url: string) => {
    const queryString = url.split("#")[1] || url.split("?")[1];
    if (!queryString) {
      return {};
    }
    const searchParams = new URLSearchParams(queryString);
    return Object.fromEntries(searchParams.entries());
  };

  const authenticateUser = async (
    access_token: string,
    refresh_token: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        setErrorMessage(
          "An error occurred while authenticating user. Please try again and request another link."
        );
        setIsError(true);
        console.error("Authentication error:", error);
        return;
      }

      console.log("Set session", data);
      setSession(data.session);
    } catch (error) {
      setErrorMessage(
        "An error occurred while authenticating user. Please try again and request another link."
      );
      setIsError(true);
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
        }
      );

      handleUniversalLink();

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    initializeSession();
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <YStack justifyContent="center" height={"93%"}>
          <Spinner size="large" color="$green10Light" />
        </YStack>
      ) : (
        <View>
          {session && session.user ? (
            <Onboard
              userId={session.user.id.toString()}
              areNamesSaved={areNamesSaved}
            />
          ) : (
            <Auth emailError={emailError} setAreNamesSaved={setAreNamesSaved} />
          )}
        </View>
      )}
    </>
  );
};

export default Page;
