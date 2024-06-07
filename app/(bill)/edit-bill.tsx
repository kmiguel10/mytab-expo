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
  const [openDate, setOpenDate] = useState(false);
  const [planDuration, setPlanDuration] = useState(7);

  //Dates these dates are in localtimezones
  const [date, setDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [dateCalculation, setDateCalculation] = useState("");
  const [endDateCalculation, setEndDateCalculation] = useState("");

  const [isDateRangeChangeable, setIsDateRangeChangeable] = useState(false);

  //Initial Values
  let initialName = "";
  const [initialStartDate, setInitialStartDate] = useState("");

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

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
  const handleBillNameChange = (billName: string) => {
    setBillInfo((prevBillInfo) =>
      prevBillInfo.map((bill) => ({
        ...bill,
        name: billName,
      }))
    );
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
  }, [id, userId, initialStartDate]);

  /**
   * Initializes dates
   */
  useEffect(() => {
    if (billInfo && billInfo.length > 0) {
      console.log("- - - Date fresh from API ");

      console.log("billInfo[0]?.start_date", billInfo[0]?.start_date);
      console.log("billInfo[0]?.end_date", billInfo[0]?.end_date);

      const localDate = moment.utc(billInfo[0]?.start_date).local();

      console.log("moment billInfo[0]?.start_date", localDate.toString());
      console.log(
        "moment billInfo[0]?.end_date",
        moment(billInfo[0]?.end_date).utc()
      );

      //Start date and end date are assumed to be in UTC format from the database
      const startDate = moment(billInfo[0]?.start_date).utc();
      const endDate = moment(billInfo[0]?.end_date).utc();

      //Save initial name and date
      initialName = billInfo[0].name;
      setInitialStartDate(startDate.format("MMM D"));

      console.log("initialName", initialName);
      console.log("initialStartDate", initialStartDate);

      console.log("startDate", startDate);
      console.log("endDate", endDate);

      let formattedStartDate = startDate.format("MMM D");
      let formattedEndDate = endDate.format("MMM D");

      console.log("Formatted date:");
      console.log("formattedStartDate:", formattedStartDate);
      console.log("formattedEndDate:", formattedEndDate);

      if (startDate && endDate) {
        //set the date and endDate initially in UTC, used when saving the updated duration
        setDate(moment(startDate));
        setEndDate(moment(endDate));

        //set dates for calculations locally, in localTime. These are used for local calculations
        setDateCalculation(startDate.local().format("MMM D"));
        setEndDateCalculation(endDate.local().format("MMM D"));

        console.log("date calc", startDate.local().format("MMM D"));

        // const durationInMilliseconds = endDate.getTime() - startDate.getTime();
        // const durationInDays = Math.ceil(
        //   durationInMilliseconds / (1000 * 60 * 60 * 24)
        // );

        const durationInDays = endDate.diff(startDate, "days");

        console.log("Duration in days", durationInDays);

        setPlanDuration(durationInDays);

        console.log("Duration in days:", durationInDays);
      }
    }
  }, [billInfo]);

  //Can be deleted, just logs
  // useEffect(() => {
  //   console.log("DATES in UTC");
  //   console.log("start date", date);
  //   console.log("end date", endDate);

  //   console.log("DATES in localTime");
  //   console.log("start date", dateCalculation);
  //   console.log("end date", endDateCalculation);
  // }, [date, endDate]);

  /**
   * 1. Bill is active if it is within the date range or better if the bill is before the start date then it can be changed still
   * 2. The bill's date range can be changed if the bill is not active yet
   *
   * Calculations must be based on UTC
   */
  useEffect(() => {
    console.log("+++++++++++");
    const today = moment().utc().format("YYYY-MM-DD"); //in localtime
    const todayFormatted = moment(today).utc().format("YYYY-MM-DD");
    const dateFormatted = date.utc().format("YYYY-MM-DD");
    const dateLocalFormatted = date.local().format("YYYY-MM-DD");

    const localToday = convertToLocalDate(today.toString());
    console.log("Today", todayFormatted.toString(), moment().utc().toString());
    console.log("Start Date", dateFormatted);
    console.log("Start Date local: ", dateLocalFormatted);
    console.log("Local today", localToday);
    console.log(
      "todayFormatted < dateFormatted",
      todayFormatted < dateFormatted
    );

    setDateCalculation(date.local().format("MMM D"));
    setEndDateCalculation(endDate.local().format("MMM D"));

    //The calculations should be done with the month/day format of the dates. So it counts the entire day and not the timestamp.
    //Changeable if today is less than the local start date or the UTC start Date
    if (todayFormatted < dateLocalFormatted || todayFormatted < dateFormatted) {
      // console.log("isDateRangeChangeable", isDateRangeChangeable);
      // console.log("today < date", today < date);
      // console.log("today", today);
      // console.log("date: ", date);
      // console.log("localToday", localToday);
      // console.log("dateCalculation", localToday);
      setIsDateRangeChangeable(true);
    } else {
      // console.log("isDateRangeChangeable", isDateRangeChangeable);
      // console.log("today < date", today < date);
      // console.log("today", today);
      // console.log("date: ", date);
      // console.log("localToday", localToday);
      // console.log("dateCalculation", localToday);
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
                  date={date.utc().toDate()}
                  endDate={endDate.utc().toDate()}
                  setInitialDate={setInitialStartDate}
                  newInitialDate={dateCalculation}
                  newExpirationDate={endDateCalculation}
                />
              </XStack>
              <YStack paddingLeft="$2">
                <XStack gap="$2">
                  <Text>Duration</Text>
                  {initialStartDate !== date.utc().format("MMM D") && (
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
                    {dateCalculation} -{endDateCalculation}
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
                        currentEndDateUTC={endDate.utc().toDate()}
                        billId={parseInt(id.toString())}
                        setBillInfo={setBillInfo}
                        setOpenExtendDuration={setOpenExtendDuration}
                        setErrorMessage={setExtendDurationErrorMsg}
                      />
                    )}
                </XStack>
              </YStack>
              {/* When picking a date, it is initialized to today in order for the time to be accurate */}
              <DatePicker
                modal
                mode={"date"}
                open={openDate}
                date={moment().toDate()}
                minimumDate={moment().toDate()}
                maximumDate={maxDate}
                onConfirm={(_date) => {
                  //What might be happening here is. The native date is already in UTC for example 12:00:00 UTC but the datepicker is converting that date to UTC also by adding 4-5 more hours...
                  //need to be able to determine which timezone currently
                  setOpenDate(false);
                  setDate(moment(_date));
                  console.log(
                    "*** Start from datepicker",
                    moment(_date).utc().toDate()
                  );
                  const newEndDate = moment(_date);
                  console.log(
                    "new endate",
                    newEndDate.toString(),
                    date.toString()
                  );
                  console.log("DURATION", planDuration);
                  newEndDate.add(planDuration, "days");
                  setEndDate(newEndDate);
                  // console.log("End date", newEndDate.add(planDuration, "days"));
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
