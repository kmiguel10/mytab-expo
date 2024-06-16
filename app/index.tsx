import React, { useState } from "react";
import { Spinner, View, YStack } from "tamagui";

import Auth from "@/components/login/auth";
import Onboard from "@/components/login/onboard";
import { getProfileInfo } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { ProfileInfo } from "@/types/global";
import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";

/**
 * User will be directed to Onboard if not signed up
 */
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
    setIsLoading(true);

    const fetchProfileInfo = async () => {
      try {
        if (session) {
          const profile = await getProfileInfo(session.user.id);
          setProfileInfo(profile || null); // Ensure profile is set to null if undefined
        } else {
          setProfileInfo(null);
        }
      } catch (error) {
        setProfileInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileInfo();
  }, [session]);

  return (
    <>
      {isLoading ? (
        <YStack justifyContent="center" height={"93%"}>
          <Spinner size="large" color="$green10Light" />
        </YStack>
      ) : (
        <View>
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
