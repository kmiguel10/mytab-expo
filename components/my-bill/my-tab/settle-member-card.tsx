import Avatar from "@/components/login/avatar";
import {
  findUserDisplayName,
  formatToDollarCurrency,
  truncateToTwoDecimalPlaces,
} from "@/lib/helpers";
import {
  Member,
  SettleCardInfo,
  SettlementInfo,
  Transaction,
} from "@/types/global";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import {
  CardProps,
  ListItem,
  ScrollView,
  SizableText,
  useWindowDimensions,
  View,
  XStack,
  YGroup,
} from "tamagui";
import UserSettlementsSheet from "./user-settlements-sheet";

interface Props extends CardProps {
  members: SettleCardInfo[];
  scaledHeight: number;
  scaledWidth: number;
  currentUser: string;
  membersInfo: Member[];
  transactions: Transaction[];
}

const SettleMemberCard: React.FC<Props> = ({
  members,
  scaledHeight,
  scaledWidth,
  membersInfo,
  transactions,
  currentUser,
  ...props
}) => {
  /** - - - - - - - - - - State Variables - - - - - - - - */
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [openSettlementsSheet, setOpenSettlementsSheet] = useState(false);

  const [memberSettlementInfo, setMemberSettlementInfo] = useState<
    SettlementInfo[] | null
  >();
  const [currentUserSettlementInfo, setCurrentUserSettlementInfo] = useState<
    SettlementInfo[] | null
  >();

  const [selectedUserAvatarUrl, setSelectedUserAvatarUrl] = useState("");
  const [currentUserAvatarUrl, setCurrentUserAvatarUrl] = useState("");

  const [selectedUserName, setSelectedUserName] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");

  const [doesUserOweMoney, setDoesUserOweMoney] = useState(false);

  /** - - - - - - - - - - Functions - - - - - - - - */
  const setSelectedUserSettlements = (selectedMember: string) => {
    const currentUserSettlements: SettlementInfo[] =
      getSettlementsForCurrentUser(currentUser, selectedMember, transactions);

    if (currentUserSettlements) {
      setCurrentUserSettlementInfo(currentUserSettlements);
    }

    const selectedMemberSettlements: SettlementInfo[] =
      getSettlementsForSelectedMember(
        currentUser,
        selectedMember,
        transactions
      );

    if (selectedMemberSettlements) {
      setMemberSettlementInfo(selectedMemberSettlements);
    }

    let _currentUserAvatarUrl = getAvatarUrl(currentUser, membersInfo);
    let _selectedUserAvatarUrl = getAvatarUrl(selectedMember, membersInfo);

    let _currentUserName = getMemberName(currentUser, membersInfo);
    let _selectedUserName = getMemberName(selectedMember, membersInfo);

    if (_currentUserAvatarUrl) {
      setCurrentUserAvatarUrl(_currentUserAvatarUrl);
    }
    if (_selectedUserAvatarUrl) {
      setSelectedUserAvatarUrl(_selectedUserAvatarUrl);
    }

    if (_currentUserName) {
      setCurrentUserName(_currentUserName);
    }

    if (_selectedUserName) {
      setSelectedUserName(_selectedUserName);
    }

    setOpenSettlementsSheet(true);

    console.log("selected user, id: ", selectedMember);
  };

  //Set the select member settlements

  /** - - - - - - - - - - Helpers - - - - - - - - */

  /**
   * 1. Look for transactions where the payer is the current user and look if the SPLIT array contains the selectedUser as a member
   * 2. Save the transaction name and split amount into SettlementInfo Array. This represents the amount where the current user paid for the selected member's portion in the transaction
   * @param currentUser
   * @param selectedMember
   * @param transactions
   * @returns array of settlementInfo, where the current user paid for the selected member
   */

  const getSettlementsForCurrentUser = (
    currentUser: string,
    selectedMember: string,
    transactions: Transaction[]
  ): SettlementInfo[] => {
    return transactions.flatMap((txn) => {
      if (
        txn.payerid === currentUser &&
        txn.split.some((s) => s.memberId === selectedMember)
      ) {
        const selectedMemberSplit = txn.split.find(
          (s) => s.memberId === selectedMember
        );
        if (selectedMemberSplit) {
          return [
            {
              transactionName: txn.name,
              userSplitAmount: selectedMemberSplit.amount,
            },
          ];
        }
      }
      return [];
    });
  };

  /**
   *This is the reverse of the getSettlementsForCurrentUser, where the function looks for transactions where the selected member paid for the currentUser
   * @returns Returns settlements where the selected member paid for the current user
   */
  const getSettlementsForSelectedMember = (
    currentUser: string,
    selectedMember: string,
    transactions: Transaction[]
  ): SettlementInfo[] => {
    return transactions.flatMap((txn) => {
      if (
        txn.payerid === selectedMember &&
        txn.split.some((s) => s.memberId === currentUser)
      ) {
        const currentUserSplit = txn.split.find(
          (s) => s.memberId === currentUser
        );
        if (currentUserSplit) {
          return [
            {
              transactionName: txn.name,
              userSplitAmount: currentUserSplit.amount,
            },
          ];
        }
      }
      return [];
    });
  };

  //Get avatar url of user given members array
  const getAvatarUrl = (userId: string, members: Member[]): string | null => {
    return (
      members.find((member) => member.userid === userId)?.avatar_url ?? null
    );
  };

  const getMemberName = (userId: string, members: Member[]): string | null => {
    return (
      members.find((member) => member.userid === userId)?.displayName ?? null
    );
  };

  /** - - - - - - - - - - Functions - - - - - - - - */

  /** - - - - - - - - - - useEffects - - - - - - - - */
  useEffect(() => {
    console.log("members", members);
  }, [members]);

  return (
    <View>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <XStack
          flex={1}
          flexWrap="wrap"
          gap="$1"
          backgroundColor={"transparent"}
          justifyContent="center"
          paddingBottom="$2"
        >
          {members?.map((member, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedUserSettlements(member.member)}
            >
              <YGroup
                alignSelf="center"
                width={windowWidth * 0.9}
                size="$4"
                key={index}
              >
                <YGroup.Item key={index}>
                  <ListItem
                    key={index}
                    backgroundColor={
                      member.owed - member.debt >= 0
                        ? "$green3Light"
                        : "$red3Light"
                    }
                    hoverTheme
                    icon={
                      <Avatar
                        url={getAvatarUrl(member.member, membersInfo)}
                        size="$4.5"
                      />
                    }
                    title={findUserDisplayName(member.member, membersInfo)}
                    subTitle={
                      member.owed - member.debt >= 0 ? "Owes you" : "You owe"
                    }
                    iconAfter={
                      <SizableText
                        color={
                          member.owed - member.debt >= 0
                            ? "$green10Light"
                            : "$red10Light"
                        }
                      >
                        {formatToDollarCurrency(
                          truncateToTwoDecimalPlaces(
                            Math.abs(member.owed - member.debt)
                          )
                        )}
                      </SizableText>
                    }
                  />
                </YGroup.Item>
              </YGroup>
            </Pressable>
          ))}
          {members.length % 2 !== 0 && (
            <XStack
              padding="$1"
              backgroundColor={"white"}
              width={scaledWidth * 0.49}
              justifyContent="center"
            ></XStack>
          )}
        </XStack>
      </ScrollView>
      <UserSettlementsSheet
        open={openSettlementsSheet}
        setOpen={setOpenSettlementsSheet}
        selectedMemberSettlements={memberSettlementInfo || null}
        currentUserSettlements={currentUserSettlementInfo || null}
        currentUserUrl={currentUserAvatarUrl}
        selectedUserUrl={selectedUserAvatarUrl}
        currentUserName={currentUserName}
        selectedUserName={selectedUserName}
      />
    </View>
  );
};

export default SettleMemberCard;
