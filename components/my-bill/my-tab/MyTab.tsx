import { getMyTabInfo } from "@/lib/api";
import { getMyTabHeaderAmounts, roundToNearestTenth } from "@/lib/helpers";
import { Member, MyTabInfo, SettleCardInfo } from "@/types/global";
import React, { useEffect, useState } from "react";
import { H3, Text, View, XStack, YStack } from "tamagui";
import SettleMemberCard from "./settle-member-card";

interface Props {
  userId: string;
  billId: number;
  tabSectionHeight: number;
  tabSectionWidth: number;
  members: Member[];
}

const MyTab: React.FC<Props> = ({
  userId,
  billId,
  tabSectionHeight,
  tabSectionWidth,
  members,
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

  //Should I use, useMemo?
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
        width={tabSectionWidth}
        padding="$2"
        paddingLeft="$3"
        justifyContent="flex-start"
      >
        <YStack gap="$3" width={tabSectionWidth * 0.25}>
          {owedAmount - debtAmount <= 0 ? (
            <Text>You pay</Text>
          ) : (
            <Text>You receive</Text>
          )}

          <H3
            color={
              owedAmount - debtAmount <= 0 ? "$red10Light" : "$green10Light"
            }
          >
            ${roundToNearestTenth(settleAmount)}
          </H3>
        </YStack>
        <YStack gap="$3" width={tabSectionWidth * 0.25}>
          <Text>You are owed</Text>
          <H3 color={"$green10Light"}>${roundToNearestTenth(owedAmount)}</H3>
        </YStack>
        <YStack gap="$3" width={tabSectionWidth * 0.25}>
          <Text>You owe</Text>
          <H3 color={"$red10Light"}>${roundToNearestTenth(debtAmount)}</H3>
        </YStack>
      </XStack>
      <XStack height={cardsSectionHeight} backgroundColor={"white"}>
        <SettleMemberCard
          members={settleMembersInfo}
          scaledHeight={tabSectionHeight}
          scaledWidth={tabSectionWidth}
          membersInfo={members}
        />
      </XStack>
    </View>
  );
};

export default MyTab;
