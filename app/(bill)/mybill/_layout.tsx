import { View, Text } from "react-native";
import React from "react";
import { Tabs, Stack, useLocalSearchParams } from "expo-router";

const BillLayout = () => {
  const { id } = useLocalSearchParams();
  {
    /** NEED to decide whether tabs or just buttons is best  */
  }
  return (
    // <Tabs>
    //   <Tabs.Screen name="index" options={{ tabBarLabel: "Info" }}></Tabs.Screen>
    //   <Tabs.Screen
    //     name="summary"
    //     options={{ tabBarLabel: "Summary" }}
    //   ></Tabs.Screen>
    // </Tabs>
    <Stack>
      <Stack.Screen name="[id]" options={{ title: "Create Bill" }} />
    </Stack>
    // <View>
    //   <Text>Test</Text>
    // </View>
  );
};

export default BillLayout;
