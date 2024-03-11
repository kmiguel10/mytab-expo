import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { getMyTabInfo } from "@/lib/api";
import { Card, H2, XStack, YStack } from "tamagui";
import { MyTabInfo, SettleCardInfo } from "@/types/global";
import { getMyTabHeaderAmounts } from "@/lib/helpers";
import SettleMemberCard from "./settle-member-card";

interface Props {
  userId: string;
  billId: number;
  tabSectionHeight: number;
  tabSectionWidth: number;
}

const MyTab: React.FC<Props> = ({
  userId,
  billId,
  tabSectionHeight,
  tabSectionWidth,
}) => {
  const [myTabInfo, setMyTabInfo] = useState<MyTabInfo[] | null>([]);
  const [owedAmount, setOwedAmount] = useState<number>(0);
  const [debtAmount, setDebtAmount] = useState<number>(0);
  const [settleMembersInfo, setSettleMembersInfo] = useState<SettleCardInfo[]>(
    []
  );

  let headerSectionHeight = tabSectionHeight * 0.15;
  let cardsSectionHeight = tabSectionHeight * 0.759;
  let settleAmount = Math.abs(owedAmount - debtAmount);

  useEffect(() => {
    async function fetchMyTabInfo() {
      if (userId) {
        const data = await getMyTabInfo(userId, billId);
        console.log("Fetched data: ", data);
        setMyTabInfo(data);
      }
    }
    fetchMyTabInfo();

    console.log("My Tab", myTabInfo);
  }, [userId, billId]);

  useEffect(() => {
    if (myTabInfo) {
      const {
        owedAmount: _owed,
        debtAmount: _debt,
        settleMembersInfo: _settleMembersInfo,
      } = getMyTabHeaderAmounts({
        myTabInfo,
        userId,
      });
      setOwedAmount(_owed);
      setDebtAmount(_debt);
      setSettleMembersInfo(_settleMembersInfo);
    }
  }, [myTabInfo, userId]);

  return (
    <View>
      <XStack
        gap="$5"
        height={headerSectionHeight}
        backgroundColor={"white"}
        justifyContent="space-evenly"
      >
        <YStack gap="$3">
          {owedAmount - debtAmount <= 0 ? (
            <Text>You pay</Text>
          ) : (
            <Text>You receive</Text>
          )}

          <H2
            color={
              owedAmount - debtAmount <= 0 ? "$red10Light" : "$green10Light"
            }
          >
            {settleAmount}
          </H2>
        </YStack>
        <YStack gap="$3">
          <Text>You are owed</Text>
          <H2 color={"$green10Light"}>{owedAmount}</H2>
        </YStack>
        <YStack gap="$3">
          <Text>You owe</Text>
          <H2 color={"$red10Light"}>{debtAmount}</H2>
        </YStack>
      </XStack>
      <XStack height={cardsSectionHeight} backgroundColor={"white"}>
        <SettleMemberCard
          members={settleMembersInfo}
          scaledHeight={tabSectionHeight}
          scaledWidth={tabSectionWidth}
        />
      </XStack>
    </View>
  );
};

export default MyTab;
