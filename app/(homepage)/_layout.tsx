import { useRoute } from "@react-navigation/native";
import { Link, Tabs, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const route = useRoute();
  const { id } = route.params as { id: string };
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
      }}
    >
      <Tabs.Screen
        name="[id]"
        initialParams={{ id }}
        options={{
          title: "Homepage",
          tabBarLabel: "Bills",
          tabBarShowLabel: false,
          tabBarIcon: () => <Ionicons name="receipt" size={24} color="gray" />,
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
          tabBarShowLabel: false,
          tabBarIcon: () => (
            <Ionicons name="person-outline" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
