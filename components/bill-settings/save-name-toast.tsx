import { Toast } from "@tamagui/toast";

interface SaveNameToastProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  billName: string;
  saveNameError: boolean;
}

const SaveNameToast: React.FC<SaveNameToastProps> = ({
  setOpen,
  open,
  billName,
  saveNameError,
}) => {
  const successMsg = `Changes saved to ${billName} successfully!`;
  const errorMsg = "Error changing bill name";
  return (
    <Toast
      onOpenChange={setOpen}
      open={open}
      animation="100ms"
      enterStyle={{ x: -20, opacity: 0 }}
      exitStyle={{ x: -20, opacity: 0 }}
      opacity={1}
      x={0}
      backgroundColor={saveNameError ? "$red8Light" : "$green8Light"}
      width={"80%"}
      justifyContent="center"
    >
      <Toast.Title textAlign="left">
        {saveNameError ? errorMsg : successMsg}
      </Toast.Title>
    </Toast>
  );
};

export default SaveNameToast;
