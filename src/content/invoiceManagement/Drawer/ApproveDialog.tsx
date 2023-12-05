import CustomizedDialogs from "@/components/common/DialogComponent";
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
export const ApproveDialogComponent = (props: InsertBookDialogProps) => {
  const { openDialog, handleClickClose, handleClickConfirm, control } = props;

  return (
    <CustomizedDialogs
      size={"sm"}
      open={openDialog}
      confirm={true}
      titleConfirmButton="Xác nhận"
      title={"Xác nhận tạo bút toán"}
      handleClickClose={handleClickClose}
      handleClickConfirm={handleClickConfirm}
    >
      <div className="app">
        <TextareaComponent
          control={control}
          valueInput={""}
          name={"formConfirm.explanation"}
          label={"Diễn Giải"}
          width={""}
          type={""}
          disable={false}
        />
      </div>
    </CustomizedDialogs>
  );
};
