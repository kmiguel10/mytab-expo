import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Paragraph } from "tamagui";

const Page = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Paragraph>
        Will receive an id from Homepage and use it to create a GET() request to
        receive lists of transactions and members for that BillId
      </Paragraph>
      <Text>Info {id}</Text>
    </View>
  );
};

export default Page;
