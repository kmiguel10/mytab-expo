import { X, Smile, Check, Axe } from "@tamagui/lucide-icons";
import { Keyboard } from "react-native";

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
import { StyledButton } from "../button/button";

interface Props {
  memberSplits: MemberSplitAmount[];
  onSaveSplits: (selectedMembers: SelectedMemberSplitAmount[]) => void;
  amount: number;
  setIsEven: React.Dispatch<React.SetStateAction<boolean>>;
  includedMembers: SelectedMemberSplitAmount[];
  isDisabled: boolean;
}

const CustomSplit: React.FC<Props> = ({
  memberSplits,
  amount,
  onSaveSplits,
  setIsEven,
  includedMembers,
  isDisabled,
}) => {
  /** States */
  const [selectedMembers, setSelectedMembers] =
    useState<SelectedMemberSplitAmount[]>();
  const [splitAmount, setSplitAmount] = useState(0);
  const [sumAmount, setSumAmount] = useState(0);
  const [isModalToggled, setIsModalToggled] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isKeyboardVisible = Keyboard.isVisible();

  /** Handlers */
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

  /** Functions */
  const initializeSelectedSplits = () => {
    setSelectedMembers(includedMembers);
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

  //reset splits when closing the modal: check members , set amount to 0
  const resetSplits = () => {
    setSelectedMembers((prevSelectedMembers) =>
      prevSelectedMembers?.map((member) => ({
        ...member,
        amount: 0,
        isIncluded: true,
      }))
    );
  };

  // Listen for keyboard show/hide events
  Keyboard.addListener("keyboardDidShow", () => {
    console.log("Keyboard is shown");
  });

  Keyboard.addListener("keyboardDidHide", () => {
    console.log("Keyboard is hidden");
  });

  /** Use Effects */

  //on save assign those checked to the transactions.split on the parent component
  useEffect(() => {
    initializeSelectedSplits();
    setSplitAmount(amount);
  }, [memberSplits]);

  useEffect(() => {
    calculateSumAmount();
  }, [selectedMembers]);

  useEffect(() => {
    console.log("Keyboard display:", isKeyboardVisible);
  }, [isKeyboardVisible]);

  useEffect(() => {
    console.log("*** Split Amount modal is open / closed: ", isModalToggled);
    resetSplits();
  }, [isModalToggled]);

  return (
    <Dialog modal>
      <Dialog.Trigger asChild alignContent="flex-end">
        <StyledButton
          backgroundColor="$blue3"
          disabled={!isDisabled}
          active={isDisabled}
          size={"$3.5"}
          width={"30%"}
          icon={<Axe size={"$1.5"} />}
        >
          Split
        </StyledButton>
      </Dialog.Trigger>
      <Adapt when="sm" platform="touch">
        <Sheet
          animation="medium"
          zIndex={200000}
          modal
          dismissOnSnapToBottom
          snapPoints={[90, 50]}
          onOpenChange={() => setIsModalToggled(!isModalToggled)}
        >
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
            <Text>{isKeyboardVisible.toString()}</Text>
          </Dialog.Description>
          <Separator />
          {/* <View height={windowHeight * 0.6}> */}
          <View height={windowHeight * 0.28}>
            <ScrollView>
              <XStack
                flexWrap="wrap"
                backgroundColor={"$backgroundTransparent"}
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
                    <XStack
                      justifyContent="space-between"
                      gap="$2"
                      alignItems="center"
                    >
                      <Checkbox
                        size={"$6"}
                        checked={selectedMembers.isIncluded}
                        onCheckedChange={() =>
                          handleCheckboxChange(selectedMembers.memberId)
                        }
                      >
                        <Checkbox.Indicator>
                          <Check size={"$1.5"} />
                        </Checkbox.Indicator>
                      </Checkbox>
                      <Label
                        width={windowWidth * 0.4}
                        justifyContent="center"
                        htmlFor="name"
                      >
                        {selectedMembers.displayName}
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
          <XStack gap="$4" justifyContent="space-between">
            {/* <DialogInstance /> */}
            <StyledButton active={true} onPress={onEvenClick}>
              Even
            </StyledButton>
            <Dialog.Close displayWhenAdapted asChild>
              <StyledButton
                create={true}
                aria-label="Close"
                onPress={handleSaveChanges}
              >
                Save
              </StyledButton>
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
