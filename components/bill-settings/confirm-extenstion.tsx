import { convertToLocalDate, formatDate } from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { BillInfo } from "@/types/global";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  Button,
  Card,
  H4,
  Paragraph,
  useWindowDimensions,
  XStack,
  YStack,
} from "tamagui";
import { StyledButton } from "../button/button";
import { AlertCircle } from "@tamagui/lucide-icons";
import moment from "moment";
import * as RNIap from "react-native-iap";

interface Props {
  setOpenExtendDuration: (open: boolean) => void;
  currentEndDateUTC: Date;
  billId: number;
  setBillInfo: (billInfo: BillInfo[]) => void;
  setErrorMessage: (error: string) => void;
  isBillExpired: boolean;
  isBillExpiringToday: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ConfirmExtension: React.FC<Props> = ({
  currentEndDateUTC,
  billId,
  setBillInfo,
  setOpenExtendDuration,
  setErrorMessage,
  isBillExpired,
  isBillExpiringToday,
  isLoading,
  setIsLoading,
}) => {
  /************ States and Variables ************/
  const [extendedStartDateUTC, setExtendedStartDateUTC] = useState(moment());
  const [extendedEndDateUTC, setExtendedEndDateUTC] = useState(moment());

  const [extendedEndDateLocalTime, setExtendedEndDateLocalTime] = useState("");
  const [extendedStartDateLocalTime, setExtendedStartDateLocalTime] =
    useState("");

  const { width, height } = useWindowDimensions();

  const extensionProductId = "com.mytab.1week";

  const confirmPurchaseMessage = `Do you want to extend your bill for 1 week for $1.99?\n\nNew Start Date: ${extendedStartDateLocalTime}\nNew Expiration Date: ${extendedEndDateLocalTime}`;
  const title = "Purchase extension";

  /************ Functions ************/
  const onSubmit = async () => {
    // if (name) {
    //   const { data, error } = await supabase
    //     .from("bills")
    //     .update({ name: name, start_date: date, end_date: endDate })
    //     .eq("billid", billId)
    //     .select();
    //   if (data) {
    //     console.log("submitted bill: ", data);
    //     setOpen(true);
    //     setSaveNameError(false);
    //     // router.replace({
    //     //   pathname: `/(bill)/mybill/${billId}`,
    //     //   params: { userId: userId.toString() },
    //     // });
    //   } else if (error) {
    //     console.log("ERROR", error);
    //     setSaveNameError(true);
    //   }
    // }
    //work on this tomorrow
    //change the date and endDate of the bill
  };

  /**
   * The extentions will be based on whether expiresToday = 8 days, expired = 7
   * change the isActive = true and isLocked = false
   * also change those values in members table
   */
  const purchaseExtension = async () => {
    let purchase: void | RNIap.ProductPurchase | RNIap.ProductPurchase[] =
      undefined;

    try {
      //Request extension purchase
      setIsLoading(true);
      try {
        purchase = await RNIap.requestPurchase({
          sku: extensionProductId,
        });
      } catch (purchaseError: any) {
        setIsLoading(false);
        setOpenExtendDuration(true);
        //if error go back to edit page...
        setErrorMessage(`Error, ${purchaseError.message}`);
        return;
      }

      //If purchase is successfull, extend bill
      if (purchase) {
        //Update isActive=true and isLocked=falseflags also
        const { data, error } = await supabase
          .from("bills")
          .update({
            start_date: extendedStartDateUTC,
            end_date: extendedEndDateUTC,
            isActive: true,
            isLocked: false,
          })
          .eq("billid", billId)
          .select();

        //if success - close dialog and come back to edit bill and show success message with updates duration

        if (data) {
          setBillInfo(data);
          setOpenExtendDuration(true);
          setIsLoading(false);
          console.log("New bill", data);
          console.log(
            "Extended duration for bill: ",
            data[0]?.billId,
            data[0].start_date,
            data[0].endDate
          );
        }

        if (error) {
          setIsLoading(false);
          setOpenExtendDuration(true);
          setErrorMessage(error.message);
        }
      } else {
        //error with purchase
        setIsLoading(false);
        console.error("Error: Purchase was not successful");
        setOpenExtendDuration(true);
      }

      //if error - show error message and comeback to edit bill
    } catch (error: any) {
      setIsLoading(false);
      //show error
      setOpenExtendDuration(true);
      setErrorMessage(error.message);
    }
  };

  /************ UseEffects ************/

  /**
   * Sanitize current end date
   */
  useEffect(() => {
    let extendedDays_startDate = 1;
    let extendedDays_endDate = 8;

    if (isBillExpired) {
      //a full week
      extendedDays_startDate = 0;
      extendedDays_endDate = 7;
    } else if (isBillExpiringToday) {
      //take into account an additional day
      extendedDays_startDate = 0;
      extendedDays_endDate = 8;
    }

    console.log("currentEndDateUTC", currentEndDateUTC);

    //set extended dates
    const newStartDate = moment().utc().add(extendedDays_startDate, "days");
    const newEndate = moment().utc().add(extendedDays_endDate, "days").utc();

    //utc
    setExtendedStartDateUTC(newStartDate);
    setExtendedEndDateUTC(newEndate);

    //local
    setExtendedStartDateLocalTime(newStartDate.local().format("MMMM, D"));
    setExtendedEndDateLocalTime(newEndate.local().format("MMMM, D"));
  }, [currentEndDateUTC, isBillExpired, isBillExpiringToday]);

  return (
    <AlertDialog native={false}>
      <AlertDialog.Trigger asChild>
        <StyledButton
          active={true}
          width={width * 0.25}
          size={"$3.5"}
          disabled={false}
        >
          Extend
        </StyledButton>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
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
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack gap="$4">
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <AlertDialog.Description>
              <Card backgroundColor={"$green6Light"} padding="$2">
                <XStack alignItems="center" gap="$2">
                  <AlertCircle />
                  <H4>Note</H4>
                </XStack>
                <Card.Header>
                  <Paragraph>{confirmPurchaseMessage}</Paragraph>
                </Card.Header>
              </Card>
            </AlertDialog.Description>
            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <StyledButton>Cancel</StyledButton>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <StyledButton active={true} onPress={purchaseExtension}>
                  Purchase
                </StyledButton>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default ConfirmExtension;
