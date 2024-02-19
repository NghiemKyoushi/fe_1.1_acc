import { fetchBranch, fetchSaveImage } from "@/api/service/invoiceManagement";
import SelectSearchComponent from "@/components/common/AutoComplete";
import CustomizedDialogs from "@/components/common/DialogComponent";
import ImageUpload from "@/components/common/ImageUpload";
import { InputNumber } from "@/components/common/InputCustom";
import { LabelComponent } from "@/components/common/LabelComponent";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import { branchType } from "@/models/PortManagementModel";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Control, UseFormSetValue, useController } from "react-hook-form";
import styled from "styled-components";

interface InsertBookDialogProps {
  openDialog: boolean;
  handleClickClose: () => void;
  handleClickConfirm: () => void;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  // register: UseFormRegister<FieldValues>
}
export const PayFeeDialogComponent = (props: InsertBookDialogProps) => {
  const {
    openDialog,
    handleClickClose,
    handleClickConfirm,
    setValue,
    control,
  } = props;
  const [imageId, setImageId] = useState("");
  const [branchList, setBranchList] = useState<branchType[]>([]);
  useEffect(() => {
    fetchBranch().then((res) => {
      if (res.data) {
        const branch = res.data.map((item: any) => {
          return {
            values: item?.name,
            key: item?.id,
          };
        });
        setBranchList(branch);
      }
    });
  }, []);
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
  const getDataCustomerFromApi = (value: string) => {};
  return (
    <CustomizedDialogs
      size={"sm"}
      open={openDialog}
      confirm={true}
      titleConfirmButton="Xác nhận"
      title={"Cập nhật phí đã ứng"}
      handleClickClose={handleClickClose}
      handleClickConfirm={handleClickConfirm}
    >
      <div className="app">
        <StyleInputContainer>
          <LabelComponent require={true}>Số tiền</LabelComponent>
          <InputNumber
            type={true}
            InputWidth="100%"
            name={"formConfirm.prePaidFee"}
            control={control}
          />
        </StyleInputContainer>

        <StyleInputContainer>
          <LabelComponent require={true}>Chi nhánh</LabelComponent>
          <SelectSearchComponent
            control={control}
            props={{
              name: "formConfirm.branchIds",
              placeHoder: "",
              results: branchList,
              label: "",
              //   disable: role !== ROLE.ADMIN && true,
              type: "text",
              setValue: setValue,
              labelWidth: "43",
              getData: getDataCustomerFromApi,
            }}
          />
        </StyleInputContainer>
        <div style={{ marginTop: 20 }}>
          <ImageUpload handleGetFile={handleGetFile} filePath="" />
        </div>
      </div>
    </CustomizedDialogs>
  );
};

const StyleInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;
