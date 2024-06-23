import { fetchGetAllCard } from "@/api/service/cardCustomerApis";
import TableDataComponent from "@/components/common/DataGrid";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { cardType } from "@/models/CardCustomerModel";
import {
  ColCardType,
  ColPosManagement,
  FormParams,
  PosParamBodySend,
  SupportedCardTypesParam,
} from "@/models/PortManagementModel";
import { Box, Button, IconButton, Typography } from "@mui/material";
import {
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
} from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import styled from "styled-components";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { fetchCreatePos, fetchUpdatePos } from "@/api/service/posManagerApis";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { InputNumber } from "@/components/common/InputCustom";
import { fetchPosManagement } from "@/actions/PosManagementActions";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import AutoCompleteMultiple from "@/components/common/AutoCompleteMultiple";
import { fetchBranch } from "@/api/service/invoiceManagement";
import SelectSearchComponent from "@/components/common/AutoComplete";
import { ROLE, cookieSetting, getValueWithComma } from "@/utils";

export interface NewPosDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  searchCondition: any;
  rowInfo: any;
}
const ViewPosDrawer = (props: NewPosDrawerProps) => {
  const { isOpen, handleCloseDrawer, searchCondition, rowInfo } = props;
  const [listOfCard, setListOfCard] = useState<ColCardType[]>([]);
  const [branchList, setBranchList] = useState([]);
  const [role, setRole] = useState<string | undefined>("");

  useEffect(() => {
    setRole(cookieSetting.get("roles"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieSetting.get("roles")]);
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
    },
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (rowInfo) {
      let getCard: ColCardType[] = [];
      rowInfo?.supportedCardTypes.map(
        (item: SupportedCardTypesParam, index: number) => {
          getCard.push({
            id: item.id,
            name: item?.cardType?.name,
            cardTypeId: item?.cardType?.id,
            posCardFee: item?.posCardFee,
          });
        }
      );
      const branchFormat = rowInfo?.branches.map((item: any) => {
        return {
          value: item?.name,
          key: item?.id,
        };
      });
      reset({
        code: rowInfo.code,
        name: rowInfo.name,
        address: rowInfo.address,
        accountNumber: rowInfo.accountNumber,
        bank: rowInfo.bank,
        maxBillAmount: getValueWithComma(rowInfo.maxBillAmount),
        posFeeTable: getCard,
        note: rowInfo?.note,
        branchIds: branchFormat,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowInfo]);
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
  }, []);
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
      // {
      //   headerName: "Thao Tác",
      //   field: "",
      //   width: 105,
      //   sortable: false,
      //   renderCell: ({ row }) => {
      //     return (
      //       <>
      //         <IconButton color="error">
      //           <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
      //         </IconButton>
      //       </>
      //     );
      //   },
      // },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listOfCard]
  );
  const handleCreate = () => {
    const {
      accountNumber,
      branchIds,
      address,
      bank,
      code,
      maxBillAmount,
      note,
      name,
    } = getValues();
    let formatList: ColCardType[] = [];
    watch("posFeeTable").map((item) => {
      formatList.push({
        cardTypeId: item.cardTypeId,
        posCardFee: item.posCardFee ? item.posCardFee : 0,
      });
    });
    let arrBranchId: any[] = [];

    if (branchIds) {
      arrBranchId = branchIds.map((item) => {
        return item.key;
      });
    }
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
      branchIds: arrBranchId ? arrBranchId : [],
    };
    fetchUpdatePos(rowInfo.id, request)
      .then((res) => {
        enqueueSnackbar("Cập nhật thành công!!", { variant: "success" });
        handleCloseDrawer();
        dispatch(fetchPosManagement(searchCondition));
        // reset();
      })
      .catch(function (error) {
        // enqueueSnackbar("cập nhật thất bại", { variant: "error" });
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Cập nhật thất bại", { variant: "error" });
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
  const getValueBranch = (value: string) => {};

  return (
    <>
      <DrawerCustom
        widthDrawer={540}
        isOpen={isOpen}
        title="Xem/Cập nhật mã pos"
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
              {role !== ROLE.VIEWER && (
                <Button
                  style={{ marginTop: 30 }}
                  variant="contained"
                  size="small"
                  type="submit"
                >
                  Cập nhật
                </Button>
              )}
            </Box>
          </PageContent>
        </form>
      </DrawerCustom>
    </>
  );
};
export default ViewPosDrawer;
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
  gap: 18px;
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
