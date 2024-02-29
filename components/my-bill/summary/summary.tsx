import { View, Text } from "react-native";
import React from "react";
import HeaderInfo from "./HeaderInfo";
import SummaryChart from "./summary-chart";
import MemberCards from "./member-cards";

interface Props {
  summaryInfo: { amountPaid: number; txnCount: number; userid: string }[];
}

const Summary: React.FC<Props> = ({ summaryInfo }) => {
  // Calculate total paid amount and total transaction count
  const totalPaid = summaryInfo.reduce(
    (total, info) => total + info.amountPaid,
    0
  );
  const totalTxnCount = summaryInfo.reduce(
    (total, info) => total + info.txnCount,
    0
  );

  return (
    <View>
      {/* <HeaderInfo totalPaid={totalPaid} txnCount={totalTxnCount} /> */}
      <SummaryChart members={summaryInfo} />
      <Text>Cards scrollview</Text>
      <MemberCards members={summaryInfo} />
    </View>
  );
};

export default Summary;
