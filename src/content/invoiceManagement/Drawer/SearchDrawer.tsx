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
import { fetchInvoice } from "@/actions/InvoiceManagementActions";
import {
  fetchCardCustomer,
  fetchListCardCustomer,
} from "@/actions/CardCustomerActions";
import { useEffect, useMemo, useState } from "react";
import { cookieSetting } from "@/utils";

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
                e.target.value.trim().replaceAll(/[^0-9]/g, "")
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
                e.target.value.trim().replaceAll(/[^0-9]/g, "")
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
  const [cardType, setCardType] = useState([]);
  const dispatch = useDispatch();
  const employeeId = cookieSetting.get("employeeId");

  useMemo(() => {
    if (listOfCardCustomer) {
      const listArr: any = [];
      listOfCardCustomer.map((item: any) => {
        listArr.push({
          key: item?.id,
          values: item?.name,
        });
      });
      setCardType(listArr);
    }
  }, [listOfCardCustomer]);
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
      fromCreatedDate: new Date(),
      toCreatedDate: new Date(),
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
      isSearchCardTrading: false,
    },
  });
  const handleGetCard = (value: string) => {
    if (value !== "") {
      dispatch(
        fetchListCardCustomer({
          page: 0,
          pageSize: 10,
          sorter: "name",
          sortDirection: "DESC",
          name: value,
        })
      );
    }
  };

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
    } = getValues();

    const fromDate = new Date(fromCreatedDate);
    const toDate = new Date(toCreatedDate);

    const bodySend = {
      ...searchCondition,
      receiptCode: receiptCode,
      fromTransactionTotal: fromTransactionTotal,
      toTransactionTotal: toTransactionTotal,
      fromIntake: fromIntake,
      fromEstimatedProfit: fromEstimatedProfit,
      fromLoan: fromLoan,
      fromPayout: fromPayout,
      fromRepayment: fromRepayment,
      toEstimatedProfit: toEstimatedProfit,
      toIntake: toIntake,
      toLoan: toLoan,
      toPayout: toPayout,
      toRepayment: toRepayment,
      fromCreatedDate: fromDate.toISOString(),
      toCreatedDate: toDate.toISOString(),
      customerCardId: cardCustomer.key,
      employeeId: isSearchCardTrading ? null : employeeId,
    };
    handleChangeSearch(bodySend);
    dispatch(fetchInvoice(bodySend));
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
          <StyleInputContainer style={{ maxWidth: 273 }}>
            <LabelComponent require={true}>Mã hóa đơn</LabelComponent>
            <TextFieldCustom type={"text"} {...register("receiptCode")} />
          </StyleInputContainer>
          <StyleInputContainer style={{ maxWidth: 273 }}>
            <LabelComponent require={true}>Thẻ khách</LabelComponent>
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
            />{" "}
          </StyleInputContainer>
          <StyleCheckBoxTex>
            <Controller
              name="isSearchCardTrading"
              control={control}
              render={({ field }) => (
                <Checkbox
                  disabled={watch("cardCustomer.key") !== "" ? false : true}
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
