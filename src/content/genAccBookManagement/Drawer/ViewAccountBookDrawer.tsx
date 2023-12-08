import {
  createNewAccountingBook,
  updateDetailAccountingBook,
} from "@/api/service/accountingBook";
import { fetchCreateCardCustomer } from "@/api/service/cardCustomerApis";
import { fetchCreateEmp } from "@/api/service/empManagementApis";
import { fetchBranch, fetchRoles } from "@/api/service/invoiceManagement";
import SelectSearchComponent from "@/components/common/AutoComplete";
import DateSiglePicker from "@/components/common/DatePicker";
import DrawerCustom from "@/components/common/Drawer";
import ImageUpload from "@/components/common/ImageUpload";
import { LabelComponent } from "@/components/common/LabelComponent";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import { TextFieldCustom } from "@/components/common/Textfield";
import { NewUserPrarams, valueForm } from "@/models/EmpManagement";
import { RootState } from "@/reducers/rootReducer";
import { cookieSetting, getDateOfPresent } from "@/utils";
import { Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import styled from "styled-components";

export interface ViewAccountBookProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  rowInfo: any;
}
export const listTranType = [
  { key: "INTAKE", values: "Thu" },
  { key: "PAYOUT", values: "Chi" },
  { key: "LOAN", values: "Công nợ" },
  { key: "REPAYMENT", values: "Thu nợ" },
];
export const ViewAccountBookDrawer = (props: ViewAccountBookProps) => {
  const { isOpen, handleCloseDrawer, rowInfo } = props;
  const [banchList, setBranchList] = useState([]);
  const [roles, setRoles] = useState([]);
  const accEntryType = useSelector(
    (state: RootState) => state.accEntryType.accEntryTypeList
  );
  const branchId = cookieSetting.get("branchId");

  const { register, handleSubmit, setValue, getValues, watch, reset, control } =
    useForm({
      defaultValues: {
        name: "",
        code: "",
        explanation: "",
        moneyAmount: "",
        entryType: {
          key: "",
          values: "",
        },
        transactionType: {
          key: "",
          values: "",
        },
        imageId: "",
      },
    });

  useEffect(() => {
    if (rowInfo) {
      reset({
        name: rowInfo?.name,
        code: rowInfo?.code,
        explanation: rowInfo?.explanation,
        moneyAmount: rowInfo?.moneyAmount,
        entryType: {
          key: rowInfo?.entryType,
          values: rowInfo?.entryType,
        },
        transactionType: {
          key: rowInfo?.transactionType,
          values: listTranType.find(
            (item) => item.key === rowInfo?.transactionType
          )?.values,
        },
        imageId: rowInfo?.imageId,
      });
    }
  }, [rowInfo]);
  const dispatch = useDispatch();
  const handleGetFile = (file: any) => {};

  const handleUpdate = async () => {
    const { name, code, entryType, explanation, transactionType } = getValues();
    const bodySend = {
      entryType: entryType?.key,
      transactionType: transactionType?.key,
      moneyAmount: 1000,
      explanation: explanation,
      branchId: branchId,
      imageId: "",
    };
    updateDetailAccountingBook(rowInfo.id, bodySend)
      .then((res) => {
        enqueueSnackbar("Cập nhật bút toán thành công!!", {
          variant: "success",
        });
        handleCloseDrawer();
        // handleSearch();
      })
      .catch(function (error) {
        enqueueSnackbar("Cập nhật bút toán thất bại", { variant: "error" });
      });
  };
  const getDataCustomerFromApi = (value: string) => {};
  useEffect(() => {
    fetchBranch().then((res) => {
      if (res.data) {
        const branch = res.data.map((item: any) => {
          return {
            values: item?.name,
            keys: item?.id,
          };
        });
        setBranchList(branch);
      }
    });
    fetchRoles().then((res) => {
      if (res.data) {
        const roles = res.data.map((item: any) => {
          return {
            values: item.title,
            keys: item.id,
          };
        });
        setRoles(roles);
      }
    });
  }, []);
  return (
    <DrawerCustom
      widthDrawer={550}
      isOpen={isOpen}
      title="Tạo bút toán"
      handleClose={handleCloseDrawer}
    >
      <PageContent>
        <form style={{ padding: 16 }} onSubmit={handleUpdate}>
          <SearchContainer>
            <StyleContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Phân loại </LabelComponent>
                <SelectSearchComponent
                  control={control}
                  props={{
                    name: "transactionType",
                    placeHoder: "",
                    results: listTranType,
                    label: "",
                    // getData:((value) => setValue("customerName", value)),
                    type: "text",
                    setValue: setValue,
                    labelWidth: "114",
                    getData: getDataCustomerFromApi,
                  }}
                />
              </StyleInputContainer>

              <StyleInputContainer>
                <LabelComponent require={true}>Số tiền</LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  {...register("moneyAmount", { required: true })}
                />
              </StyleInputContainer>
            </StyleContainer>
            <StyleContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Định khoản</LabelComponent>
                <SelectSearchComponent
                  control={control}
                  props={{
                    name: "entryType",
                    placeHoder: "",
                    results: accEntryType,
                    label: "",
                    // getData:((value) => setValue("customerName", value)),
                    type: "text",
                    setValue: setValue,
                    labelWidth: "114",
                    getData: getDataCustomerFromApi,
                  }}
                />
              </StyleInputContainer>
            </StyleContainer>
          </SearchContainer>
          <div>
            <LabelComponent require={true}>Diễn giải</LabelComponent>
            <TextareaComponent
              control={control}
              valueInput={""}
              name={"explanation"}
              label={"Diễn Giải"}
              width={""}
              type={""}
              disable={false}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <ImageUpload handleGetFile={handleGetFile} filePath="" />
          </div>
          <Button
            style={{ position: "fixed", bottom: 50, right: 32 }}
            variant="contained"
            size="medium"
            onClick={() => handleUpdate()}
          >
            Cập nhật
          </Button>
        </form>
      </PageContent>
    </DrawerCustom>
  );
};
export default ViewAccountBookDrawer;
const StyleInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;

const StyleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 96%;
  gap: 30px;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
`;
