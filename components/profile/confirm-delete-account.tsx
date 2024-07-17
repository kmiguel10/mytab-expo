import { supabase } from "@/lib/supabase";
import { AlertCircle } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, useWindowDimensions } from "react-native";
import {
  AlertDialog,
  Button,
  Card,
  H4,
  Paragraph,
  SizableText,
  Spinner,
  XStack,
  YStack,
} from "tamagui";
import { StyledButton } from "../button/button";

interface Props {
  billId: number;
  userId: string;
  isIpad: boolean;
}

const ConfirmDeleteAccount: React.FC<Props> = ({ billId, userId, isIpad }) => {
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const message = (
    <SizableText fontSize="$5">
      Are you sure you want to delete your account?
    </SizableText>
  );

  const deleteDescription = (
    <>
      {`\n\n- Your active bills will be marked as inactive and expired. \n- Your email and display name will be deleted.`}
    </>
  );

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      // Call the deleteUser Edge Function
      const { data, error } = await supabase.functions.invoke("deleteUser", {
        body: { userId: userId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data && data.success) {
        // If deletion is successful, sign out the user
        await supabase.auth.signOut();

        Alert.alert(
          "Success",
          "User account deleted successfully. You have been signed out.",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigate to the login or home screen after successful deletion and sign out
                router.replace("/"); // Adjust this route as needed
              },
            },
          ]
        );
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      Alert.alert("Error", error.message || "Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog native={false}>
      <AlertDialog.Trigger asChild>
        <StyledButton
          delete={true}
          backgroundColor={"$red7Light"}
          size={isIpad ? "$3" : "$3.5"}
          width={width * 0.25}
        >
          Delete
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
              <AlertDialog.Title>Delete Account</AlertDialog.Title>
              <AlertDialog.Description>
                <Card backgroundColor={"$red7Light"} padding="$2">
                  <XStack alignItems="center" gap="$2">
                    <AlertCircle />
                    <H4>Warning</H4>
                  </XStack>
                  <Card.Header>
                    <Paragraph>
                      {message}
                      {deleteDescription}
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

export default ConfirmDeleteAccount;
