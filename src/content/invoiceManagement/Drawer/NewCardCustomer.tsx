import { fetchAllCard } from "@/actions/CardCustomerActions";
import { fetchSearchCustomer } from "@/actions/CustomerManagerAction";
import { fetchCreateCardCustomer } from "@/api/service/cardCustomerApis";
import SelectSearchComponent from "@/components/common/AutoComplete";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { NewCardType, NewCardTypeFrorm } from "@/models/CardCustomerModel";
import { RootState } from "@/reducers/rootReducer";
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
}

const NewCardCustomer = (props: NewCardCustomerProps) => {
  const { isOpen, handleCloseDrawer } = props;
  const { register, handleSubmit, setValue, getValues, watch, reset, control } =
    useForm<NewCardTypeFrorm>({
      defaultValues: {
        customerId: {
          key: "",
          value: "",
        },
        cardTypeId: {
          key: "",
          value: "",
        },
        name: "",
        bank: "",
        accountNumber: "",
      },
    });
  const listOfCustomer = useSelector(
    (state: RootState) => state.customerManagament.customerList
  );
  const listOfCard = useSelector(
    (state: RootState) => state.cardCustomer.cardList
  );
  const dispatch = useDispatch();
  const getDataCustomerFromApi = (value: string) => {
    if (value !== "") {
      dispatch(fetchSearchCustomer({ customerName: value }));
    }
  };
  const handleCreateCard = () => {
    const { bank, name, accountNumber, customerId, cardTypeId } = getValues();
    const bodySend = {
      accountNumber: accountNumber,
      bank: bank,
      cardTypeId: cardTypeId.key,
      customerId: customerId.key,
      name: name,
      paymentDueDate: "",
      paymentLimit: 0,
    };
    fetchCreateCardCustomer(bodySend)
      .then((res) => {
        enqueueSnackbar("Tạo thẻ mới thành công!!", { variant: "success" });
      })
      .catch(function (error) {
        // handle error
        enqueueSnackbar("Tạo người dùng thất bại !!", { variant: "error" });
      });
  };
  useEffect(() => {
    dispatch(fetchAllCard());
  }, []);
  return (
    <DrawerCustom
      widthDrawer={270}
      isOpen={isOpen}
      title="Tạo Hóa đơn"
      handleClose={handleCloseDrawer}
    >
      <PageContent>
        <form key={"newCustomerCard"}>
          <StyleInputContainer>
            <LabelComponent require={true}>Tên khách hàng</LabelComponent>
            <SelectSearchComponent
              control={control}
              props={{
                name: "customerId",
                placeHoder: "",
                results: listOfCustomer,
                label: "",
                type: "text",
                setValue: setValue,
                labelWidth: "112",
                getData: getDataCustomerFromApi,
              }}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Loại thẻ</LabelComponent>
            <SelectSearchComponent
              control={control}
              props={{
                name: "cardTypeId",
                placeHoder: "",
                results: listOfCard,
                label: "",
                // getData:((value) => setValue("customerId", value)),
                type: "text",
                setValue: setValue,
                labelWidth: "112",
                getData: getDataCustomerFromApi,
              }}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Tên thẻ</LabelComponent>
            <TextFieldCustom
              type={"text"}
              {...register("name", { required: true })}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Ngân Hàng</LabelComponent>
            <TextFieldCustom
              type={"text"}
              {...register("bank", { required: true })}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Số thẻ</LabelComponent>
            <TextFieldCustom
              type={"text"}
              {...register("accountNumber", { required: true })}
            />
          </StyleInputContainer>
          <Box
            sx={{
              justifyContent: "flex-end",
              display: "flex",
              marginTop: 3,
              padding: "0px 16px 8px 16px",
            }}
          >
            <Button size="small" variant="contained" onClick={handleCreateCard}>
              Lưu Thẻ
            </Button>
          </Box>
        </form>
      </PageContent>
    </DrawerCustom>
  );
};
export default NewCardCustomer;

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
