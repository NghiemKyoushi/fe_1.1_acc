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

export interface SearchDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
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
previous.setDate(date.getDate() - 7);
const offsetInMinutes = previous.getTimezoneOffset();
previous.setMinutes(previous.getMinutes() - offsetInMinutes);
const dateNext = new Date();
const nextDay = new Date(dateNext.getTime());
nextDay.setDate(dateNext.getDate() + 1);
const offsetInMinutes2 = nextDay.getTimezoneOffset();
nextDay.setMinutes(nextDay.getMinutes() - offsetInMinutes2);

const SearchDrawer = (props: SearchDrawerProps) => {
  const { isOpen, handleCloseDrawer } = props;
  const listOfCustomer = useSelector(
    (state: RootState) => state.customerManagament.customerList
  );
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
      fromCreatedDate: new Date(previous),
      toCreatedDate: new Date(),
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
  console.log("watch", watch());
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
    console.log("fromDate", fromCreatedDate);

    const offsetInMinutes = fromDate.getTimezoneOffset();
    fromDate.setMinutes(fromDate.getMinutes() - offsetInMinutes);

    const gettoDate = new Date(toCreatedDate);
    const toDate = new Date(gettoDate.setDate(gettoDate.getDate() + 1));

    const bodySend = {
      page: 0,
      pageSize: 10,
      sorter: "createdDate",
      sortDirection: "DESC",
      entryCode: entryCode,
      transactionTypes: arr,
      fromTransactionTotal: fromTransactionTotal,
      toTransactionTotal: toTransactionTotal,
      fromCreatedDate: fromDate.toISOString(),
      toCreatedDate: toDate.toISOString(),
    };
    dispatch(fetchAccBook(bodySend));
    dispatch(fetchSumAccBook(bodySend));
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
