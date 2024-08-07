import { supabase } from "@/lib/supabase";
import { Trash, Trash2 } from "@tamagui/lucide-icons";
import React, { useEffect } from "react";
import {
  AlertDialog,
  Button,
  useWindowDimensions,
  XStack,
  YStack,
} from "tamagui";
import { StyledButton } from "../button/button";
import { useRouter } from "expo-router";
import { Transaction } from "@/types/global";

interface Props {
  userId: string;
  transaction: Transaction;
}

export const ConfirmDeleteTransaction: React.FC<Props> = ({
  userId,
  transaction,
}) => {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  /** Soft Delete */
  const onDeleteTxn = async () => {
    let _userId = userId.toString();
    transaction.submittedbyid = _userId;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .update({ isdeleted: true })
        .eq("id", transaction.id)
        .select();

      if (error) {
        router.navigate({
          pathname: `/(bill)/${transaction.billid}`,
          params: { userId: _userId, errorDeleteMsg: error.message }, //
        });
      }

      if (data) {
        const _deletedTxn: Transaction = data[0];
        router.navigate({
          pathname: `/(bill)/${transaction.billid}`,
          params: { userId: _userId, deletedTxnName: _deletedTxn.name },
        });
      }
    } catch (error: any) {
      router.navigate({
        pathname: `/(bill)/${transaction.billid}`,
        params: { userId: _userId, errorDeleteMsg: error.message }, //
      });
    }
  };

  return (
    <AlertDialog native={false}>
      <AlertDialog.Trigger asChild>
        <StyledButton
          color={"$red10Light"}
          delete={true}
          size="$3"
          icon={<Trash2 size={"$1"} color={"$red9"} />}
          width={width * 0.25}
        />
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={1}
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
          scale={0.9}
          opacity={1}
          y={0}
        >
          <YStack gap="$3">
            <AlertDialog.Title>Delete transaction?</AlertDialog.Title>
            <AlertDialog.Description>
              Are you sure you want to delete transaction? : "{transaction.name}
              "
            </AlertDialog.Description>
            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <StyledButton>Cancel</StyledButton>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <StyledButton decline={true} onPress={onDeleteTxn}>
                  Delete
                </StyledButton>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default ConfirmDeleteTransaction;
