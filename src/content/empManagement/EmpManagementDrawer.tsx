import { fetchCreateCardCustomer } from "@/api/service/cardCustomerApis";
import { fetchCreateEmp } from "@/api/service/empManagementApis";
import { fetchBranch, fetchRoles } from "@/api/service/invoiceManagement";
import SelectSearchComponent from "@/components/common/AutoComplete";
import DateSiglePicker from "@/components/common/DatePicker";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { NewUserPrarams, valueForm } from "@/models/EmpManagement";
import { getDateOfPresent, handleKeyPress } from "@/utils";
import { Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import styled from "styled-components";

export interface NEmpManagementDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  handleSearch: () => void;
}
export const EmpManagementDrawer = (props: NEmpManagementDrawerProps) => {
  const { isOpen, handleCloseDrawer, handleSearch } = props;
  const [banchList, setBranchList] = useState([]);
  const [roles, setRoles] = useState([]);

  const { register, handleSubmit, setValue, getValues, watch, reset, control } =
    useForm<valueForm>({
      defaultValues: {
        name: "",
        phoneNumber: "",
        code: "",
        branchIds: {
          keys: "",
          values: "",
        },
        roleIds: {
          keys: "",
          values: "",
        },
        startDate: new Date(),
        email: "",
        salary: "",
        password: "",
      },
    });
  const dispatch = useDispatch();

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
    } = getValues();
    const bodySend: NewUserPrarams = {
      name: name,
      code: code,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      roleIds: roleIds?.keys ? [roleIds?.keys] : [],
      branchIds: branchIds?.keys ? [branchIds?.keys] : [],
    };
    fetchCreateEmp(bodySend)
      .then((res) => {
        enqueueSnackbar("Tạo thẻ mới thành công!!", { variant: "success" });
        handleCloseDrawer();
        handleSearch();
      })
      .catch(function (error) {
        // enqueueSnackbar("Tạo thẻ mới thất bại", { variant: "error" });
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Tạo thẻ mới thất bại", { variant: "error" });
        }
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
      title="Tạo Nhân viên"
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
                />
              </StyleInputContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Chi nhánh</LabelComponent>
                <SelectSearchComponent
                  control={control}
                  props={{
                    name: "branchIds",
                    placeHoder: "",
                    results: banchList,
                    label: "",
                    type: "text",
                    setValue: setValue,
                    labelWidth: "112",
                    getData: getDataCustomerFromApi,
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
                <LabelComponent require={true}>Mật khẩu </LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  {...register("password", { required: true })}
                />
              </StyleInputContainer>
            </StyleContainer>
            <StyleContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Mã nhân viên</LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  {...register("code", { required: true })}
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
                    // getData:((value) => setValue("customerName", value)),
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
            Thêm nhân viên
          </Button>
        </form>
      </PageContent>
    </DrawerCustom>
  );
};
export default EmpManagementDrawer;
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
  gap: 30px;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
`;
