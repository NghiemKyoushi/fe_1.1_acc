import { fetchGetAllCard } from "@/api/service/cardCustomerApis";
import TableDataComponent from "@/components/common/DataGrid";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { cardType } from "@/models/CardCustomerModel";
import {
  ColCardType,
  PosParamBodySend,
  SupportedCardTypesParam,
} from "@/models/PortManagementModel";
import { Button, IconButton } from "@mui/material";
import { GridColDef, GridRowModel } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { fetchCreatePos } from "@/api/service/posManagerApis";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";

export interface NewPosDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
}
const NewPosDrawer = (props: NewPosDrawerProps) => {
  const { isOpen, handleCloseDrawer } = props;
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
  } = useForm({
    defaultValues: {
      code: "",
      name: "",
      address: "",
      accountNumber: "",
      bank: "",
      maxBillAmount:''
    },
  });
  const dispatch = useDispatch();
  useEffect(() => {
    fetchGetAllCard().then((res) => {
      if (res) {
        let getCard: ColCardType[] = [];
        res.data.map((item: cardType, index: number) => {
          getCard.push({
            id: index,
            name: item.name,
            cardTypeId: item.id,
            posCardFee: "",
          });
        });
        setListOfCard([...getCard]);
      }
    });
  }, []);
  const columnsOther: GridColDef[] = useMemo(
    () => [
      {
        headerName: "Loại thẻ",
        field: "name",
        width: 150,
        sortable: false,
        editable: true,
      },
      {
        headerName: "Phí",
        field: "posCardFee",
        width: 105,
        sortable: false,
        editable: true,
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
  const handleProcessRowUpdate2 = useCallback(
    async (newRow: GridRowModel) => {
      const oldRowData = [...listOfCard];
      let rowIndex = oldRowData.findIndex(
        (element) => element.id === newRow.id
      );
      oldRowData[rowIndex] = {
        id: newRow.id,
        name: newRow.name,
        cardTypeId: newRow.cardTypeId,
        posCardFee: newRow.posCardFee,
      };
      setListOfCard(oldRowData);
      return null;
    },
    [listOfCard]
  );
  const handleCreate = () => {
    const { accountNumber, address, bank, code,maxBillAmount } = getValues();
    let formatList: SupportedCardTypesParam[] = [];
    listOfCard.map((item) => {
      formatList.push({
        cardTypeId: item.cardTypeId,
        posCardFee: +item.posCardFee,
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
      maxBillAmount: maxBillAmount
    };
    fetchCreatePos(request)
      .then((res) => {
        enqueueSnackbar("Tạo Pos thành công!!", { variant: "success" });
        handleCloseDrawer();
        reset();
      })
      .catch(function (error) {
        enqueueSnackbar("Tạo Pos thất bại", { variant: "error" });
      });
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  return (
    <>
      <DrawerCustom
        widthDrawer={650}
        isOpen={isOpen}
        title="Tạo mã pos"
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
                dataInfo={listOfCard}
                disableFilter={true}
                isPage={true}
                processRowUpdate={handleProcessRowUpdate2}
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
export default NewPosDrawer;
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
