import { MemberData } from "@/types/global";
import { useState } from "react";
import { LayoutRectangle } from "react-native";

import type { StackProps, TabLayout, TabsTabProps } from "tamagui";

import {
  AnimatePresence,
  SizableText,
  styled,
  Tabs,
  View,
  YStack,
} from "tamagui";
import UserBills from "./user-bills";
interface Props {
  bills: MemberData[];
  inactiveBills: MemberData[];
  loadingBills: boolean;
  userId: string;
  height: number;
  width: number;
  setRefreshing: (toggle: boolean) => void;
  resetToasts: () => void;
  refreshing: boolean;
}
export const TabsAdvancedUnderline: React.FC<Props> = ({
  bills,
  inactiveBills,
  loadingBills,
  userId,
  height,
  width,
  setRefreshing,
  refreshing,
  resetToasts,
}) => {
  const [tabState, setTabState] = useState<{
    currentTab: string;
    /**
     * Layout of the Tab user might intend to select (hovering / focusing)
     */
    intentAt: TabLayout | null;
    /**
     * Layout of the Tab user selected
     */
    activeAt: TabLayout | null;
    /**
     * Used to get the direction of activation for animating the active indicator
     */
    prevActiveAt: TabLayout | null;
  }>({
    activeAt: null,
    currentTab: "active",
    intentAt: null,
    prevActiveAt: null,
  });
  const setCurrentTab = (currentTab: string) =>
    setTabState({ ...tabState, currentTab });
  const setIntentIndicator = (intentAt: LayoutRectangle | null) =>
    setTabState({ ...tabState, intentAt });
  const setActiveIndicator = (activeAt: LayoutRectangle | null) =>
    setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt });
  const { activeAt, intentAt, prevActiveAt, currentTab } = tabState;
  /**
   * -1: from left
   *  0: n/a
   *  1: from right
   */
  const direction = (() => {
    if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
      return 0;
    }
    return activeAt.x > prevActiveAt.x ? -1 : 1;
  })();
  const enterVariant =
    direction === 1 ? "isLeft" : direction === -1 ? "isRight" : "defaultFade";
  const exitVariant =
    direction === 1 ? "isRight" : direction === -1 ? "isLeft" : "defaultFade";
  const handleOnInteraction: TabsTabProps["onInteraction"] = (type, layout) => {
    if (type === "select") {
      setActiveIndicator(layout);
    } else {
      setIntentIndicator(layout);
    }
  };

  /**
   * Needs to be on parent because it will be used for
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    resetToasts();
  };

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      size="$4"
      height={height}
      flexDirection="column"
      activationMode="manual"
      backgroundColor="white"
      bordered
      borderRadius={16}
    >
      <YStack width={width}>
        <AnimatePresence>
          {intentAt && (
            <TabsRovingIndicator
              width={intentAt.width}
              height="$0.5"
              x={intentAt.x}
              bottom={0}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeAt && (
            <TabsRovingIndicator
              theme="active"
              active
              width={activeAt.width}
              height="$0.5"
              x={activeAt.x}
              bottom={0}
            />
          )}
        </AnimatePresence>
        <Tabs.List
          disablePassBorderRadius
          loop={false}
          aria-label="Manage your account"
          borderBottomLeftRadius={0}
          borderBottomRightRadius={0}
          paddingBottom="$1.5"
          borderColor="$color3"
          borderBottomWidth="$0.5"
          backgroundColor="transparent"
          paddingLeft="$2"
        >
          <Tabs.Tab
            unstyled
            paddingHorizontal="$3"
            paddingVertical="$2"
            value="active"
            onInteraction={handleOnInteraction}
          >
            <SizableText>Active</SizableText>
          </Tabs.Tab>
          <Tabs.Tab
            unstyled
            paddingHorizontal="$3"
            paddingVertical="$2"
            value="inactive"
            onInteraction={handleOnInteraction}
          >
            <SizableText>Inactive</SizableText>
          </Tabs.Tab>
        </Tabs.List>
      </YStack>
      <AnimatePresence
        exitBeforeEnter
        enterVariant={enterVariant}
        exitVariant={exitVariant}
      >
        <AnimatedYStack
          key={currentTab}
          animation="100ms"
          x={0}
          opacity={1}
          flex={1}
        >
          <Tabs.Content value={currentTab} forceMount flex={1} paddingTop="$2">
            <View height={"100%"}>
              {currentTab === "active" ? (
                <UserBills
                  bills={bills}
                  loadingBills={loadingBills}
                  userId={userId}
                  refreshing={refreshing}
                  handleRefresh={handleRefresh}
                />
              ) : (
                <UserBills
                  bills={inactiveBills}
                  loadingBills={loadingBills}
                  userId={userId}
                  refreshing={refreshing}
                  handleRefresh={handleRefresh}
                />
              )}
            </View>
          </Tabs.Content>
        </AnimatedYStack>
      </AnimatePresence>
    </Tabs>
  );
};
const TabsRovingIndicator = ({
  active,
  ...props
}: { active?: boolean } & StackProps) => {
  return (
    <YStack
      position="absolute"
      backgroundColor="$color5"
      opacity={0.7}
      animation="100ms"
      enterStyle={{
        opacity: 0,
      }}
      exitStyle={{
        opacity: 0,
      }}
      {...(active && {
        backgroundColor: "$color8",
        opacity: 0.6,
      })}
      {...props}
    />
  );
};
const AnimatedYStack = styled(YStack, {
  variants: {
    isLeft: { true: { x: -25, opacity: 0 } },
    isRight: { true: { x: 25, opacity: 0 } },
    defaultFade: { true: { opacity: 0 } },
  } as const,
});
