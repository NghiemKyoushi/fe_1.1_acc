import SelectSearchComponent from "@/components/common/AutoComplete";
import CustomizedDialogs from "@/components/common/DialogComponent";
import ImageUpload from "@/components/common/ImageUpload";
import { LabelComponent } from "@/components/common/LabelComponent";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import { TextFieldCustom } from "@/components/common/Textfield";
import { listTranType } from "@/content/accBookManagement/Drawer/NewAccountBookDrawer";
import { Divider } from "@mui/material";
import { Control, UseFormSetValue, useController } from "react-hook-form";

interface InsertBookDialogProps {
  openDialog: boolean;
  handleClickClose: () => void;
  handleClickConfirm: () => void;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  // register: UseFormRegister<FieldValues>
}
export const AddEntryTypeDialogComponent = (props: InsertBookDialogProps) => {
  const {
    openDialog,
    handleClickClose,
    setValue,
    handleClickConfirm,
    control,
  } = props;
  const getDataCustomerFromApi = (value: string) => {};

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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <LabelComponent require={true}>Định khoản</LabelComponent>
          <TextFieldCustom
            type={"text"}
            style={{ width: 250 }}
            onChange={(e: any) => {
              setValue("accEntryType", e.target.value.trim());
            }}
          />
        </div>

        <div>
          <LabelComponent require={true}>Phân loại </LabelComponent>
          <SelectSearchComponent
            control={control}
            props={{
              name: "transactionType",
              placeHoder: "",
              results: listTranType,
              label: "",
              // getData:((value) => setValue("customerName", value)),
              type: "text",
              setValue: setValue,
              labelWidth: "50",
              getData: getDataCustomerFromApi,
            }}
          />
        </div>
      </div>
    </CustomizedDialogs>
  );
};
