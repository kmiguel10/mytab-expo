import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function TabLayout() {
  const route = useRoute();
  const { id } = route.params as { id: string };
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
        }}
      />
      <Stack.Screen
        name="profile"
        initialParams={{ id }}
        options={{
          title: "Settings",
        }}
      />
    </Stack>
  );
}
