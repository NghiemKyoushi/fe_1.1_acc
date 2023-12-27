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
export const AddEntryTypeDialogComponent = (props: InsertBookDialogProps) => {
  const {
    openDialog,
    handleClickClose,
    handleClickConfirm,
    control,
  } = props;

  return (
    <CustomizedDialogs
      size={"sm"}
      open={openDialog}
      confirm={true}
      titleConfirmButton="Xác nhận"
      title={"Tạo/Sửa định khoản"}
      handleClickClose={handleClickClose}
      handleClickConfirm={handleClickConfirm}
    >
      <div className="app">
        <LabelComponent require={true}>Định khoản</LabelComponent>
        <TextareaComponent
          control={control}
          valueInput={""}
          name={"accEntryType"}
          label={"Định khoản"}
          width={""}
          type={""}
          disable={false}
        />
      </div>
    </CustomizedDialogs>
  );
};
