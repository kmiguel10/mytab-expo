import EditTransaction from "@/components/create-transaction/edit-transaction-sheet";
import Avatar from "@/components/login/avatar";
import { getActiveTransactions } from "@/lib/api";
import {
  findUserAvatar,
  findUserDisplayName,
  formatDateToMonthDay,
} from "@/lib/helpers";
import { Member, Transaction } from "@/types/global";
import React, { useEffect, useState } from "react";
import { Pressable, RefreshControl } from "react-native";
import {
  CardProps,
  H1,
  ListItem,
  ScrollView,
  Text,
  View,
  XStack,
  YGroup,
  useWindowDimensions,
} from "tamagui";

interface Props extends CardProps {
  transactions: Transaction[];
  members: Member[];
  currentUser: string;
  resetToasts: () => void;
  setTransactions: (transactions: Transaction[]) => void;
  isLocked: boolean;
  billOwnerId: string;
}

const TransactionInfoCard: React.ForwardRefRenderFunction<
  HTMLDivElement,
  Props
> = ({
  transactions,
  currentUser,
  members,
  resetToasts,
  setTransactions,
  isLocked,
  billOwnerId,
  ...props
}) => {
  /** ---------- States ---------- */
  const [openEditTxn, setOpenEditTxn] = useState(false);
  const [currentTxnToEdit, setCurrentTxnToEdit] = useState<Transaction>({
    billid: 0,
    submittedbyid: "",
    payerid: null,
    amount: 0,
    name: "",
    notes: null,
    split: [],
    isdeleted: false,
  });

  const [refreshing, setRefreshing] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  /** ---------- Functions  ---------- */
  const handleRefresh = async () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const fetchTransactions = async () => {
    if (currentUser) {
      const transactionData: Transaction[] = await getActiveTransactions(
        transactions ? transactions[0].billid.toString() : "0"
      );
      console.log("currentUser", currentUser);
      console.log("Bill id", currentTxnToEdit.billid.toString());
      console.log("*** Fetched transactions on refresh: ", transactionData);
      if (transactionData) setRefreshing(false);
      setTransactions(transactionData);
    }
  };

  const onTransactionClick = (txnId: string) => {
    resetToasts();
    setCurrentTxnToEdit(
      transactions.find((txn) => `${txn.id}` === txnId) ?? {
        billid: 0,
        submittedbyid: "",
        payerid: null,
        amount: 0,
        name: "",
        notes: null,
        split: [],
        isdeleted: false,
      }
    );
    setOpenEditTxn(true);

    //set the current transaction to edit
    console.log("--- islocked: ", isLocked);
  };

  useEffect(() => {
    console.log("Info card open state: ", openEditTxn);
    if (!openEditTxn) {
      setCurrentTxnToEdit({
        billid: 0,
        submittedbyid: "",
        payerid: null,
        amount: 0,
        name: "",
        notes: null,
        split: [],
        isdeleted: false,
      });
      console.log("cleared transaction to edit");
    }
  }, [openEditTxn]);

  return (
    <View height={"100%"}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <XStack
          flex={1}
          flexWrap="wrap"
          gap="$1"
          backgroundColor={"transparent"}
          justifyContent="center"
          paddingBottom="$2"
        >
          {transactions.map((txn, index) => (
            <XStack
              padding="$1"
              backgroundColor={"transparent"}
              justifyContent="center"
              key={index}
            >
              <Pressable
                onPress={() => onTransactionClick(`${txn.id}`)}
                disabled={isLocked}
              >
                <YGroup
                  alignSelf="center"
                  bordered
                  width={windowWidth * 0.9}
                  size="$4"
                >
                  <YGroup.Item>
                    <ListItem
                      hoverTheme
                      icon={
                        <XStack gap="$2" alignItems="center">
                          <Text fontSize="$1" alignItems="center">
                            {txn.createdat
                              ? formatDateToMonthDay(new Date(txn.createdat))
                              : "N/A"}
                          </Text>
                          <Avatar
                            url={findUserAvatar(txn.payerid, members)}
                            size="$4.5"
                          />
                        </XStack>
                      }
                      title={txn.name}
                      subTitle={`Paid by: ${findUserDisplayName(
                        txn.payerid,
                        members
                      )}`}
                      iconAfter={<H1>${txn.amount}</H1>}
                    />
                  </YGroup.Item>
                </YGroup>
              </Pressable>
            </XStack>
          ))}
          {/** Creates an extra card to even out spacing */}
          {transactions.length % 2 !== 0 && (
            <XStack
              padding="$1"
              backgroundColor={"transparent"}
              width={windowWidth * 0.46}
              justifyContent="center"
            ></XStack>
          )}
        </XStack>
      </ScrollView>
      <EditTransaction
        members={members}
        open={openEditTxn}
        setOpen={setOpenEditTxn}
        transaction={currentTxnToEdit}
        setCurrentTxnToEdit={setCurrentTxnToEdit}
        billOwnerId={billOwnerId}
      />
    </View>
  );
};

export default TransactionInfoCard;
