import { StyledButton } from "@/components/button/button";
import { BodyContainer } from "@/components/containers/body-container";
import { FooterContainer } from "@/components/containers/footer-container";
import { HeaderContainer } from "@/components/containers/header-container";
import { OuterContainer } from "@/components/containers/outer-container";
import CreateBillSheet from "@/components/homepage/create-bill-sheet";
import { TabsAdvancedUnderline } from "@/components/homepage/homepage-tabs-underline";
import JoinBill from "@/components/homepage/join-bill";
import Avatar from "@/components/login/avatar";
import { getBillsForUserIdWithUrls, getProfileInfo } from "@/lib/api";
import { MemberData, ProfileInfo } from "@/types/global";
import { Toast, ToastViewport } from "@tamagui/toast";
import { useLocalSearchParams } from "expo-router";
import { Skeleton } from "moti/skeleton";
import React, { useEffect, useState } from "react";
import { Alert, useWindowDimensions } from "react-native";
import * as RNIap from "react-native-iap";
import { Text, YStack } from "tamagui";

const Home = () => {
  /********** States and Variables ***********/
  const {
    id,
    newBillId: initialNewBillId,
    joinedBillCode: initialJoinedBillCode,
    errorMessage: initialErrorMessage,
    errorCreateMessage: initialErrorCreateMessage,
    successDeletedBillMsg: initialSuccessDeletedBillMsg,
  } = useLocalSearchParams();

  const [newBillId, setNewBillId] = useState(initialNewBillId || "");
  const [joinedBillCode, setJoinedBillCode] = useState(
    initialJoinedBillCode || ""
  );
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage || "");
  const [errorCreateMessage, setErrorCreateMessage] = useState(
    initialErrorCreateMessage || ""
  );
  const [successDeletedBillMsg, setSuccessDeletedBillMsg] = useState(
    initialSuccessDeletedBillMsg || ""
  );

  const [bills, setBills] = useState<MemberData[]>([]);
  const [inactiveBills, setInactiveBills] = useState<MemberData[]>([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const [newBill, setNewBill] = useState<MemberData | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateBillOpen, setIsCreateBillOpen] = useState(false);
  const [products, setProducts] = useState<RNIap.Product[]>([]);
  const [purchase, setPurchase] = useState<RNIap.Purchase | null>(null);
  const [isFreeBillActive, setIsFreeBillActive] = useState(false);

  /********** Functions  ***********/
  const onOpenCreateBillSheet = () => {
    setIsCreateBillOpen(true);
  };

  //resetToasts on pulldown refresh
  const resetToasts = () => {
    setOpen(false);
    setNewBillId("");
    setJoinedBillCode("");
    setErrorMessage("");
    setErrorCreateMessage("");
    setSuccessDeletedBillMsg("");
  };

  /************  UseEffects  **********/
  //Fetches bills
  useEffect(() => {
    //console.log("*** Homepage: Fetch bills for user", id);
    async function fetchBills() {
      if (!id) return;

      const billsData = await getBillsForUserIdWithUrls(id.toString());
      //find an active free bill - if there is then set flag to false

      let activeFreeBillFound = billsData.find(
        (member) => member.isFree && member.isBillActive && !member.isdeleted
      );

      if (activeFreeBillFound) {
        setIsFreeBillActive(!!activeFreeBillFound);
      }
      console.log(
        "activeFreeBillFound",
        isFreeBillActive,
        !!activeFreeBillFound,
        activeFreeBillFound
      );

      const filteredInactiveBills = billsData.filter(
        (member) =>
          (member.isMemberIncluded === true || member.isRequestSent === true) &&
          member.isBillActive === false
      );
      const filteredBillsData = billsData.filter(
        (member) =>
          (member.isMemberIncluded === true || member.isRequestSent === true) &&
          member.isBillActive === true
      );
      setBills(filteredBillsData);
      setInactiveBills(filteredInactiveBills);
      setLoadingBills(false);
      setRefreshing(false);

      // if (refreshing) {
      //   console.log("REFRESHINGGG")
      //   resetToasts()
      // }

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
          isFree: false,
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
            isFree: false,
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
            isFree: false,
          };
        }

        if (newBill.memberid) {
          setNewBill(newBill);
          setOpen(true);
        }
      }

      // if (initialJoinedBillCode) {
      //   setJoinedBillCode(initialJoinedBillCode);
      //   setOpen(true);
      // }
      // if (initialErrorMessage) {
      //   setErrorMessage(initialErrorMessage);
      //   setOpen(true);
      // }
      // if (initialErrorCreateMessage) {
      //   setErrorCreateMessage(initialErrorCreateMessage);
      //   setOpen(true);
      // }
      // if (initialSuccessDeletedBillMsg) {
      //   setSuccessDeletedBillMsg(initialSuccessDeletedBillMsg);
      //   setOpen(true);
      // }
    }

    fetchBills();
    setError(errorMessage?.toString());
  }, [
    id,
    refreshing,
    newBillId,
    joinedBillCode,
    errorMessage,
    errorCreateMessage,
    successDeletedBillMsg,
  ]);

  //Sets and resets toasts
  useEffect(() => {
    if (
      initialNewBillId ||
      initialJoinedBillCode ||
      initialErrorMessage ||
      initialErrorCreateMessage ||
      initialSuccessDeletedBillMsg
    ) {
      setOpen(true);
      setNewBillId(initialNewBillId);
      setJoinedBillCode(initialJoinedBillCode);
      setErrorMessage(initialErrorMessage);
      setErrorCreateMessage(initialErrorCreateMessage);
      setSuccessDeletedBillMsg(initialSuccessDeletedBillMsg);
    }
  }, [
    initialNewBillId,
    initialJoinedBillCode,
    initialErrorMessage,
    initialErrorCreateMessage,
    initialSuccessDeletedBillMsg,
  ]);

  //Fetches profile info for the header
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

  /********** In App Purchases **********/
  const handlePurchaseError = (error: RNIap.PurchaseError) => {
    console.log("Purchase error:", error);
    Alert.alert("Purchase Error", error.message);
  };

  const handlePurchaseSuccess = async (purchase: RNIap.Purchase) => {
    console.log("*** Entering handlePurchaseSuccess: ", purchase);
    try {
      const receipt = purchase.transactionReceipt;
      const purchases = RNIap.getAvailablePurchases();

      console.log("receipts: ", receipt);
      console.log("Available Purchases: ", purchases);

      if (receipt) {
        console.log("Purchase successful: ", receipt);

        // Verify receipt (front-end only)
        Alert.alert("Purchase Success", "Your purchase was successful!");

        // Grant access for the specified duration
        // This is where you'd implement your access logic

        // Finish the transaction
        await RNIap.finishTransaction({ purchase, isConsumable: true });
        console.log("Transaction finished");
      } else {
        console.error("No transaction receipt found");
        Alert.alert("Purchase Error", "No transaction receipt found.");
      }
    } catch (error) {
      console.error("Error finishing transaction:", error);
      Alert.alert(
        "Purchase Error",
        "An error occurred while finishing the transaction."
      );
    }
  };

  //This init for IAP is with backend for receipt verification
  // useEffect(() => {
  //   const initIAP = async () => {
  //     try {
  //       await RNIap.initConnection();
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   };

  //   //Initialize IAP
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

  //   const purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
  //     console.warn("purchaseErrorListener", error);
  //     Alert.alert("Purchase Error", error.message);
  //   });

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
        console.log("* * * Initialization Completed IAP connection * * * ");
        //await fetchProducts();
      } catch (err) {
        console.warn(err);
      }
    };

    // const fetchProducts = async () => {
    //   try {
    //     console.log("Fetching products with IDs:", productSkus);
    //     if (productSkus && productSkus.length > 0) {
    //       const fetchedProducts = await RNIap.getProducts({
    //         skus: productSkus,
    //       });
    //       console.log("Products fetched:", fetchedProducts);
    //       if (fetchedProducts.length === 0) {
    //         console.error("No products found");
    //       }
    //       setProducts(fetchedProducts);
    //     } else {
    //       console.warn("No product SKUs provided");
    //     }
    //   } catch (err) {
    //     console.error("Error fetching products:", err);
    //   }
    // };

    initIAP();

    const purchaseUpdate = RNIap.purchaseUpdatedListener((purchase) => {
      console.log("Purchase updated:", purchase);
      handlePurchaseSuccess(purchase);
    });

    const purchaseError = RNIap.purchaseErrorListener((error) => {
      handlePurchaseError(error);
      console.log("Purchase error HAHA: ", error);
    });

    return () => {
      purchaseUpdate.remove();
      purchaseError.remove();
      console.log("*** Ending IAP connection");
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
          backgroundColor={"$backgroundStrong"}
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
            inactiveBills={inactiveBills}
            userId={id.toString()}
            height={windowHeight * 0.62}
            width={windowWidth * 0.95}
            setRefreshing={setRefreshing}
            refreshing={refreshing}
            loadingBills={loadingBills}
            resetToasts={resetToasts}
          />
        </BodyContainer>
      </YStack>

      <FooterContainer justifyContent="space-between" height={windowHeight}>
        {loadingBills ? (
          <>
            <Skeleton
              show={true}
              colorMode={"light"}
              height={windowHeight * 0.05}
              width={windowWidth * 0.3}
            />
            <Skeleton
              show={true}
              colorMode={"light"}
              height={windowHeight * 0.05}
              width={windowWidth * 0.3}
            />
          </>
        ) : (
          <>
            <JoinBill
              avatarUrl={avatarUrl}
              displayName={
                profileInfo?.displayName ? profileInfo.displayName : ""
              }
              buttonWidth={windowWidth * 0.25}
              buttonSize={"$3.5"}
            />
            <StyledButton
              create={true}
              size={"$3.5"}
              width={windowWidth * 0.25}
              onPress={onOpenCreateBillSheet}
            >
              Create
            </StyledButton>
          </>
        )}

        <CreateBillSheet
          open={isCreateBillOpen}
          setOpen={setIsCreateBillOpen}
          isFreeBillActive={isFreeBillActive}
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
        </Toast>
      )}
    </OuterContainer>
  );
};

export default Home;
