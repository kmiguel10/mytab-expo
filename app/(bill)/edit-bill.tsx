import ConfirmDeleteBill from "@/components/bill-settings/confirm-delete-bill";
import ConfirmExtension from "@/components/bill-settings/confirm-extenstion";
import ConfirmSaveName from "@/components/bill-settings/confirm-save-name";
import EditMembers from "@/components/bill-settings/edit-members";
import LockSwitch from "@/components/bill-settings/lock-switch";
import { BodyContainer } from "@/components/containers/body-container";
import { OuterContainer } from "@/components/containers/outer-container";
import { StyledInput } from "@/components/input/input";
import { getBillInfo } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { BillInfo } from "@/types/global";
import { ToastViewport } from "@tamagui/toast";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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
import BillSettingsSkeleton from "@/components/skeletons/bill-settings-skeleton";
import { AlertCircle } from "@tamagui/lucide-icons";
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

  //Dates these dates are in localtimezones
  const [date, setDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [dateLocalTime, setDateLocalTime] = useState("");
  const [endDateLocalTime, setEndDateLocalTime] = useState("");

  const [isBillNameError, setIsBillNameError] = useState(false);

  const [isBillExpired, setIsBillExpired] = useState(false);
  const [isExpiringToday, setIsExpiringToday] = useState(false);

  //Initial Values
  const [initialName, setInitialName] = useState("");
  const [newBillName, setNewBillName] = useState("");

  const [isFreeBill, setIsFreeBill] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Calculate the maximum date (30 days from today)
  const today = moment().utc();

  /** ---------- Functions ---------- */

  //This saves the name and date
  const onSubmit = async () => {
    setIsLoading(true);
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
        setIsLoading(false);
      } else if (error) {
        setIsLoading(false);
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
    //Fetch bill info
    async function fetchBillInfo() {
      if (id) {
        setIsLoading(true);
        const data: BillInfo[] | null = await getBillInfo(Number(id));
        setBillInfo(data);

        //set isOwner
        if (data) {
          if (data[0].ownerid === userId) {
            setIsOwner(true);
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }
    }
    fetchBillInfo();
  }, [id, userId]);

  /**
   * Initializes dates
   * Sets isExpired and isExpiring flags
   */
  useEffect(() => {
    if (billInfo && billInfo.length > 0) {
      setIsLoading(false);
      const _isActive = billInfo[0].isActive;
      //set isLocked
      setIsLocked(billInfo[0].isLocked);

      //Start date and end date are assumed to be in UTC format from the database
      const startDate = moment(billInfo[0]?.start_date).utc();
      const endDate = moment(billInfo[0]?.end_date).utc();

      //calculate in local time
      const formattedTodayInUtc = moment().utc().local().startOf("day");
      //testing
      //const formattedTodayInUtc = endDate.local().add(1, "day").startOf("day");
      const formattedEndDate = endDate.local().startOf("day");

      //Sets isExpired and isExpiring flags
      if (formattedTodayInUtc.isSame(formattedEndDate)) {
        setIsExpiringToday(true);
        setIsBillExpired(false);
      } else if (!_isActive) {
        //formattedTodayInUtc.isAfter(formattedEndDate)
        /** TODO: use the isActive prop from the DB after implementing edge function of switching bills to expired */
        setIsBillExpired(true);
        setIsExpiringToday(false);
      } else {
        setIsBillExpired(false);
        setIsExpiringToday(false);
      }

      //Save initial name and date
      setInitialName(billInfo[0].name);
      setNewBillName(billInfo[0].name);
      setIsFreeBill(billInfo[0].isFree);

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
   * sets if expiring today and if expired
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
        {isLoading ? (
          <BillSettingsSkeleton show={true} colorMode={"light"} />
        ) : (
          <>
            <Form
              onSubmit={onSubmit}
              rowGap="$3"
              borderRadius="$4"
              padding="$3"
            >
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
                      <Fieldset
                        horizontal={false}
                        gap={"$2"}
                        width={width * 0.5}
                      >
                        <StyledInput
                          defaultValue={billInfo[0]?.name}
                          onChangeText={handleBillNameChange}
                          error={isBillNameError}
                          maxLength={20}
                          disabled={isBillExpired || isLocked}
                        />
                      </Fieldset>
                      <ConfirmSaveName
                        billId={billInfo[0]?.billid}
                        userId={userId?.toString() || ""}
                        setOpen={setOpen}
                        setSaveNameError={setSaveNameError}
                        disabled={
                          newBillName === initialName || isBillNameError
                        }
                        setInitialName={setInitialName}
                        newBillName={newBillName}
                      />
                    </XStack>
                  </YStack>
                  <YStack paddingLeft="$2">
                    <XStack gap="$2" alignItems="center">
                      <H6>Duration</H6>
                      {isExpiringToday && (
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
                      {isBillExpired && (
                        <XStack
                          backgroundColor={"$red5Light"}
                          paddingHorizontal={"$2"}
                          paddingVertical={"$1"}
                          alignItems="center"
                          borderRadius={"$12"}
                          gap="$2"
                        >
                          <AlertCircle size="$1" />
                          <Text fontSize={"$1"}>Expired</Text>
                        </XStack>
                      )}
                    </XStack>

                    <XStack justifyContent="space-between" alignItems="center">
                      <Text alignItems="center" justifyContent="flex-start">
                        {dateLocalTime} - {endDateLocalTime}
                      </Text>

                      {/* Free bills cannot be extended */}
                      {isOwner &&
                        !isFreeBill &&
                        (isExpiringToday || isBillExpired) && (
                          <ConfirmExtension
                            currentEndDateUTC={endDate.utc().toDate()}
                            billId={parseInt(id?.toString() || "")}
                            setBillInfo={setBillInfo}
                            setOpenExtendDuration={setOpenExtendDuration}
                            setErrorMessage={setExtendDurationErrorMsg}
                            isBillExpired={isBillExpired}
                            isBillExpiringToday={isExpiringToday}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
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
                  userId={userId?.toString() || ""}
                  billId={parseInt(id?.toString() || "")}
                  isLocked={isLocked}
                  disabled={!isOwner || isBillExpired}
                />
              </XStack>
            )}
            <EditMembers
              billId={parseInt(id?.toString() || "")}
              ownerId={billInfo[0]?.ownerid}
              height={height * 0.45}
              isOwner={isOwner}
              isFreeBill={isFreeBill}
              isBillExpired={isBillExpired}
              isLoading={isLoading}
            />
            {isOwner && !isBillExpired && (
              <XStack justifyContent="space-between" padding="$3">
                <ConfirmDeleteBill
                  billId={billInfo[0]?.billid}
                  userId={userId?.toString() || ""}
                />
              </XStack>
            )}
          </>
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
