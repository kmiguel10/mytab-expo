import EditTransaction from "@/components/create-transaction/edit-transaction-sheet";
import Avatar from "@/components/login/avatar";
import { getActiveTransactions } from "@/lib/api";
import {
  findUserAvatar,
  findUserDisplayName,
  formatDateToMonthDay,
  formatToDollarCurrency,
} from "@/lib/helpers";
import { Member, Transaction } from "@/types/global";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, RefreshControl } from "react-native";
import {
  ListItem,
  ScrollView,
  SizableText,
  Text,
  View,
  XStack,
  YGroup,
  useWindowDimensions,
} from "tamagui";

interface Props {
  transactions: Transaction[];
  members: Member[];
  currentUser: string;
  resetToasts: () => void;
  setTransactions: (transactions: Transaction[]) => void;
  isLocked: boolean;
  billOwnerId: string;
  billId: number;
  setIsLoading: (loading: boolean) => void;
}

const TransactionInfoCard: React.FC<Props> = ({
  transactions,
  currentUser,
  members,
  resetToasts,
  setTransactions,
  isLocked,
  billOwnerId,
  billId,
  setIsLoading,
}) => {
  /** ---------- States and Variables ---------- */
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

  const router = useRouter();

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
        billId ? billId?.toString() : "0"
      );
      if (transactionData) setRefreshing(false);
      setTransactions(transactionData);
    }
  };

  /**
   * If the current user is not the owner of the transaction then open a modal (not editable) instead of the screen
   */
  const onTransactionClick = (txnId: string) => {
    console.log("openEditTxn", openEditTxn);
    resetToasts();
    const _currentTxn = transactions.find((txn) => `${txn.id}` === txnId) ?? {
      billid: 0,
      submittedbyid: "",
      payerid: null,
      amount: 0,
      name: "",
      notes: null,
      split: [],
      isdeleted: false,
    };
    setCurrentTxnToEdit(_currentTxn);

    //create object to send
    const editTxnObject = {
      members: members,
      transaction: _currentTxn,
      billOwnerId: billOwnerId,
      currentUser: currentUser,
      transactionId: txnId,
      // setIsLoadingBillPage: setIsLoading
    };
    if (currentUser === _currentTxn.payerid) {
      console.log(
        "screen",
        currentUser === currentTxnToEdit.payerid,
        currentUser,
        currentTxnToEdit.payerid
      );
      router.push({
        pathname: "/screens/edit-transaction",
        params: {
          editTxnObject: encodeURIComponent(JSON.stringify(editTxnObject)),
        },
      });
    } else {
      console.log(
        "modal",
        currentUser === currentTxnToEdit.payerid,
        currentUser,
        currentTxnToEdit.payerid
      );
      setOpenEditTxn(true);
    }
  };

  /** ---------- UseEffects  ---------- */
  useEffect(() => {
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
    }
  }, [openEditTxn]);

  return (
    <View height={"100%"}>
      <EditTransaction
        members={members}
        open={openEditTxn}
        setOpen={setOpenEditTxn}
        transaction={currentTxnToEdit}
        setCurrentTxnToEdit={setCurrentTxnToEdit}
        billOwnerId={billOwnerId}
        setIsLoadingBillPage={setIsLoading}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {transactions.length > 0 ? (
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
                            <SizableText
                              fontSize="$1"
                              alignItems="center"
                              color={"$gray10Light"}
                            >
                              {txn.createdat
                                ? formatDateToMonthDay(new Date(txn.createdat))
                                : "N/A"}
                            </SizableText>
                            <Avatar
                              url={findUserAvatar(txn.payerid, members)}
                              size="$4.5"
                            />
                          </XStack>
                        }
                        title={txn.name}
                        subTitle={
                          <SizableText
                            size={"$2"}
                            color={"$gray10Light"}
                          >{`Paid by: ${findUserDisplayName(
                            txn.payerid,
                            members
                          )}`}</SizableText>
                        }
                        iconAfter={
                          <SizableText>
                            {formatToDollarCurrency(
                              txn.amount ? txn.amount : 0
                            )}
                          </SizableText>
                        }
                      />
                    </YGroup.Item>
                  </YGroup>
                </Pressable>
              </XStack>
            ))}
          </XStack>
        ) : (
          <XStack
            gap="$1"
            backgroundColor={"transparent"}
            justifyContent="center"
            padding="$10"
          >
            <Text>Empty</Text>
          </XStack>
        )}
      </ScrollView>
    </View>
  );
};

export default TransactionInfoCard;
