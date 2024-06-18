import { getAccEntryApis } from "@/api/service/accEntryType";
import {
  createNewAccountingBook,
  updateDetailAccountingBook,
} from "@/api/service/accountingBook";
import { fetchCreateCardCustomer } from "@/api/service/cardCustomerApis";
import { fetchCreateEmp } from "@/api/service/empManagementApis";
import { updateDetailGenAccountingBook } from "@/api/service/genAccountingBook";
import {
  fetchBranch,
  fetchImagePath,
  fetchRoles,
  fetchSaveImage,
} from "@/api/service/invoiceManagement";
import SelectSearchComponent from "@/components/common/AutoComplete";
import DateSiglePicker from "@/components/common/DatePicker";
import DrawerCustom from "@/components/common/Drawer";
import ImageUpload from "@/components/common/ImageUpload";
import { LabelComponent } from "@/components/common/LabelComponent";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import { TextFieldCustom } from "@/components/common/Textfield";
import { AccEntryDetail } from "@/content/accBookManagement/Drawer/NewAccountBookDrawer";
import { NewUserPrarams, valueForm } from "@/models/EmpManagement";
import { RootState } from "@/reducers/rootReducer";
import {
  ROLE,
  cookieSetting,
  getDateOfPresent,
  getValueWithComma,
  handleKeyPress,
} from "@/utils";
import { Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import styled from "styled-components";

export interface ViewAccountBookProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  rowInfo: any;
  handleSearch: () => void;
}
export const listTranType = [
  { key: "INTAKE", values: "Thu" },
  { key: "PAYOUT", values: "Chi" },
  { key: "LOAN", values: "Công nợ" },
  { key: "REPAYMENT", values: "Thu nợ" },
];
export const ViewAccountBookDrawer = (props: ViewAccountBookProps) => {
  const { isOpen, handleCloseDrawer, handleSearch, rowInfo } = props;
  const [banchList, setBranchList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [accEntryList, setAccEntryList] = useState<Array<AccEntryDetail>>([]);
  const [role, setRole] = useState<string | undefined>("");

  useEffect(() => {
    setRole(cookieSetting.get("roles"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieSetting.get("roles")]);
  const accEntryType = useSelector(
    (state: RootState) => state.accEntryType.accEntryTypeList
  );
  const branchId = cookieSetting.get("branchId");
  const [imageId, setImageId] = useState("");

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
  const getPathImage = async (id: string) => {
    const getFile = await fetchImagePath(id);
    return getFile;
  };
  useEffect(() => {
    if (rowInfo) {
      if (rowInfo?.imageId !== "") {
        getPathImage(rowInfo.imageId).then((res) => {
          URL.createObjectURL(res.data);
          setImagePath(URL.createObjectURL(res.data));
        });
      }
      setImageId(rowInfo?.imageId);
      reset({
        name: rowInfo?.name,
        code: rowInfo?.code,
        explanation: rowInfo?.explanation,
        moneyAmount: getValueWithComma(rowInfo?.moneyAmount),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowInfo]);
  const dispatch = useDispatch();
  const handleGetFile = (file: any) => {
    if (!file || file[0].size > 5 * 1024 * 1024) {
      enqueueSnackbar("File ảnh phải nhỏ hơn 5MB", { variant: "error" });
      return;
    }
    fetchSaveImage(imageId, file[0])
      .then((res) => {
        setImageId(res.data);
      })
      .catch(function (error) {
        enqueueSnackbar("Load ảnh thất bại", { variant: "error" });
      });
  };
  const handleUpdate = async () => {
    const { entryType, moneyAmount, explanation, transactionType } =
      getValues();
    const bodySend = {
      entryType: entryType?.key,
      transactionType: transactionType?.key,
      moneyAmount: parseFloat(moneyAmount.replace(/,/g, "")),
      explanation: explanation,
      branchId: branchId,
      imageId: imageId,
    };
    updateDetailGenAccountingBook(rowInfo.id, bodySend)
      .then((res) => {
        enqueueSnackbar("Cập nhật bút toán thành công!!", {
          variant: "success",
        });
        handleCloseDrawer();
        handleSearch();
      })
      .catch(function (error) {
        enqueueSnackbar("Cập nhật bút toán thất bại", { variant: "error" });
      });
  };
  const getDataCustomerFromApi = (value: string) => {};
  const getDataEntryType = (value: string) => {
    getAccEntryApis(value, watch("transactionType.key"))
      .then((res) => {
        if (res.data) {
          let arr: AccEntryDetail[] = [];
          res.data.map((item: string) => {
            arr.push({
              key: item,
              values: item,
            });
          });
          setAccEntryList([...arr]);
        }
      })
      .catch(function (error) {});
  };
  useMemo(() => {
    if (watch("transactionType.key") === "") {
      setAccEntryList([]);
      setValue("entryType", { key: "", values: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("transactionType")]);
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
      title="Xem/Cập nhật bút toán"
      handleClose={handleCloseDrawer}
    >
      <PageContent>
        <form
          onKeyPress={handleKeyPress}
          style={{ padding: 16 }}
          onSubmit={handleUpdate}
        >
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
                  onChange={(e: any) => {
                    setValue(
                      "moneyAmount",
                      getValueWithComma(
                        e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                      )
                    );
                  }}
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
                    results: accEntryList,
                    disable: watch("transactionType").key === "" ? true : false,
                    label: "",
                    type: "text",
                    setValue: setValue,
                    labelWidth: "114",
                    getData: getDataEntryType,
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
            <ImageUpload handleGetFile={handleGetFile} filePath={imagePath} />
          </div>
          {rowInfo?.entryCode === null && role !== ROLE.VIEWER && (
            <Button
              style={{ position: "fixed", bottom: 50, right: 32 }}
              variant="contained"
              size="medium"
              onClick={() => handleUpdate()}
            >
              Cập nhật
            </Button>
          )}
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
