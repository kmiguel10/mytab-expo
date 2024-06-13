import { getMembersWithBillcode } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { BillData } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { AlertDialog, Input, XStack, YStack } from "tamagui";
import { StyledButton } from "../button/button";

interface Props {
  avatarUrl: string | null;
  displayName: string;
  buttonWidth: number;
  buttonSize: string;
}

const JoinBill: React.FC<Props> = ({
  avatarUrl,
  buttonWidth,
  buttonSize,
  displayName,
}) => {
  const { id } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const router = useRouter();

  const freePlanMembersLimit = 2;
  const paidPlanMembersLimit = 12;

  /**
   * Cannot join if there are 12 or more members
   * @returns
   */
  const joinAsMember = async () => {
    if (!code) {
      console.error("Error: Billcode cannot be null");
      return;
    }

    //First check if members is >= 12 , if it is then send an error saying that the limit of members has reached... 12
    const membersData = await getMembersWithBillcode(code);

    if (membersData) {
      let _isFreePlan = membersData[0]?.isFree;

      if (_isFreePlan) {
        if (membersData.length >= freePlanMembersLimit) {
          router.replace({
            pathname: `/(homepage)/${id}`,
            params: {
              errorMessage: "ERROR: Free plans are only allowed 2 members",
            },
          });
          return;
        }
      } else {
        if (membersData.length >= paidPlanMembersLimit) {
          router.replace({
            pathname: `/(homepage)/${id}`,
            params: {
              errorMessage: "The max amount of 12 members has been reached.",
            },
          });
          return;
        }
      }
    }

    let { data, error } = await supabase
      .from("members")
      .insert([
        {
          userid: id,
          billcode: code,
          avatar_url: avatarUrl,
          displayName: displayName,
        },
      ])
      .eq("billcode", code)
      .select();

    if (data && data.length > 0) {
      const joinedBillData: BillData = data[0] as BillData;
      // router.replace(`/(homepage)/${id}`);
      router.replace({
        pathname: `/(homepage)/${id}`,
        params: { joinedBillCode: joinedBillData?.billid ?? null }, // Add userId to params
      });
    } else {
      //Scenario user is declined to join and tried joining again
      //NOTE: use upsert here
      if (error) {
        const { data, error: _error } = await supabase
          .from("members")
          .update({ isMemberIncluded: false, isRequestSent: true })
          .eq("userid", id)
          .eq("billcode", code)
          .select();

        if (data && data.length > 0) {
          const joinedBillData: BillData = data[0] as BillData;
          router.replace({
            pathname: `/(homepage)/${id}`,
            params: { joinedBillCode: joinedBillData?.billid ?? null }, // Add userId to params
          });
        } else {
          router.replace({
            pathname: `/(homepage)/${id}`,
            params: { errorMessage: "Error joining bill" },
          });
        }
      }
    }
  };

  const onCancel = () => {
    setCode("");
    router.back;
  };

  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>
        <StyledButton active={true} size={buttonSize} width={buttonWidth}>
          Join
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
            <AlertDialog.Title>Join Bill</AlertDialog.Title>
            <AlertDialog.Description size={"$5"}>
              Enter Bill code:
            </AlertDialog.Description>
            <Input
              placeholder="Example: 12GH89"
              value={code}
              onChangeText={setCode}
            />

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
                  active={!!code}
                  disabled={!code}
                  onPress={joinAsMember}
                >
                  Join
                </StyledButton>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default JoinBill;
