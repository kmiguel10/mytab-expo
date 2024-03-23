import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Tabs, Stack, useLocalSearchParams } from "expo-router";

const BillLayout = () => {
  const { id, billId, userId } = useLocalSearchParams();
  useEffect(() => {
    console.log("[id, billId, userId]);:", id, billId, userId);
  }, [id, billId, userId]);
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
      <Stack.Screen
        name="[id]"
        options={{ title: "My Bill", headerShown: false }}
      />
      {/* <Stack.Screen
            name="pages/create-transaction"
            options={{ title: "Create Transaction" }}
          /> */}
    </Stack>

    // <View>
    //   <Text>Test</Text>
    // </View>
  );
};

export default BillLayout;
