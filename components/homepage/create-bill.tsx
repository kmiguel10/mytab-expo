import { supabase } from "@/lib/supabase";
import { BillData } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { AlertDialog, Input, XStack, YStack } from "tamagui";
import { StyledButton } from "../button/button";

interface Props {
  buttonWidth: number;
  buttonSize: string;
}

const CreateBill: React.FC<Props> = ({ buttonWidth, buttonSize }) => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [name, setName] = useState("");

  const onCreateBill = async () => {
    if (!name) {
      console.error("Error: Name cannot be null");
      return;
    }

    const { data, error } = await supabase
      .from("bills")
      .insert([{ ownerid: id, name: name }])
      .select();

    if (data && data.length > 0) {
      const newBillData: BillData = data[0] as BillData;
      router.replace({
        pathname: `/(homepage)/${id}`,
        params: { newBillId: newBillData?.billid ?? null }, // Add userId to params
      });
    } else {
      if (error) {
        router.replace({
          pathname: `/(homepage)/${id}`,
          params: { errorCreateMessage: "Error creating bill" },
        });
      }
    }
  };

  const onCancel = () => {
    setName("");
    router.back;
  };

  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>
        <StyledButton create={true} size={buttonSize} width={buttonWidth}>
          Create
        </StyledButton>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.9}
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
          y={-230}
          width={"90%"}
        >
          <YStack space>
            <AlertDialog.Title>Create Bill</AlertDialog.Title>
            <AlertDialog.Description size={"$5"}>
              Enter Bill Name:
            </AlertDialog.Description>
            <XStack alignItems="center" space="$2">
              <Input
                flex={1}
                size={3}
                placeholder="Ex: Cancun Trip !!!"
                value={name}
                onChangeText={setName}
              />
            </XStack>

            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <StyledButton
                  width={buttonWidth}
                  size={buttonSize}
                  onPress={onCancel}
                >
                  Cancel
                </StyledButton>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <StyledButton
                  width={buttonWidth}
                  size={buttonSize}
                  create={!!name}
                  disabled={!name}
                  onPress={onCreateBill}
                >
                  Create
                </StyledButton>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default CreateBill;
