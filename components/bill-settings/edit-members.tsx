import { getMembers } from "@/lib/api";
import { ChevronRight, Moon, Star, Trash } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  ListItem,
  YGroup,
  Separator,
  Button,
  XStack,
  YStack,
} from "tamagui";
import ConfirmationDialog from "./confirmation-dialog";

interface Props {
  billId: number;
  ownerId: string;
  height: number;
}

interface Member {
  memberid: string;
  userid: string;
  isMemberIncluded: boolean;
}

const EditMembers: React.FC<Props> = ({ billId, ownerId, height }) => {
  const [members, setMembers] = useState<Member[]>([]);
  //Get included members
  useEffect(() => {
    const fetchDataAndInitializeSplits = async () => {
      if (billId) {
        try {
          const membersData = await getMembers(Number(billId));

          setMembers(membersData);
        } catch (error) {
          console.error("Error fetching members:", error);
        }
      }
    };

    fetchDataAndInitializeSplits();
  }, [billId]);

  // Don't display owner id
  const filteredMembers = members.filter((member) => member.userid !== ownerId);
  return (
    <View height={height} padding="$3">
      <ScrollView>
        <YStack gap="$1.5">
          {filteredMembers.map((member, index) => (
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
                      {/* <Button
                        onPress={() => console.log("Trash")}
                        size={"$2"}
                        icon={<Trash size={"$1"} color={"$red10Light"} />}
                        backgroundColor={"$red4Light"}
                      /> */}
                      <ConfirmationDialog user={member} />
                    </XStack>
                  }
                />
              </YGroup.Item>
            </YGroup>
          ))}
        </YStack>
      </ScrollView>
      {/* <Text>{JSON.stringify(members)}</Text> */}
    </View>
  );
};

export default EditMembers;
