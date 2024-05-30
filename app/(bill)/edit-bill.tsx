import ConfirmDeleteBill from "@/components/bill-settings/confirm-delete-bill";
import ConfirmSaveName from "@/components/bill-settings/confirm-save-name";
import EditMembers from "@/components/bill-settings/edit-members";
import LockSwitch from "@/components/bill-settings/lock-switch";
import { StyledButton } from "@/components/button/button";
import { BodyContainer } from "@/components/containers/body-container";
import { OuterContainer } from "@/components/containers/outer-container";
import { StyledInput } from "@/components/input/input";
import { getBillInfo } from "@/lib/api";
import { formatDate, formatDateToMonthDay } from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { BillInfo } from "@/types/global";
import { Toast, ToastViewport } from "@tamagui/toast";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import DatePicker from "react-native-date-picker";
import {
  Fieldset,
  Form,
  useWindowDimensions,
  XStack,
  Text,
  YStack,
  View,
  Card,
} from "tamagui";

export const EditBill = () => {
  /** ---------- States ---------- */
  const { width, height } = useWindowDimensions();
  const { id, userId } = useLocalSearchParams();
  const [billInfo, setBillInfo] = useState<BillInfo[]>([]);
  const [open, setOpen] = useState(false);
  const [saveNameError, setSaveNameError] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [planDuration, setPlanDuration] = useState(7);
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isBillActive, setIsBillActive] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  let duration: number = 0;

  // Calculate the maximum date (30 days from today)
  const minDate = new Date();
  const maxDate = new Date(
    minDate.getFullYear(),
    minDate.getMonth(),
    minDate.getDate() + 30
  );

  /** Functions */
  //This only changes the name
  const onSubmit = async () => {
    if (billInfo.length > 0) {
      const { data, error } = await supabase
        .from("bills")
        .update({ name: billInfo[0].name, start_date: date, end_date: endDate })
        .eq("billid", id)
        .select();

      if (data) {
        console.log("submitted bill: ", data);
      } else if (error) {
        console.log("ERROR", error);
      }
    }
  };

  const handleBillNameChange = (billName: string) => {
    setBillInfo((prevBillInfo) =>
      prevBillInfo.map((bill) => ({
        ...bill,
        name: billName,
      }))
    );
  };

  /** --- UseEffects --- */
  useEffect(() => {
    //Fetch bill info
    async function fetchBillInfo() {
      if (id) {
        const data: BillInfo[] | null = await getBillInfo(Number(id));
        setBillInfo(data);

        //set isOwner
        if (data) {
          if (data[0].ownerid === userId) {
            setIsOwner(true);
          }
        }
      }
    }
    fetchBillInfo();
  }, [id, userId]);

  //set the date and endDate initially
  useEffect(() => {
    if (billInfo && billInfo.length > 0) {
      const startDate = new Date(billInfo[0]?.start_date);
      const endDate = new Date(billInfo[0]?.end_date);

      if (startDate && endDate) {
        setDate(startDate);
        setEndDate(endDate);

        const durationInMilliseconds = endDate.getTime() - startDate.getTime();
        const durationInDays = Math.ceil(
          durationInMilliseconds / (1000 * 60 * 60 * 24)
        );

        setPlanDuration(durationInDays);

        console.log("Duration in days:", durationInDays);
      }
    }
  }, [billInfo]);

  useEffect(() => {
    const today = new Date();
    if (today >= date && today <= endDate) {
      setIsBillActive(false);
    } else {
      setIsBillActive(true);
    }
    console.log("IsBillActive", today >= date && today <= endDate, today);
  }, [date, endDate]);

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
        <ToastViewport
          width={"100%"}
          justifyContent="center"
          flexDirection="column-reverse"
          top={0}
          right={0}
        />
        <Form onSubmit={onSubmit} rowGap="$3" borderRadius="$4" padding="$3">
          <View margin="$1">
            <Card
              bordered
              backgroundColor="white"
              borderRadius={"$5"}
              height={windowHeight * 0.175}
              gap="$4.5"
              padding="$2.5"
            >
              <XStack
                justifyContent="space-between"
                alignItems="center"
                gap="$2"
              >
                <Fieldset horizontal={false} gap={"$2"} width={width * 0.5}>
                  <StyledInput
                    defaultValue={billInfo[0]?.name}
                    onChangeText={handleBillNameChange}
                    error={!billInfo[0]?.name}
                  />
                </Fieldset>
                <ConfirmSaveName
                  name={billInfo[0]?.name}
                  billId={billInfo[0]?.billid}
                  userId={userId.toString()}
                  setOpen={setOpen}
                  setSaveNameError={setSaveNameError}
                  disabled={!billInfo[0]?.name}
                  date={date}
                  endDate={endDate}
                />
              </XStack>
              <YStack paddingLeft="$2">
                <Text>Duration</Text>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text alignItems="center" justifyContent="flex-start">
                    {formatDate(date)} - {formatDate(endDate)}
                  </Text>
                  {isOwner && (
                    <StyledButton
                      size={"$3.5"}
                      active={isBillActive}
                      disabled={!isBillActive}
                      onPress={() => setOpenDate(true)}
                    >
                      Select Date
                    </StyledButton>
                  )}
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
        </Form>
        {isOwner && (
          <XStack padding="$3" justifyContent="flex-end">
            <LockSwitch
              size="$2"
              userId={userId.toString()}
              billId={parseInt(id.toString())}
              isLocked={billInfo[0]?.isLocked}
            />
          </XStack>
        )}

        <EditMembers
          billId={parseInt(id.toString())}
          ownerId={billInfo[0]?.ownerid}
          height={height * 0.5}
          isOwner={isOwner}
        />
        {isOwner && (
          <XStack justifyContent="space-between" padding="$3">
            <ConfirmDeleteBill
              billId={billInfo[0]?.billid}
              userId={userId.toString()}
            />
          </XStack>
        )}

        <SaveNameToast
          setOpen={setOpen}
          open={open}
          billName={billInfo[0]?.name}
          saveNameError={saveNameError}
        />
      </BodyContainer>
    </OuterContainer>
  );
};

export default EditBill;

interface SaveNameToastProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  billName: string;
  saveNameError: boolean;
}

const SaveNameToast: React.FC<SaveNameToastProps> = ({
  setOpen,
  open,
  billName,
  saveNameError,
}) => {
  const successMsg = `Changes saved to ${billName} successfully!`;
  const errorMsg = "Error changing bill name";
  return (
    <Toast
      onOpenChange={setOpen}
      open={open}
      animation="100ms"
      enterStyle={{ x: -20, opacity: 0 }}
      exitStyle={{ x: -20, opacity: 0 }}
      opacity={1}
      x={0}
      backgroundColor={saveNameError ? "$red8Light" : "$green8Light"}
      width={"80%"}
      justifyContent="center"
    >
      <Toast.Title textAlign="left">
        {saveNameError ? errorMsg : successMsg}
      </Toast.Title>
    </Toast>
  );
};
