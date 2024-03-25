import { getBillInfo } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { BillInfo } from "@/types/global";
import { Session } from "@supabase/supabase-js";
import { Home, Settings2 } from "@tamagui/lucide-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Text, View } from "tamagui";

const Layout = () => {
  const router = useRouter();
  const { id, billId, userId } = useLocalSearchParams();

  const [session, setSession] = useState<Session | null>(null);
  const [sessionUserId, setSessionUserId] = useState("");
  const [isBillLocked, setIsBillLocked] = useState(false);
  const handleHomeButtonClick = () => {
    router.push(`/(homepage)/${sessionUserId}`);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      setSessionUserId(session?.user.id);
    }
  }, [session]);

  useEffect(() => {
    async function fetchBillInfo() {
      if (id) {
        const data: BillInfo[] | null = await getBillInfo(Number(id));
        setIsBillLocked(data[0].isLocked);
      }
    }
    fetchBillInfo();
  }, [id, userId]);

  //Create functions with params to route to Homepage and Bill Settings
  return (
    <Stack>
      <Stack.Screen
        name="mybill"
        options={{
          title: "",
          headerTitle: () =>
            isBillLocked ? (
              <View
                backgroundColor={"$red4Light"}
                paddingHorizontal={"$2"}
                paddingVertical={"$1"}
                alignItems="center"
                borderRadius={"$12"}
              >
                <Text fontSize={"$1"}>Locked</Text>
              </View>
            ) : (
              ""
            ),
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={handleHomeButtonClick}>
              <Home />
            </Pressable>
          ),
          headerRight: () => (
            <Link
              href={{
                pathname: "/pages/edit-bill",
                params: {
                  id: id,
                  billId: billId,
                  userId: sessionUserId,
                },
              }}
              asChild
            >
              <Pressable>
                <Settings2 />
              </Pressable>
            </Link>
          ),
        }}
        initialParams={{ id: id, billId: billId, userId: userId }}
      />
    </Stack>
  );
};

export default Layout;
