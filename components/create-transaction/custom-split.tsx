import { View, Text } from "react-native";
import React from "react";
import { Button, Card, H2, H4, YStack } from "tamagui";
import { ChevronRight, Cloud, Moon, Star, Sun } from "@tamagui/lucide-icons";
import { ListItem, Separator, XStack, YGroup } from "tamagui";

const CustomSplit = () => {
  return (
    <Card elevate bordered>
      <Card.Header>
        <H4>Custom</H4>
      </Card.Header>
      <Card.Footer />

      <YGroup
        alignSelf="center"
        bordered
        width={340}
        size="$4"
        separator={<Separator />}
      >
        <YGroup.Item>
          <YStack>
            <ListItem hoverTheme title="Star" subTitle="Twinkles" />
            <ListItem hoverTheme>
              <XStack>
                <Button>Test</Button>
                <Text>TEst</Text>
              </XStack>
            </ListItem>
          </YStack>
        </YGroup.Item>
        <YGroup.Item>
          <XStack>
            <ListItem hoverTheme>Moon</ListItem>
          </XStack>
        </YGroup.Item>
        <YGroup.Item>
          <ListItem hoverTheme>Sun</ListItem>
        </YGroup.Item>
        <YGroup.Item>
          <ListItem hoverTheme>Cloud</ListItem>
        </YGroup.Item>
      </YGroup>

      <Card.Background />
    </Card>
  );
};

export default CustomSplit;
