import CustomizedDialogs from "@/components/common/DialogComponent";
import { LabelComponent } from "@/components/common/LabelComponent";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import { Control } from "react-hook-form";
import styled from "styled-components";

interface InsertBookDialogProps {
  openDialog: boolean;
  handleClickClose: () => void;
  handleClickConfirm: () => void;
  control: Control<any>;
}
export const NoteDeleteDialogComponent = (props: InsertBookDialogProps) => {
  const { openDialog, handleClickClose, handleClickConfirm, control } = props;

  return (
    <CustomizedDialogs
      size={"sm"}
      open={openDialog}
      confirm={true}
      titleConfirmButton="Xác nhận"
      title={"Thông tin ghi chú"}
      handleClickClose={handleClickClose}
      handleClickConfirm={handleClickConfirm}
    >
      <div className="app">
        <StyleInputContainer>
          <LabelComponent require={true}>Ghi chú</LabelComponent>
          <TextareaComponent
            control={control}
            valueInput={""}
            name={"noteDeleteInfo"}
            label={"Ghi chú"}
            width={""}
            type={""}
            disable={false}
          />
        </StyleInputContainer>
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
