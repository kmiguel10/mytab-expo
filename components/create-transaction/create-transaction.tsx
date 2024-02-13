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
} from "tamagui";
import { SelectDemoItem } from "./SelectDemo";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MembersDropdown from "./members-dropdown";

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
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");

  const handlePayerChange = (selectedPayer: string) => {
    setPayer(selectedPayer);
  };

  const handleAmountChange = (text: string) => {
    // Remove non-numeric characters except for the decimal point
    const numericValue = text.replace(/[^\d.]/g, "");

    // Format the numeric value to a dollar format
    const formattedAmount = parseFloat(numericValue).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    setAmount(formattedAmount);
  };

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
              value={name}
              onChangeText={setName}
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
              value={amount}
              onChangeText={handleAmountChange}
            />
          </Fieldset>
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
            {/* <DialogInstance /> */}
            <Dialog.Close displayWhenAdapted asChild>
              <Button aria-label="Close">Save changes</Button>
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
            <Text>Txn name: {name}</Text>
            <Text>Amount: {amount}</Text>
            <Text>Payer: {payer}</Text>
            <Text>BillId: {billId}</Text>
            <Text>Submitted By: {userId}</Text>
            <Text>Members: {JSON.stringify(members)}</Text>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
