import Avatar from "@/components/login/avatar";
import { SettlementInfo } from "@/types/global";
import { useEffect, useState } from "react";
import { Sheet, Text, useWindowDimensions, View } from "tamagui";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedMemberSettlements: SettlementInfo[] | null;
  currentUserSettlements: SettlementInfo[] | null;
  currentUserUrl: string;
  selectedUserUrl: string;
}

const UserSettlementsSheet: React.FC<Props> = ({
  open,
  setOpen,
  selectedMemberSettlements,
  currentUserSettlements,
  currentUserUrl,
  selectedUserUrl,
}) => {
  /** - - - - - - - - State Variables - - - - - - - - */
  const [position, setPosition] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [currentUserLocal, setCurrentUserLocal] = useState("");

  /** - - - - - - - - functions - - - - - - - - */

  /** - - - - - - - - useEffects - - - - - - - - */
  useEffect(() => {
    if (currentUserUrl) {
      setCurrentUserLocal(currentUserUrl);
    }
  }, [useEffect]);

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={() => setOpen(!open)}
      snapPoints={[60]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" justifyContent="flex-start" gap="$2">
        <Avatar url={selectedUserUrl || null} size={"$5"} />
        <Text>{currentUserUrl}</Text>
        <Text>This is how much the selected membered paid for you:</Text>
        <Text>{JSON.stringify(selectedMemberSettlements)}</Text>
        <Avatar url={currentUserUrl} size={"$5"} />
        <Text>This is how much you paid for selected member:</Text>
        <Text>{JSON.stringify(currentUserSettlements)}</Text>
      </Sheet.Frame>
    </Sheet>
  );
};

export default UserSettlementsSheet;
