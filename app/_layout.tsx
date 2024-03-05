import "../tamagui-web.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { Button, TamaguiProvider } from "tamagui";

import { config } from "../tamagui.config";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { ToastProvider } from "@tamagui/toast";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {/* <ToastProvider> */}
        <Stack>
          <Stack.Screen name="index" options={{ title: "Log In / Sign up" }} />
          <Stack.Screen name="(homepage)" options={{ headerShown: false }} />
          <Stack.Screen name="(bill)" options={{ headerShown: false }} />
          <Stack.Screen
            name="pages/create-transaction"
            options={{ title: "Create Transaction" }}
          />
          {/* <Stack.Screen
              name="/(bill)/mybill/"
              options={{ headerShown: false }}
            /> */}
          <Stack.Screen
            name="(modals)/create-bill"
            options={{
              presentation: "modal",
              title: "Create Bill",
              // headerLeft: () => (
              //   <Button onPress={() => router.back()}>Home</Button>
              // ),
            }}
          />

          {/* <Stack.Screen
            name="(modals)/create-transaction"
            options={{
              headerTitle: "Create Transaction",
              presentation: "modal",
              title: "Create Transaction",
            }}
          /> */}
        </Stack>
        {/* </ToastProvider> */}
      </ThemeProvider>
    </TamaguiProvider>
  );
}
