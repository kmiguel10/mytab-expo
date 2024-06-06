import { getMonthAndDateFromISOString } from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "@tamagui/lucide-icons";
import React from "react";
import {
  AlertDialog,
  Card,
  H4,
  Paragraph,
  useWindowDimensions,
  XStack,
  YStack,
} from "tamagui";
import { StyledButton } from "../button/button";

interface Member {
  memberid: string;
  userid: string;
  isMemberIncluded: boolean;
}
interface Props {
  name: string;
  billId: number;
  userId: string;
  disabled: boolean;
  date: Date;
  endDate: Date;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSaveNameError: React.Dispatch<React.SetStateAction<boolean>>;
  setInitialDate: (date: string) => void;
  newInitialDate: string;
  newExpirationDate: string;
}
//pass: name, billId, userId

export const ConfirmSaveName: React.FC<Props> = ({
  name,
  billId,
  userId,
  disabled,
  setOpen,
  setSaveNameError,
  setInitialDate,
  date,
  endDate,
  newInitialDate,
  newExpirationDate,
}) => {
  /************ States and Variables ************/
  const { width, height } = useWindowDimensions();
  const confirmSaveMessage = `Are you sure you want to save changes to bill: \n"${name}"`;

  const changeDateToTodayMsg =
    "You are activating the bill today. This action cannot be undone. ";

  const newExpirationDateMsg = `New Expiration Date: ${newExpirationDate}`;
  const today = new Date();
  const todayMonthDate = getMonthAndDateFromISOString(today.toISOString());
  const dateMonthDate = getMonthAndDateFromISOString(date.toISOString());

  /************ Functions ************/
  const onSubmit = async () => {
    if (name) {
      const { data, error } = await supabase
        .from("bills")
        .update({ name: name, start_date: date, end_date: endDate })
        .eq("billid", billId)
        .select();

      if (data) {
        console.log("submitted bill: ", data);
        setOpen(true);
        setSaveNameError(false);
        setInitialDate(data[0].start_date);
        // router.replace({
        //   pathname: `/(bill)/mybill/${billId}`,
        //   params: { userId: userId.toString() },
        // });
      } else if (error) {
        console.log("ERROR", error);
        setSaveNameError(true);
      }
    }
  };

  return (
    <AlertDialog native={false}>
      <AlertDialog.Trigger asChild>
        <StyledButton
          active={!disabled}
          width={width * 0.25}
          size={"$3.5"}
          disabled={disabled}
        >
          Save
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
          <YStack gap="$2">
            <AlertDialog.Title>Save changes</AlertDialog.Title>
            <AlertDialog.Description>
              <YStack gap="$2">
                <Paragraph>{confirmSaveMessage}</Paragraph>
                {todayMonthDate === dateMonthDate && (
                  <Card backgroundColor={"$yellow7Light"} padding="$2">
                    <XStack alignItems="center" gap="$2">
                      <AlertCircle />
                      <H4>Warning</H4>
                    </XStack>
                    <Paragraph padding="$1">{changeDateToTodayMsg}</Paragraph>
                    <Paragraph padding="$1">{newExpirationDateMsg}</Paragraph>
                  </Card>
                )}
              </YStack>
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <StyledButton>Cancel</StyledButton>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <StyledButton active={true} onPress={onSubmit}>
                  Save
                </StyledButton>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default ConfirmSaveName;
