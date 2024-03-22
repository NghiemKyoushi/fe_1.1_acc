import SelectSearchComponent from "@/components/common/AutoComplete";
import { DateRangePicker } from "@/components/common/DatePickerComponent";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { RootState } from "@/reducers/rootReducer";
import {
  Controller,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  useForm,
} from "react-hook-form";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Button, Checkbox, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  fetchInvoice,
  fetchSumInvoice,
} from "@/actions/InvoiceManagementActions";
import {
  fetchCardCustomer,
  fetchListCardCustomer,
} from "@/actions/CardCustomerActions";
import { useEffect, useMemo, useState } from "react";
import {
  cookieSetting,
  formatDate,
  getDateOfPresent,
  getValueWithComma,
} from "@/utils";
import { fetchSearchCustomer } from "@/actions/CustomerManagerAction";
import _ from "lodash";

const date = new Date();
const previous = new Date(date.getTime());
previous.setDate(date.getDate() - 30);
const offsetInMinutes = previous.getTimezoneOffset();
previous.setMinutes(previous.getMinutes() - offsetInMinutes);
const dateNext = new Date();
const nextDay = new Date(dateNext.getTime());
nextDay.setDate(dateNext.getDate() + 1);
const offsetInMinutes2 = nextDay.getTimezoneOffset();
nextDay.setMinutes(nextDay.getMinutes() - offsetInMinutes2);

export interface SearchDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  searchCondition: any;
  handleChangeSearch: (value: any) => void;
}
export interface RangeNumberFilterProps<
  TFieldValues extends FieldValues = FieldValues
> {
  fromNumberName: string;
  toNumberName: string;
  register: UseFormRegister<any>;
  handleSearch: () => void;
  setvalue: UseFormSetValue<any>;
}
export const RangeNumberFilter = (props: RangeNumberFilterProps) => {
  const { fromNumberName, toNumberName, register, handleSearch, setvalue } =
    props;
  return (
    <>
      <StyleRangeFilter>
        <StyleFilterContainer>
          <StyleTitleSearch>Từ</StyleTitleSearch>
          <TextFieldCustom
            type={"text"}
            variantshow="outlined"
            textholder="Lọc giá trị"
            {...register(fromNumberName)}
            onChange={(e: any) => {
              setvalue(
                fromNumberName,
                getValueWithComma(
                  e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                )
              );
            }}
          />
        </StyleFilterContainer>
        <StyleFilterContainer>
          <StyleTitleSearch>Đến</StyleTitleSearch>
          <TextFieldCustom
            type={"text"}
            variantshow="outlined"
            textholder="Lọc giá trị"
            {...register(toNumberName)}
            onChange={(e: any) => {
              setvalue(
                toNumberName,
                getValueWithComma(
                  e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                )
              );
            }}
          />
        </StyleFilterContainer>
      </StyleRangeFilter>
    </>
  );
};
const SearchDrawer = (props: SearchDrawerProps) => {
  const { isOpen, handleCloseDrawer, searchCondition, handleChangeSearch } =
    props;
  const listOfCardCustomer = useSelector(
    (state: RootState) => state.cardCustomer.cardCustomerList
  );
  const cardType = useSelector(
    (state: RootState) => state.cardCustomer.cardType
  );
  const dispatch = useDispatch();
  const employeeId = cookieSetting.get("employeeId");
  const listOfCustomer = useSelector(
    (state: RootState) => state.customerManagament.customerList
  );
  // useMemo(() => {
  //   if (listOfCardCustomer) {
  //     const listArr: any = [];
  //     listOfCardCustomer.map((item: any) => {
  //       listArr.push({
  //         key: item?.id,
  //         values: item?.name,
  //       });
  //     });
  //     setCardType(listArr);
  //   }
  // }, [listOfCardCustomer]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
    getValues,
  } = useForm({
    defaultValues: {
      codeInvoice: "",
      fromCreatedDate: formatDate(previous.getTime()),
      toCreatedDate: getDateOfPresent(),
      fromTransactionTotal: "",
      toTransactionTotal: "",
      fromIntake: "",
      fromEstimatedProfit: "",
      fromLoan: "",
      fromPayout: "",
      fromRepayment: "",
      toEstimatedProfit: "",
      toIntake: "",
      toLoan: "",
      toPayout: "",
      toRepayment: "",
      receiptCode: "",
      cardCustomer: {
        key: "",
        values: "",
      },
      customerName: {
        key: "",
        values: "",
        nationalId: "",
      },
      isSearchCardTrading: false,
    },
  });
  const handleGetCard = (value: string) => {};

  const handleSearch = () => {
    const {
      fromEstimatedProfit,
      toEstimatedProfit,
      fromIntake,
      toIntake,
      fromLoan,
      toLoan,
      fromPayout,
      toPayout,
      fromRepayment,
      toRepayment,
      fromTransactionTotal,
      toTransactionTotal,
      receiptCode,
      fromCreatedDate,
      toCreatedDate,
      cardCustomer,
      isSearchCardTrading,
      customerName,
    } = getValues();

    // const fromDate = new Date(fromCreatedDate);
    // const toDate = new Date(toCreatedDate);
    const fromDate = new Date(fromCreatedDate);
    const offsetInMinutes = fromDate.getTimezoneOffset();
    fromDate.setMinutes(fromDate.getMinutes() - offsetInMinutes);

    const gettoDate = new Date(toCreatedDate);
    const toDate = new Date(gettoDate.setDate(gettoDate.getDate() + 1));

    const offsetInMinutes2 = toDate.getTimezoneOffset();
    toDate.setMinutes(toDate.getMinutes() - offsetInMinutes2);
    const bodySend = {
      ...searchCondition,
      receiptCode: receiptCode,
      fromTransactionTotal:
        fromTransactionTotal === "0" || fromTransactionTotal === "0"
          ? ""
          : _.toNumber(fromTransactionTotal.toString().replace(",", "")),
      toTransactionTotal:
        toTransactionTotal === "" || toTransactionTotal === "0"
          ? ""
          : _.toNumber(toTransactionTotal.toString().replace(",", "")),
      fromIntake:
        fromIntake === "" || fromIntake === "0"
          ? ""
          : _.toNumber(fromIntake.toString().replace(",", "")),
      fromEstimatedProfit:
        fromEstimatedProfit === "" || fromEstimatedProfit === "0"
          ? ""
          : _.toNumber(fromEstimatedProfit.toString().replace(",", "")),
      fromLoan:
        fromLoan === "" || fromLoan === "0"
          ? ""
          : _.toNumber(fromLoan.toString().replace(",", "")),
      fromPayout:
        fromPayout === "" || fromPayout === "0"
          ? ""
          : _.toNumber(fromPayout.toString().replace(",", "")),
      fromRepayment:
        fromRepayment === "" || fromRepayment === "0"
          ? ""
          : _.toNumber(fromRepayment.toString().replace(",", "")),
      toEstimatedProfit:
        toEstimatedProfit === "" || toEstimatedProfit === "0"
          ? ""
          : _.toNumber(toEstimatedProfit.toString().replace(",", "")),
      toIntake:
        toIntake === "" || toIntake === "0"
          ? ""
          : _.toNumber(toIntake.toString().replace(",", "")),
      toLoan:
        toLoan === "" || toLoan === "0" ? "" : _.toNumber(toLoan.toString().replace(",", "")),
      toPayout:
        toPayout === "" || toPayout === "0"
          ? ""
          : _.toNumber(toPayout.toString().replace(",", "")),
      toRepayment:
        toRepayment === "" || toRepayment === "0"
          ? ""
          : _.toNumber(toRepayment.toString().replace(",", "")),
      fromCreatedDate: fromDate.toISOString(),
      toCreatedDate: toDate.toISOString(),
      customerCardId: cardCustomer.key,
      employeeId: "",
      customerName: customerName.values,
      receiptStatusList:
        watch("cardCustomer.key") !== "" && isSearchCardTrading === true
          ? ["COMPLETED", "LOANED"]
          : null,
    };

    handleChangeSearch(bodySend);
    dispatch(fetchInvoice(bodySend));
    dispatch(fetchSumInvoice(bodySend));
  };
  useEffect(() => {
    if (watch("customerName")?.key) {
      dispatch(fetchCardCustomer({ customerId: watch("customerName")?.key }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("customerName")]);
  const getDataCustomerFromApi = (value: string) => {
    if (value !== "") {
      dispatch(fetchSearchCustomer({ customerName: value }));
    }
  };
  return (
    <DrawerCustom
      widthDrawer={450}
      isOpen={isOpen}
      title="Tìm kiếm nâng cao"
      handleClose={handleCloseDrawer}
    >
      <form onSubmit={handleSubmit(handleSearch)}>
        <PageContent>
          <StyleInputContainer style={{ width: "100%" }}>
            <LabelComponent require={true}>Thời gian</LabelComponent>
            <DateRangePicker
              setvalue={setValue}
              fromdatename={"fromCreatedDate"}
              todatename={"toCreatedDate"}
            />
          </StyleInputContainer>
          <StyleInputContainer style={{ maxWidth: 240 }}>
            <LabelComponent require={true}>Mã hóa đơn</LabelComponent>
            <TextFieldCustom type={"text"} {...register("receiptCode")} />
          </StyleInputContainer>
          <StyleInputContainer style={{ maxWidth: 273 }}>
            <LabelComponent require={true}>Tên Khách Hàng</LabelComponent>
            <SelectSearchComponent
              control={control}
              props={{
                name: "customerName",
                placeHoder: "",
                results: listOfCustomer,
                label: "",
                type: "text",
                setValue: setValue,
                labelWidth: "100",
                getData: getDataCustomerFromApi,
              }}
            />
          </StyleInputContainer>
          <StyleInputContainer style={{ maxWidth: 273 }}>
            <LabelComponent require={true}>Tên Thẻ</LabelComponent>
            <SelectSearchComponent
              control={control}
              props={{
                name: "cardCustomer",
                placeHoder: "",
                results: cardType,
                label: "",
                type: "text",
                setValue: setValue,
                labelWidth: "100",
                getData: handleGetCard,
              }}
            />
          </StyleInputContainer>
          <StyleCheckBoxTex>
            <Controller
              name="isSearchCardTrading"
              control={control}
              render={({ field }) => (
                <Checkbox
                  disabled={watch("cardCustomer").key !== "" ? false : true}
                  checked={watch("isSearchCardTrading")}
                  {...field}
                />
              )}
            />
            <Typography sx={{ fontStyle: "italic", fontSize: 16 }}>
              Tra cứu giao dịch thẻ
            </Typography>
          </StyleCheckBoxTex>
          <StyleInputContainer>
            <LabelComponent require={true}>Tổng giao dịch</LabelComponent>
            <RangeNumberFilter
              setvalue={setValue}
              handleSearch={handleSearch}
              register={register}
              fromNumberName="fromTransactionTotal"
              toNumberName="toTransactionTotal"
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Thu</LabelComponent>
            <RangeNumberFilter
              setvalue={setValue}
              handleSearch={handleSearch}
              register={register}
              fromNumberName="fromIntake"
              toNumberName="toIntake"
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Chi</LabelComponent>
            <RangeNumberFilter
              setvalue={setValue}
              handleSearch={handleSearch}
              register={register}
              fromNumberName="fromPayout"
              toNumberName="toPayout"
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Công nợ</LabelComponent>
            <RangeNumberFilter
              setvalue={setValue}
              handleSearch={handleSearch}
              register={register}
              fromNumberName="fromLoan"
              toNumberName="toLoan"
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Thu nợ</LabelComponent>
            <RangeNumberFilter
              setvalue={setValue}
              handleSearch={handleSearch}
              register={register}
              fromNumberName="fromRepayment"
              toNumberName="torePayment"
            />
          </StyleInputContainer>
          <div>
            <Button
              style={{ marginTop: 20 }}
              variant="contained"
              size="small"
              type="submit"
            >
              Tìm kiếm
            </Button>
          </div>
        </PageContent>
      </form>
    </DrawerCustom>
  );
};
export default SearchDrawer;
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

const StyleFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyleRangeFilter = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
`;
const StyleTitleSearch = styled.p`
  font-size: 12px;
  font-weight: 400px;
  margin: 0.5px;
`;
const StyleCheckBoxTex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
