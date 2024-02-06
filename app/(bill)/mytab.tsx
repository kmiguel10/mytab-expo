import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const MyTab = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>MyTab {id}</Text>
      <Text>Will show info about user's tab</Text>
    </View>
  );
};

export default MyTab;
