import { fetchGetAllCard } from "@/api/service/cardCustomerApis";
import TableDataComponent from "@/components/common/DataGrid";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { cardType } from "@/models/CardCustomerModel";
import {
  ColCardType,
  FormParams,
  PosParamBodySend,
  SupportedCardTypesParam,
  branchType,
} from "@/models/PortManagementModel";
import { Box, Button, IconButton, Typography } from "@mui/material";
import {
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import styled from "styled-components";
import { fetchCreatePos } from "@/api/service/posManagerApis";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { InputNumber } from "@/components/common/InputCustom";
import { fetchPosManagement } from "@/actions/PosManagementActions";
import { fetchBranch } from "@/api/service/invoiceManagement";
import { ROLE, cookieSetting, getValueWithComma } from "@/utils";
import TextareaComponent from "@/components/common/TextAreaAutoSize";

export interface NewPosDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  searchCondition: any;
}
const NewPosDrawer = (props: NewPosDrawerProps) => {
  const { isOpen, handleCloseDrawer, searchCondition } = props;
  const [listOfCard, setListOfCard] = useState<ColCardType[]>([]);
  const [branchList, setBranchList] = useState<branchType[]>([]);
  const role = cookieSetting.get("roles");
  const branchId = cookieSetting.get("branchId");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
    getValues,
  } = useForm<FormParams>({
    defaultValues: {
      code: "",
      name: "",
      address: "",
      accountNumber: "",
      bank: "",
      maxBillAmount: "",
      posFeeTable: [],
      branchIds: {
        key: "",
        values: "",
      },
      note: "",
    },
  });
  const dispatch = useDispatch();
  useEffect(() => {
    fetchGetAllCard().then((res) => {
      if (res) {
        let getCard: ColCardType[] = [];
        res.data.map((item: cardType, index: number) => {
          getCard.push({
            id: item.id,
            name: item.name,
            cardTypeId: item.id,
            posCardFee: 0,
          });
        });
        setValue("posFeeTable", getCard);
        setListOfCard([...getCard]);
      }
    });
    fetchBranch().then((res) => {
      if (res.data) {
        const branch = res.data.map((item: any) => {
          return {
            values: item?.name,
            key: item?.id,
          };
        });
        setBranchList(branch);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useMemo(() => {
    if (role !== ROLE.ADMIN) {
      branchList.map((item) => {
        if (item?.key === branchId) {
          setValue("branchIds", {
            key: item.key,
            values: item?.values,
          });
        }
      });
    } else {
      setValue("branchIds", {
        key: branchList[0]?.key,
        values: branchList[0]?.values,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, branchList]);
  const { fields: posFeeTable } = useFieldArray({
    control,
    name: "posFeeTable",
  });
  const columnsOther: GridColDef[] = useMemo(
    () => [
      {
        headerName: "Loại thẻ",
        field: "name",
        width: 150,
        sortable: false,
      },
      {
        headerName: "Phí",
        field: "posCardFee",
        width: 105,
        sortable: false,
        editable: true,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          return (
            <>
              <InputNumber
                InputWidth="100%"
                key={index}
                name={`posFeeTable.${index}.posCardFee`}
                control={control}
              />
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listOfCard]
  );
  const handleCreate = () => {
    const { accountNumber, address, bank, code, maxBillAmount, note, name } =
      getValues();
    let formatList: ColCardType[] = [];
    watch("posFeeTable").map((item) => {
      formatList.push({
        cardTypeId: item.cardTypeId,
        posCardFee: item.posCardFee,
      });
    });
    const request: PosParamBodySend = {
      code: code,
      name: name,
      address: address,
      bank: bank,
      accountNumber: accountNumber,
      supportedCardTypes: formatList,
      posStatus: "AVAILABLE",
      maxBillAmount: maxBillAmount.replaceAll(",", ""),
      note: note,
    };
    fetchCreatePos(request)
      .then((res) => {
        enqueueSnackbar("Tạo Pos thành công!!", { variant: "success" });
        handleCloseDrawer();
        dispatch(fetchPosManagement(searchCondition));
        const posFee = watch("posFeeTable").map((item) => {
          return {
            id: item.id,
            name: item.name,
            cardTypeId: item.cardTypeId,
            posCardFee: 0,
          };
        });
        reset({
          code: "",
          name: "",
          address: "",
          accountNumber: "",
          bank: "",
          maxBillAmount: "",
          note: "",
          posFeeTable: posFee,
        });
      })
      .catch(function (error) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Tạo Pos thất bại", { variant: "error" });
        }
      });
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  const getDataCustomerFromApi = (value: string) => {};
  return (
    <>
      <DrawerCustom
        widthDrawer={540}
        isOpen={isOpen}
        title="Tạo mã pos"
        handleClose={handleCloseDrawer}
      >
        <form
          style={{ padding: 16 }}
          onKeyPress={handleKeyPress}
          onSubmit={handleSubmit(handleCreate)}
        >
          <PageContent>
            <SearchContainer>
              <StyleContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Mã Pos</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    {...register("code", { required: "Mã pos là bắt buộc" })}
                  />
                  <TextHelper>{errors?.code && errors.code.message}</TextHelper>
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Số Tài Khoản</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    {...register("accountNumber", {
                      required: "Số tài khoản là bắt buộc",
                    })}
                  />
                  <TextHelper>
                    {errors?.accountNumber && errors.accountNumber.message}
                  </TextHelper>
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Định mức</LabelComponent>
                  <TextFieldCustom
                    {...register("maxBillAmount", {
                      required: "Định mức tài khoản là bắt buộc",
                    })}
                    onChange={(e: any) => {
                      setValue(
                        "maxBillAmount",
                        getValueWithComma(
                          e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                        )
                      );
                    }}
                  />

                  <TextHelper>
                    {errors?.accountNumber && errors.accountNumber.message}
                  </TextHelper>
                </StyleInputContainer>
              </StyleContainer>
              <StyleContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Tên Pos</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    {...register("name", { required: "Tên pos là bắt buộc" })}
                  />
                  <TextHelper>{errors?.name && errors.name.message}</TextHelper>
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Địa chỉ</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    {...register("address", {
                      required: "Địa chỉ là bắt buộc",
                    })}
                  />
                  <TextHelper>
                    {errors?.address && errors.address.message}
                  </TextHelper>
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Ngân hàng</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    {...register("bank", { required: "Ngân hàng là bắt buộc" })}
                  />
                  <TextHelper>{errors?.bank && errors.bank.message}</TextHelper>
                </StyleInputContainer>
              </StyleContainer>
            </SearchContainer>
            <div style={{ width: "80%" }}>
              <Typography style={{ fontWeight: "bold" }}>Ghi chú</Typography>
              <TextareaComponent
                control={control}
                valueInput={""}
                name={"note"}
                label={"Ghi chú"}
                width={"100"}
                type={""}
                disable={false}
              />
            </div>
            <StyleDataGrid>
              <TableDataComponent
                columns={columnsOther}
                dataInfo={posFeeTable}
                disableFilter={true}
                isPage={true}
                rowCount={100}
                getRowId={getRowId}
              />
            </StyleDataGrid>
            <Box
              sx={{
                justifyContent: "flex-end",
                display: "flex",
                padding: "0px 16px 8px 16px",
              }}
            >
              {" "}
              <Button variant="contained" size="small" type="submit">
                Thêm mới Pos
              </Button>
            </Box>
          </PageContent>
        </form>
      </DrawerCustom>
    </>
  );
};
export default NewPosDrawer;
const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyleDataGrid = styled.div`
  width: 260px;
  padding: 0px 0px;
`;
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
  gap: 5px;
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 64px;
`;
const TextHelper = styled.span`
  color: red;
  font-size: 12px;
`;
const ContainerSum = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 16px;
  margin-top: -30px;
`;
const InfoBankCard = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #0068a3;
  color: #0068a3;
  border-radius: 10px;
  padding: 10px;
  background-color: #d6f0ff;
`;
