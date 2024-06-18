import {
  formatToDollarCurrency,
  truncateToTwoDecimalPlaces,
} from "@/lib/helpers";
import React from "react";
import {
  SizableText,
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
  isMaxTransactionsReached: boolean;
  maxTransactions: number;
  isExpiringToday: boolean;
  isBillExpired: boolean;
}

const HeaderInfo: React.FC<Props> = ({
  summaryInfo,
  billName,
  height,
  width,
  isMaxTransactionsReached,
  maxTransactions,
  isExpiringToday,
  isBillExpired,
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
    <YStack justifyContent="space-evenly" gap="$1" padding="$2">
      <XStack
        width={windowWidth * 0.45}
        gap="$3"
        paddingHorizontal="$2"
        alignItems="center"
      >
        <View>
          <SizableText>Bill Name</SizableText>
          <SizableText
            size={"$7"}
            height={height * 0.25}
            width={windowWidth * 0.4}
            fontWeight="800"
          >
            {billName}
          </SizableText>
        </View>

        <View gap="$1" alignSelf="flex-start">
          {isMaxTransactionsReached && (
            <View
              backgroundColor={"$red4Light"}
              paddingHorizontal={"$2"}
              alignSelf="flex-start"
              borderRadius={"$12"}
            >
              <SizableText fontSize={"$1"}>
                Max {maxTransactions} Transactions
              </SizableText>
            </View>
          )}
          {isExpiringToday && (
            <View
              backgroundColor={"$yellow4Light"}
              paddingHorizontal={"$2"}
              borderRadius={"$12"}
              alignSelf="flex-start"
            >
              <SizableText fontSize={"$1"}>Expires Today</SizableText>
            </View>
          )}
          {isBillExpired && (
            <View
              backgroundColor={"$red4Light"}
              paddingHorizontal={"$2"}
              borderRadius={"$12"}
              alignSelf="flex-start"
            >
              <SizableText fontSize={"$1"}>Expired</SizableText>
            </View>
          )}
        </View>
      </XStack>
      <XStack width={windowWidth * 0.45} gap="$3" paddingHorizontal="$2">
        <View>
          <SizableText>Total Amount</SizableText>
          <SizableText
            size={"$7"}
            height={height * 0.25}
            width={windowWidth * 0.35}
            fontWeight="800"
          >
            {formatToDollarCurrency(truncateToTwoDecimalPlaces(totalPaid))}
          </SizableText>
        </View>
        <View>
          <SizableText>Transactions</SizableText>
          <SizableText
            size={"$7"}
            height={height * 0.25}
            width={windowWidth * 0.35}
            fontWeight="800"
          >
            {txnCount}
          </SizableText>
        </View>
      </XStack>
    </YStack>
  );
};

export default HeaderInfo;
