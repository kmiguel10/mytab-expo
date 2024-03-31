import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Session } from "@supabase/supabase-js";
import { Home } from "@tamagui/lucide-icons";
import { Link, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Text } from "tamagui";

export default function TabLayout() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionUserId, setSessionUserId] = useState("");

  /** Functions */
  const signOutUser = async () => {
    await supabase.auth.signOut();
    console.log("*** User signed out");
  };

  const handleHomeButtonClick = () => {
    if (sessionUserId) {
      router.replace({
        pathname: "/(homepage)/[id]",
        params: { id: sessionUserId },
      });
    } else {
      console.error("UserId does not exist");
    }
  };

  /** Use Effects */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      setSessionUserId(session?.user.id);
    }
  }, [session]);

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        initialParams={{ id: sessionUserId }}
        options={{
          title: "Home",
          headerRight: () => (
            <Link
              href={{
                pathname: "/(homepage)/profile",
                params: { id: sessionUserId },
              }}
              asChild
            >
              <Pressable>
                <Ionicons name="settings-outline" size={24} color="gray" />
              </Pressable>
            </Link>
          ),
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Settings",
          headerRight: () => (
            <Link href={"/"} replace asChild>
              <Text onPress={signOutUser}>Sign out</Text>
            </Link>
          ),
          headerLeft: () => (
            <Pressable onPress={handleHomeButtonClick}>
              <Home />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
