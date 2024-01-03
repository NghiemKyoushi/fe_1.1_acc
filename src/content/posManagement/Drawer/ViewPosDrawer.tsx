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
import { Button, IconButton } from "@mui/material";
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

export interface NewPosDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  searchCondition: any;
  rowInfo: any;
}
const ViewPosDrawer = (props: NewPosDrawerProps) => {
  const { isOpen, handleCloseDrawer, searchCondition, rowInfo } = props;
  const [listOfCard, setListOfCard] = useState<ColCardType[]>([]);
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
      reset({
        code: rowInfo.code,
        name: rowInfo.name,
        address: rowInfo.address,
        accountNumber: rowInfo.accountNumber,
        bank: rowInfo.bank,
        maxBillAmount: rowInfo.maxBillAmount,
        posFeeTable: getCard,
      });
    }
  }, [rowInfo]);
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
      {
        headerName: "Thao Tác",
        field: "",
        width: 105,
        sortable: false,
        renderCell: ({ row }) => {
          return (
            <>
              <IconButton color="error">
                <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </>
          );
        },
      },
    ],
    [listOfCard]
  );
  const handleCreate = () => {
    const { accountNumber, address, bank, code, maxBillAmount } = getValues();
    let formatList: ColCardType[] = [];
    watch("posFeeTable").map((item) => {
      formatList.push({
        cardTypeId: item.cardTypeId,
        posCardFee: item?.posCardFee,
      });
    });
    const request: PosParamBodySend = {
      code: code,
      name: code,
      address: address,
      bank: bank,
      accountNumber: accountNumber,
      supportedCardTypes: formatList,
      posStatus: "AVAILABLE",
      maxBillAmount: maxBillAmount,
    };
    fetchUpdatePos(rowInfo.id, request)
      .then((res) => {
        enqueueSnackbar("Cập nhật thành công!!", { variant: "success" });
        handleCloseDrawer();
        dispatch(fetchPosManagement(searchCondition));
        reset();
      })
      .catch(function (error) {
        enqueueSnackbar("cập nhật thất bại", { variant: "error" });
      });
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  return (
    <>
      <DrawerCustom
        widthDrawer={540}
        isOpen={isOpen}
        title="Xem/Cập nhật mã pos"
        handleClose={handleCloseDrawer}
      >
        <form style={{ padding: 16 }} onSubmit={handleSubmit(handleCreate)}>
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
                    type={"number"}
                    {...register("maxBillAmount", {
                      required: "Định mức tài khoản là bắt buộc",
                    })}
                  />
                  <TextHelper>
                    {errors?.accountNumber && errors.accountNumber.message}
                  </TextHelper>
                </StyleInputContainer>
              </StyleContainer>
              <StyleContainer>
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
            <div>
              <Button
                style={{ marginTop: 30 }}
                variant="contained"
                size="small"
                type="submit"
              >
                Thêm mới Pos
              </Button>
            </div>
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
  width: 360px;
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
