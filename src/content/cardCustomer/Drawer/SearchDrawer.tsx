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
import { fetchInvoice, fetchPos } from "@/actions/InvoiceManagementActions";
import { fetchAccBook, fetchSumAccBook } from "@/actions/AccBookActions";
import { useEffect, useState } from "react";
import { fetchBills, fetchSumBills } from "@/actions/BillManagementActions";
import { handleKeyPress } from "@/utils";
import { fetchSearchCustomer } from "@/actions/CustomerManagerAction";
import { fetchListCardCustomer } from "@/actions/CardCustomerActions";

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
      accountNumber: 0,
      customerName: {
        key: "",
        values: "",
      },
    },
  });
  const getDataCustomerFromApi = (value: string) => {
    if (value !== "") {
      dispatch(fetchSearchCustomer({ customerName: value }));
    }
  };
  const getPosFromApi = (value: string) => {
    dispatch(fetchPos({ posName: value }));
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
    const { accountNumber, customerName } = getValues();
    const bodySend = {
      ...searchCondition,
      accountNumber: accountNumber,
      customerName: customerName.values,
    };
    handleChangeSearch(bodySend);
    dispatch(fetchListCardCustomer(bodySend));

  };
  return (
    <DrawerCustom
      widthDrawer={320}
      isOpen={isOpen}
      title="Tìm kiếm nâng cao"
      handleClose={handleCloseDrawer}
    >
      <form
        style={{ padding: 14 }}
        onKeyPress={handleKeyPress}
        onSubmit={handleSubmit(handleSearch)}
      >
        <PageContent>
          <StyleInputContainer>
            <LabelComponent require={true}>Thẻ khách</LabelComponent>
            <SelectSearchComponent
              control={control}
              props={{
                name: "customerName",
                placeHoder: "Tìm theo tên khách",
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
            <LabelComponent require={true}>Số thẻ</LabelComponent>
            <TextFieldCustom
              textholder="Tìm theo số thẻ"
              {...register("accountNumber")}
              onChange={(e: any) => {
                setValue(
                  "accountNumber",
                  e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                );
              }}
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
