import { useRoute } from "@react-navigation/native";
import { Link, Tabs, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Text } from "tamagui";

export default function TabLayout() {
  const route = useRoute();
  const router = useRouter();
  const { id } = route.params as { id: string };
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "red",
      }}
    >
      <Tabs.Screen
        name="[id]"
        initialParams={{ id }}
        options={{
          title: "Homepage",
          headerRight: () => (
            <Link
              href={{
                pathname: "/(modals)/create-bill",
                params: { id },
              }}
              asChild
            >
              <Pressable>
                <Text>Create Bill</Text>
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        initialParams={{ id }}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Text>Hello!</Text>,
        }}
      />
    </Tabs>
  );
}
