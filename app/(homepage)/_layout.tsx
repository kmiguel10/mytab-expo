import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import { Plus } from "@tamagui/lucide-icons";
import { supabase } from "@/lib/supabase";
import { Button, Text } from "tamagui";

export default function TabLayout() {
  const route = useRoute();
  const { id } = route.params as { id: string };
  /** Functions */
  const signOutUser = async () => {
    await supabase.auth.signOut();
    console.log("USER SIGNED OUT");
  };
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        initialParams={{ id }}
        options={{
          title: "Home",
          headerRight: () => (
            <Link
              href={{
                pathname: "/(homepage)/profile",
                params: { id },
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
        initialParams={{ id }}
        options={{
          title: "Settings",
          headerRight: () => (
            <Link href={"/"} replace asChild>
              <Text onPress={signOutUser}>Sign out</Text>
            </Link>
          ),
          headerLeft: () => (
            <Link href={`/(homepage)/${id}`} replace asChild>
              <Text onPress={signOutUser}>Home</Text>
            </Link>
            //      router.replace({
            //   pathname: "/(homepage)/[id]",
            //   params: { id: userId.toString() },
            // });
          ),
        }}
      />
    </Stack>
  );
}
