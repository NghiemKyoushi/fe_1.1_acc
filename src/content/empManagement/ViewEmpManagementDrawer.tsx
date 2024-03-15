import { fetchCreateCardCustomer } from "@/api/service/cardCustomerApis";
import {
  fetchCreateEmp,
  fetchUpdateEmp,
} from "@/api/service/empManagementApis";
import { fetchBranch, fetchRoles } from "@/api/service/invoiceManagement";
import SelectSearchComponent from "@/components/common/AutoComplete";
import AutoCompleteMultiple from "@/components/common/AutoCompleteMultiple";
import DateSiglePicker from "@/components/common/DatePicker";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import {
  EditUserPrarams,
  NewUserPrarams,
  valueForm,
} from "@/models/EmpManagement";
import { getDateOfPresent, getValueWithComma, handleKeyPress } from "@/utils";
import { Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import styled from "styled-components";

export interface NEmpManagementDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  handleSearch: () => void;
  rowInfo: any;
}
export const ViewEmpManagementDrawer = (props: NEmpManagementDrawerProps) => {
  const { isOpen, handleCloseDrawer, handleSearch, rowInfo } = props;
  const [branchList, setBranchList] = useState([]);
  const [roles, setRoles] = useState([]);

  const { register, handleSubmit, setValue, getValues, watch, reset, control } =
    useForm<valueForm>({
      defaultValues: useMemo(() => {
        return {
          name: "",
          phoneNumber: "",
          code: "",
          branchIds: [],
          roleIds: {
            keys: "",
            values: "",
          },
          startDate: new Date(),
          email: "",
          salary: "",
          password: "",
          bank: "",
          accountNumber: "",
        };
      }, [rowInfo]),
    });
  useEffect(() => {
    if (rowInfo) {
      const branchFormat = rowInfo?.branches.map((item: any) => {
        return {
          value: item?.name,
          key: item?.id,
        };
      });
      reset({
        name: rowInfo?.name,
        code: rowInfo?.code,
        email: rowInfo?.email,
        salary: getValueWithComma(rowInfo?.salary),
        bank: rowInfo?.bank,
        accountNumber: rowInfo?.accountNumber,
        phoneNumber: rowInfo?.phoneNumber,
        roleIds: {
          keys: rowInfo?.roles[0].id,
          values: rowInfo?.roles[0].title,
        },
        branchIds: branchFormat,
        accountBalance: getValueWithComma(rowInfo?.accountBalance),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowInfo]);
  const dispatch = useDispatch();
  const getValueBranch = (value: string) => {};
  const handleCreateUser = () => {
    const {
      name,
      branchIds,
      code,
      phoneNumber,
      roleIds,
      startDate,
      password,
      email,
      salary,
      accountNumber,
      bank,
    } = getValues();
    let arrBranchId: any[] = [];
    if (branchIds) {
      arrBranchId = branchIds.map((item) => {
        return item.key;
      });
    }
    const bodySend: EditUserPrarams = {
      name: name,
      code: code,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      salary: salary?.replaceAll(",", ""),
      bank: bank,
      accountNumber: accountNumber,
      roleIds: [roleIds?.keys],
      branchIds: arrBranchId ? arrBranchId : [],
    };
    fetchUpdateEmp(rowInfo.id, bodySend)
      .then((res) => {
        enqueueSnackbar("Cập nhật nhân viên thành công!!", {
          variant: "success",
        });
        handleCloseDrawer();
        handleSearch();
      })
      .catch(function (error) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Cập nhật nhân viên thất bại", { variant: "error" });
        }
      });
  };
  const getDataCustomerFromApi = (value: string) => {};
  useEffect(() => {
    fetchBranch().then((res) => {
      if (res.data) {
        const branch = res.data.map((item: any) => {
          return {
            value: item?.name,
            key: item?.id,
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
      title="Xem/Sửa Nhân viên"
      handleClose={handleCloseDrawer}
    >
      <PageContent>
        <form
          onKeyPress={handleKeyPress}
          style={{ padding: 16 }}
          onSubmit={handleCreateUser}
        >
          <SearchContainer>
            <StyleContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Họ và tên </LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  {...register("name", { required: true })}
                />
              </StyleInputContainer>

              <StyleInputContainer>
                <LabelComponent require={true}>Số điện thoại </LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  {...register("phoneNumber", { required: true })}
                  onChange={(e: any) => {
                    setValue(
                      "phoneNumber",
                      e.target.value.trim().replaceAll(/[^0-9]/g, "")
                    );
                  }}
                />
              </StyleInputContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Chi nhánh</LabelComponent>
                <AutoCompleteMultiple
                  control={control}
                  props={{
                    name: "branchIds",
                    placeHoder: "",
                    results: branchList,
                    label: "",
                    type: "text",
                    setValue: setValue,
                    labelWidth: "114",
                    getData: getValueBranch,
                  }}
                />
              </StyleInputContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>
                  Ngày bắt đầu làm việc{" "}
                </LabelComponent>
                <DateSiglePicker
                  props={{ name: "startDate", setValue: setValue }}
                  control={control}
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
                <LabelComponent require={true}>Số dư tài khoản</LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  disable="true"
                  iconend={<p style={{ width: 24 }}>VND</p>}
                  {...register("accountBalance", { required: true })}
                />
              </StyleInputContainer>
            </StyleContainer>
            <StyleContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Mã nhân viên</LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  {...register("code", { required: true })}
                  onChange={(e: any) => {
                    let value = e.target.value;
                    let replaced = value.replace(
                      /[a-z]/g,
                      function (match: any) {
                        return match.toUpperCase();
                      }
                    );
                    setValue("code", replaced);
                  }}
                />
              </StyleInputContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Email </LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  {...register("email", { required: true })}
                />
              </StyleInputContainer>

              <StyleInputContainer>
                <LabelComponent require={true}>Chức vụ</LabelComponent>
                <SelectSearchComponent
                  control={control}
                  props={{
                    name: "roleIds",
                    placeHoder: "",
                    results: roles,
                    label: "",
                    type: "text",
                    setValue: setValue,
                    labelWidth: "114",
                    getData: getDataCustomerFromApi,
                  }}
                />
              </StyleInputContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Lương tháng </LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  {...register("salary", { required: true })}
                  onChange={(e: any) => {
                    setValue(
                      "salary",
                      getValueWithComma(
                        e.target.value.trim().replaceAll(/[^0-9]/g, "")
                      )
                    );
                  }}
                />
              </StyleInputContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Số tài khoản</LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  {...register("accountNumber", { required: true })}
                />
              </StyleInputContainer>
            </StyleContainer>
          </SearchContainer>
          <Button
            style={{ position: "fixed", bottom: 50, right: 32 }}
            variant="contained"
            size="medium"
            onClick={() => handleCreateUser()}
          >
            Xác nhận
          </Button>
        </form>
      </PageContent>
    </DrawerCustom>
  );
};
export default ViewEmpManagementDrawer;
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
  gap: 64px;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
`;
