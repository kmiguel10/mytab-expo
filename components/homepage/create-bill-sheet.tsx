import React, { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import DatePicker from "react-native-date-picker";
import {
  Card,
  H4,
  H6,
  ListItem,
  Separator,
  Sheet,
  Text,
  useWindowDimensions,
  View,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { StyledButton } from "../button/button";
import { StyledInput } from "../input/input";
import { supabase } from "@/lib/supabase";
import { BillData } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";

/**
 *
 * @returns Display Plans and Payment UI
 */

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateBillSheet: React.FC<Props> = ({ open, setOpen }) => {
  /** ---------- States and Variables ---------- */
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [position, setPosition] = useState(0);
  const [isPlanSelected, setIsPlanSelected] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [billName, setBillName] = useState("");
  const [billNameError, setBillNameError] = useState(false);
  const [isBillActive, setIsBillActive] = useState(false);

  //Default is 7 days
  const [planDuration, setPlanDuration] = useState(7);
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [payButtonHeight, setPayButtonHeight] = useState(windowHeight * 0.57);

  const router = useRouter();
  const { id } = useLocalSearchParams();

  const plans = [
    { title: "Free", subtitle: "2 Users for 1 week", price: "Free" },
    { title: "1 Week", subtitle: "2 - 12 Users for 1 week", price: "$1.99" },
    { title: "2 Weeks", subtitle: "2 - 12 Users for 2 weeks", price: "$1.99" },
  ];

  /** ---------- Functions ---------- */

  const onPlanSelected = (index: number) => {
    setIsPlanSelected(true);
    setDate(new Date());
    setSelectedPlan(index);

    //2 week plan
    if (index === 2) {
      setPlanDuration(14);

      const newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + 14);
      setEndDate(newEndDate);
    } else {
      setPlanDuration(7);

      const newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + 7);
      setEndDate(newEndDate);
    }
  };

  const onCreateBill = async () => {
    if (!billName) {
      console.error("Error: Name cannot be null");
      return;
    }

    const { data, error } = await supabase
      .from("bills")
      .insert([
        {
          ownerid: id,
          name: billName,
          start_date: date,
          end_date: endDate,
          isActive: isBillActive,
        },
      ])
      .select();

    if (data && data.length > 0) {
      setOpen(false);
      const newBillData: BillData = data[0] as BillData;
      router.replace({
        pathname: `/(homepage)/${id}`,
        params: { newBillId: newBillData?.billid ?? null }, // Add userId to params
      });
    } else {
      if (error) {
        router.replace({
          pathname: `/(homepage)/${id}`,
          params: { errorCreateMessage: "Error creating bill" },
        });
      }
    }
  };

  /**
   * Clear state when closing
   */
  const onOpenChange = () => {
    setOpen(!open);
    setIsPlanSelected(false);
    setSelectedPlan(null);
    setPlanDuration(7);
    setDate(new Date());
    setBillName("");

    //Reset end date
    const newEndDate = new Date(date);
    newEndDate.setDate(newEndDate.getDate() + 7);
    setEndDate(newEndDate);
  };

  const onDateConfirm = (_date: Date) => {
    {
      setOpenDate(false);
      setDate(date);

      const newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + planDuration);
      setEndDate(newEndDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", { month: "long", day: "numeric" });
  };

  const onBillNameInput = (_billName: string) => {
    if (_billName.length <= 20) {
      setBillName(_billName);
      setBillNameError(false);
    } else {
      setBillNameError(true);
    }

    console.log("BILLNAME TOO LONG", billNameError);
  };

  const onBackClick = () => {
    setIsPlanSelected(false);
    setSelectedPlan(null);
    setPlanDuration(7);
    setDate(new Date());
    setBillName("");

    //Reset end date
    const newEndDate = new Date(date);
    newEndDate.setDate(newEndDate.getDate() + 7);
    setEndDate(newEndDate);
  };

  // Calculate the maximum date (30 days from today)
  const minDate = new Date();
  const maxDate = new Date(
    minDate.getFullYear(),
    minDate.getMonth(),
    minDate.getDate() + 30
  );

  /** ---------- Listeners ---------- */
  // Listen for keyboard show/hide events
  Keyboard.addListener("keyboardDidShow", () => {
    setPayButtonHeight(windowHeight * 0.2);
  });

  Keyboard.addListener("keyboardDidHide", () => {
    setPayButtonHeight(windowHeight * 0.55);
  });

  /** ---------- UseEffect ---------- */
  useEffect(() => {
    const currentDate = new Date();
    console.log("Current date", currentDate >= date && currentDate <= endDate);
    if (currentDate >= date && currentDate <= endDate) {
      setIsBillActive(true);
    } else {
      setIsBillActive(false);
    }
  }, [date, endDate, minDate, maxDate]);

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={() => onOpenChange()}
      snapPoints={isPlanSelected ? [90] : [50]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" justifyContent="flex-start" gap="$5">
        <YStack>
          {isPlanSelected ? (
            <StyledButton
              width={windowWidth * 0.2}
              size={"$3"}
              onPress={onBackClick}
            >
              Back
            </StyledButton>
          ) : (
            <XStack justifyContent="flex-start">
              <H4>Select a plan:</H4>
            </XStack>
          )}

          <Separator marginVertical={"$3"} />
          <YGroup alignSelf="center" width={"100%"} size="$5" gap="$2">
            <YGroup.Item>
              {plans.map((plan, index) => (
                <ListItem
                  key={index}
                  hoverTheme
                  title={<H6 fontSize={"$4"}>{plan.title}</H6>}
                  subTitle={plan.subtitle}
                  iconAfter={
                    <StyledButton
                      size="$3"
                      active={true}
                      onPress={() => onPlanSelected(index)}
                      disabled={isPlanSelected}
                    >
                      {"  "}
                      {plan.price}
                      {"  "}
                    </StyledButton>
                  }
                  size={"$5"}
                  borderRadius={"$4"}
                  display={
                    isPlanSelected && selectedPlan !== index ? "none" : "flex"
                  }
                />
              ))}
            </YGroup.Item>
          </YGroup>
          {isPlanSelected && (
            <>
              <Separator marginVertical={"$3"} />
              <View gap="$4.5" height={payButtonHeight}>
                <Card
                  bordered
                  backgroundColor="white"
                  borderRadius={"$5"}
                  height={windowHeight * 0.2}
                >
                  <YStack gap="$2" margin="$3.5">
                    <Text>Bill Name</Text>
                    <StyledInput
                      placeholder="Ex: Mexico Trip"
                      value={billName}
                      onChangeText={onBillNameInput}
                      error={billNameError}
                    />
                  </YStack>
                  <YStack marginHorizontal="$3.5">
                    <Text>Duration</Text>
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text alignItems="center">
                        {formatDate(date)} - {formatDate(endDate)}
                      </Text>
                      <StyledButton
                        size={"$3.5"}
                        active={true}
                        onPress={() => setOpenDate(true)}
                      >
                        Select Date
                      </StyledButton>
                    </XStack>
                  </YStack>
                  <DatePicker
                    modal
                    mode={"date"}
                    open={openDate}
                    date={date}
                    minimumDate={new Date()}
                    maximumDate={maxDate}
                    onConfirm={(date) => {
                      setOpenDate(false);
                      setDate(date);

                      const newEndDate = new Date(date);
                      newEndDate.setDate(newEndDate.getDate() + planDuration);
                      setEndDate(newEndDate);
                    }}
                    onCancel={() => {
                      setOpenDate(false);
                    }}
                  />
                </Card>
              </View>
              <View paddingTop="$2">
                <StyledButton
                  create={!!billName && !billNameError}
                  disabled={!billName || billNameError}
                  onPress={onCreateBill}
                >
                  Pay
                </StyledButton>
              </View>
            </>
          )}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

export default CreateBillSheet;
