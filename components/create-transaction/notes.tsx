import { useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { H4, Sheet, SizableText, TextArea, XStack, View } from "tamagui";
import { XCircle } from "@tamagui/lucide-icons";
import { StyledButton } from "../button/button";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  setTransaction: React.Dispatch<React.SetStateAction<any>>;
}

const Notes: React.FC<Props> = ({ open, setOpen, setTransaction }) => {
  const { width, height } = useWindowDimensions();
  const [localNotes, setLocalNotes] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleAddNotes = () => {
    setTransaction((prevTransaction: any) => ({
      ...prevTransaction,
      notes: localNotes,
    }));
    setOpen(false);
  };

  const handleNotesChange = (note: string) => {
    setLocalNotes(note);
  };

  const handleClearNotes = () => {
    setLocalNotes("");
  };

  /** UseEffect */
  useEffect(() => {
    if (localNotes.length >= 201 || localNotes.length === 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [localNotes]);
  return (
    <Sheet
      forceRemoveScrollEnabled={false}
      modal={true}
      open={open}
      onOpenChange={() => setOpen(!open)}
      snapPoints={[93]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom={false}
      zIndex={100000}
      animation="medium"
      disableDrag={true}
    >
      <Sheet.Overlay
        animation="100ms"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" justifyContent="flex-start" gap="$2">
        <XStack justifyContent="space-between" paddingLeft="$1">
          <H4>Memo...</H4>
          <XCircle onPress={() => setOpen(false)} />
        </XStack>
        <XStack height={"40%"} maxWidth={width} minWidth={width}>
          <TextArea
            borderWidth="$1"
            placeholder="Enter your memo..."
            width={width * 0.9}
            autoFocus={true}
            onChangeText={handleNotesChange}
            maxLength={200}
            value={localNotes}
          />
        </XStack>
        <View
          backgroundColor={
            localNotes.length === 200 ? "$red4Light" : "$blue4Light"
          }
          paddingHorizontal={"$2"}
          borderRadius={"$12"}
          width={width * 0.4}
        >
          <SizableText
            color={localNotes.length === 200 ? "$red8Light" : "$blue8Light"}
            fontSize={"$1"}
          >
            Remaining characters: {200 - localNotes.length}
          </SizableText>
        </View>
        <XStack justifyContent="space-between">
          <StyledButton
            width={width * 0.25}
            size={"$3"}
            active={localNotes.length !== 0}
            onPress={handleClearNotes}
            disabled={localNotes.length === 0}
          >
            Clear
          </StyledButton>
          <StyledButton
            width={width * 0.25}
            size={"$3"}
            active={!isDisabled}
            disabled={isDisabled}
            onPress={handleAddNotes}
          >
            Add
          </StyledButton>
        </XStack>
      </Sheet.Frame>
    </Sheet>
  );
};

export default Notes;
