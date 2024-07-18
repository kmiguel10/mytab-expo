import { getMyTabInfo } from "@/lib/api";
import {
  formatToDollarCurrency,
  getMyTabHeaderAmounts,
  truncateToTwoDecimalPlaces,
} from "@/lib/helpers";
import { Member, MyTabInfo, SettleCardInfo, Transaction } from "@/types/global";
import React, { useEffect, useState } from "react";
import { Separator, SizableText, View, XStack, YStack } from "tamagui";
import SettleMemberCard from "./settle-member-card";
import MySvg from "@/assets/svgs/business-deal.svg";

interface Props {
  userId: string;
  billId: number;
  tabSectionHeight: number;
  tabSectionWidth: number;
  members: Member[];
  transactions: Transaction[];
  isIpad: boolean;
}

const MyTab: React.FC<Props> = ({
  userId,
  billId,
  tabSectionHeight,
  tabSectionWidth,
  members,
  transactions,
  isIpad,
}) => {
  /** - - - - - - - - - - State Variables - - - - - - - - */
  const [myTabInfo, setMyTabInfo] = useState<MyTabInfo[] | null>([]);
  const [owedAmount, setOwedAmount] = useState<number>(0);
  const [debtAmount, setDebtAmount] = useState<number>(0);
  const [settleMembersInfo, setSettleMembersInfo] = useState<SettleCardInfo[]>(
    []
  );

  let headerSectionHeight = tabSectionHeight * 0.15;
  let cardsSectionHeight = tabSectionHeight * 0.735;
  let settleAmount = Math.abs(owedAmount - debtAmount);

  /** - - - - - - - - - - State Variables - - - - - - - - */

  /** - - - - - - - - - - Functions - - - - - - - - */

  /** - - - - - - - - - - useEffects - - - - - - - - */
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
      console.log("My Tab Info: ", myTabInfo);
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
    <View gap="$1">
      {transactions.length > 0 ? (
        <>
          <XStack
            gap="$3"
            height={headerSectionHeight}
            width={tabSectionWidth}
            padding="$2"
            paddingLeft="$3"
            justifyContent="space-between"
            backgroundColor={"$backgroundTransparent"}
          >
            <XStack gap="$3" justifyContent="space-around">
              <YStack gap="$2" width={tabSectionWidth * 0.25}>
                <SizableText>Receive</SizableText>
                <SizableText size="$4" color={"$green10Light"}>
                  {formatToDollarCurrency(
                    truncateToTwoDecimalPlaces(owedAmount)
                  )}
                </SizableText>
              </YStack>
              <YStack gap="$2" width={tabSectionWidth * 0.25}>
                <SizableText>Pay</SizableText>
                <SizableText size="$4" color={"$red10Light"}>
                  {formatToDollarCurrency(
                    truncateToTwoDecimalPlaces(debtAmount)
                  )}
                </SizableText>
              </YStack>
              <Separator vertical />
            </XStack>
            <View>
              <YStack gap="$2" width={tabSectionWidth * 0.25}>
                {owedAmount - debtAmount <= 0 ? (
                  <SizableText fontWeight={"bold"} size="$4">
                    You pay
                  </SizableText>
                ) : (
                  <SizableText fontWeight={"bold"} size="$4">
                    You receive
                  </SizableText>
                )}
                <SizableText
                  size="$6"
                  fontWeight={"bold"}
                  color={
                    owedAmount - debtAmount <= 0
                      ? "$red10Light"
                      : "$green10Light"
                  }
                >
                  {formatToDollarCurrency(
                    truncateToTwoDecimalPlaces(settleAmount)
                  )}
                </SizableText>
              </YStack>
            </View>
          </XStack>
          <XStack
            height={cardsSectionHeight}
            backgroundColor={"$backgroundTransparent"}
            paddingTop={isIpad ? "$4" : ""}
          >
            <SettleMemberCard
              members={settleMembersInfo}
              scaledHeight={tabSectionHeight}
              scaledWidth={tabSectionWidth}
              membersInfo={members}
              transactions={transactions}
              currentUser={userId}
            />
          </XStack>
        </>
      ) : (
        <>
          <YStack
            gap="$1"
            backgroundColor={"transparent"}
            justifyContent="center"
            padding="$10"
            alignItems="center"
          >
            <SizableText color={"gray"}>Who owes what?</SizableText>
            <MySvg width={"95%"} height={"90%"} />
          </YStack>
        </>
      )}
    </View>
  );
};

export default MyTab;
