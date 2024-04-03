import React, { useState } from "react";
import { Paragraph, Text, View, YStack } from "tamagui";

import Auth from "@/components/login/auth";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import Onboard from "@/components/login/onboard";
import { ProfileInfo } from "@/types/global";
import { getProfileInfo } from "@/lib/api";

const Page = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>();

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
    if (session) {
      const fetchprofileInfo = async () => {
        try {
          const profile: ProfileInfo | null = await getProfileInfo(
            session?.user.id
          );
          setProfileInfo(profile);
        } catch (error) {
          console.error("Error fetching profile info:", error);
          setProfileInfo(null);
        }
      };
      fetchprofileInfo();
    }
  }, [session]);

  return (
    <View>
      {session && session.user && profileInfo?.displayName ? (
        <Onboard userId={session.user.id.toString()} />
      ) : (
        <Auth />
      )}
    </View>
  );
};

export default Page;
