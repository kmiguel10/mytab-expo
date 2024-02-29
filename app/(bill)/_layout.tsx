import { useRoute } from "@react-navigation/native";
import { Stack, Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button, Text } from "tamagui";

const Layout = () => {
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params as { id: string };
  return (
    // <Tabs>
    //   <Tabs.Screen
    //     name="mybill"
    //     options={{
    //       title: "Bill",
    //       headerShown: true,
    //       tabBarShowLabel: true,
    //       tabBarIcon: () => (
    //         <Ionicons name="list-circle-sharp" size={32} color="black" />
    //       ),
    //       headerLeft: () => <Text onPress={() => router.back()}>Home</Text>,
    //     }}
    //     initialParams={{ id: id }}
    //   ></Tabs.Screen>
    //   <Tabs.Screen
    //     name="mytab"
    //     options={{
    //       tabBarLabel: "My Tab",
    //       headerShown: true,
    //       tabBarShowLabel: true,
    //       tabBarIcon: () => (
    //         <FontAwesome6 name="money-bill-transfer" size={30} color="black" />
    //       ),
    //     }}
    //     initialParams={{ id: id }}
    //   ></Tabs.Screen>
    // </Tabs>
    <Stack>
      <Stack.Screen
        name="mybill"
        options={{
          title: "Bill",
          headerShown: true,
          headerLeft: () => <Text onPress={() => router.back()}>Home</Text>,
        }}
        initialParams={{ id: id }}
      />
    </Stack>
  );
};

export default Layout;
