import React from "react";
import HeaderInfo from "./HeaderInfo";
import SummaryChart from "./summary-chart";
import MemberCards from "./member-cards";
import { View, YStack } from "tamagui";
import { SummaryInfo } from "@/types/global";

interface Props {
  summaryInfo: SummaryInfo[];
  tabSectionHeight: number;
  tabSectionWidth: number;
}

const Summary: React.FC<Props> = ({
  summaryInfo,
  tabSectionHeight,
  tabSectionWidth,
}) => {
  // Calculate total paid amount and total transaction count
  const totalPaid = summaryInfo.reduce(
    (total, info) => total + info.amountPaid,
    0
  );
  const totalTxnCount = summaryInfo.reduce(
    (total, info) => total + info.txnCount,
    0
  );

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
            scaledHeight={chartHeight}
            scaledWidth={chartWidth}
          />
        </View>
      </YStack>
    </View>
  );
};

export default Summary;
