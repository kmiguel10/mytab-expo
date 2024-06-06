import ConfirmDeleteBill from "@/components/bill-settings/confirm-delete-bill";
import ConfirmExtension from "@/components/bill-settings/confirm-extenstion";
import ConfirmSaveName from "@/components/bill-settings/confirm-save-name";
import EditMembers from "@/components/bill-settings/edit-members";
import LockSwitch from "@/components/bill-settings/lock-switch";
import { StyledButton } from "@/components/button/button";
import { BodyContainer } from "@/components/containers/body-container";
import { OuterContainer } from "@/components/containers/outer-container";
import { StyledInput } from "@/components/input/input";
import { getBillInfo } from "@/lib/api";
import {
  convertToLocalDate,
  formatDate,
  formatDateToMonthDay,
  getMonthAndDateFromISOString,
} from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { BillInfo } from "@/types/global";
import { Toast, ToastViewport } from "@tamagui/toast";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import DatePicker from "react-native-date-picker";
import {
  Card,
  Fieldset,
  Form,
  Text,
  useWindowDimensions,
  View,
  XStack,
  YStack,
} from "tamagui";

/**
 * This component's features are only visible to the bill owner
 * The following can be edited and saved
 * 1. Bill Name
 * 2. Bill Duration
 *  a. Bill Duration can be edited only if the bill has not started
 *    - It can be extended within one month
 *  b. Bill Duration can be extended for one week only after it has become inactive (meaning expired) or on the last day of the billduration
 *  c. Once the bill has become active, the duration cannot be changed and it expires on the given expiration date
 *
 * @returns
 */
export const EditBill = () => {
  /** ---------- States ---------- */
  const { width, height } = useWindowDimensions();
  const { id, userId } = useLocalSearchParams();
  const [billInfo, setBillInfo] = useState<BillInfo[]>([]);
  const [open, setOpen] = useState(false);
  const [openExtendDuration, setOpenExtendDuration] = useState(false);
  const [extendDurationErrorMsg, setExtendDurationErrorMsg] = useState("");
  const [saveNameError, setSaveNameError] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [planDuration, setPlanDuration] = useState(7);
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isDateRangeChangeable, setIsDateRangeChangeable] = useState(false);
  const [dateCalculation, setDateCalculation] = useState(new Date());
  const [endDateCalculation, setEndDateCalculation] = useState(new Date());
  const expirationWarningMessage = `${billInfo[0]?.name} expires today. Do you want to extend for another week for $1.99?`;

  //Initial Values
  let initialName = "";

  const [initialStartDate, setInitialStartDate] = useState("");

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  let duration: number = 0;

  // Get the timezone offset of the device
  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

  // Calculate the maximum date (30 days from today)
  const minDate = new Date();
  const maxDate = new Date(
    minDate.getFullYear(),
    minDate.getMonth(),
    minDate.getDate() + 30
  );

  const todayMonthDate = getMonthAndDateFromISOString(minDate.toISOString());
  const endDateMonthDate = getMonthAndDateFromISOString(endDate.toISOString());

  /** ---------- Functions ---------- */
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

  const onPurchaseExtension = async () => {};

  /** ---------- Handlers ---------- */
  const handleBillNameChange = (billName: string) => {
    setBillInfo((prevBillInfo) =>
      prevBillInfo.map((bill) => ({
        ...bill,
        name: billName,
      }))
    );
  };

  /** ---------- UseEffects ---------- */
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
  }, [id, userId, initialStartDate]);

  useEffect(() => {
    if (billInfo && billInfo.length > 0) {
      console.log("- - - Date fresh from API ");

      console.log("billInfo[0]?.start_date", billInfo[0]?.start_date);
      console.log("billInfo[0]?.end_date", billInfo[0]?.end_date);

      const startDate = new Date(billInfo[0]?.start_date);
      const endDate = new Date(billInfo[0]?.end_date);

      //Save initial name and date
      initialName = billInfo[0].name;
      setInitialStartDate(formatDateToMonthDay(startDate));

      console.log("initialName", initialName);
      console.log("initialStartDate", initialStartDate);

      console.log("startDate", startDate);
      console.log("endDate", endDate);

      let formattedStartDate = formatDate(startDate);
      let formattedEndDate = formatDate(endDate);

      console.log("Formatted date:");
      console.log("formattedStartDate:", formattedStartDate);
      console.log("formattedEndDate:", formattedEndDate);

      if (startDate && endDate) {
        //set the date and endDate initially in UTC, used when saving the updated duration
        setDate(startDate);
        setEndDate(endDate);

        //set dates for calculations locally, in localTime. These are used for local calculations
        setDateCalculation(convertToLocalDate(startDate.toString()));
        setEndDateCalculation(convertToLocalDate(endDate.toString()));

        const durationInMilliseconds = endDate.getTime() - startDate.getTime();
        const durationInDays = Math.ceil(
          durationInMilliseconds / (1000 * 60 * 60 * 24)
        );

        console.log("Duration in days", durationInDays);

        setPlanDuration(durationInDays);

        console.log("Duration in days:", durationInDays);
      }
    }
  }, [billInfo]);

  //Can be deleted, just logs
  useEffect(() => {
    console.log("DATES in UTC");
    console.log("start date", date);
    console.log("end date", endDate);

    console.log("DATES in localTime");
    console.log("start date", dateCalculation);
    console.log("end date", endDateCalculation);
  }, [date, endDate]);

  /**
   * 1. Bill is active if it is within the date range or better if the bill is before the start date then it can be changed still
   * 2. The bill's date range can be changed if the bill is not active yet
   *
   * Calculations must be based on UTC
   */
  useEffect(() => {
    console.log("+++++++++++");
    const today = new Date(); //in UTC
    const localToday = convertToLocalDate(today.toString());
    console.log("Today", today);
    console.log("Date", date);
    console.log("Local today", localToday);

    setDateCalculation(convertToLocalDate(date.toString()));
    setEndDateCalculation(convertToLocalDate(endDate.toString()));

    if (today < date) {
      console.log("isDateRangeChangeable", isDateRangeChangeable, today < date);
      console.log(date, localToday, dateCalculation);
      setIsDateRangeChangeable(true);
    } else {
      console.log("isDateRangeChangeable", isDateRangeChangeable);
      console.log(date, localToday, dateCalculation);
      setIsDateRangeChangeable(false);
    }
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
          <View margin="$1" gap="$2">
            {/* <Card
              bordered
              backgroundColor="$yellow7Light"
              borderRadius={"$5"}
              height={windowHeight * 0.05}
              gap="$4.5"
              padding="$2.5"
            >
              <paragra>{expirationWarningMessage}</paragra>
            </Card> */}
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
                  setInitialDate={setInitialStartDate}
                  newInitialDate={formatDateToMonthDay(dateCalculation)}
                  newExpirationDate={formatDateToMonthDay(endDateCalculation)}
                />
              </XStack>
              <YStack paddingLeft="$2">
                <XStack gap="$2">
                  <Text>Duration</Text>
                  {initialStartDate.toString() !==
                    formatDateToMonthDay(dateCalculation) && (
                    <View
                      backgroundColor={"$yellow5Light"}
                      paddingHorizontal={"$2"}
                      paddingVertical={"$1"}
                      alignItems="center"
                      borderRadius={"$12"}
                    >
                      <Text fontSize={"$1"}>Unsaved Changes</Text>
                    </View>
                  )}
                </XStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <Text alignItems="center" justifyContent="flex-start">
                    {formatDateToMonthDay(dateCalculation)} -
                    {formatDateToMonthDay(endDateCalculation)}
                  </Text>
                  {todayMonthDate === endDateMonthDate && (
                    <View
                      backgroundColor={"$yellow5Light"}
                      paddingHorizontal={"$2"}
                      paddingVertical={"$1"}
                      alignItems="center"
                      borderRadius={"$12"}
                    >
                      <Text fontSize={"$1"}>Expires today</Text>
                    </View>
                  )}

                  {isOwner && isDateRangeChangeable && (
                    <StyledButton
                      size={"$3.5"}
                      active={isDateRangeChangeable}
                      disabled={!isDateRangeChangeable}
                      onPress={() => setOpenDate(true)}
                    >
                      Select Date
                    </StyledButton>
                  )}
                  {isOwner &&
                    !isDateRangeChangeable &&
                    todayMonthDate === endDateMonthDate && (
                      <ConfirmExtension
                        currentEndDateUTC={endDate}
                        billId={parseInt(id.toString())}
                        setBillInfo={setBillInfo}
                        setOpenExtendDuration={setOpenExtendDuration}
                        setErrorMessage={setExtendDurationErrorMsg}
                      />
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
                  console.log("Start from datepicker", date);
                  const newEndDate = new Date(date);
                  newEndDate.setDate(newEndDate.getDate() + planDuration);
                  console.log("End date", newEndDate.getDate() + planDuration);
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
              disabled={isDateRangeChangeable}
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
        <ExtendDurationToast
          setOpenExtendDuration={setOpenExtendDuration}
          openExtendDuration={openExtendDuration}
          extendErrorMessage={extendDurationErrorMsg}
          bill={billInfo}
        />
      </BodyContainer>
    </OuterContainer>
  );
};

export default EditBill;

interface ExtendDurationToastProps {
  setOpenExtendDuration: React.Dispatch<React.SetStateAction<boolean>>;
  openExtendDuration: boolean;
  extendErrorMessage: string;
  bill: BillInfo[];
}

const ExtendDurationToast: React.FC<ExtendDurationToastProps> = ({
  setOpenExtendDuration,
  openExtendDuration,
  extendErrorMessage,
  bill,
}) => {
  const errorTitle = "Error extending duration";
  const successTitle = `Bill Duration Extended for ${bill[0]?.name}`;

  const successMsg = ` New Duration ${formatDate(
    convertToLocalDate(bill[0]?.start_date.toString())
  )} - ${formatDate(convertToLocalDate(bill[0]?.end_date.toString()))}`;
  return (
    <Toast
      onOpenChange={setOpenExtendDuration}
      open={openExtendDuration}
      animation="100ms"
      enterStyle={{ x: -20, opacity: 0 }}
      exitStyle={{ x: -20, opacity: 0 }}
      opacity={1}
      x={0}
      backgroundColor={extendErrorMessage ? "$red8Light" : "$green8Light"}
      width={"80%"}
      justifyContent="center"
    >
      <Toast.Title textAlign="left">
        {extendErrorMessage ? errorTitle : successTitle}
      </Toast.Title>
      <Toast.Description>
        {extendErrorMessage ? extendErrorMessage : successMsg}
      </Toast.Description>
    </Toast>
  );
};

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
