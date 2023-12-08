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
  handleGetFile: (file: Array<any>) => void;
  control: Control<any>;
  // register: UseFormRegister<FieldValues>
}
export const ConfirmBillsDialogComponent = (props: InsertBookDialogProps) => {
  const {
    openDialog,
    handleClickClose,
    handleClickConfirm,
    control,
    handleGetFile,
  } = props;

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
        <LabelComponent require={true}>Diễn giải</LabelComponent>
        <TextareaComponent
          control={control}
          valueInput={""}
          name={"explanation"}
          label={"Diễn Giải"}
          width={""}
          type={""}
          disable={false}
        />
      </div>
      <div style={{ marginTop: 20 }}>
        <ImageUpload handleGetFile={handleGetFile} filePath="" />
      </div>
    </CustomizedDialogs>
  );
};
