import Avatar from "@/components/login/avatar";
import { SummaryInfo, Transaction } from "@/types/global";
import React, { useState } from "react";
import {
  CardProps,
  H1,
  ListItem,
  ScrollView,
  useWindowDimensions,
  View,
  XStack,
  YGroup,
} from "tamagui";
import UserTransactions from "./user-transactions-sheet";
import { filterUserTransactions } from "@/lib/helpers";
import { Pressable } from "react-native";

interface Props extends CardProps {
  members: SummaryInfo[];
  transactions: Transaction[];
  scaledHeight: number;
  scaledWidth: number;
}

const MemberCards: React.FC<Props> = ({
  members,
  transactions,
  scaledHeight,
  scaledWidth,
  ...props
}) => {
  /** - - - - - - - - - - State Variables - - - - - - - - */
  const [openTransactionsSheet, setOpenTransactionsSheet] = useState(false);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [selectedMember, setSelectedMember] = useState<SummaryInfo | null>(
    null
  );

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  /** - - - - - - - - - - Functions - - - - - - - - */
  const setSelectedUserTransactions = (member: SummaryInfo) => {
    //set filtered transactions based on user
    const userTxns = filterUserTransactions(transactions, member);
    console.log("Transactions for user", userTxns);

    setUserTransactions(userTxns);
    setSelectedMember(member);

    //open sheet
    setOpenTransactionsSheet(true);
  };

  /** - - - - - - - - - - useEffects - - - - - - - - */

  /**
   * Need to be able to save the avatars and pass it down, the use useMemo
   */
  return (
    <View>
      <ScrollView>
        <XStack
          flex={1}
          flexWrap="wrap"
          gap="$0.5"
          backgroundColor={"transparent"}
          justifyContent="center"
          paddingBottom="$2"
        >
          {members.map((member, index) => (
            <XStack
              padding="$1"
              backgroundColor={"transparent"}
              justifyContent="center"
              key={index}
            >
              <Pressable onPress={() => setSelectedUserTransactions(member)}>
                <YGroup
                  alignSelf="center"
                  bordered
                  width={windowWidth * 0.9}
                  size="$4"
                >
                  <YGroup.Item>
                    <ListItem
                      hoverTheme
                      icon={<Avatar url={member.avatar_url} size="$4.5" />}
                      title={member.displayName}
                      subTitle={`Transaction Count: ${member.txnCount}`}
                      iconAfter={<H1>${member.amountPaid}</H1>}
                    />
                  </YGroup.Item>
                </YGroup>
              </Pressable>
            </XStack>
          ))}
          {members.length % 2 !== 0 && (
            <XStack
              padding="$1"
              backgroundColor={"white"}
              width={scaledWidth * 0.49}
              justifyContent="center"
            ></XStack>
          )}
        </XStack>
      </ScrollView>
      <UserTransactions
        userTransactions={userTransactions}
        selectedMember={selectedMember}
        open={openTransactionsSheet}
        setOpen={setOpenTransactionsSheet}
      />
    </View>
  );
};

export default MemberCards;
