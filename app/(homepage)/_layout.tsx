import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Home, Settings } from "@tamagui/lucide-icons";
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
    try {
      await supabase.auth.signOut();
      setSession(null); // Clear the session state
      router.push("/"); // Route back to homepage on sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
                <Settings />
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
            <Pressable onPress={signOutUser}>
              <Text>Sign out</Text>
            </Pressable>
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
