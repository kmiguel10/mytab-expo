import { View, Text } from "react-native";
import React from "react";
import { Tabs, Stack } from "expo-router";
import BillLayout from "./mybill/_layout";
import { useRoute } from "@react-navigation/native";

const Layout = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  return (
    <Tabs>
      <Tabs.Screen
        name="mybill"
        options={{ title: "Bill", headerShown: true }}
        initialParams={{ id: id }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="mytab"
        options={{ tabBarLabel: "My tab" }}
        initialParams={{ id: id }}
      ></Tabs.Screen>
    </Tabs>
  );
};

export default Layout;
