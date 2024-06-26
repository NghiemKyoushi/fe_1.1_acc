import CustomizedDialogs from "@/components/common/DialogComponent";
import ImageUpload from "@/components/common/ImageUpload";
import { InputNumber } from "@/components/common/InputCustom";
import { LabelComponent } from "@/components/common/LabelComponent";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import { Control, useController } from "react-hook-form";
import styled from "styled-components";

interface InsertBookDialogProps {
  openDialog: boolean;
  handleClickClose: () => void;
  handleClickConfirm: () => void;
  handleGetFile: (file: Array<any>) => void;
  control: Control<any>;
  // register: UseFormRegister<FieldValues>
}
export const RepayDialogComponent = (props: InsertBookDialogProps) => {
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
      title={"Xác nhận hoàn trả"}
      handleClickClose={handleClickClose}
      handleClickConfirm={handleClickConfirm}
    >
      <div className="app">
        <StyleInputContainer>
          <LabelComponent require={true}>Diễn giải</LabelComponent>
          <TextareaComponent
            control={control}
            valueInput={""}
            name={"formRepay.explanation"}
            label={"Diễn Giải"}
            width={""}
            type={""}
            disable={false}
          />
        </StyleInputContainer>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 30,
            marginTop: 10,
          }}
        >
          <StyleInputContainer>
            <LabelComponent require={true}>Số tiền</LabelComponent>
            <InputNumber
              InputWidth="100%"
              name={`formRepay.repaidAmount`}
              control={control}
              type={true}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Dư nợ</LabelComponent>
            <InputNumber
              InputWidth="100%"
              name={`formRepay.loan`}
              control={control}
              type={true}
            />
          </StyleInputContainer>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <ImageUpload handleGetFile={handleGetFile} filePath="" />
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
