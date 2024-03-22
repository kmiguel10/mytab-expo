import { X, Smile, UserCheck, Axe } from "@tamagui/lucide-icons";

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
  ScrollView,
  Separator,
  Sheet,
  Text,
  Unspaced,
  View,
  XStack,
  YStack,
  useWindowDimensions,
} from "tamagui";

interface Props {
  memberSplits: MemberSplitAmount[];
  onSaveSplits: (selectedMembers: SelectedMemberSplitAmount[]) => void;
  amount: number;
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
  const [splitAmount, setSplitAmount] = useState(0);
  const [sumAmount, setSumAmount] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const initializeSelectedSplits = () => {
    setSelectedMembers(includedMembers);
  };

  const handleAmountChange = (memberId: string, newAmount: number) => {
    setSelectedMembers((prevSelectedMembers) => {
      return prevSelectedMembers?.map((member) => {
        if (!newAmount) {
          newAmount = 0;
        }
        if (member.memberId === memberId) {
          return {
            ...member,
            amount: newAmount,
          };
        }
        //set sumAmount to the total sum of amount of selectedMembers
        return member;
      });
    });
  };

  const calculateSumAmount = () => {
    let sum: number = 0;
    selectedMembers?.forEach((member) => {
      if (member.isIncluded) {
        sum += parseFloat(member.amount.toString());
        console.log("SUM", sum);
      }
    });
    setSumAmount(parseInt(sum.toString()));
  };

  const handleSaveChanges = () => {
    if (splitAmount != sumAmount) {
      console.error("Amount is not enough", splitAmount - sumAmount);
      return;
    }
    if (selectedMembers) {
      onSaveSplits(selectedMembers);
      setIsEven(false);
    }
  };

  const handleCheckboxChange = (memberId: string) => {
    setSelectedMembers((prevSelectedMembers) =>
      prevSelectedMembers?.map((member) => {
        if (member.memberId === memberId) {
          // Deduct amount if member is included, otherwise add amount back
          const amountToDeduct = member.isIncluded ? member.amount : 0;
          setSumAmount((prevSum) => prevSum - amountToDeduct);
          return { ...member, isIncluded: !member.isIncluded, amount: 0 };
        }
        return member;
      })
    );
  };

  //Sets the split evenly
  const onEvenClick = () => {
    const splitEvenAmount = (totalAmount: number, memberCount: number) => {
      return totalAmount / memberCount;
    };

    const includedMemberCount = includedMembers.length;
    const evenSplitAmount = splitEvenAmount(amount, includedMemberCount);

    const newSelectedMembers = includedMembers.map((member) => ({
      ...member,
      amount: evenSplitAmount,
    }));

    console.log("evenSplitAmount", evenSplitAmount);
    setSumAmount(evenSplitAmount * includedMemberCount);

    setSelectedMembers(newSelectedMembers);
  };

  //on save assign those checked to the transactions.split on the parent component
  useEffect(() => {
    // console.log("Custom Split Component");
    // console.log("Amount: ", amount);
    // console.log("member splits: ", JSON.stringify(memberSplits));
    initializeSelectedSplits();
    setSplitAmount(amount);
  }, [memberSplits]);

  useEffect(() => {
    calculateSumAmount();
  }, [selectedMembers]);

  return (
    <Dialog modal>
      <Dialog.Trigger asChild alignContent="flex-end">
        <Button
          variant="outlined"
          theme="active"
          backgroundColor="$blue3"
          disabled={!amount}
          icon={<Axe size={"$1.5"} />}
        >
          Split
        </Button>
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
            Remaining split ampount: {splitAmount - sumAmount}
          </Dialog.Description>
          <Separator />
          <View height={windowHeight * 0.45}>
            <ScrollView>
              <XStack
                flexWrap="wrap"
                backgroundColor={"whitesmoke"}
                width={windowWidth * 0.95}
                gap="$2"
              >
                {selectedMembers?.map((selectedMembers, index) => (
                  <Fieldset
                    gap="$1"
                    horizontal
                    key={index}
                    width={windowWidth * 0.88}
                  >
                    <XStack justifyContent="space-between" gap="$2">
                      <Checkbox
                        size={"$6"}
                        checked={selectedMembers.isIncluded}
                        onCheckedChange={() =>
                          handleCheckboxChange(selectedMembers.memberId)
                        }
                      >
                        <Checkbox.Indicator>
                          <UserCheck size={"$1.5"} />
                        </Checkbox.Indicator>
                      </Checkbox>
                      <Label
                        width={windowWidth * 0.4}
                        justifyContent="center"
                        htmlFor="name"
                      >
                        {selectedMembers.memberId.slice(0, 5)}
                      </Label>
                      <Input
                        disabled={!selectedMembers.isIncluded}
                        flex={1}
                        id={`amount-${selectedMembers.memberId.slice(0, 5)}`}
                        value={selectedMembers.amount?.toString()}
                        onChangeText={(newAmount: string) =>
                          handleAmountChange(
                            selectedMembers.memberId,
                            parseInt(newAmount)
                          )
                        }
                        defaultValue={selectedMembers.amount?.toString()}
                        keyboardType="numeric"
                      />
                    </XStack>
                  </Fieldset>
                ))}
              </XStack>
            </ScrollView>
          </View>
          <Separator />
          <XStack alignSelf="flex-end" gap="$4">
            {/* <DialogInstance /> */}
            <Button onPress={onEvenClick}>Even</Button>
            <Dialog.Close displayWhenAdapted asChild>
              <Button
                theme="active"
                aria-label="Close"
                onPress={handleSaveChanges}
              >
                Save
              </Button>
            </Dialog.Close>
          </XStack>
          <XStack>
            {/* <Text>{JSON.stringify(selectedMembers)}</Text> */}
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
