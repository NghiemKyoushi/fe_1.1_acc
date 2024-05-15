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
import { fetchInvoice, fetchPos } from "@/actions/InvoiceManagementActions";
import { fetchAccBook, fetchSumAccBook } from "@/actions/AccBookActions";
import { useEffect, useState } from "react";
import { fetchBills, fetchSumBills } from "@/actions/BillManagementActions";
import { handleKeyPress } from "@/utils";

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

const SearchDrawer = (props: SearchDrawerProps) => {
  const { isOpen, handleCloseDrawer, searchCondition, handleChangeSearch } =
    props;
  const listOfCustomer = useSelector(
    (state: RootState) => state.customerManagament.customerList
  );
  const listOfPos = useSelector(
    (state: RootState) => state.invoiceManagement.posList
  );
  const [posList, setPosList] = useState<Array<any>>([]);
  const dispatch = useDispatch();
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
      fromCreatedDate: new Date(previous),
      toCreatedDate: new Date(),
      code: "",
      posCode: {
        key: "",
        values: "",
      },
      fromMoneyAmount: 0,
      toMoneyAmount: 0,
      fromFee: 0,
      toFee: 0,
      fromEstimatedProfit: 0,
      toEstimatedProfit: 0,
      onlyConfirmedBillsWithoutReturnFromBank: false,
    },
  });
  const getDataCustomerFromApi = (value: string) => {
    if (value !== "") {
      // dispatch(fetchSearchCustomer({ customerName: value }));
    }
  };
  const getPosFromApi = (value: string) => {
    dispatch(fetchPos({ posName: value, branchId: "" }));
  };
  useEffect(() => {
    let result = [];
    if (listOfPos.length > 0) {
      result = listOfPos.map((item: any) => {
        return {
          values: item.code,
          key: item.id,
        };
      });
      setPosList(result);
    }
  }, [listOfPos]);
  const handleSearch = () => {
    const {
      fromCreatedDate,
      toCreatedDate,
      code,
      fromMoneyAmount,
      toMoneyAmount,
      fromEstimatedProfit,
      toEstimatedProfit,
      posCode,
      onlyConfirmedBillsWithoutReturnFromBank,
    } = getValues();
    const fromDate = new Date(fromCreatedDate);
    const offsetInMinutes = fromDate.getTimezoneOffset();
    fromDate.setMinutes(fromDate.getMinutes() - offsetInMinutes);

    const gettoDate = new Date(toCreatedDate);
    const toDate = new Date(gettoDate.setDate(gettoDate.getDate() + 1));
    const bodySend = {
      ...searchCondition,
      fromCreatedDate: fromDate.toISOString(),
      toCreatedDate: toDate.toISOString(),
      posCode: posCode?.values,
      code: code,
      fromMoneyAmount: +fromMoneyAmount === 0 ? "" : fromMoneyAmount,
      toMoneyAmount: toMoneyAmount === 0 ? "" : toMoneyAmount,
      fromEstimatedProfit: fromEstimatedProfit === 0 ? "" : fromEstimatedProfit,
      toEstimatedProfit: toEstimatedProfit === 0 ? "" : toEstimatedProfit,
      onlyConfirmedBillsWithoutReturnFromBank:
        onlyConfirmedBillsWithoutReturnFromBank,
    };
    handleChangeSearch(bodySend);
    dispatch(fetchBills(bodySend));
    dispatch(fetchSumBills(bodySend));
  };
  return (
    <DrawerCustom
      widthDrawer={450}
      isOpen={isOpen}
      title="Tìm kiếm nâng cao"
      handleClose={handleCloseDrawer}
    >
      <form onKeyPress={handleKeyPress} onSubmit={handleSubmit(handleSearch)}>
        <PageContent>
          <StyleInputContainer style={{ width: "100%" }}>
            <LabelComponent>Thời gian</LabelComponent>
            <DateRangePicker
              watch={watch}
              setvalue={setValue}
              fromdatename={"fromCreatedDate"}
              todatename={"toCreatedDate"}
            />
          </StyleInputContainer>
          <StyleInputContainer style={{ maxWidth: 273 }}>
            <LabelComponent>Mã bill</LabelComponent>
            <TextFieldCustom
              type={"text"}
              {...register("code")}
              style={{ width: 221 }}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent>Pos</LabelComponent>
            <SelectSearchComponent
              control={control}
              props={{
                name: "posCode",
                placeHoder: "",
                results: posList,
                label: "",
                // getData:((value) => setValue("customerId", value)),
                type: "text",
                setValue: setValue,
                labelWidth: "59",
                getData: getPosFromApi,
              }}
            />
          </StyleInputContainer>
          <StyleCheckBoxTex>
            <Controller
              name="onlyConfirmedBillsWithoutReturnFromBank"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={watch("onlyConfirmedBillsWithoutReturnFromBank")}
                  {...field}
                />
              )}
            />
            <Typography sx={{ fontStyle: "italic", fontSize: 16 }}>
              Bill đã xác nhận nhưng chưa có tiền về
            </Typography>
          </StyleCheckBoxTex>
          <StyleInputContainer>
            <LabelComponent>Tổng giao dịch</LabelComponent>
            <RangeNumberFilter
              setvalue={setValue}
              handleSearch={handleSearch}
              register={register}
              fromNumberName="fromMoneyAmount"
              toNumberName="toMoneyAmount"
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent>Ước tính</LabelComponent>
            <RangeNumberFilter
              setvalue={setValue}
              handleSearch={handleSearch}
              register={register}
              fromNumberName="fromEstimatedProfit"
              toNumberName="toEstimatedProfit"
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
  gap: 4px;
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
