import React, { useState } from "react";
import { Paragraph, Text, View, YStack } from "tamagui";

import Auth from "@/components/login/auth";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import Onboard from "@/components/login/onboard";

const Page = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {}, [session]);

  return (
    <View>
      {session && session.user ? (
        <Onboard userId={session.user.id.toString()} />
      ) : (
        <Auth />
      )}
    </View>
  );
};

export default Page;
