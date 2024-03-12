import { X } from "@tamagui/lucide-icons";

import { MemberSplitAmount, SelectedMemberSplitAmount } from "@/types/global";
import { useEffect, useState } from "react";
import {
  Adapt,
  Button,
  Checkbox,
  Dialog,
  Fieldset,
  Input,
  Label,
  Sheet,
  Text,
  Unspaced,
  XStack,
} from "tamagui";

interface Props {
  memberSplits: MemberSplitAmount[];
  onSaveSplits: (selectedMembers: SelectedMemberSplitAmount[]) => void;
  amount: string;
  setIsEven: React.Dispatch<React.SetStateAction<boolean>>;
  includedMembers: SelectedMemberSplitAmount[];
}

const CustomSplit: React.FC<Props> = ({
  memberSplits,
  amount,
  onSaveSplits,
  setIsEven,
  includedMembers,
}) => {
  const [selectedMembers, setSelectedMembers] =
    useState<SelectedMemberSplitAmount[]>();
  //set up the list item...

  const initializeSelectedSplits = () => {
    setSelectedMembers(includedMembers);

    console.log(
      "Selected members (custom split): ",
      JSON.stringify(selectedMembers)
    );
  };

  const handleAmountChange = (memberId: string, newAmount: string) => {
    setSelectedMembers((prevSelectedMembers) => {
      return prevSelectedMembers?.map((member) => {
        if (member.memberId === memberId) {
          return {
            ...member,
            amount: parseFloat(newAmount),
          };
        }
        return member;
      });
    });
  };

  const handleSaveChanges = () => {
    if (selectedMembers) {
      onSaveSplits(selectedMembers);
      setIsEven(false);
    }
  };

  const handleCheckboxChange = (memberId: string) => {
    setSelectedMembers((prevSelectedMembers) =>
      prevSelectedMembers?.map((member) =>
        member.memberId === memberId
          ? { ...member, isIncluded: !member.isIncluded }
          : member
      )
    );
  };

  //on save assign those checked to the transactions.split on the parent component
  useEffect(() => {
    console.log("Custom Split Component");
    console.log("Amount: ", amount);
    console.log("member splits: ", JSON.stringify(memberSplits));
    initializeSelectedSplits();
  }, [memberSplits]);
  return (
    <Dialog modal>
      <Dialog.Trigger asChild alignContent="flex-end">
        {/* <XStack>
          <XStack flex={2} /> */}
        <Button width="80%" variant="outlined" theme="active">
          Split
        </Button>
        {/* </XStack> */}
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
          <Dialog.Title>Amount: {amount}</Dialog.Title>

          <Dialog.Description>
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>
          {selectedMembers?.map((selectedMembers, index) => (
            // <Text key={index}>{JSON.stringify(selectedMembers)}</Text>
            <Fieldset gap="$1" horizontal key={index}>
              {/* <Text key={index}>{JSON.stringify(selectedMembers)}</Text> */}
              <XStack>
                <Checkbox
                  checked={selectedMembers.isIncluded}
                  onCheckedChange={() =>
                    handleCheckboxChange(selectedMembers.memberId)
                  }
                >
                  <Checkbox.Indicator>
                    <Text>X</Text>
                  </Checkbox.Indicator>
                </Checkbox>
                <Label width={160} justifyContent="flex-end" htmlFor="name">
                  {selectedMembers.memberId}
                </Label>
                <Input
                  flex={1}
                  id={`amount-${selectedMembers.memberId}`}
                  value={selectedMembers.amount?.toString()}
                  onChangeText={(newAmount: string) =>
                    handleAmountChange(selectedMembers.memberId, newAmount)
                  }
                  defaultValue={selectedMembers.amount?.toString()}
                />
              </XStack>
            </Fieldset>
          ))}
          <XStack alignSelf="flex-end" gap="$4">
            {/* <DialogInstance /> */}
            <Dialog.Close displayWhenAdapted asChild>
              <Button
                theme="active"
                aria-label="Close"
                onPress={handleSaveChanges}
              >
                Save changes
              </Button>
            </Dialog.Close>
          </XStack>
          <XStack>
            <Text>{JSON.stringify(selectedMembers)}</Text>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default CustomSplit;
