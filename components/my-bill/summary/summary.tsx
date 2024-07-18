import { SummaryInfo, Transaction } from "@/types/global";
import React, { useEffect, useState } from "react";
import { SizableText, View, YStack } from "tamagui";
import MemberCards from "./member-cards";
import SummaryChart from "./summary-chart";
import MySvg from "@/assets/svgs/credit-card.svg";

interface Props {
  summaryInfo: SummaryInfo[];
  transactions: Transaction[];
  tabSectionHeight: number;
  tabSectionWidth: number;
  isIpad: boolean;
}

const Summary: React.FC<Props> = ({
  summaryInfo,
  tabSectionHeight,
  tabSectionWidth,
  transactions,
  isIpad,
}) => {
  let chartWidth = tabSectionWidth * 0.96;

  const [chartHeight, setChartHeight] = useState(tabSectionHeight * 0.35);
  const [memberCardsHeight, setMemberCardsHeight] = useState(
    tabSectionHeight * 0.52
  );
  useEffect(() => {
    if (isIpad) {
      setChartHeight(tabSectionHeight * 0.5);
      setMemberCardsHeight(tabSectionHeight * 0.3);
    }
  }, [isIpad]);

  return (
    <View>
      {summaryInfo[0].txnCount > 0 ? (
        <YStack justifyContent="center" alignItems="center">
          <View padding="$2">
            <SummaryChart
              members={summaryInfo}
              scaledHeight={chartHeight}
              scaledWidth={chartWidth}
            />
          </View>
          <View height={memberCardsHeight} justifyContent="center" padding="$2">
            <MemberCards
              members={summaryInfo}
              transactions={transactions}
              scaledHeight={chartHeight}
              scaledWidth={chartWidth}
            />
          </View>
        </YStack>
      ) : (
        <YStack
          gap="$1"
          backgroundColor={"transparent"}
          justifyContent="center"
          padding="$10"
          alignItems="center"
        >
          <SizableText color={"gray"}>Monitor how much you spend</SizableText>
          <MySvg width={"95%"} height={"90%"} />
        </YStack>
      )}
    </View>
  );
};

export default Summary;
