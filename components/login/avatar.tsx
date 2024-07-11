import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Avatar as AvatarTamagui, XStack } from "tamagui";
import { StyledButton } from "../button/button";

interface Props {
  url: string | null;
  size: string;
  setUploading?: (uploading: boolean) => void;
  uploading?: boolean;
  onUpload?: (filePath: string) => void;
}

export default function Avatar({
  url,
  size = "$3",
  onUpload,
  setUploading,
  uploading,
}: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      retrieveAvatar(url);
    } else {
      setAvatarUrl(null);
    }
  }, [url]);

  async function retrieveAvatar(path: string) {
    try {
      const cachedUrl = await AsyncStorage.getItem(`avatarCache:${path}`);
      if (cachedUrl) {
        setAvatarUrl(cachedUrl);
      } else {
        await downloadImage(path);
      }
    } catch (error: any) {
      console.log("Error retrieving avatar:", error.message);
    }
  }

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = async () => {
        const base64Url = fr.result as string;
        setAvatarUrl(base64Url);
        await AsyncStorage.setItem(`avatarCache:${path}`, base64Url);
      };
    } catch (error: any) {
      console.log("Error downloading image:", error.message);
    }
  }

  async function uploadAvatar() {
    try {
      setUploading?.(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];

      if (!image.uri) {
        throw new Error("No image uri!");
      }

      // Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(image.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileExt = image.uri.split(".").pop()?.toLowerCase() ?? "jpg";
      const fileName = `${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, decode(base64), {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      if (!data) {
        throw new Error("Upload failed: No data returned");
      }

      const newAvatarUrl = `data:image/${fileExt};base64,${base64}`;

      // Update the avatar URL state
      setAvatarUrl(newAvatarUrl);

      // Update the cache with the new avatar URL
      await AsyncStorage.setItem(`avatarCache:${data.path}`, newAvatarUrl);

      if (onUpload) {
        onUpload(data.path);
      }
    } catch (error: any) {
      console.error("Error uploading image:", error.message);
      Alert.alert("Upload Error", error.message);
    } finally {
      setUploading?.(false);
    }
  }

  // Helper function to decode base64
  function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  return (
    <View>
      {avatarUrl ? (
        <XStack alignItems="center" justifyContent="space-between">
          <AvatarTamagui circular size={size}>
            <AvatarTamagui.Image accessibilityLabel="avatar" src={avatarUrl} />
            <AvatarTamagui.Fallback delayMs={600} backgroundColor="$blue10" />
          </AvatarTamagui>
          {onUpload && (
            <View>
              <StyledButton
                onPress={uploadAvatar}
                disabled={uploading}
                size="$2.5"
                active
              >
                {uploading ? "Uploading ..." : "Upload image"}
              </StyledButton>
            </View>
          )}
        </XStack>
      ) : (
        <XStack alignItems="center" justifyContent="space-between">
          <AvatarTamagui circular size={size}>
            <AvatarTamagui.Fallback delayMs={600} backgroundColor="$blue10" />
          </AvatarTamagui>
          {onUpload && (
            <View>
              <StyledButton
                onPress={uploadAvatar}
                disabled={uploading}
                size="$2.5"
                active
              >
                {uploading ? "Uploading ..." : "Upload image"}
              </StyledButton>
            </View>
          )}
        </XStack>
      )}
    </View>
  );
}
