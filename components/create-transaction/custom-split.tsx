import {
  formatToDollarCurrency,
  truncateToTwoDecimalPlaces,
} from "@/lib/helpers";
import { MemberSplitAmount, SelectedMemberSplitAmount } from "@/types/global";
import { Axe, Check, X } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { Keyboard, ScrollView, useWindowDimensions } from "react-native";
import {
  Adapt,
  Button,
  Checkbox,
  Dialog,
  Fieldset,
  Input,
  Label,
  Separator,
  Sheet,
  SizableText,
  Unspaced,
  View,
  XStack,
  YStack,
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
  const [buttonAreaHeight, setButtonAreaHeight] = useState(windowHeight * 0.61);

  /** ---------- Handlers ---------- */
  const handleAmountChange = (memberId: string, _amount: string) => {
    const regex = /^\d*(\.\d*)?$/;

    if (regex.test(_amount)) {
      if (
        _amount.startsWith("0") &&
        _amount.length > 1 &&
        !_amount.startsWith("0.")
      ) {
        _amount = _amount.replace(/^0+/, "");
      }

      setSelectedMembers((prevSelectedMembers: any) => {
        return prevSelectedMembers?.map((member: { memberId: string }) => {
          if (member.memberId === memberId) {
            return {
              ...member,
              amount: _amount ? _amount : 0,
            };
          }
          return member;
        });
      });
    }
  };

  const handleBlur = (memberId: string, amount: string) => {
    let _amount = amount;

    if (amount === "" || amount === ".") {
      _amount = "0";
    } else if (amount.endsWith(".")) {
      _amount = amount.slice(0, -1);
    }

    setSelectedMembers((prevSelectedMembers: any) => {
      return prevSelectedMembers?.map((member: { memberId: string }) => {
        if (member.memberId === memberId) {
          return {
            ...member,
            amount: parseFloat(_amount).toString(),
          };
        }
        return member;
      });
    });
  };

  const handleSaveChanges = () => {
    if (truncateToTwoDecimalPlaces(splitAmount - sumAmount) !== 0) {
      console.error(
        "Amount is not enough",
        truncateToTwoDecimalPlaces(splitAmount - sumAmount)
      );
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
          const amountToDeduct = member.isIncluded
            ? parseFloat(member.amount.toString())
            : 0;
          setSumAmount((prevSum) => prevSum - amountToDeduct);
          return { ...member, isIncluded: !member.isIncluded, amount: 0 };
        }
        return member;
      })
    );
  };

  /** ---------- Functions ---------- */
  const initializeSelectedSplits = () => {
    setSelectedMembers(includedMembers);
  };

  const calculateSumAmount = () => {
    let sum = 0;
    selectedMembers?.forEach((member) => {
      if (member.isIncluded) {
        sum += parseFloat(member.amount.toString());
      }
    });
    setSumAmount(sum);
  };

  const onEvenClick = () => {
    const splitEvenAmount = (totalAmount: number, memberCount: number) => {
      return totalAmount / memberCount;
    };

    const includedMemberCount = includedMembers.length;
    const evenSplitAmount = splitEvenAmount(amount, includedMemberCount);

    const newSelectedMembers = includedMembers.map((member) => ({
      ...member,
      amount: truncateToTwoDecimalPlaces(evenSplitAmount),
    }));

    setSumAmount(evenSplitAmount * includedMemberCount);
    setSelectedMembers(newSelectedMembers);
  };

  const resetSplits = () => {
    setSelectedMembers((prevSelectedMembers) =>
      prevSelectedMembers?.map((member) => ({
        ...member,
        amount: 0,
        isIncluded: true,
      }))
    );
  };

  /** ---------- Listeners ---------- */
  Keyboard.addListener("keyboardDidShow", () => {
    setButtonAreaHeight(windowHeight * 0.28);
  });

  Keyboard.addListener("keyboardDidHide", () => {
    setButtonAreaHeight(windowHeight * 0.61);
  });

  /** ---------- Use Effects ---------- */
  useEffect(() => {
    initializeSelectedSplits();
    setSplitAmount(amount);
  }, [memberSplits, includedMembers]);

  useEffect(() => {
    calculateSumAmount();
  }, [selectedMembers]);

  useEffect(() => {
    resetSplits();
  }, [isModalToggled]);

  return (
    <Dialog modal>
      <Dialog.Trigger asChild alignContent="flex-end">
        <StyledButton
          backgroundColor="$blue3"
          disabled={isDisabled}
          active={!isDisabled}
          size="$3.5"
          width="30%"
          icon={<Axe size="$1.5" />}
        >
          Split
        </StyledButton>
      </Dialog.Trigger>
      <Adapt when="sm" platform="touch">
        <Sheet
          animation="medium"
          zIndex={100000}
          modal
          dismissOnSnapToBottom
          snapPoints={[90, 50]}
          onOpenChange={() => setIsModalToggled(!isModalToggled)}
        >
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            animation="100ms"
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
          animation={["quick", { opacity: { overshootClamping: true } }]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
          <XStack gap="$3">
            <YStack>
              <SizableText size="$4">Transaction Amount</SizableText>
              <SizableText size={"$9"}>
                {formatToDollarCurrency(truncateToTwoDecimalPlaces(amount))}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText size="$4">Amount to Distribute</SizableText>
              <SizableText
                size={"$9"}
                color={
                  splitAmount - sumAmount >= 0 && splitAmount - sumAmount <= 0.1
                    ? "$green8Light"
                    : "$red8Light"
                }
              >
                {formatToDollarCurrency(
                  truncateToTwoDecimalPlaces(splitAmount - sumAmount)
                )}
              </SizableText>
            </YStack>
          </XStack>
          <Separator />
          <View height={buttonAreaHeight}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <XStack
                flexWrap="wrap"
                backgroundColor="$backgroundTransparent"
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
                        size="$6"
                        checked={selectedMembers.isIncluded}
                        onCheckedChange={() =>
                          handleCheckboxChange(selectedMembers.memberId)
                        }
                      >
                        <Checkbox.Indicator>
                          <Check size="$1.5" />
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
                        value={selectedMembers.amount.toString()}
                        onChangeText={(newAmount: string) =>
                          handleAmountChange(
                            selectedMembers.memberId,
                            newAmount
                          )
                        }
                        onBlur={() =>
                          handleBlur(
                            selectedMembers.memberId,
                            selectedMembers.amount.toString()
                          )
                        }
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
            <StyledButton active onPress={onEvenClick}>
              Even
            </StyledButton>
            <Dialog.Close displayWhenAdapted asChild>
              <StyledButton
                create={
                  splitAmount - sumAmount >= 0 && splitAmount - sumAmount <= 0.1
                }
                disabled={
                  !(
                    splitAmount - sumAmount >= 0 &&
                    splitAmount - sumAmount <= 0.1
                  ) && truncateToTwoDecimalPlaces(splitAmount - sumAmount) !== 0
                }
                aria-label="Close"
                onPress={handleSaveChanges}
              >
                Save
              </StyledButton>
            </Dialog.Close>
          </XStack>
          <XStack></XStack>
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
