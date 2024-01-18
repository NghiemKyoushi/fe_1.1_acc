import { fetchAllCard } from "@/actions/CardCustomerActions";
import { fetchSearchCustomer } from "@/actions/CustomerManagerAction";
import {
  fetchCreateCardCustomer,
  updateCardCustomer,
} from "@/api/service/cardCustomerApis";
import SelectSearchComponent from "@/components/common/AutoComplete";
import DateSiglePicker from "@/components/common/DatePicker";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { NewCardType, NewCardTypeFrorm } from "@/models/CardCustomerModel";
import { RootState } from "@/reducers/rootReducer";
import { getValueWithComma, handleKeyPress } from "@/utils";
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
  handleSearch: () => void;
  rowInfo: any;
}

const ViewCardCustomer = (props: NewCardCustomerProps) => {
  const { isOpen, handleCloseDrawer, handleSearch, rowInfo } = props;
  const { register, handleSubmit, setValue, getValues, watch, reset, control } =
    useForm<NewCardTypeFrorm>({
      defaultValues: {
        customerId: {
          key: "",
          values: "",
        },
        cardTypeId: {
          key: "",
          values: "",
        },
        name: "",
        bank: "",
        accountNumber: "",
        paymentDueDate: "",
        paymentLimit: "",
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
    const {
      bank,
      name,
      accountNumber,
      customerId,
      cardTypeId,
      paymentDueDate,
      paymentLimit,
    } = getValues();

    // const getDate = new Date(paymentDueDate);
    const bodySend = {
      accountNumber: accountNumber,
      bank: bank,
      cardTypeId: cardTypeId.key,
      customerId: customerId.key,
      name: name,
      paymentDueDate: paymentDueDate,
      paymentLimit: parseFloat(paymentLimit.replace(/,/g, "")),
    };
    updateCardCustomer(rowInfo.id, bodySend)
      .then((res) => {
        enqueueSnackbar("Tạo thẻ khách thành công!!", { variant: "success" });
        handleCloseDrawer();

        handleSearch();
      })
      .catch(function (error) {
        enqueueSnackbar("Tạo thẻ khách thất bại !!", { variant: "error" });
      });
  };
  useEffect(() => {
    dispatch(fetchAllCard());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rowInfo) {
      reset({
        customerId: {
          key: rowInfo?.customer.id,
          values: rowInfo?.customer.name,
        },
        cardTypeId: {
          key: rowInfo?.cardType.id,
          values: rowInfo?.cardType.name,
        },
        name: rowInfo?.name,
        bank: rowInfo?.bank,
        accountNumber: rowInfo?.accountNumber,
        paymentDueDate: rowInfo?.paymentDueDate,
        paymentLimit: getValueWithComma(rowInfo?.paymentLimit),
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowInfo]);
  return (
    <DrawerCustom
      widthDrawer={270}
      isOpen={isOpen}
      title="Xem/Sửa thẻ"
      handleClose={handleCloseDrawer}
    >
      <PageContent>
        <form
          onKeyPress={handleKeyPress}
          key={"newCustomerCard"}
          onSubmit={handleSubmit(handleCreateCard)}
        >
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
              onChange={(e: any) => {
                setValue(
                  "accountNumber",
                  e.target.value.trim().replaceAll(/[^0-9]/g, "")
                );
              }}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>
              Mức chi trả tối thiểu
            </LabelComponent>
            <TextFieldCustom
              type={"text"}
              {...register("paymentLimit", { required: true })}
              onChange={(e: any) => {
                setValue(
                  "paymentLimit",
                  getValueWithComma(
                    e.target.value.trim().replaceAll(/[^0-9]/g, "")
                  )
                );
              }}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Hạn thanh toán</LabelComponent>
            <TextFieldCustom
              type="text"
              {...register("paymentDueDate", {
                required: true,
                min: 1,
                max: 31,
              })}
              onChange={(e: any) => {
                const inputValue = e.target.value.trim();
                const isValid = /^(0?[1-9]|[12][0-9]|3[0-1])$/.test(inputValue);
                setValue("paymentDueDate", isValid ? inputValue : "");
              }}
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
            <Button size="small" variant="contained" type="submit">
              Cập nhật
            </Button>
          </Box>
        </form>
      </PageContent>
    </DrawerCustom>
  );
};
export default ViewCardCustomer;

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
