import { StyledButton } from "@/components/button/button";
import { BodyContainer } from "@/components/containers/body-container";
import { OuterContainer } from "@/components/containers/outer-container";
import CustomSplit from "@/components/create-transaction/custom-split";
import MembersDropdown from "@/components/create-transaction/members-dropdown";
import Notes from "@/components/create-transaction/notes";
import SplitView from "@/components/create-transaction/split-view";
import { StyledInput } from "@/components/input/input";
import { supabase } from "@/lib/supabase";
import { Member, SelectedMemberSplitAmount, Transaction } from "@/types/global";
import { Pencil } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Fieldset,
  Form,
  Separator,
  SizableText,
  Spinner,
  Text,
  useWindowDimensions,
  XStack,
  YStack,
} from "tamagui";
import DeviceInfo from "react-native-device-info";

const CreateTransaction = () => {
  /********** States and variables ***********/
  const [position, setPosition] = useState(0);
  const [amount, setAmount] = useState("");
  const [isAmountError, setIsAmountError] = useState(false);
  const [transaction, setTransaction] = useState<Transaction>({
    billid: 0,
    submittedbyid: "",
    payerid: null,
    amount: 0,
    name: "",
    notes: null,
    split: [],
    isdeleted: false,
  });
  const [isIpad, setIsIpad] = useState(false);
  const router = useRouter();
  const [includedMembers, setIncludedMembers] = useState<
    SelectedMemberSplitAmount[]
  >([]);

  const [activeMembers, setActiveMembers] = useState<Member[]>([]);

  const [isEven, setIsEven] = useState(true);
  const { width, height } = useWindowDimensions();

  const [transactionName, setTransactionName] = useState("");
  const [isTransactionNameError, setIsTransactionNameError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [maxTransaction, setMaxTransaction] = useState(0);
  const [members, setMembers] = useState<Member[]>([]);

  const [userId, setUserId] = useState("");
  const [billId, setBillId] = useState(null);
  const [openNotes, setOpenNotes] = useState(false);

  const { createTxnObject } = useLocalSearchParams();

  /********** Functions ***********/
  const getDisplayName = (userId: string) => {
    const user = activeMembers.find((member) => member.userid === userId);

    return user ? user.displayName : "";
  };

  const handleNameChange = (txnName: string) => {
    const trimmedTxnName = txnName.trim();
    // setTransaction((prevTransaction) => ({
    //   ...prevTransaction,
    //   name: txnName,
    // }));

    if (trimmedTxnName.length === 0) {
      setIsTransactionNameError(true);
      setTransactionName(txnName);
    } else if (trimmedTxnName.length <= 20) {
      setTransactionName(txnName);
      setIsTransactionNameError(false);
    } else {
      setIsTransactionNameError(true);
    }
  };

  const handlePayerChange = (selectedPayer: string) => {
    // setPayer(selectedPayer);
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      payerid: selectedPayer, // Update the payer property of the transaction object with the new value
    }));
  };

  const handleAmountChange = (_amount: string) => {
    //set error state
    if (_amount.length === 0) {
      setIsAmountError(true);
    } else if (parseFloat(_amount) === 0) {
      setIsAmountError(true);
    } else if (_amount.length <= 5 && parseFloat(_amount) > 0) {
      setIsAmountError(false);
    } else {
      setIsAmountError(true);
    }
    // Allow only digits optionally followed by a dot and then more digits
    const regex = /^\d*\.?\d*$/;

    if (regex.test(_amount)) {
      // Remove leading zeros unless the value is "0" or it starts with "0."
      if (
        _amount.startsWith("0") &&
        _amount.length > 1 &&
        !_amount.startsWith("0.")
      ) {
        _amount = _amount.replace(/^0+/, "");
      }

      if (_amount) {
        setAmount(_amount);
      } else {
        setAmount("0");
      }
    }
  };

  const handleBlur = () => {
    // Default to 0 if the input is empty or just a dot
    if (amount === "" || amount === ".") {
      setAmount("0");
      setIsAmountError(true);
    } else if (amount.endsWith(".")) {
      // Remove trailing dot if present
      setAmount(amount.slice(0, -1));
    }
  };

  /**
   * On Success:
   * - close modal
   * - set transactions to the returned transactions
   *
   * need to adjust tables on split transactions and the functions...
   */
  const onCreateTxn = async () => {
    let _userId = userId?.toString() || "";
    transaction.submittedbyid = _userId;
    transaction.billid = Number(billId);
    transaction.amount = parseFloat(amount);
    transaction.name = transactionName;

    console.log("*** Transaction to send: ", JSON.stringify(transaction));

    try {
      setIsLoading(true);
      const { data, error: billError } = await supabase
        .from("bills")
        .select("isLocked,activeTxnCount,isActive")
        .eq("billid", transaction.billid);
      console.log("data", data);
      console.log("billerror", billError);
      if (data) {
        //Scenario if the bill is expired:
        if (!data[0].isActive) {
          router.navigate({
            pathname: `/(bill)/${billId}`,
            params: {
              userId: _userId,
              errorCreateMsg: "Failed to add transaction: Bill is expired",
            }, //
          });

          setIsLoading(false);
          return;
        }

        //Scenario if the maxTransaction is reached
        if (data[0].activeTxnCount >= maxTransaction) {
          router.navigate({
            pathname: `/(bill)/${billId}`,
            params: {
              userId: _userId,
              errorCreateMsg: `Reached maximum ${maxTransaction} transactions`,
            }, //
          });
          setIsLoading(false);
          return;
        }
        if (data[0].isLocked) {
          setIsLoading(false);
          //Scenario: if the Bill is locked
          router.navigate({
            pathname: `/(bill)/${transaction.billid}`,
            params: {
              userId: _userId,
              errorEditMsg: "Bill is locked. It cannot be edited.",
            },
          });
        } else {
          //Scenario: able to add transaction
          const { data, error } = await supabase
            .from("transactions")
            .insert([transaction])
            .select();
          console.log("ADDED");
          if (error) {
            setIsLoading(false);
            throw new Error(error.message); // Throw the error to be caught in the catch block
          }

          if (data) {
            console.log("ADDED");
            const createdTxn: Transaction = data[0];
            router.navigate({
              pathname: `/(bill)/[id]`,
              params: {
                userId: _userId,
                txnName: createdTxn.name,
                id: createdTxn.billid,
              },
            });
            setIsLoading(false);
          }
          setIsLoading(false);
        }
      }

      if (billError) {
        console.log("billError", billError);
      }
    } catch (error: any) {
      console.log("ERROR", error.message);
      router.navigate({
        pathname: `/(bill)/${billId}`,
        params: { userId: _userId, errorCreateMsg: error.message }, //
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSplits = () => {
    let amountNum = parseFloat(amount);
    const splitEvenAmount = (_amount: number) => {
      return _amount / activeMembers.length;
    };
    const newSplits = activeMembers.map((member) => ({
      memberId: member.userid,
      amount: splitEvenAmount(amountNum),
      displayName: member.displayName,
      avatarUrl: member.avatar_url,
    }));

    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      split: newSplits,
    }));
  };

  const initiateIncludedMembers = () => {
    const newSelectedSplits: SelectedMemberSplitAmount[] = activeMembers.map(
      (member) => ({
        isIncluded: true,

        memberId: member.userid,
        amount: 0,
        displayName: member.displayName,
        avatarUrl: member.avatar_url,
      })
    );

    setIncludedMembers(newSelectedSplits);
  };

  const handleSaveSplits = (selectedMembers: SelectedMemberSplitAmount[]) => {
    // Filter out selectedMembers with isIncluded as true
    const includedMembers = selectedMembers.filter(
      (member) => member.isIncluded
    );
    const split = selectedMembers.map((member) => ({
      isIncluded: member.isIncluded,
      memberId: member.memberId,
      amount: member.amount,
      displayName: member.displayName,
      avatarUrl: member.avatarUrl,
    }));

    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      split: split,
    }));

    setIncludedMembers(split);
  };

  /********** UseEffects ***********/
  useEffect(() => {
    if (createTxnObject) {
      const parsedObject = JSON.parse(
        decodeURIComponent(createTxnObject.toString())
      );
      console.log("Parsed Transaction Object:", parsedObject);
      // You can now use the parsedObject to set state or perform any necessary actions
      const { userId, billId, maxTransaction, members } = parsedObject;
      setMaxTransaction(maxTransaction);
      setMembers(members);
      setUserId(userId);
      setBillId(billId);
    }
  }, [createTxnObject]);

  useEffect(() => {
    if (activeMembers.length > 0) {
      initializeSplits();
      initiateIncludedMembers();
    }
  }, [activeMembers, amount]);

  //Only use active members
  useEffect(() => {
    const _activeMembers = members.filter(
      (member) => member.isMemberIncluded === true
    );
    setActiveMembers(_activeMembers);
    console.log("**** Active members", JSON.stringify(_activeMembers));
  }, [members]);

  useEffect(() => {
    const checkIfTablet = async () => {
      const isTablet = await DeviceInfo.isTablet();
      const model = await DeviceInfo.getModel();
      const deviceType = await DeviceInfo.getDeviceType();

      console.log("Is Tablet:", isTablet);
      console.log("Model:", model);
      console.log("Device Type:", deviceType);

      const isIpadModel = model.toLowerCase().includes("ipad");
      if (isIpadModel) {
        // setButtonSize("$2.5");
      }
      setIsIpad(isIpadModel);

      console.log("Is iPad Model:", isIpadModel);
    };

    checkIfTablet();
  }, []);

  return (
    <OuterContainer
      padding="$2"
      gap="$2"
      backgroundColor={"whitesmoke"}
      height={height}
    >
      <BodyContainer
        height={height * 0.86}
        borderBottomRightRadius={"$11"}
        borderBottomLeftRadius={"$11"}
      >
        <Notes
          open={openNotes}
          setOpen={setOpenNotes}
          setTransaction={setTransaction}
          transactionNotes={transaction.notes}
          isIpad={isIpad}
        />
        {isLoading ? (
          <YStack justifyContent="center" flex={2}>
            <Spinner color="forestgreen" size="large" />
          </YStack>
        ) : (
          <Form
            onSubmit={() => console.log("")}
            rowGap="$3"
            borderRadius="$6"
            padding="$3"
            justifyContent="center"
          >
            <Form.Trigger asChild>
              <XStack justifyContent="flex-end">
                <StyledButton
                  width={width * 0.25}
                  size={"$3"}
                  create={
                    !!transactionName &&
                    !isTransactionNameError &&
                    !!amount &&
                    !isAmountError
                  }
                  disabled={
                    !transactionName ||
                    isTransactionNameError ||
                    !amount ||
                    isAmountError
                  }
                  onPress={onCreateTxn}
                >
                  Create
                </StyledButton>
              </XStack>
            </Form.Trigger>
            <Fieldset horizontal justifyContent="center">
              <SizableText size={"$9"}>$</SizableText>
              <StyledInput
                placeholder="0"
                defaultValue={""}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={handleAmountChange}
                onBlur={handleBlur}
                inputMode="decimal"
                size={"$11"}
                backgroundColor={"$backgroundTransparent"}
                borderWidth={0}
                autoFocus={true}
                maxLength={5}
              />
            </Fieldset>
            <XStack justifyContent="space-between" gap={"$2"}>
              <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
                <Text paddingLeft="$1.5" fontSize={"$1"}>
                  Transaction name (*)
                </Text>
                <StyledInput
                  placeholder="Enter name"
                  defaultValue=""
                  value={transactionName}
                  error={isTransactionNameError}
                  backgroundColor={"white"}
                  onChangeText={handleNameChange}
                  maxLength={20}
                />
              </Fieldset>
              <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
                <Text paddingLeft="$1.5" fontSize={"$1"}>
                  Paid by:
                </Text>
                <MembersDropdown
                  members={activeMembers}
                  onPayerChange={handlePayerChange}
                  defaultPayer={getDisplayName(userId?.toString() || "")}
                  isVisibleToUser={
                    !transactionName ||
                    isTransactionNameError ||
                    !amount ||
                    isAmountError
                  }
                />
              </Fieldset>
            </XStack>
            <XStack justifyContent="space-between" paddingTop="$4">
              <StyledButton
                backgroundColor="$blue3"
                size="$3"
                width="30%"
                icon={<Pencil size="$1" />}
                onPress={() => setOpenNotes(true)}
                disabled={
                  !transactionName ||
                  isTransactionNameError ||
                  !amount ||
                  isAmountError
                }
                active={
                  !!transactionName &&
                  !isTransactionNameError &&
                  !!amount &&
                  !isAmountError
                }
              >
                Notes
              </StyledButton>
              <CustomSplit
                memberSplits={transaction.split}
                amount={parseFloat(amount)}
                onSaveSplits={handleSaveSplits}
                setIsEven={setIsEven}
                includedMembers={includedMembers}
                isDisabled={
                  !transactionName ||
                  isTransactionNameError ||
                  !amount ||
                  isAmountError
                }
                isIpad={isIpad}
              />
            </XStack>
            <XStack
              alignItems="center"
              justifyContent="space-around"
              paddingTop="$3"
              gap="$3"
            >
              <Separator />
              <Text fontSize={"$2"}>Current Split</Text>
              <Separator />
            </XStack>
            <SplitView memberSplits={transaction.split} isEven={isEven} />
          </Form>
        )}
      </BodyContainer>
    </OuterContainer>
  );
};

export default CreateTransaction;
