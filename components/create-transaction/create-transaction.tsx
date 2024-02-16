import { X } from "@tamagui/lucide-icons";

import {
  Text,
  Adapt,
  Button,
  Dialog,
  Fieldset,
  Input,
  Label,
  Paragraph,
  Sheet,
  TooltipSimple,
  Unspaced,
  XStack,
  YStack,
  Switch,
  Separator,
  ScrollView,
} from "tamagui";
import { SelectDemoItem } from "./SelectDemo";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MembersDropdown from "./members-dropdown";
import { Transaction, MemberSplitAmount } from "@/types/global";
import CustomSplit from "./custom-split";

interface Member {
  userId: string;
  // Add other properties if necessary
}

interface CreateTransaction {
  billId: any;
  userId: any;
  members: Member[]; // Ensure correct type for members
}

export const CreateTransaction: React.FC<CreateTransaction> = ({
  billId,
  userId,
  members,
}) => {
  // const [name, setName] = useState("");
  // const [amount, setAmount] = useState("");
  // const [payer, setPayer] = useState("");
  // const [submittedBy, setSubmittedBy] = useState("");
  // Assuming your members array is correctly populated
  const member1 = members.length >= 1 ? members[0].userId : ""; // Access userId of the first member or set to empty string if no member
  const member2 = members.length >= 2 ? members[1] : ""; // Access userId of the second member or set to empty string if no second member

  const [transaction, setTransaction] = useState<Transaction>({
    billid: 0,
    submittedbyid: null,
    payerid: null,
    amount: "",
    name: "", // Initialize with an empty string
    split: [],
    isdeleted: false,
  });

  const handleNameChange = (txnName: string) => {
    //setName(txnName);
    // transaction.name = name;
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      name: txnName,
    }));
  };

  const handlePayerChange = (selectedPayer: string) => {
    // setPayer(selectedPayer);
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      payerid: selectedPayer, // Update the payer property of the transaction object with the new value
    }));
  };

  const handleAmountChange = (amount: string) => {
    // Remove non-numeric characters except for the decimal point
    const numericValue = amount.replace(/[^\d.]/g, "");

    // Format the numeric value to a dollar format
    const formattedAmount = parseFloat(numericValue).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      amount: amount, // Update the payer property of the transaction object with the new value
    }));

    // setAmount(formattedAmount);
  };

  const onCreateTxn = async () => {
    transaction.submittedbyid = userId;
    transaction.split = [
      { memberId: userId, amount: 10 },
      { memberId: userId, amount: 10 },
      { memberId: userId, amount: 20 },
      { memberId: userId, amount: 30 },
    ];
    transaction.billid = billId;
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        // {
        //   billid: 123456, // Example bill ID
        //   submittedbyid: "e2ed822b-fb05-4b5d-aeb2-f94981f8b8a7", // Example submitted by ID
        //   payerid: "58f4a6d4-9cb7-4b53-aa70-3fa7b927f024", // Example payer ID
        //   createdat: new Date(), // Example creation timestamp
        //   amount: 500, // Example amount
        //   name: "Transaction Name", // Example name
        //   notes: "Transaction Notes", // Example notes
        //   split: {
        //     // Example split information
        //     user1: 250,
        //     user2: 250,
        //   },
        //   isdeleted: false, // Example deletion status
        // },
        transaction,
      ])
      .select();

    if (error) {
      console.log("Transaction: ", transaction);
      console.error("Error inserting data:", error.message, error.details);
    } else {
      console.log("Data inserted successfully:", data);
    }
  };

  // useEffect(() => {
  //   // Update the name property of the transaction object whenever the name state changes
  //   setTransaction((prevTransaction) => ({
  //     ...prevTransaction,
  //     name: name,
  //     payer: payer,
  //   }));
  // }, [name, payer]);

  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button>Create Transaction</Button>
      </Dialog.Trigger>
      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>

          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
          <ScrollView>
            <Dialog.Title>Create Transaction</Dialog.Title>
            <Dialog.Description>
              Make changes to your profile here. Click save when you're done.
            </Dialog.Description>
            <Fieldset gap="$4" horizontal>
              <Label width={160} justifyContent="flex-end" htmlFor="name">
                Name
              </Label>

              <Input
                flex={1}
                id="name"
                placeholder="Transaction Name"
                defaultValue=""
                value={transaction.name}
                onChangeText={handleNameChange}
              />
            </Fieldset>
            <Fieldset gap="$4" horizontal>
              <Label width={160} justifyContent="flex-end" htmlFor="amout">
                Amount
              </Label>

              <Input
                flex={1}
                id="amount"
                placeholder="Enter a number"
                defaultValue=""
                keyboardType="numeric"
                value={transaction.amount.toString()}
                onChangeText={handleAmountChange}
              />
            </Fieldset>
            <Fieldset gap="$4" horizontal>
              <Label width={160} justifyContent="flex-end" htmlFor="amout">
                Split
              </Label>
              <XStack width={200} alignItems="center" gap="$4">
                <Label
                  paddingRight="$0"
                  minWidth={90}
                  justifyContent="flex-end"
                >
                  Even
                </Label>
                <Separator minHeight={20} vertical />
                <Switch>
                  <Switch.Thumb animation="quick" />
                </Switch>
              </XStack>
            </Fieldset>
            {/* <Fieldset>
              <CustomSplit />
            </Fieldset> */}
            <Fieldset gap="$4" horizontal>
              <Label width={160} justifyContent="flex-end" htmlFor="payer">
                <TooltipSimple
                  label="Pick your favorite"
                  placement="bottom-start"
                >
                  <Paragraph>Payer</Paragraph>
                </TooltipSimple>
              </Label>

              <MembersDropdown
                members={members}
                onPayerChange={handlePayerChange}
              />
            </Fieldset>

            <Fieldset gap="$4" horizontal>
              <Label width={160} justifyContent="flex-end" htmlFor="name">
                Submitted By
              </Label>

              <Input
                flex={1}
                id="submittedBy"
                defaultValue=""
                value={userId}
                disabled={true}
              />
            </Fieldset>

            <XStack alignSelf="flex-end" gap="$4">
              <Dialog.Close displayWhenAdapted asChild>
                <Button aria-label="Close">Cancel</Button>
              </Dialog.Close>
              {/* <DialogInstance /> */}
              <Dialog.Close displayWhenAdapted asChild>
                <Button aria-label="Close" onPress={onCreateTxn}>
                  Create
                </Button>
              </Dialog.Close>
            </XStack>
            <Unspaced>
              <Dialog.Close asChild>
                <Button
                  position="absolute"
                  top="$3"
                  right="$3"
                  size="$2"
                  circular
                  icon={X}
                />
              </Dialog.Close>
            </Unspaced>
            <YStack>
              <Text>Txn name: {transaction.name}</Text>
              <Text>Amount: {transaction.amount}</Text>
              <Text>Payer: {transaction.payerid}</Text>
              <Text>SubmittedBy: {transaction.submittedbyid}</Text>
              <Text>Split: {JSON.stringify(transaction.split)}</Text>
              <Text>Submitted By: {transaction.submittedbyid}</Text>
              <Text>Members: {JSON.stringify(members)}</Text>
            </YStack>
          </ScrollView>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
