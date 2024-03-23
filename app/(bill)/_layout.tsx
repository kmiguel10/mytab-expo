import { useRoute } from "@react-navigation/native";
import { Stack, Tabs, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button, Text } from "tamagui";
import { Home, Settings2 } from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const Layout = () => {
  const router = useRouter();
  const { id, billId, userId } = useLocalSearchParams();

  const [session, setSession] = useState<Session | null>(null);
  const [sessionUserId, setSessionUserId] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    console.log("Session user", session?.user.id);
    console.log("SESSION", session);
  }, []);

  useEffect(() => {
    if (session) {
      setSessionUserId(session?.user.id);
    }
    console.log("sessionUserId", sessionUserId);
  }, [session]);

  //Create functions with params to route to Homepage and Bill Settings
  return (
    <Stack>
      <Stack.Screen
        name="mybill"
        options={{
          title: "",
          headerShown: true,
          headerLeft: () => (
            <Text onPress={() => router.back()}>
              <Home />
              {/* <Settings2 /> */}
            </Text>
          ),
          headerRight: () => (
            <Link
              href={{
                pathname: "/pages/edit-bill",
                params: {
                  id: id,
                  billId: billId,
                  userId: sessionUserId,
                },
              }}
              asChild
            >
              <Pressable>
                <Settings2 />
              </Pressable>
            </Link>
          ),
        }}
        initialParams={{ id: id, billId: billId, userId: userId }}
      />
    </Stack>
  );
};

export default Layout;
