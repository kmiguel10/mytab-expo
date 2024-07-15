import { StyledButton } from "@/components/button/button";
import { BodyContainer } from "@/components/containers/body-container";
import { FooterContainer } from "@/components/containers/footer-container";
import { HeaderContainer } from "@/components/containers/header-container";
import { OuterContainer } from "@/components/containers/outer-container";
import UnderlinedTabs from "@/components/my-bill/my-tab/underlined-tabs";
import HeaderInfo from "@/components/my-bill/summary/HeaderInfo";
import BillHeaderSkeleton from "@/components/skeletons/bill-header-skeleton";
import {
  getActiveTransactions,
  getBillInfo,
  getBillSummaryInfo,
  getMembers,
} from "@/lib/api";
import { BillInfo, Member, SummaryInfo, Transaction } from "@/types/global";
import { Toast, ToastViewport } from "@tamagui/toast";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { Skeleton } from "moti/skeleton";
import React, { useEffect, useState } from "react";
import { Spinner, YStack, useWindowDimensions } from "tamagui";
import DeviceInfo from "react-native-device-info";

// Define the possible product types
type ProductType = "free.plan" | "com.mytab.1week" | "com.mytab.2weeks";

const BillScreen = () => {
  /** ---------- States  and variables---------- */
  const {
    id,
    userId,
    txnName: initialTxnName,
    errorCreateMsg: initialErrorCreateMsg,
    errorEditMsg: initialErrorEditMsg,
    editedTxnName: initialEditedTxnName,
    errorDeleteMsg: initialErrorDeleteMsg,
    deletedTxnName: initialDeletedTxnName,
  } = useLocalSearchParams();

  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setloadingTransactions] = useState(true);
  const [summaryInfo, setSummaryInfo] = useState<SummaryInfo[]>([]);
  const [loadingSummaryInfo, setLoadingSummaryInfo] = useState(true);
  const [billInfo, setBillInfo] = useState<BillInfo[]>([]);
  //const [myTabInfo, setMyTabInfo] = useState<any[] | null>([]);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [openCreateTxn, setOpenCreateTxn] = useState(false);
  const [isMaxTxnsReached, setIsMaxTxnsReached] = useState(false);
  const [maxTransactions, setMaxTransactions] = useState(0);

  const [isBillExpired, setIsBillExpired] = useState(false);
  const [isExpiringToday, setIsExpiringToday] = useState(false);

  // Create states for toast messages
  const [txnName, setTxnName] = useState(initialTxnName || "");
  const [errorCreateMsg, setErrorCreateMsg] = useState(
    initialErrorCreateMsg || ""
  );
  const [editedTxnName, setEditedTxnName] = useState(
    initialEditedTxnName || ""
  );
  const [errorEditMsg, setErrorEditMsg] = useState(initialErrorEditMsg || "");
  const [errorDeleteMsg, setErrorDeleteMsg] = useState(
    initialErrorDeleteMsg || ""
  );
  const [deletedTxnName, setDeletedTxnName] = useState(
    initialDeletedTxnName || ""
  );

  //I am using this to set loading for when I am submitting changes for edit
  const [isLoading, setIsLoading] = useState(false);
  const [isIpad, setIsIpad] = useState(false);

  const router = useRouter();

  /** ---------- Functions ---------- */
  const onCreateTransactionClick = () => {
    const createTxnObject = {
      billId: id?.toString() || "",
      members: members,
      maxTransaction: maxTransactions,
      userId: userId,
    };
    router.push({
      pathname: "/screens/create-transaction",
      params: {
        createTxnObject: encodeURIComponent(JSON.stringify(createTxnObject)),
      },
    });
  };

  // const onOpenCreateTxn = () => {
  //   setOpenCreateTxn(true);
  // };

  // Resets toast messages
  const resetToastMessageStates = () => {
    // Reset states
    setTxnName("");
    setErrorCreateMsg("");
    setEditedTxnName("");
    setErrorEditMsg("");
    setErrorDeleteMsg("");
    setDeletedTxnName("");
  };

  // Type guard to check if a value is a valid ProductType
  const isProductType = (value: string): value is ProductType => {
    return ["free.plan", "com.mytab.1week", "com.mytab.2weeks"].includes(value);
  };

  /** ---------- UseEffects ---------- */

  /** fetch summary info */
  useEffect(() => {
    async function fetchSummaryInfo() {
      if (id) {
        const data = await getBillSummaryInfo(Number(id));
        setSummaryInfo(data);

        if (data) setLoadingSummaryInfo(false);
      }
    }
    fetchSummaryInfo();
  }, [id, transactions]);

  /**Fetch members of the bill */
  useEffect(() => {
    async function fetchMembers() {
      if (id) {
        const membersData = await getMembers(Number(id));
        setMembers(membersData);
      }
    }
    fetchMembers();
  }, [id]);

  //Need to be able to reflect current transaction upon creating a new txn
  useEffect(() => {
    async function fetchTransactions() {
      if (userId) {
        const transactionData: Transaction[] = await getActiveTransactions(
          id?.toString() || ""
        );
        setTransactions(transactionData);
        if (transactionData) setloadingTransactions(false);
      }
    }
    fetchTransactions();
  }, [userId, txnName, deletedTxnName, editedTxnName]);

  //Fetch bill info
  useEffect(() => {
    async function fetchBillInfo() {
      if (id) {
        const data: BillInfo[] | null = await getBillInfo(Number(id));

        if (data) {
          setBillInfo(data);
        }
      }
    }
    fetchBillInfo();
  }, [id]);

  //Sets if max transactions reached based on productId and if expiredToday or
  /**
   * 1. Sets if max transactions reached based on productId and if expiredToday
   * 2. Sets if expires today
   * 3. sets if bill is expired
   */
  useEffect(() => {
    if (billInfo.length === 0) {
      // Handle the case where billInfo is empty
      setIsMaxTxnsReached(false);
      return;
    }

    const _isActive = billInfo[0].isActive;

    /** Expires today */
    const endDateInUtc = moment(billInfo[0].end_date)
      .utc()
      .local()
      .startOf("day");
    const todayInUtc = moment().utc().local().startOf("day");

    // const todayInUtc = moment(billInfo[0].end_date)
    //   .add(1, "day")
    //   .utc()
    //   .local()
    //   .startOf("day");

    if (todayInUtc.isSame(endDateInUtc)) {
      setIsExpiringToday(true);
      setIsBillExpired(false);
    } else if (!_isActive) {
      //expired
      //todayInUtc.isAfter(endDateInUtc)
      /** TODO: use the isExpired prop from the DB after implementing edge function of switching bills to expired */
      setIsBillExpired(true);
      setIsExpiringToday(false);
    }
    /** Max Transactions reached */
    const transactionNumber = transactions.length;
    const productType = billInfo[0]?.productId;

    // Mapping product types to their respective max transactions
    const planMaxTransactions: Record<ProductType, number> = {
      "free.plan": 20,
      "com.mytab.1week": 100,
      "com.mytab.2weeks": 200,
    };

    // Determine if the max transaction number is reached based on the plan
    if (productType && isProductType(productType)) {
      const _maxTransactions = planMaxTransactions[productType];
      setIsMaxTxnsReached(transactionNumber >= _maxTransactions);
      setMaxTransactions(_maxTransactions);
      console.log("setIsMaxTxnsReached", transactionNumber >= _maxTransactions);
      console.log("transactionNumber", transactionNumber);
      console.log("productType", productType);
    } else {
      // Handle unexpected product types if necessary
      //setIsMaxTxnsReached(false);
      console.error("Error not a valid productType: ", productType);
    }
  }, [billInfo, transactions]);

  // Update toast message states whenever search params change
  useEffect(() => {
    if (
      initialTxnName ||
      initialErrorCreateMsg ||
      initialEditedTxnName ||
      initialErrorEditMsg ||
      initialDeletedTxnName ||
      initialErrorDeleteMsg
    ) {
      console.log(" *** Toasts are initialized");
      setOpen(true);
      setTxnName(initialTxnName || "");
      setErrorCreateMsg(initialErrorCreateMsg || "");
      setEditedTxnName(initialEditedTxnName || "");
      setErrorEditMsg(initialErrorEditMsg || "");
      setDeletedTxnName(initialDeletedTxnName || "");
      setErrorDeleteMsg(initialErrorDeleteMsg || "");
    }
  }, [
    initialTxnName,
    initialErrorCreateMsg,
    initialEditedTxnName,
    initialErrorEditMsg,
    initialDeletedTxnName,
    initialErrorDeleteMsg,
  ]);

  useEffect(() => {
    const checkIfTablet = async () => {
      const isTablet = await DeviceInfo.isTablet();
      const model = await DeviceInfo.getModel();
      const deviceType = await DeviceInfo.getDeviceType();

      console.log("Is Tablet:", isTablet);
      console.log("Model:", model);
      console.log("Device Type:", deviceType);

      const isIpadModel = model.toLowerCase().includes("ipad");
      if (isIpadModel) {
        // setButtonSize("$2.5");
      }
      setIsIpad(isIpadModel);

      console.log("Is iPad Model:", isIpadModel);
    };

    checkIfTablet();
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
        <HeaderContainer>
          {!loadingSummaryInfo ? (
            <HeaderInfo
              summaryInfo={summaryInfo}
              billName={billInfo[0]?.name}
              height={windowHeight * 0.15}
              width={windowWidth}
              isMaxTransactionsReached={isMaxTxnsReached}
              maxTransactions={maxTransactions}
              isExpiringToday={isExpiringToday}
              isBillExpired={isBillExpired}
            />
          ) : (
            <BillHeaderSkeleton
              height={windowHeight * 0.15}
              width={windowWidth}
              show={true}
              colorMode={"light"}
            />
          )}
        </HeaderContainer>
        <BodyContainer height={windowHeight * 0.6}>
          {isLoading ? (
            <YStack flex={1} justifyContent="center">
              <Spinner color={"forestgreen"} size="large" />
            </YStack>
          ) : (
            <UnderlinedTabs
              transactions={transactions}
              summaryInfo={summaryInfo}
              billId={Number(id)}
              userId={userId?.toString() || ""}
              height={windowHeight * 0.6}
              width={windowWidth * 0.95}
              members={members}
              resetToastMessageStates={resetToastMessageStates}
              setTransactions={setTransactions}
              isLocked={billInfo[0]?.isLocked}
              billOwnerId={billInfo[0]?.ownerid}
              loadingTransactions={loadingTransactions}
              setIsLoading={setIsLoading}
              isIpad={isIpad}
            />
          )}
        </BodyContainer>
      </YStack>
      <FooterContainer
        height={windowHeight}
        justifyContent="flex-end"
        alignContent="center"
      >
        {/* <MembersView members={members} height={windowHeight} /> */}
        {loadingSummaryInfo ? (
          <Skeleton
            show={true}
            colorMode={"light"}
            height={windowHeight * 0.05}
            width={windowWidth * 0.4}
          />
        ) : (
          <StyledButton
            disabled={billInfo[0]?.isLocked || isMaxTxnsReached}
            create={!billInfo[0]?.isLocked && !isMaxTxnsReached}
            width={isIpad ? windowWidth * 0.4 : windowWidth * 0.38}
            size={"$3.5"}
            onPress={onCreateTransactionClick}
          >
            Add Transaction
          </StyledButton>
        )}
      </FooterContainer>

      {(txnName || errorCreateMsg) && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={txnName ? "$green8Light" : "$red8Light"}
          height={"auto"}
          width={"80%"}
          justifyContent="center"
        >
          <Toast.Title textAlign="left">
            {txnName ? "Transaction created" : "Failed creating transaction"}
          </Toast.Title>
          <Toast.Description>
            {txnName ? `You entered: ${txnName}` : `Error: ${errorCreateMsg}`}
          </Toast.Description>
        </Toast>
      )}
      {(editedTxnName || errorEditMsg) && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={editedTxnName ? "$green8Light" : "$red8Light"}
          height={"auto"}
          width={"80%"}
          justifyContent="center"
        >
          <Toast.Title textAlign="left">
            {editedTxnName
              ? "Transaction edited"
              : "Failed editing transaction"}
          </Toast.Title>
          <Toast.Description>
            {editedTxnName
              ? `You edited: ${editedTxnName}`
              : `Error: ${errorEditMsg}`}
          </Toast.Description>
        </Toast>
      )}
      {(deletedTxnName || errorDeleteMsg) && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={deletedTxnName ? "$green8Light" : "$red8Light"}
          height={"auto"}
          width={"80%"}
          justifyContent="center"
        >
          <Toast.Title textAlign="left">
            {deletedTxnName
              ? "Transaction deleted"
              : "Failed deleting transaction"}
          </Toast.Title>
          <Toast.Description>
            {deletedTxnName
              ? `You deleted: ${deletedTxnName}`
              : `Error: ${errorDeleteMsg}`}
          </Toast.Description>
        </Toast>
      )}
    </OuterContainer>
  );
};
export default BillScreen;
