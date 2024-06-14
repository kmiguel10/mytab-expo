import { ScrollView, RefreshControl } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { XStack, H5, View, Text } from "tamagui";
import BillCardSkeleton from "../skeletons/bill-card-skeleton";
import BillCard from "./bill-card";
import { MemberData } from "@/types/global";

interface Props {
  bills: MemberData[];
  loadingBills: boolean;
  userId: string;
  refreshing: boolean;
  handleRefresh: () => void;
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
}) => {
  /************ States and Variables *************/
  /************ Functions *************/
  /************ UseEffects *************/

  return (
    <ScrollView
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
                backgroundColor="transparent"
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
              <H5>Empty</H5>
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
