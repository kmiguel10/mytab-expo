import React, { useState } from "react";
import { Spinner, View, YStack } from "tamagui";

import Auth from "@/components/login/auth";
import Onboard from "@/components/login/onboard";
import { getProfileInfo } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { ProfileInfo } from "@/types/global";
import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
// import "react-native-reanimated";
// import "react-native-gesture-handler";

const Page = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    console.log("session", session);
    setIsLoading(true);
    if (session) {
      const fetchprofileInfo = async () => {
        try {
          const profile: ProfileInfo | null = await getProfileInfo(
            session?.user.id
          );
          setProfileInfo(profile);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error("Error fetching profile info:", error);
          setProfileInfo(null);
        }
      };
      fetchprofileInfo();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  return (
    <>
      {isLoading ? (
        <YStack justifyContent="center" height={"93%"}>
          <Spinner size="large" color="$green10Light" />
        </YStack>
      ) : (
        <View>
          {/* Will be directed to Onboard if signed up then onboard will determine if profile is provided or not... */}
          {session && session.user && profileInfo?.email ? (
            <Onboard userId={session.user.id.toString()} />
          ) : (
            <Auth />
          )}
        </View>
      )}
    </>
  );
};

export default Page;
