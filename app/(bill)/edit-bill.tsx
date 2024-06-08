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
  getMonthAndDateFromISOString,
} from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { BillInfo } from "@/types/global";
import { ToastViewport } from "@tamagui/toast";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import DatePicker from "react-native-date-picker";
import {
  Card,
  Fieldset,
  Form,
  H6,
  Text,
  useWindowDimensions,
  View,
  XStack,
  YStack,
} from "tamagui";

import ExtendDurationToast from "@/components/bill-settings/extend-duration-toast";
import SaveNameToast from "@/components/bill-settings/save-name-toast";
import moment from "moment";
import "moment-timezone";
import { AlertCircle } from "@tamagui/lucide-icons";

/**
 * This component's features are only visible to the bill owner
 * The following can be edited and saved
 *
 * It is important that calculations for this component are done in UTC
 *
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

  //Dates these dates are in localtimezones
  const [date, setDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [dateLocalTime, setDateLocalTime] = useState("");
  const [endDateLocalTime, setEndDateLocalTime] = useState("");

  const [isBillNameError, setIsBillNameError] = useState(false);

  //Initial Values
  const [initialName, setInitialName] = useState("");
  const [newBillName, setNewBillName] = useState("");

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Calculate the maximum date (30 days from today)
  const today = moment().utc();

  const todayMonthDate = today.format("MMM D");
  const endDateMonthDate = endDate.format("MMM D");

  /** ---------- Functions ---------- */

  //This saves the name and date
  const onSubmit = async () => {
    if (billInfo.length > 0) {
      const { data, error } = await supabase
        .from("bills")
        .update({
          name: billInfo[0].name,
          start_date: date.utc(),
          end_date: endDate.utc(),
        })
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

  // Handle Bill Name Change
  const handleBillNameChange = (_billName: string) => {
    const trimmedBillName = _billName.trim();

    if (trimmedBillName.length === 0) {
      setIsBillNameError(true);
      setNewBillName(_billName);
    } else if (trimmedBillName.length <= 20) {
      setIsBillNameError(false);
      setNewBillName(_billName);
    } else {
      setIsBillNameError(true);
      setNewBillName(_billName);
    }
  };

  /** ---------- UseEffects ---------- */
  /**
   * Fetches Bill Info
   */
  useEffect(() => {
    console.log("***** Bill Info Fetched");
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

  /**
   * Initializes dates
   */
  useEffect(() => {
    if (billInfo && billInfo.length > 0) {
      //Start date and end date are assumed to be in UTC format from the database
      const startDate = moment(billInfo[0]?.start_date).utc();
      const endDate = moment(billInfo[0]?.end_date).utc();

      //Save initial name and date
      setInitialName(billInfo[0].name);
      setNewBillName(billInfo[0].name);

      if (startDate && endDate) {
        //set the date and endDate initially in UTC, used when saving the updated duration
        setDate(moment(startDate));
        setEndDate(moment(endDate));

        //set dates for calculations locally, in localTime. These are used for local calculations
        setDateLocalTime(startDate.local().format("MMM D"));
        setEndDateLocalTime(endDate.local().format("MMM D"));
      }
    }
  }, [billInfo]);

  /**
   * 1. Bill is active if it is within the date range or better if the bill is before the start date then it can be changed still
   * 2. The bill's date range can be changed if the bill is not active yet
   *
   * Calculations must be based on UTC
   */
  useEffect(() => {
    setDateLocalTime(date.local().format("MMM D"));
    setEndDateLocalTime(endDate.local().format("MMM D"));
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
            <Card
              bordered
              backgroundColor="white"
              borderRadius={"$5"}
              height={windowHeight * 0.225}
              gap="$4.5"
              padding="$2.5"
            >
              <YStack paddingLeft="$2">
                <XStack gap="$2" alignItems="center" paddingBottom="$2">
                  <H6>Bill Name</H6>
                </XStack>
                <XStack
                  justifyContent="space-between"
                  alignItems="center"
                  gap="$2"
                >
                  <Fieldset horizontal={false} gap={"$2"} width={width * 0.5}>
                    <StyledInput
                      defaultValue={billInfo[0]?.name}
                      onChangeText={handleBillNameChange}
                      error={isBillNameError}
                      maxLength={20}
                    />
                  </Fieldset>
                  <ConfirmSaveName
                    billId={billInfo[0]?.billid}
                    userId={userId.toString()}
                    setOpen={setOpen}
                    setSaveNameError={setSaveNameError}
                    disabled={newBillName === initialName || isBillNameError}
                    setInitialName={setInitialName}
                    newBillName={newBillName}
                  />
                </XStack>
              </YStack>

              <YStack paddingLeft="$2">
                <XStack gap="$2" alignItems="center">
                  <H6>Duration</H6>
                  {todayMonthDate === endDateMonthDate && (
                    <XStack
                      backgroundColor={"$yellow5Light"}
                      paddingHorizontal={"$2"}
                      paddingVertical={"$1"}
                      alignItems="center"
                      borderRadius={"$12"}
                      gap="$2"
                    >
                      <AlertCircle size="$1" />
                      <Text fontSize={"$1"}>Expires today</Text>
                    </XStack>
                  )}
                </XStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <Text alignItems="center" justifyContent="flex-start">
                    {dateLocalTime} - {endDateLocalTime}
                  </Text>

                  {isOwner && todayMonthDate === endDateMonthDate && (
                    <ConfirmExtension
                      currentEndDateUTC={endDate.utc().toDate()}
                      billId={parseInt(id.toString())}
                      setBillInfo={setBillInfo}
                      setOpenExtendDuration={setOpenExtendDuration}
                      setErrorMessage={setExtendDurationErrorMsg}
                    />
                  )}
                  {/* For testing */}
                  {/* <ConfirmExtension
                    currentEndDateUTC={endDate.utc().toDate()}
                    billId={parseInt(id.toString())}
                    setBillInfo={setBillInfo}
                    setOpenExtendDuration={setOpenExtendDuration}
                    setErrorMessage={setExtendDurationErrorMsg}
                  /> */}
                </XStack>
              </YStack>
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
              disabled={!isOwner}
            />
          </XStack>
        )}
        <EditMembers
          billId={parseInt(id.toString())}
          ownerId={billInfo[0]?.ownerid}
          height={height * 0.45}
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
