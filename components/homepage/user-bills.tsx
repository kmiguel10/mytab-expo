import { ScrollView, RefreshControl, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { XStack, H5, View, Text, SizableText } from "tamagui";
import BillCardSkeleton from "../skeletons/bill-card-skeleton";
import BillCard from "./bill-card";
import { MemberData } from "@/types/global";
import DeviceInfo from "react-native-device-info";
import MySvg from "@/assets/svgs/street-food.svg";

interface Props {
  bills: MemberData[];
  loadingBills: boolean;
  userId: string;
  refreshing: boolean;
  handleRefresh: () => void;
  isIpad: boolean;
}

/**
 * Component to render active and inactive bills
 * @returns Active or Inactive Bills
 */
const UserBills: React.FC<Props> = ({
  bills,
  loadingBills,
  userId,
  refreshing,
  handleRefresh,
  isIpad,
}) => {
  /************ States and Variables *************/
  const { width, height } = useWindowDimensions();
  /************ Functions *************/
  /************ UseEffects *************/

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {!loadingBills ? (
        <>
          {bills?.length > 0 ? (
            bills.map((item, index) => (
              <XStack
                key={`${item.memberid}-${index}`}
                backgroundColor="$backgroundTransparent"
                justifyContent="center"
                padding="$1.5"
              >
                <Link
                  key={`${item.memberid}-${index}`}
                  href={{
                    pathname: `/(bill)/${item.billid}`,
                    params: { userId: userId },
                  }}
                  disabled={item.isRequestSent && item.ownerid !== userId}
                  asChild
                >
                  <BillCard
                    key={`${item.memberid}-${index}`}
                    animation="bouncy"
                    size="$3"
                    bill={item}
                    membership={item.ownerid === userId ? "Owner" : "Member"}
                    isIpad={isIpad}
                  />
                </Link>
              </XStack>
            ))
          ) : (
            <XStack
              gap="$1"
              backgroundColor={"transparent"}
              justifyContent="center"
              padding="$10"
            >
              <View alignItems="center">
                <SizableText color={"grey"}>
                  Create a bill and share the code with your friends!
                </SizableText>
                <MySvg
                  width={isIpad ? width * 0.5 : width * 0.6}
                  height={isIpad ? height * 0.3 : height * 0.3}
                />
              </View>
            </XStack>
          )}
        </>
      ) : (
        <XStack
          backgroundColor="transparent"
          justifyContent="center"
          padding="$1.5"
        >
          <BillCardSkeleton
            width={360}
            height={110}
            scale={0.9}
            size="$3"
            hoverStyle={{ scale: 0.925 }}
            pressStyle={{ scale: 0.875 }}
            show={loadingBills}
          />
        </XStack>
      )}
    </ScrollView>
  );
};

export default UserBills;
