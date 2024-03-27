import { View, Text, YStack, YGroup, ListItem, XStack } from "tamagui";
import ConfirmationDialog from "./confirmation-dialog";
import { Member } from "@/types/global";

interface Props {
  includedMembers: Member[];
  fetchMembersData: () => void;
}

const CurrentMembers: React.FC<Props> = ({
  includedMembers,
  fetchMembersData,
}) => {
  return (
    <View>
      <Text>Members</Text>
      <YStack gap="$1.5">
        {includedMembers.map((member, index) => (
          <YGroup
            alignSelf="center"
            bordered
            width={"100%"}
            size="$5"
            padding={"$1"}
          >
            <YGroup.Item>
              <ListItem
                title={member.userid}
                iconAfter={
                  <XStack gap="$2">
                    <ConfirmationDialog
                      user={member}
                      fetchMembersData={fetchMembersData}
                    />
                  </XStack>
                }
              />
            </YGroup.Item>
          </YGroup>
        ))}
      </YStack>
    </View>
  );
};

export default CurrentMembers;
