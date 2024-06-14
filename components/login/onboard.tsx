import { getProfileInfo } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { ProfileInfo } from "@/types/global";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import {
  Button,
  Fieldset,
  Form,
  Input,
  Spinner,
  Text,
  useWindowDimensions,
  View,
  XStack,
  YStack,
} from "tamagui";
import { StyledButton } from "../button/button";
import { BodyContainer } from "../containers/body-container";
import { OuterContainer } from "../containers/outer-container";
import { StyledInput } from "../input/input";
import Avatar from "./avatar";

interface Props {
  userId: string;
}

/**
 * Route here after sign up and only after sign up... meaning...
 * after initial sign up the user must provide a display name...
 *
 * 1. If there is a displayName then redirect to the homepage
 * 2. If no displayName then stay on onboard page
 * @param param0
 * @returns
 */
export const Onboard: React.FC<Props> = ({ userId }) => {
  /************ States and Variables ************/
  const { width, height } = useWindowDimensions();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>();
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isDisplayNameError, setIsDisplayNameError] = useState(false);
  const [initialDisplayName, setInitialDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [buttonAreaHeight, setButtonAreaHeight] = useState(height * 0.28);
  const router = useRouter();

  /************ Functions ************/
  const onSave = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          displayName: displayName,
          firstName: firstName,
          lastName: lastName,
        })
        .eq("id", userId)
        .select();

      console.log("");

      if (data) {
        console.log("*** User updated: ", data);
        router.replace({
          pathname: "/(homepage)/[id]",
          params: { id: userId },
        });
      } else if (error) {
        console.log("Error", error.message);
      }
    } catch (error) {
      console.log("Error onboarding user", error);
    }
  };

  const signOutUser = async () => {
    await supabase.auth.signOut();
    console.log("USER SIGNED OUT");
  };

  const handleDisplayNameChange = (_displayName: string) => {
    const trimmedDisplayName = _displayName.trim();

    if (trimmedDisplayName.length === 0) {
      setIsDisplayNameError(true);
      setDisplayName(_displayName);
    } else if (trimmedDisplayName.length <= 2) {
      setIsDisplayNameError(true);
      setDisplayName(_displayName);
    } else if (trimmedDisplayName.length <= 10) {
      setIsDisplayNameError(false);
      setDisplayName(_displayName);
    } else {
      setIsDisplayNameError(true);
    }
  };

  const handleFirstNameChange = (_firstName: string) => {
    setFirstName(_firstName);
  };

  const handleLastNameChange = (_lastName: string) => {
    setLastName(_lastName);
  };

  const updateProfile = async ({ avatar_url }: { avatar_url: string }) => {
    try {
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
    }
  };

  /************ UseEffects ************/
  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        setIsLoading(true);
        const profile: ProfileInfo | null = await getProfileInfo(userId);
        setProfileInfo(profile);
        setInitialDisplayName(profile?.displayName || "");
        setDisplayName(profile?.displayName || "");
        setIsLoading(false);

        // Redirect if displayName is present
        if (profile?.displayName) {
          router.replace({
            pathname: "/(homepage)/[id]",
            params: { id: userId },
          });
        }
      } catch (error) {
        console.error("Error fetching profile info:", error);
        setProfileInfo(null);
        setIsLoading(false);
      }
    };
    fetchProfileInfo();
  }, [userId, router]);

  useEffect(() => {
    const handleKeyboardShow = () => setButtonAreaHeight(height * 0.39);
    const handleKeyboardHide = () => setButtonAreaHeight(height * 0.75);

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [height]);

  return (
    <OuterContainer
      padding="$2"
      gap="$2"
      backgroundColor={"whitesmoke"}
      height={height}
    >
      {isLoading ? (
        <YStack justifyContent="center" height={"85%"}>
          <Spinner size="large" color="$green10Light" />
        </YStack>
      ) : (
        <BodyContainer
          height={height * 0.86}
          borderBottomRightRadius={"$11"}
          borderBottomLeftRadius={"$11"}
        >
          <Form onSubmit={onSave} rowGap="$3" borderRadius="$4" padding="$3">
            <YStack height={buttonAreaHeight} gap={"$2"}>
              <View paddingVertical={"$5"}>
                <Avatar
                  url={avatarUrl}
                  onUpload={(url: string) => {
                    setAvatarUrl(url);
                    updateProfile({ avatar_url: url });
                  }}
                  size="$6"
                />
              </View>
              <XStack>
                <Fieldset horizontal={false} gap={"$2"} width={width * 0.9}>
                  <Text paddingLeft="$1.5" fontSize={"$1"}>
                    Display name *
                  </Text>
                  <StyledInput
                    id="display-name"
                    placeholder="Display Name"
                    defaultValue=""
                    value={displayName}
                    onChangeText={handleDisplayNameChange}
                    backgroundColor={"$backgroundTransparent"}
                    maxLength={10}
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
                    value={firstName}
                    onChangeText={handleFirstNameChange}
                    backgroundColor={"$backgroundTransparent"}
                    maxLength={10}
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
                    value={lastName}
                    onChangeText={handleLastNameChange}
                    backgroundColor={"$backgroundTransparent"}
                    maxLength={10}
                  />
                </Fieldset>
              </XStack>
              <XStack>
                <Fieldset horizontal={false} gap={"$2"} width={width * 0.9}>
                  <Text paddingLeft="$1.5" fontSize={"$1"}>
                    Email
                  </Text>
                  <Input
                    id="email"
                    placeholder="Email"
                    defaultValue={profileInfo?.email}
                    value={profileInfo?.email}
                    backgroundColor={"$gray"}
                    disabled
                  />
                </Fieldset>
              </XStack>
            </YStack>
            <XStack justifyContent="space-between">
              <Button onPress={signOutUser}>Sign out</Button>
              <Form.Trigger asChild>
                <StyledButton
                  create={!!displayName && !isDisplayNameError}
                  disabled={!displayName || isDisplayNameError}
                >
                  Save
                </StyledButton>
              </Form.Trigger>
            </XStack>
          </Form>
        </BodyContainer>
      )}
    </OuterContainer>
  );
};

export default Onboard;
