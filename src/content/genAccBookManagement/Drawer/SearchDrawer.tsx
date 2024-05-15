import SelectSearchComponent from "@/components/common/AutoComplete";
import { DateRangePicker } from "@/components/common/DatePickerComponent";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { RootState } from "@/reducers/rootReducer";
import {
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  useForm,
} from "react-hook-form";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchInvoice } from "@/actions/InvoiceManagementActions";
import { listTranType } from "./NewAccountBookDrawer";
import { fetchAccBook, fetchSumAccBook } from "@/actions/AccBookActions";
import {
  fetchGenAccBook,
  fetchGenSumAccBook,
} from "@/actions/GenAccBookActions";
import { formatDate, getDateOfPresent, handleKeyPress } from "@/utils";
import { RangeNumberFilter } from "@/content/accBookManagement/Drawer/SearchDrawer";
import _ from "lodash";

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
const date = new Date();
const previous = new Date(date.getTime());
previous.setDate(date.getDate() - 30);
const offsetInMinutes = previous.getTimezoneOffset();
previous.setMinutes(previous.getMinutes() - offsetInMinutes);
const dateNext = new Date();
const nextDay = new Date(dateNext.getTime());
nextDay.setDate(dateNext.getDate());
const offsetInMinutes2 = nextDay.getTimezoneOffset();
nextDay.setMinutes(nextDay.getMinutes() - offsetInMinutes2);

const SearchDrawer = (props: SearchDrawerProps) => {
  const { isOpen, handleCloseDrawer, searchCondition, handleChangeSearch } =
    props;
  // const listOfCustomer = useSelector(
  //   (state: RootState) => state.customerManagament.customerList
  // );
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
      codeInvoice: "",
      fromCreatedDate: formatDate(previous.getTime()),
      toCreatedDate: getDateOfPresent(),
      fromTransactionTotal: "",
      toTransactionTotal: "",
      entryCode: "",
      entryType: "",
      transactionTypes: {
        key: "",
        values: "",
      },
    },
  });
  const getDataCustomerFromApi = (value: string) => {
    if (value !== "") {
      // dispatch(fetchSearchCustomer({ customerName: value }));
    }
  };
  const handleSearch = () => {
    const {
      fromCreatedDate,
      toCreatedDate,
      entryCode,
      entryType,
      toTransactionTotal,
      fromTransactionTotal,
      transactionTypes,
    } = getValues();
    let arr: any[] = [];
    if (transactionTypes.key !== "") {
      arr.push(transactionTypes.key);
    }
    const fromDate = new Date(fromCreatedDate);
    const offsetInMinutes = fromDate.getTimezoneOffset();
    fromDate.setMinutes(fromDate.getMinutes() - offsetInMinutes);

    const gettoDate = new Date(toCreatedDate);
    const toDate = new Date(gettoDate.setDate(gettoDate.getDate()));

    const bodySend = {
      ...searchCondition,
      entryCode: entryCode,
      transactionTypes: transactionTypes.key,
      fromTransactionTotal:
        fromTransactionTotal === "0" || fromTransactionTotal === "0"
          ? ""
          : _.toNumber(fromTransactionTotal.toString().replaceAll(",", "")),
      toTransactionTotal:
        toTransactionTotal === "0" || toTransactionTotal === "0"
          ? ""
          : _.toNumber(toTransactionTotal.toString().replaceAll(",", "")),
      fromCreatedDate: fromDate.toISOString(),
      toCreatedDate: toDate.toISOString(),
    };
    handleChangeSearch(bodySend);
    dispatch(fetchGenAccBook(bodySend));
    dispatch(fetchGenSumAccBook(bodySend));
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
            <LabelComponent require={true}>Thời gian</LabelComponent>
            <DateRangePicker
              setvalue={setValue}
              fromdatename={"fromCreatedDate"}
              todatename={"toCreatedDate"}
            />
          </StyleInputContainer>
          <StyleInputContainer style={{ maxWidth: 273 }}>
            <LabelComponent require={true}>Mã bút toán</LabelComponent>
            <TextFieldCustom
              type={"text"}
              {...register("entryCode")}
              style={{ width: 221 }}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Loại giao dịch</LabelComponent>
            <SelectSearchComponent
              control={control}
              props={{
                name: "transactionTypes",
                placeHoder: "",
                results: listTranType,
                label: "",
                // getData:((value) => setValue("customerId", value)),
                type: "text",
                setValue: setValue,
                labelWidth: "59",
                getData: getDataCustomerFromApi,
              }}
            />
          </StyleInputContainer>
          <StyleInputContainer>
            <LabelComponent require={true}>Số tiền</LabelComponent>
            <RangeNumberFilter
              setvalue={setValue}
              handleSearch={handleSearch}
              register={register}
              fromNumberName="fromTransactionTotal"
              toNumberName="toTransactionTotal"
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
