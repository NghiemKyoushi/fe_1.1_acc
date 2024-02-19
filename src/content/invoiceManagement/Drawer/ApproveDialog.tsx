import { fetchSaveImage } from "@/api/service/invoiceManagement";
import CustomizedDialogs from "@/components/common/DialogComponent";
import ImageUpload from "@/components/common/ImageUpload";
import { LabelComponent } from "@/components/common/LabelComponent";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { Control, UseFormSetValue, useController } from "react-hook-form";

interface InsertBookDialogProps {
  openDialog: boolean;
  handleClickClose: () => void;
  handleClickConfirm: () => void;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  // register: UseFormRegister<FieldValues>
}
export const ApproveDialogComponent = (props: InsertBookDialogProps) => {
  const {
    openDialog,
    handleClickClose,
    handleClickConfirm,
    setValue,
    control,
  } = props;
  const [imageId, setImageId] = useState("");

  const handleGetFile = (file: any) => {
    if (!file || file[0].size > 5 * 1024 * 1024) {
      enqueueSnackbar("File ảnh phải nhỏ hơn 5MB", { variant: "error" });
      return;
    }
    fetchSaveImage(imageId, file[0])
      .then((res) => {
        setImageId(res.data);
        setValue("formConfirm.imageId", res.data);
      })
      .catch(function (error) {
        enqueueSnackbar("Load ảnh thất bại", { variant: "error" });
      });
  };

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
        <LabelComponent require={true}>Diễn giải</LabelComponent>
        <TextareaComponent
          control={control}
          valueInput={""}
          name={"formConfirm.explanation"}
          label={"Diễn Giải"}
          width={""}
          type={""}
          disable={false}
        />
        <div style={{ marginTop: 20 }}>
          <ImageUpload handleGetFile={handleGetFile} filePath="" />
        </div>
      </div>
    </CustomizedDialogs>
  );
};
