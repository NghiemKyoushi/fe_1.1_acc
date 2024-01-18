import CustomizedDialogs from "@/components/common/DialogComponent";
import { LabelComponent } from "@/components/common/LabelComponent";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import { Divider } from "@mui/material";
import { Control, useController } from "react-hook-form";

interface InsertBookDialogProps {
  openDialog: boolean;
  handleClickClose: () => void;
  handleClickConfirm: () => void;
  // register: UseFormRegister<FieldValues>
}
export const DialogDeleteComponent = (props: InsertBookDialogProps) => {
  const { openDialog, handleClickClose, handleClickConfirm } = props;

  return (
    <CustomizedDialogs
      size={"xs"}
      open={openDialog}
      confirm={true}
      titleConfirmButton="Xác nhận"
      title={"Xác nhận xóa"}
      handleClickClose={handleClickClose}
      handleClickConfirm={handleClickConfirm}
    >
      <div className="app" style={{ alignItems: "center" }}>
        <h3> Bạn có chắc chắn muốn xóa ?</h3>
      </div>
    </CustomizedDialogs>
  );
};
