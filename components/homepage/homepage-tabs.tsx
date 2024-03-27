import { View, Text, Dimensions } from "react-native";
import React from "react";
import { ScrollView, SizableText, Tabs, XStack } from "tamagui";
import { BillData, MemberData } from "@/types/global";
import { Link } from "expo-router";
import BillCard from "./bill-card";

interface Props {
  bills: MemberData[];
  userId: string;
}

const HomepageTabs: React.FC<Props> = ({ bills, userId }) => {
  const windowHeight = Dimensions.get("window").height;
  return (
    <Tabs
      defaultValue="tab1"
      orientation="horizontal"
      flexDirection="column"
      width={400}
      borderRadius="$4"
      overflow="hidden"
      borderColor="white"
      backgroundColor="white"
    >
      <Tabs.List width={200}>
        <Tabs.Tab flex={1.2} value="tab1" backgroundColor={"white"}>
          <SizableText fontFamily="$body" fontSize="$2" color={"$blue10Light"}>
            Active ({bills?.length})
          </SizableText>
        </Tabs.Tab>
        <Tabs.Tab flex={1} value="tab2" backgroundColor={"white"}>
          <SizableText fontFamily="$body" fontSize="$2">
            Inactive
          </SizableText>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <ScrollView backgroundColor={"white"}>
          {bills.map((item, index) => (
            <XStack
              key={index}
              backgroundColor="white"
              justifyContent="center"
              padding="$1"
            >
              <Link
                href={{
                  pathname: `/(bill)/mybill/${item.billid}`,
                  params: { userId: userId },
                }}
                asChild
              >
                <BillCard
                  animation="bouncy"
                  size="$4"
                  width={360}
                  height={110}
                  scale={0.9}
                  hoverStyle={{ scale: 0.925 }}
                  pressStyle={{ scale: 0.875 }}
                  bill={item}
                  membership={item.ownerid === userId ? "Owner" : "Member"}
                />
              </Link>
            </XStack>
          ))}
        </ScrollView>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Text>There are no active bills.</Text>
      </Tabs.Content>
    </Tabs>
  );
};

export default HomepageTabs;
