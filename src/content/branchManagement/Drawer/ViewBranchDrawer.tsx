import { fetchBranch } from "@/actions/BranchManagementAction";
import { fetchAllCard } from "@/actions/CardCustomerActions";
import { fetchSearchCustomer } from "@/actions/CustomerManagerAction";
import {
  createNewBranch,
  updateNewBranch,
} from "@/api/service/branchManagement";
import { fetchCreateCardCustomer } from "@/api/service/cardCustomerApis";
import SelectSearchComponent from "@/components/common/AutoComplete";
import DateSiglePicker from "@/components/common/DatePicker";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { BranchParamSend } from "@/models/BranchManagementModel";
import { NewCardType, NewCardTypeFrorm } from "@/models/CardCustomerModel";
import { RootState } from "@/reducers/rootReducer";
import { handleKeyPress } from "@/utils";
import { Box, Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import styled from "styled-components";

export interface NewCardCustomerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  rowInfo: any;
}

const ViewBranchDrawer = (props: NewCardCustomerProps) => {
  const { isOpen, handleCloseDrawer, rowInfo } = props;
  const { register, handleSubmit, setValue, getValues, watch, reset, control } =
    useForm<BranchParamSend>({
      defaultValues: {
        name: "",
        code: "",
        phoneNumber: "",
        // accountNumber: "",
        // bank: "",
      },
    });
  const listOfCustomer = useSelector(
    (state: RootState) => state.customerManagament.customerList
  );
  const listOfCard = useSelector(
    (state: RootState) => state.cardCustomer.cardList
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (rowInfo) {
      reset({
        name: rowInfo.name,
        code: rowInfo.code,
        phoneNumber: rowInfo.phoneNumber,
      //   accountNumber: rowInfo.accountNumber,
      //   bank: rowInfo.bank,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowInfo]);
  const handleCreateCard = () => {
    const { name, code, phoneNumber } = getValues();
    const bodySend = {
      // accountNumber: accountNumber,
      // bank: bank,
      name: name,
      code: code,
      phoneNumber: phoneNumber,
    };
    updateNewBranch(rowInfo.id, bodySend)
      .then((res) => {
        enqueueSnackbar("Cập nhật thành công!!", { variant: "success" });
        handleCloseDrawer();
        dispatch(fetchBranch());
      })
      .catch(function (error) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Cập nhật thất bại !", { variant: "error" });
        }
      });
  };
  useEffect(() => {
    dispatch(fetchAllCard());
  }, []);

  return (
    <DrawerCustom
      widthDrawer={270}
      isOpen={isOpen}
      title="Xem/Sửa chi nhánh"
      handleClose={handleCloseDrawer}
    >
      <PageContent>
        <form onKeyPress={handleKeyPress} key={"newCustomerCard"} onSubmit={handleSubmit(handleCreateCard)}>
          <StyleInputContainer>
            <LabelComponent require={true}>Tên chi nhánh</LabelComponent>
            <TextFieldCustom
              type={"text"}
              {...register("name", { required: true })}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Mã chi nhánh</LabelComponent>
            <TextFieldCustom
              type={"text"}
              {...register("code", { required: true })}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Số điện thoại</LabelComponent>
            <TextFieldCustom
              type={"text"}
              {...register("phoneNumber", { required: true })}
            />
          </StyleInputContainer>
          {/* <StyleInputContainer>
            <LabelComponent require={true}>Số tài khoản</LabelComponent>
            <TextFieldCustom
              type={"text"}
              {...register("accountNumber", { required: true })}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Ngân hàng</LabelComponent>
            <TextFieldCustom
              type={"text"}
              {...register("bank", { required: true })}
            />
          </StyleInputContainer> */}
          <Box
            sx={{
              justifyContent: "flex-end",
              display: "flex",
              marginTop: 3,
              padding: "0px 16px 8px 16px",
            }}
          >
            <Button size="small" variant="contained" type="submit">
              Cập nhật
            </Button>
          </Box>
        </form>
      </PageContent>
    </DrawerCustom>
  );
};
export default ViewBranchDrawer;

const StyleInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;
const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
`;
