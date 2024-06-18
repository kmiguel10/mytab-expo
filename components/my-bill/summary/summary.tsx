import { SummaryInfo, Transaction } from "@/types/global";
import React from "react";
import { View, YStack } from "tamagui";
import MemberCards from "./member-cards";
import SummaryChart from "./summary-chart";

interface Props {
  summaryInfo: SummaryInfo[];
  transactions: Transaction[];
  tabSectionHeight: number;
  tabSectionWidth: number;
}

const Summary: React.FC<Props> = ({
  summaryInfo,
  tabSectionHeight,
  tabSectionWidth,
  transactions,
}) => {
  let chartHeight = tabSectionHeight * 0.35;
  let chartWidth = tabSectionWidth * 0.96;
  let memberCardsHeight = tabSectionHeight * 0.52;

  return (
    <View>
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
    </View>
  );
};

export default Summary;
