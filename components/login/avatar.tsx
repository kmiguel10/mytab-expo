import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
      retrieveCachedAvatar(url);
    }
  }, [url]);

  async function retrieveCachedAvatar(path: string) {
    try {
      const cachedUrl = await AsyncStorage.getItem(`avatarCache:${path}`);
      if (cachedUrl) {
        setAvatarUrl(cachedUrl);
        console.log(`Retrieved cached avatar for ${path}`);
      } else {
        downloadImage(path);
      }
    } catch (error: any) {
      console.log("Error retrieving cached avatar:", error.message);
    }
  }

  async function downloadImage(path: string) {
    try {
      console.log(`Downloading image from ${path}`);
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
        console.log(`Image downloaded and cached for ${path}`);
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

      const response = await fetch(image.uri);
      const arraybuffer = await response.arrayBuffer();
      const fileExt = image.uri.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      console.log(`Uploading image to ${path}`);
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }

      if (onUpload) {
        onUpload(data.path);
        const base64Data = await convertArrayBufferToBase64(arraybuffer);
        setAvatarUrl(`data:${image.type};base64,${base64Data}`);
        await AsyncStorage.setItem(
          `avatarCache:${data.path}`,
          `data:${image.type};base64,${base64Data}`
        );
        console.log(`Image uploaded and cached for ${data.path}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading?.(false);
    }
  }

  async function convertArrayBufferToBase64(
    arraybuffer: ArrayBuffer
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([arraybuffer], {
        type: "application/octet-stream",
      });
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert arraybuffer to base64."));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function convertImageToBase64(uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image to base64."));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
