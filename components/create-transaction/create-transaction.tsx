import { X } from "@tamagui/lucide-icons";

import {
  Text,
  Adapt,
  Button,
  Dialog,
  Fieldset,
  Input,
  Label,
  Paragraph,
  Sheet,
  TooltipSimple,
  Unspaced,
  XStack,
} from "tamagui";
import { SelectDemoItem } from "./SelectDemo";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MembersDropdown from "./members-dropdown";

interface Member {
  userId: string;
  // Add other properties if necessary
}

interface CreateTransaction {
  billId: any;
  userId: any;
  members: Member[]; // Ensure correct type for members
}

export const CreateTransaction: React.FC<CreateTransaction> = ({
  billId,
  userId,
  members,
}) => {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button>Create Transaction</Button>
      </Dialog.Trigger>
      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>

          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
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
          gap="$4"
        >
          <Dialog.Title>Create Transaction</Dialog.Title>

          <Dialog.Description>
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>

          <Fieldset gap="$4" horizontal>
            <Label width={160} justifyContent="flex-end" htmlFor="name">
              Name
            </Label>

            <Input flex={1} id="name" defaultValue="Nate Wienert" />
          </Fieldset>

          <Fieldset gap="$4" horizontal>
            <Label width={160} justifyContent="flex-end" htmlFor="username">
              <TooltipSimple
                label="Pick your favorite"
                placement="bottom-start"
              >
                <Paragraph>Members</Paragraph>
              </TooltipSimple>
            </Label>

            <MembersDropdown members={members} />
          </Fieldset>
          <XStack>
            <Text>Members: {JSON.stringify(members)}</Text>
          </XStack>
          <XStack alignSelf="flex-end" gap="$4">
            {/* <DialogInstance /> */}
            <Dialog.Close displayWhenAdapted asChild>
              <Button aria-label="Close">Save changes</Button>
            </Dialog.Close>
          </XStack>
          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
