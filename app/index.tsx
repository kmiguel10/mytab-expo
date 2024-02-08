import { View } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { H1, H2, H3, H4, H5, H6, Heading, Paragraph } from "tamagui";
import { Text, XStack, YStack } from "tamagui";
import { Button } from "tamagui";

import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Redirect } from "expo-router";
import Auth from "@/components/login/auth";

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
  console.log("Session user", session?.user.id);
  return (
    <YStack flex={1} borderRadius="$4" padding="$2">
      <Paragraph size="$2" fontWeight="800">
        This will be the log in page with modal and register Use supabase
        authentication to login with email or iphone or phonenumber
      </Paragraph>

      {session && session.user ? (
        // <Redirect href={`/(homepage)/${session.user.id}`} />
        <Redirect
          href={{
            pathname: "/(homepage)/[id]",
            params: { id: session.user.id },
          }}
        >
          Go to Details
        </Redirect>
      ) : (
        <Auth />
      )}
    </YStack>
  );
};

export default Page;
