import { Keyboard, StyleSheet, useWindowDimensions } from "react-native";

import {
  Button,
  Fieldset,
  Form,
  Input,
  Separator,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

import { supabase } from "@/lib/supabase";

import { BodyContainer } from "@/components/containers/body-container";
import { OuterContainer } from "@/components/containers/outer-container";
import Avatar from "@/components/login/avatar";
import { getProfileInfo } from "@/lib/api";
import { ProfileInfo } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyledInput } from "@/components/input/input";
import { StyledButton } from "@/components/button/button";

export default function Profile() {
  const { id: userId } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const router = useRouter();

  /** Functions */
  const onSave = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          displayName: profileInfo?.displayName,
          firstName: profileInfo?.firstName,
          lastName: profileInfo?.lastName,
        })
        .eq("id", userId)
        .select();

      if (data) {
        console.log("*** User updated: ", data);
        router.replace({
          pathname: "/(homepage)/[id]",
          params: { id: userId.toString() },
        });
      }
    } catch (error) {}
  };

  const updateProfile = async ({ avatar_url }: { avatar_url: string }) => {
    try {
      //   setLoading(true);
      //   if (!session?.user) throw new Error("No user on the session!");

      //   let { error } = await supabase.from("profiles").upsert(updates);
      console.log("avatar_url", avatar_url);
      const { data, error } = await supabase
        .from("profiles")
        .update({
          avatar_url: avatar_url,
        })
        .eq("id", userId)
        .select();

      if (data) {
        console.log("Data", data);
      }

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error.message);
      }
      // } finally {
      //   setLoading(false);
      // }
    }
  };

  const handleDisplayNameChange = (_displayName: string) => {
    setProfileInfo((prevProfileInfo) => {
      if (prevProfileInfo) {
        return {
          ...prevProfileInfo,
          displayName: _displayName,
        };
      }
      return null; // or any other default value if needed
    });
  };

  const handleFirstNameChange = (_firstName: string) => {
    setProfileInfo((prevProfileInfo) => {
      if (prevProfileInfo) {
        return {
          ...prevProfileInfo,
          firstName: _firstName,
        };
      }
      return null; // or any other default value if needed
    });
  };

  const handleLastNameChange = (_lastName: string) => {
    setProfileInfo((prevProfileInfo) => {
      if (prevProfileInfo) {
        return {
          ...prevProfileInfo,
          lastName: _lastName,
        };
      }
      return null; // or any other default value if needed
    });
  };
  /** ---------- Listeners ---------- */
  // Listen for keyboard show/hide events
  Keyboard.addListener("keyboardDidShow", () => {
    setIsKeyboardVisible(true);
  });

  Keyboard.addListener("keyboardDidHide", () => {
    setIsKeyboardVisible(false);
  });

  /** useEffects */
  useEffect(() => {
    console.log("Profile userId: ", userId);
    const fetchprofileInfo = async () => {
      try {
        const profile: ProfileInfo | null = await getProfileInfo(
          userId.toString()
        );

        if (profile) {
          setProfileInfo(profile);
          setAvatarUrl(profile?.avatar_url);
          console.log("AvatarUrl", profile?.avatar_url);
        }
      } catch (error) {
        console.error("Error fetching profile info:", error);
        setProfileInfo(null);
      }
    };
    fetchprofileInfo();
  }, [userId]);

  return (
    <OuterContainer
      padding="$2"
      gap="$2"
      backgroundColor={"whitesmoke"}
      height={height}
    >
      <BodyContainer
        height={height * 0.86}
        borderBottomRightRadius={"$11"}
        borderBottomLeftRadius={"$11"}
      >
        <Form onSubmit={onSave} rowGap="$3" borderRadius="$4" padding="$3">
          <YStack height={height * 0.75} gap={"$3"}>
            <View paddingVertical={"$3"}>
              <Avatar
                url={avatarUrl}
                onUpload={(url: string) => {
                  setAvatarUrl(url);
                  updateProfile({ avatar_url: url });
                }}
                size="$6"
              />
            </View>
            <Separator />
            {isKeyboardVisible && (
              <XStack justifyContent="flex-end">
                <Form.Trigger asChild>
                  <StyledButton
                    disabled={!profileInfo?.displayName}
                    active={profileInfo?.displayName ? true : false}
                    width={width * 0.25}
                    size={"$3.5"}
                  >
                    Save
                  </StyledButton>
                </Form.Trigger>
              </XStack>
            )}
            <XStack>
              <Fieldset horizontal={false} gap={"$2"} width={width * 0.9}>
                <Text paddingLeft="$1.5" fontSize={"$1"}>
                  Display name (required)
                </Text>
                <StyledInput
                  id="display-name"
                  placeholder="Display Name"
                  defaultValue=""
                  value={profileInfo?.displayName}
                  onChangeText={handleDisplayNameChange}
                  error={profileInfo?.displayName ? false : true}
                />
              </Fieldset>
            </XStack>
            <XStack justifyContent="space-between">
              <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
                <Text paddingLeft="$1.5" fontSize={"$1"}>
                  First name
                </Text>
                <Input
                  id="first-name"
                  placeholder="First Name"
                  defaultValue=""
                  value={profileInfo?.firstName}
                  onChangeText={handleFirstNameChange}
                  backgroundColor={"$backgroundTransparent"}
                />
              </Fieldset>
              <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
                <Text paddingLeft="$1.5" fontSize={"$1"}>
                  Last Name
                </Text>
                <Input
                  id="last-name"
                  placeholder="Last Name"
                  defaultValue=""
                  value={profileInfo?.lastName}
                  onChangeText={handleLastNameChange}
                  backgroundColor={"$backgroundTransparent"}
                />
              </Fieldset>
            </XStack>
            <XStack>
              <Fieldset horizontal={false} gap={"$2"} width={width * 0.9}>
                <Text paddingLeft="$1.5" fontSize={"$1"}>
                  Email
                </Text>
                <Input
                  id="email=profile"
                  placeholder="Email"
                  defaultValue={profileInfo?.email}
                  value={profileInfo?.email}
                  backgroundColor={"$gray"}
                  disabled
                />
              </Fieldset>
            </XStack>
          </YStack>
          <XStack justifyContent="flex-end">
            <Form.Trigger asChild>
              {!isKeyboardVisible && (
                <StyledButton
                  disabled={!profileInfo?.displayName}
                  active={profileInfo?.displayName ? true : false}
                  width={width * 0.25}
                  size={"$3.5"}
                >
                  Save
                </StyledButton>
              )}
            </Form.Trigger>
          </XStack>
        </Form>
      </BodyContainer>
    </OuterContainer>
  );
}
