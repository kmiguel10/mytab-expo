import { supabase } from "@/lib/supabase";
import { AlertCircle, Trash } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  AlertDialog,
  Button,
  Card,
  H4,
  Paragraph,
  SizableText,
  Spinner,
  useWindowDimensions,
  View,
  XStack,
  YStack,
} from "tamagui";
import { StyledButton } from "../button/button";

interface Props {
  billId: number;
  userId: string;
  isIpad: boolean;
}

export const ConfirmDeleteBill: React.FC<Props> = ({
  billId,
  userId,
  isIpad,
}) => {
  /********** States and Variables ***********/
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const message = (
    <SizableText fontSize="$5">
      Are you sure you want to delete bill?
    </SizableText>
  );
  const description = (
    <>
      {"\n\nThis bill will be marked as "}
      <View
        backgroundColor={"$red6Light"}
        paddingHorizontal={"$2"}
        borderRadius={"$12"}
        justifyContent="center"
      >
        <SizableText justifyContent="center" size={"$2"} color={"red"}>
          Expired
        </SizableText>
      </View>
      {". It can only be recovered by purchasing an extension."}
    </>
  );

  /********** Functions ***********/
  //Set flags for bills
  const onDelete = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("bills")
      .update({ isdeleted: true, isActive: false, isLocked: true })
      .eq("billid", billId)
      .select();

    if (data) {
      setIsLoading(false);
      router.replace({
        pathname: `/(homepage)/[id]`,
        params: {
          id: userId.toString(),
          successDeletedBillMsg: "Successfully Deleted Bill",
        },
      });
    } else if (error) {
      setIsLoading(false);
      router.replace({
        pathname: `/(homepage)/[id]`,
        params: { id: userId.toString(), errorMessage: "Error Deleting bill" },
      });
    }
  };

  return (
    <AlertDialog native={false}>
      <AlertDialog.Trigger asChild>
        <StyledButton
          delete={true}
          icon={<Trash size={"$1"} color={"$red10Light"} />}
          backgroundColor={"$red4Light"}
          size={isIpad ? "$3" : "$4"}
          width={"25%"}
        />
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
          {isLoading ? (
            <YStack
              gap="$4"
              width={width * 0.85}
              height={height * 0.2}
              justifyContent="center"
            >
              <Spinner size="large" color="forestgreen" />
            </YStack>
          ) : (
            <YStack gap="$4">
              <AlertDialog.Title>Delete Bill</AlertDialog.Title>
              <AlertDialog.Description>
                <Card backgroundColor={"$yellow7Light"} padding="$2">
                  <XStack alignItems="center" gap="$2">
                    <AlertCircle />
                    <H4>Warning</H4>
                  </XStack>
                  <Card.Header>
                    <Paragraph>
                      {message}
                      {description}
                    </Paragraph>
                  </Card.Header>
                </Card>
              </AlertDialog.Description>
              <XStack gap="$3" justifyContent="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button>Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <StyledButton decline={true} onPress={onDelete}>
                    Delete
                  </StyledButton>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          )}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default ConfirmDeleteBill;
