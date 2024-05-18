import React from "react";
import {
  CardProps,
  H4,
  Text,
  View,
  XStack,
  YStack,
  useWindowDimensions,
} from "tamagui";

interface Props {
  summaryInfo: { amountPaid: number; txnCount: number; userid: string }[];
  billName: string;
  height: number;
  width: number;
}

const HeaderInfo: React.FC<Props> = ({
  summaryInfo,
  billName,
  height,
  width,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  // Calculate total paid amount and total transaction count
  const totalPaid = summaryInfo.reduce(
    (total, info) => total + info.amountPaid,
    0
  );
  const txnCount = summaryInfo.reduce(
    (total, info) => total + info.txnCount,
    0
  );
  return (
    <YStack justifyContent="space-evenly" gap="$3" padding="$2">
      <XStack width={windowWidth * 0.45} gap="$3" paddingHorizontal="$2">
        <View>
          <Text>Bill Name</Text>
          <H4 height={height * 0.25} width={windowWidth * 0.35}>
            {billName}
          </H4>
        </View>
      </XStack>
      <XStack width={windowWidth * 0.45} gap="$3" paddingHorizontal="$2">
        <View>
          <Text>Total Amount</Text>
          <H4 height={height * 0.25} width={windowWidth * 0.35}>
            ${totalPaid}
          </H4>
        </View>
        <View>
          <Text>Transactions</Text>
          <H4 height={height * 0.25} width={windowWidth * 0.35}>
            {txnCount}
          </H4>
        </View>
      </XStack>
    </YStack>
  );
};

export default HeaderInfo;
