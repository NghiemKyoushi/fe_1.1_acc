import CustomizedDialogs from "@/components/common/DialogComponent";
import ImageUpload from "@/components/common/ImageUpload";
import { LabelComponent } from "@/components/common/LabelComponent";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import { Divider } from "@mui/material";
import { Control, useController } from "react-hook-form";

interface InsertBookDialogProps {
  openDialog: boolean;
  handleClickClose: () => void;
  handleClickConfirm: () => void;
  control: Control<any>;
  // register: UseFormRegister<FieldValues>
}
export const ChangePassword = (props: InsertBookDialogProps) => {
  const { openDialog, handleClickClose, handleClickConfirm, control } = props;

  return (
    <CustomizedDialogs
      size={"sm"}
      open={openDialog}
      confirm={true}
      titleConfirmButton="Xác nhận"
      title={"Xác nhận bút toán"}
      handleClickClose={handleClickClose}
      handleClickConfirm={handleClickConfirm}
    >
      <div className="app">
        <LabelComponent require={true}>Mật khẩu mới</LabelComponent>
        <div style={{ height: 120, width: "100%" }}>
          <TextareaComponent
            control={control}
            valueInput={""}
            name={"newPassword"}
            label={"Mật khẩu mới"}
            width={""}
            type={""}
            disable={false}
          />
        </div>
      </div>
    </CustomizedDialogs>
  );
};
