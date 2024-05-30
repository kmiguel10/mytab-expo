import { YStack } from "tamagui";

import CreateBill from "@/components/homepage/create-bill";
import { TabsAdvancedUnderline } from "@/components/homepage/homepage-tabs-underline";
import JoinBill from "@/components/homepage/join-bill";
import { getBillsForUserIdWithUrls, getProfileInfo } from "@/lib/api";
import { MemberData, ProfileInfo } from "@/types/global";
import { Toast, ToastViewport } from "@tamagui/toast";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, useWindowDimensions } from "react-native";
import { Text } from "tamagui";

import { BodyContainer } from "@/components/containers/body-container";
import { FooterContainer } from "@/components/containers/footer-container";
import { HeaderContainer } from "@/components/containers/header-container";
import { OuterContainer } from "@/components/containers/outer-container";
import Avatar from "@/components/login/avatar";
import React from "react";

// import "react-native-reanimated";
// import "react-native-gesture-handler";
import { Skeleton } from "moti/skeleton";
import CreateBillSheet from "@/components/homepage/create-bill-sheet";
import { StyledButton } from "@/components/button/button";

import * as RNIap from "react-native-iap";

const Home = () => {
  /********** States and Variables ***********/
  const {
    id,
    newBillId,
    joinedBillCode,
    errorMessage,
    errorCreateMessage,
    successDeletedBillMsg,
  } = useLocalSearchParams();
  const [bills, setBills] = useState<MemberData[]>([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const [newBill, setNewBill] = useState<MemberData | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const timerRef = React.useRef(0);
  const [error, setError] = useState("") || null;
  const [refreshing, setRefreshing] = useState(false);

  const [isCreateBillOpen, setIsCreateBillOpen] = useState(false);
  const [products, setProducts] = useState<RNIap.Product[]>([]);

  const productSkus = Platform.select({
    ios: ["com.mytab.1week", "com.mytab.2weeks"],
    android: [""],
  });

  const onOpenCreateBillSheet = () => {
    setIsCreateBillOpen(true);
  };

  /********** UseEffects ***********/

  useEffect(() => {
    console.log("*** Homepage: Fetch bills for user", id);
    async function fetchBills() {
      if (!id) return;

      const billsData = await getBillsForUserIdWithUrls(id.toString());
      const filteredBillsData = billsData.filter(
        (member) =>
          member.isMemberIncluded === true || member.isRequestSent === true
      );
      setBills(filteredBillsData);
      setLoadingBills(false);
      setRefreshing(false);

      if (newBillId || joinedBillCode) {
        let newBill: MemberData = {
          memberid: "",
          userid: "",
          billid: 0,
          billcode: "",
          ownerid: "",
          name: "",
          amount: 0,
          isBillActive: false,
          isMemberIncluded: false,
          isLocked: false,
          isdeleted: false,
          isRequestSent: false,
          memberUrls: [],
        };

        if (newBillId) {
          newBill = billsData?.find(
            (bill) => bill?.billid === parseInt(newBillId.toString())
          ) ?? {
            memberid: "",
            userid: "",
            billid: 0,
            billcode: "",
            ownerid: "",
            name: "",
            amount: 0,
            isBillActive: false,
            isMemberIncluded: false,
            isLocked: false,
            isdeleted: false,
            isRequestSent: false,
            memberUrls: [],
          };
        } else {
          newBill = billsData?.find(
            (bill) => bill?.billid === parseInt(joinedBillCode.toString())
          ) ?? {
            memberid: "",
            userid: "",
            billid: 0,
            billcode: "",
            ownerid: "",
            name: "",
            amount: 0,
            isBillActive: false,
            isMemberIncluded: false,
            isLocked: false,
            isdeleted: false,
            isRequestSent: false,
            memberUrls: [],
          };
        }

        if (newBill) {
          setNewBill(newBill);
          setOpen(true);
        }
      }
      if (errorMessage) {
        setOpen(true);
      }
      if (errorCreateMessage) {
        setOpen(true);
      }
      if (successDeletedBillMsg) {
        setOpen(true);
      }
    }

    fetchBills();
    setError(errorMessage?.toString());
  }, [
    id,
    newBillId,
    joinedBillCode,
    errorMessage,
    refreshing,
    successDeletedBillMsg,
  ]);

  useEffect(() => {
    const fetchprofileInfo = async () => {
      try {
        const profile: ProfileInfo | null = await getProfileInfo(id.toString());

        if (profile) {
          setProfileInfo(profile);
          setAvatarUrl(profile?.avatar_url);
        }
      } catch (error) {
        console.error("Error fetching profile info:", error);
        setProfileInfo(null);
      }
    };
    fetchprofileInfo();
  }, [id]);

  //useEffect for iap
  // useEffect(() => {
  //   const initIAP = async () => {
  //     try {
  //       await RNIap.initConnection();
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   };

  //   initIAP();

  //   // const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
  //   //   async (purchase) => {
  //   //     const receipt = purchase.transactionReceipt;
  //   //     if (receipt) {
  //   //       try {
  //   //         const response = await fetch(
  //   //           "https://localhost:3000/verify-receipt",
  //   //           {
  //   //             method: "POST",
  //   //             headers: {
  //   //               "Content-Type": "application/json",
  //   //             },
  //   //             body: JSON.stringify({
  //   //               receiptData: receipt,
  //   //               isSandbox: true,
  //   //             }),
  //   //           }
  //   //         );

  //   //         const result = await response.json();

  //   //         if (result.status === 0) {
  //   //           if (Platform.OS === "ios") {
  //   //             await RNIap.finishTransactionIOS(purchase.transactionId);
  //   //           } else if (Platform.OS === "android") {
  //   //             await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
  //   //             await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
  //   //           }
  //   //           Alert.alert(
  //   //             "Purchase Successful",
  //   //             "Receipt validated successfully"
  //   //           );
  //   //         } else {
  //   //           Alert.alert("Purchase Failed", "Invalid receipt");
  //   //         }
  //   //       } catch (error) {
  //   //         console.error(error);
  //   //       }
  //   //     }
  //   //   }
  //   // );

  //   // const purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
  //   //   console.warn("purchaseErrorListener", error);
  //   //   Alert.alert("Purchase Error", error.message);
  //   // });

  //   return () => {
  //     // purchaseUpdateSubscription.remove();
  //     // purchaseErrorSubscription.remove();
  //     RNIap.endConnection();
  //   };
  // }, []);

  useEffect(() => {
    const initIAP = async () => {
      try {
        console.log("* * * Initializing IAP connection * * * ");
        await RNIap.initConnection();
        console.log("* * * Initialization Completeded IAP connection * * * ");
        await fetchProducts();
      } catch (err) {
        console.warn(err);
      }
    };

    initIAP();

    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            const response = await fetch(
              "https://localhost:3000/verify-receipt",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  receiptData: receipt,
                  isSandbox: true,
                }),
              }
            );

            const result = await response.json();

            if (result.status === 0) {
              // Acknowledge the purchase after verification
              await RNIap.finishTransaction({ purchase });
              Alert.alert(
                "Purchase Successful",
                "Receipt validated successfully"
              );
            } else {
              Alert.alert("Purchase Failed", "Invalid receipt");
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    );

    const purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      console.warn("purchaseErrorListener", error);
      Alert.alert("Purchase Error", error.message);
    });

    const fetchProducts = async () => {
      try {
        console.log("Fetching products with IDs:", productSkus);
        if (productSkus && productSkus.length > 0) {
          const fetchedProducts = await RNIap.getProducts({
            skus: productSkus,
          });
          console.log("Products fetched:", fetchedProducts);
          if (fetchedProducts.length === 0) {
            console.error("No products found");
          }
          setProducts(fetchedProducts);
        } else {
          console.warn("No product SKUs provided");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
      console.log("Ending IAP connection");
      RNIap.endConnection();
    };
  }, []);

  return (
    <OuterContainer>
      <ToastViewport
        width={"100%"}
        justifyContent="center"
        flexDirection="column-reverse"
        top={0}
        right={0}
      />
      <YStack padding="$2" gap="$2">
        <HeaderContainer
          justifyContent="flex-start"
          gap="$3"
          height={windowHeight * 0.15}
          backgroundColor={"white"}
          paddingVertical="$4"
          paddingHorizontal="$4"
        >
          <Skeleton
            height={64}
            width={64}
            radius="round"
            show={!avatarUrl}
            colorMode="light"
          >
            <Avatar url={avatarUrl} size={"$6"} />
          </Skeleton>
          <Skeleton
            height={24}
            width={windowWidth * 0.8}
            radius="round"
            show={!profileInfo?.displayName}
            colorMode="light"
          >
            {!!profileInfo?.displayName ? (
              <Text>{profileInfo?.displayName}</Text>
            ) : (
              ""
            )}
          </Skeleton>
        </HeaderContainer>
        <BodyContainer height={windowHeight * 0.62}>
          <TabsAdvancedUnderline
            bills={bills}
            userId={id.toString()}
            height={windowHeight * 0.62}
            width={windowWidth * 0.95}
            setRefreshing={setRefreshing}
            refreshing={refreshing}
            loadingBills={loadingBills}
          />
        </BodyContainer>
      </YStack>

      <FooterContainer justifyContent="space-between" height={windowHeight}>
        <JoinBill
          avatarUrl={avatarUrl}
          displayName={profileInfo?.displayName ? profileInfo.displayName : ""}
          buttonWidth={windowWidth * 0.25}
          buttonSize={"$3.5"}
        />
        {/* <CreateBill buttonWidth={windowWidth * 0.25} buttonSize={"$3.5"} /> */}
        <StyledButton
          create={true}
          size={"$3.5"}
          width={windowWidth * 0.25}
          onPress={onOpenCreateBillSheet}
        >
          Create
        </StyledButton>
        <CreateBillSheet
          open={isCreateBillOpen}
          setOpen={setIsCreateBillOpen}
        />
      </FooterContainer>
      {newBillId && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={"$green8"}
          height={"500"}
          width={"85%"}
          justifyContent="center"
        >
          <Toast.Title alignItems="center">
            Successfully created {newBill?.name} Bill
          </Toast.Title>
          <Toast.Description>
            Share Bill Code to your friends: {newBill?.billcode}
          </Toast.Description>
        </Toast>
      )}
      {joinedBillCode && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={"$green8"}
          height={"400"}
          width={"80%"}
          justifyContent="center"
        >
          <Toast.Title alignItems="center">
            You sent a request to join " {newBill?.name} "
          </Toast.Title>
          {/* <Toast.Description>
              Share Bill Code to your friends: {newBill?.billcode}
            </Toast.Description> */}
        </Toast>
      )}
      {(errorMessage || errorCreateMessage) && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={"$red8"}
          height={"400"}
          width={"80%"}
          justifyContent="center"
        >
          <Toast.Title alignContent="center">
            {errorMessage ? errorMessage : errorCreateMessage}
          </Toast.Title>
          {/* <Toast.Description>{error}</Toast.Description> */}
        </Toast>
      )}
      {successDeletedBillMsg && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={"$green8"}
          height={"400"}
          width={"80%"}
          justifyContent="center"
        >
          <Toast.Title alignItems="center">
            Bill is deleted successfully!
          </Toast.Title>
          {/* <Toast.Description>
              Share Bill Code to your friends: {newBill?.billcode}
            </Toast.Description> */}
        </Toast>
      )}
    </OuterContainer>
  );
};

export default Home;
