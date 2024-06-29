import { formatDate, convertToLocalDate } from "@/lib/helpers";
import { BillInfo } from "@/types/global";
import { Toast } from "@tamagui/toast";

interface ExtendDurationToastProps {
  setOpenExtendDuration: React.Dispatch<React.SetStateAction<boolean>>;
  openExtendDuration: boolean;
  extendErrorMessage: string;
  bill: BillInfo[];
}

const ExtendDurationToast: React.FC<ExtendDurationToastProps> = ({
  setOpenExtendDuration,
  openExtendDuration,
  extendErrorMessage,
  bill,
}) => {
  const errorTitle = "Error extending duration";
  const successTitle = `Bill Duration Extended for ${bill[0]?.name}`;

  const successMsg = ` New Duration ${formatDate(
    convertToLocalDate(bill[0]?.start_date.toString())
  )} - ${formatDate(convertToLocalDate(bill[0]?.end_date.toString()))}`;
  return (
    <Toast
      onOpenChange={setOpenExtendDuration}
      open={openExtendDuration}
      animation="100ms"
      enterStyle={{ x: -20, opacity: 0 }}
      exitStyle={{ x: -20, opacity: 0 }}
      opacity={1}
      x={0}
      backgroundColor={extendErrorMessage ? "$red8Light" : "$green8Light"}
      height={"auto"}
      width={"80%"}
      justifyContent="center"
    >
      <Toast.Title textAlign="left">
        {extendErrorMessage ? errorTitle : successTitle}
      </Toast.Title>
      <Toast.Description>
        {extendErrorMessage ? extendErrorMessage : successMsg}
      </Toast.Description>
    </Toast>
  );
};

export default ExtendDurationToast;
