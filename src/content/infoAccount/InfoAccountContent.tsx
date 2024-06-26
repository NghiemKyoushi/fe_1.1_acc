"use client";
import { fetchDetailEmp } from "@/api/service/empManagementApis";
import Dashboard from "@/components/Layout";
import SelectSearchComponent from "@/components/common/AutoComplete";
import AutoCompleteMultiple from "@/components/common/AutoCompleteMultiple";
import DateSiglePicker from "@/components/common/DatePicker";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { valueForm } from "@/models/EmpManagement";
import { ROLE, cookieSetting, getValueWithComma } from "@/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

function InfoAccountContent() {
  const [branchList, setBranchList] = useState([]);
  const [roles, setRoles] = useState([]);
  const employeeId = cookieSetting.get("employeeId");
  const role = cookieSetting.get("roles");

  const { register, handleSubmit, setValue, getValues, watch, reset, control } =
    useForm<valueForm>({
      defaultValues: {
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
        restOfMoney: "",
        bank: "",
        accountNumber: "",
      },
    });
  useEffect(() => {
    if (employeeId) {
      fetchDetailEmp(employeeId).then((res: any) => {
        const rowInfo = res.data;
        let arrBranchId: any[] = [];
        const branchFormat = rowInfo?.branchManagementScopes.map((item: any) => {
          return {
            value: item?.branch.name,
            key: item?.branch.id,
          };
        });
        reset({
          name: rowInfo?.name,
          code: rowInfo?.code,
          email: rowInfo?.email,
          salary: rowInfo?.salary,
          phoneNumber: rowInfo?.phoneNumber,
          bank: rowInfo?.bank,
          accountNumber: rowInfo?.accountNumber,
          accountBalance: getValueWithComma(rowInfo?.accountBalance),
          roleIds: {
            keys: rowInfo?.roles[0].id,
            values: rowInfo?.roles[0].title,
          },
          branchIds: branchFormat,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);
  const getDataCustomerFromApi = (value: string) => {};
  const getValueBranch = (value: string) => {};

  return (
    <Dashboard>
      <h3 style={{ textAlign: "left" }}>THÔNG TIN TÀI KHOẢN</h3>
      <form style={{ padding: 16, width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 50,
            width: "100%",
          }}
        >
          <StyleContainer>
            <StyleInputContainer>
              <LabelComponent require={true}>Họ và tên </LabelComponent>
              <TextFieldCustom
                type={"text"}
                disable={"true"}
                {...register("name", { required: true })}
              />
            </StyleInputContainer>

            <StyleInputContainer>
              <LabelComponent require={true}>Số điện thoại </LabelComponent>
              <TextFieldCustom
                type={"text"}
                disable={"true"}
                {...register("phoneNumber", { required: true })}
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
                  labelWidth: "106",
                  disable: true,
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
              <LabelComponent require={true}>Số dư còn lại</LabelComponent>
              <TextFieldCustom
                type={"text"}
                // style={{ color: 'red'}}
                disable={"true"}
                {...register("accountBalance", { required: true })}
              />
            </StyleInputContainer>
          </StyleContainer>
          <StyleContainer>
            <StyleInputContainer>
              <LabelComponent require={true}>Mã nhân viên</LabelComponent>
              <TextFieldCustom
                type={"text"}
                disable={"true"}
                {...register("code", { required: true })}
              />
            </StyleInputContainer>
            <StyleInputContainer>
              <LabelComponent require={true}>Email </LabelComponent>
              <TextFieldCustom
                type={"text"}
                disable={"true"}
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
                  labelWidth: "105",
                  getData: getDataCustomerFromApi,
                  disable: true,
                }}
              />
            </StyleInputContainer>
            <StyleInputContainer>
              <LabelComponent require={true}>Lương tháng </LabelComponent>
              <TextFieldCustom
                type={"text"}
                disable={"true"}
                {...register("salary", { required: true })}
              />
            </StyleInputContainer>
            <StyleInputContainer>
              <LabelComponent require={true}>Số tài khoản</LabelComponent>
              <TextFieldCustom
                type={"text"}
                {...register("accountNumber", { required: true })}
                onChange={(e: any) => {
                  setValue(
                    "accountNumber",
                    e.target.value.trim().replaceAll(/[^0-9]/g, "")
                  );
                }}
              />
            </StyleInputContainer>
          </StyleContainer>
        </div>
      </form>
    </Dashboard>
  );
}
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
const PageContent = styled.div`
  display: flex;
  flex-direction: column;
`;
export default InfoAccountContent;
