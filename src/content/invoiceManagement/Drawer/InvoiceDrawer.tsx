import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import {
  Control,
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridRowModel,
  GridValidRowModel,
  GridValueGetterParams,
  GridValueSetterParams,
} from "@mui/x-data-grid";
import TableDataComponent from "@/components/common/DataGrid";
import { Box, Button, IconButton } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SelectSearchComponent from "@/components/common/AutoComplete";
import { useDispatch } from "react-redux";
import { fetchPos } from "@/actions/InvoiceManagementActions";
import { RootState } from "@/reducers/rootReducer";
import { useSelector } from "react-redux";
import { cookieSetting, getValueWithComma } from "@/utils";
import { fetchSearchCustomer } from "@/actions/CustomerManagerAction";
import { fetchCardCustomer } from "@/actions/CardCustomerActions";
import {
  InvoiceCreate,
  ReceiptCreationParams,
  ValueFormCreate,
} from "@/models/InvoiceManagement";
import NewCardCustomer from "./NewCardCustomer";
import { enqueueSnackbar } from "notistack";
import {
  fetchCreateInvoice,
  fetchSaveImage,
} from "@/api/service/invoiceManagement";
import { randomId } from "@mui/x-data-grid-generator";
import { InputNumber } from "@/components/common/InputCustom";
import ImageUpload from "@/components/common/ImageUpload";
const initialRow = [
  {
    id: randomId(),
    pos: "",
    posId: "",
    money: "",
    typeOfCard: "",
    fee: "",
    feeafterpay: "",
    billcode: "",
  },
  {
    id: randomId(),
    pos: "",
    posId: "",
    money: "",
    typeOfCard: "",
    fee: "",
    feeafterpay: "",
    billcode: "",
  },
  {
    id: randomId(),
    pos: "",
    posId: "",
    money: "",
    typeOfCard: "",
    fee: "",
    feeafterpay: "",
    billcode: "",
  },
];
const initialRow2 = [
  {
    id: 1,
    intake: "",
    payout: "",
    loan: "",
    repayment: "",
  },
];
export interface InputPosProps<T extends FieldValues> {
  name: string;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  control: Control<T>;
}
export const InputSearchPos = <T extends FieldValues>(
  props: InputPosProps<T>
) => {
  const dispatch = useDispatch();

  const { name, setValue, watch, control } = props;
  const listOfPos = useSelector(
    (state: RootState) => state.invoiceManagement.posList
  );
  let result = [];
  if (listOfPos.length > 0) {
    result = listOfPos.map((item: any) => {
      return {
        values: item.code,
        key: item.id,
      };
    });
  } else {
    result = [];
  }
  const getDataFromApi = (value: string) => {
    dispatch(fetchPos({ posName: value }));
  };
  return (
    <div>
      <SelectSearchComponent
        control={control}
        props={{
          name: name,
          placeHoder: "",
          results: result,
          label: "",
          type: "text",
          setValue: setValue,
          labelWidth: "120",
          getData: getDataFromApi,
          border: "true",
        }}
      />
    </div>
  );
};
export interface InvoiceDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  handleSearch: () => void;
}
export interface Item {
  id: string;
  pos: string;
  posId: string;
  money: string;
  typeOfCard: string;
  fee: string;
  feeafterpay: string;
  billcode: string;
}
export interface Item2 {
  id: number;
  intake: string; //thu
  payout: string; // chi
  loan: string; // công nợ
  repayment: string; // thu nợ
}

export interface TotalHeader {
  id: "Tổng";
  totalFee: number;
  totalAfterFee: number;
}

type Row = Item;
const InvoiceDrawer = (props: InvoiceDrawerProps) => {
  const { isOpen, handleCloseDrawer, handleSearch } = props;
  // const [rows, setRows] = useState<Row[]>(initialRow);
  const [rows2, setRows2] = useState<Item2[]>(initialRow2);
  const [imageId, setImageId] = useState("");
  const userName = cookieSetting.get("userName");
  const branchId = cookieSetting.get("branchId");
  const employeeId = cookieSetting.get("employeeId");
  const [isOpenCard, setIsOpenCard] = useState(false);
  const listOfCustomer = useSelector(
    (state: RootState) => state.customerManagament.customerList
  );
  const cardCustomerList = useSelector(
    (state: RootState) => state.cardCustomer.cardCustomerList
  );
  const cardType = useSelector(
    (state: RootState) => state.cardCustomer.cardType
  );
  // [key: string]: string } |
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
    control,
  } = useForm<ValueFormCreate>({
    defaultValues: {
      codeEmployee: "",
      customerInfo: "",
      customerName: {
        key: "",
        values: "",
        nationalId: "",
      },
      image_Id: "",
      posSearch: "",
      percentageFee: "",
      shipmentFee: "",
      cardCustomer: {
        key: "",
        values: "",
      },
      totalBill: "",
      invoices: [
        {
          id: "",
          pos: {
            key: "TOTAL",
            values: "",
          },
          posId: {
            key: "",
            values: "",
          },
          money: "",
          typeOfCard: "",
          fee: "",
          feeafterpay: "",
          billcode: "",
        },
        {
          id: "",
          pos: {
            key: "",
            values: "",
          },
          posId: {
            key: "",
            values: "",
          },
          money: "",
          typeOfCard: "",
          fee: "",
          feeafterpay: "",
          billcode: "",
        },
        {
          id: "",
          pos: {
            key: "",
            values: "",
          },
          posId: {
            key: "",
            values: "",
          },
          money: "",
          typeOfCard: "",
          fee: "",
          feeafterpay: "",
          billcode: "",
        },
        {
          id: "",
          pos: {
            key: "",
            values: "",
          },
          posId: {
            key: "",
            values: "",
          },
          money: "",
          typeOfCard: "",
          fee: "",
          feeafterpay: "",
          billcode: "",
        },
      ],
      invoicesCalculate: [
        {
          intake: 0, //thu
          payout: 0, // chi
          loan: 0, // công nợ
          repayment: 0,
        },
      ],
    },
  });
  const {
    fields: invoicesField,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "invoices",
  });
  const { fields: invoicesCalculateField } = useFieldArray({
    control,
    name: "invoicesCalculate",
  } as never);
  const onAdd = () => {
    const item = {
      id: "2",
      pos: {
        key: "",
        values: "",
      },
      posId: {
        key: "",
        values: "",
      },
      money: "",
      typeOfCard: "",
      fee: "",
      feeafterpay: "",
      billcode: "",
      check: "",
    };
    append(item);
  };
  const handleSubmitInvoice = () => {
    let receiptBills: any[] = [];
    if (watch("customerName").key === "") {
      enqueueSnackbar("Vui lòng chọn khách hàng", { variant: "warning" });
      return;
    }
    if (watch("cardCustomer").key === "") {
      enqueueSnackbar("Vui lòng chọn thẻ khách hàng", { variant: "warning" });
      return;
    }
    watch("invoices").map((item, index) => {
      if (item?.pos.key !== "TOTAL" && item.posId.key !== "") {
        receiptBills.push({
          billId: "",
          posId: item?.posId?.key,
          moneyAmount: +item?.money,
          fee: +item?.money * (+watch("percentageFee") / 100),
        });
      }
      return item;
    });
    if (receiptBills.length === 0) {
      enqueueSnackbar("Vui lòng nhập hóa đơn", { variant: "warning" });
      return;
    }
    if (imageId === "") {
      enqueueSnackbar("Vui lòng tải ảnh dẫn chứng", { variant: "warning" });
      return;
    }

    const request: ReceiptCreationParams = {
      imageId: imageId,
      branchId: branchId,
      customerCardId: watch("cardCustomer").key,
      percentageFee: +watch("percentageFee"),
      shipmentFee: +watch("shipmentFee"),
      intake: watch("invoicesCalculate")[0].intake,
      payout: watch("invoicesCalculate")[0].payout,
      loan: watch("invoicesCalculate")[0].loan,
      repayment: watch("invoicesCalculate")[0].repayment,
      employeeId: employeeId,
      receiptBills: receiptBills,
    };
    fetchCreateInvoice(request)
      .then((res) => {
        enqueueSnackbar("Tạo hóa đơn thành công!!", { variant: "success" });
        // reset();
        handleCloseDrawer();
        handleSearch();
      }).catch(function (error) {
        enqueueSnackbar(error, { variant: "error" });
      });
  };
  const handleOpenAddCard = () => {
    setIsOpenCard(true);
  };
  const handleCloseAddCard = () => {
    setIsOpenCard(false);
  };
  const handleGetFile = (file: Array<any>) => {
    fetchSaveImage(file[0])
      .then((res) => {
        setImageId(res.data);
      })
      .catch(function (error) {
        enqueueSnackbar("Load ảnh thất bại", { variant: "error" });
      });
  };
  const totalfee = watch("invoices").reduce(
    (total, { money }) =>
      (total += +money - +money * (+watch("percentageFee") / 100)),
    0
  );
  const columns: GridColDef<InvoiceCreate>[] = useMemo(
    () => [
      {
        field: "id",
        width: 40,
        sortable: false,
        headerName: "STT",
        renderCell: (params: GridRenderCellParams<InvoiceCreate>) => {
          if (params.row.pos.key === "TOTAL") {
            return "";
          }
          const index = params.api.getRowIndex(params.row.id);
          return +index + 1;
        },
      },
      // {
      //   headerName: "Mã Bill",
      //   field: "receiptCode",
      //   width: 100,
      //   sortable: false,
      // },
      {
        headerName: "Mã Pos",
        field: "pos",
        width: 120,
        headerAlign: "left",
        sortable: false,
        // editable: true,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.pos.key !== "TOTAL") {
            return (
              <>
                <InputSearchPos
                  control={control}
                  name={`invoices[${index}].posId`}
                  watch={watch}
                  setValue={setValue}
                />
              </>
            );
          }
          return <p>TỔNG</p>;
        },
        cellClassName: (params: GridCellParams<InvoiceCreate>) => {
          if (params.row.pos.key !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      {
        headerName: "Số tiền",
        field: "money",
        width: 130,
        sortable: false,
        editable: true,
        type: "number",
        headerAlign: "left",
        align: "left",
        cellClassName: (params: GridCellParams<InvoiceCreate>) => {
          if (params.row.pos.key !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.pos.key !== "TOTAL") {
            return (
              <>
                <InputNumber
                  InputWidth="100%"
                  key={index}
                  name={`invoices.${index}.money`}
                  control={control}
                />
              </>
            );
          }
          let money = 0;
          money = watch("invoices").reduce(
            (total, { money }) => (total += +money),
            0
          );
          return money;
        },
        Footer: () => {
          return <h1>Check</h1>;
        },
      },
      {
        headerName: "Tiền phí",
        field: "fee",
        width: 130,
        sortable: false,
        editable: false,
        align: "left",
        type: "number",

        valueGetter: (params: GridValueGetterParams) => {
          const index = params.api.getRowIndex(params.row.id);
          let restOfFee = 0;
          if (watch(`invoices.${index}.money`) !== undefined) {
            restOfFee =
              +watch(`invoices.${index}.money`) *
              (+watch("percentageFee") / 100);
          }

          if (params.row.pos.key === "TOTAL") {
            let fee = 0;
            fee = watch("invoices").reduce(
              (total, { money }) =>
                (total += +money * (+watch("percentageFee") / 100)),
              0
            );
            return fee;
          }
          return getValueWithComma(restOfFee);
        },
        cellClassName: (params: GridCellParams<InvoiceCreate>) => {
          if (params.row.pos.key !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      {
        headerName: "Tiền sau phí",
        field: "feeafterpay",
        headerAlign: "left",
        width: 130,
        sortable: false,
        editable: false,
        align: "left",
        type: "number",
        valueGetter: (params: GridValueGetterParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.pos.key === "TOTAL") {
            let fee = 0;
            fee = watch("invoices").reduce(
              (total, { money }) =>
                (total += +money - +money * (+watch("percentageFee") / 100)),
              0
            );
            return fee;
          }
          let feeafterpay = 0;
          if (watch(`invoices.${index}.money`) !== undefined) {
            feeafterpay =
              +watch(`invoices.${index}.money`) -
              +watch(`invoices.${index}.money`) *
                (+watch("percentageFee") / 100);
          }
          return feeafterpay;
        },
        cellClassName: (params: GridCellParams<InvoiceCreate>) => {
          if (params.row.pos.key !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      // {
      //   headerName: "Lợi Nhuận",
      //   field: "profit",
      //   width: 100,
      //   sortable: false,
      // },
      {
        headerName: "Thao Tác",
        field: "actions",
        width: 120,
        sortable: false,
        align: "center",
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.pos.key !== "TOTAL") {
            return (
              <>
                <IconButton color="error" onClick={() => remove(index)}>
                  <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </>
            );
          }
          return <></>;
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const columnsOther: GridColDef[] = useMemo(
    () => [
      {
        headerName: "Thu",
        field: "intake",
        width: 100,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          return (
            <>
              <InputNumber
                InputWidth="100%"
                key={index}
                name={`invoicesCalculate.${index}.intake`}
                control={control}
              />
            </>
          );
        },
      },
      {
        headerName: "Chi",
        field: "payout",
        width: 100,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          return (
            <>
              <InputNumber
                InputWidth="100%"
                key={index}
                name={`invoicesCalculate.${index}.payout`}
                control={control}
              />
            </>
          );
        },
      },
      {
        headerName: "Công nợ",
        field: "loan",
        width: 100,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          return (
            <>
              <InputNumber
                InputWidth="100%"
                key={index}
                name={`invoicesCalculate.${index}.loan`}
                control={control}
              />
            </>
          );
        },
      },
      {
        headerName: "Thu nợ",
        field: "repayment",
        width: 100,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          return (
            <>
              <InputNumber
                InputWidth="100%"
                key={index}
                name={`invoicesCalculate.${index}.repayment`}
                control={control}
              />
            </>
          );
        },
      },
    ],
    []
  );
  const getRowId = (row: any) => {
    return row.id;
  };
  const dispatch = useDispatch();

  const getDataCustomerFromApi = (value: string) => {
    if (value !== "") {
      dispatch(fetchSearchCustomer({ customerName: value }));
    }
  };
  useEffect(() => {
    if (watch("customerName")?.key) {
      dispatch(fetchCardCustomer({ customerId: watch("customerName")?.key }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("customerName")]);
  useEffect(() => {
    if (watch("cardCustomer")?.key) {
      console.log("checkkkkkvappppppppp");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("cardCustomer")]);

  const handleGetCard = () => {};
  const handleProcessRowUpdate2 = useCallback(
    async (newRow: GridRowModel) => {
      const oldRowData = [...rows2];
      let rowIndex = oldRowData.findIndex(
        (element) => element.id === newRow.id
      );
      oldRowData[rowIndex] = {
        id: newRow.id,
        intake: newRow.intake,
        payout: newRow.payout,
        loan: newRow.loan,
        repayment: newRow.repayment,
      };
      setRows2(oldRowData);
      return null;
    },
    [rows2]
  );

  return (
    <>
      <DrawerCustom
        widthDrawer={718}
        isOpen={isOpen}
        title="Tạo Hóa đơn"
        handleClose={handleCloseDrawer}
      >
        <form
          style={{ padding: 16 }}
          onSubmit={handleSubmit(handleSubmitInvoice)}
        >
          <PageContent>
            <SearchContainer>
              <StyleContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Mã Nhân Viên</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    value={userName}
                    disable={"true"}
                  />
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Phần trăm phí</LabelComponent>
                  <TextFieldCustom
                    type={"number"}
                    iconend={<p style={{ width: 24 }}>%</p>}
                    {...register("percentageFee", {
                      required: "Phần trăm phí bắt buộc",
                    })}
                  />
                  <TextHelper>
                    {errors.percentageFee && errors.percentageFee.message}
                  </TextHelper>
                </StyleInputContainer>

                <StyleInputContainer>
                  <LabelComponent require={true}>Phí vận chuyển</LabelComponent>
                  <TextFieldCustom
                    type={"number"}
                    iconend={<p style={{ width: 24 }}>VND</p>}
                    {...register("shipmentFee", {
                      required: "Phí vận chuyển bắt buộc",
                    })}
                  />
                  <TextHelper>
                    {errors.shipmentFee && errors.shipmentFee.message}
                  </TextHelper>
                </StyleInputContainer>
              </StyleContainer>
              <StyleContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Tên Khách Hàng</LabelComponent>
                  <SelectSearchComponent
                    control={control}
                    props={{
                      name: "customerName",
                      placeHoder: "",
                      results: listOfCustomer,
                      label: "",
                      // getData:((value) => setValue("customerName", value)),
                      type: "text",
                      setValue: setValue,
                      labelWidth: "100",
                      getData: getDataCustomerFromApi,
                    }}
                  />
                </StyleInputContainer>

                <StyleInputContainer style={{ position: "relative" }}>
                  <LabelComponent require={true}>Tên Thẻ</LabelComponent>
                  <SelectSearchComponent
                    control={control}
                    props={{
                      name: "cardCustomer",
                      placeHoder: "",
                      results: cardType,
                      label: "",
                      type: "text",
                      setValue: setValue,
                      labelWidth: "100",
                      getData: handleGetCard,
                    }}
                  />
                  <StyleButtonSpan>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleOpenAddCard}
                    >
                      Thêm Thẻ
                    </Button>
                  </StyleButtonSpan>
                </StyleInputContainer>
                <InfoBankCard>
                  <InfoOutlinedIcon />
                  Credit Card - BIDV - 02135466987
                </InfoBankCard>
              </StyleContainer>
            </SearchContainer>

            <StyleDataGrid>
              <Button variant="contained" size="small" onClick={onAdd}>
                Thêm bill
              </Button>
              <br />
              <Box
                sx={{
                  // height: 300,
                  width: "100%",
                  "& .super-app-theme--cell": {
                    backgroundColor: "#EAEAEA",
                    color: "#1a3e72",
                    fontWeight: "600",
                  },
                }}
              >
                <TableDataComponent
                  columns={columns}
                  dataInfo={invoicesField}
                  disableFilter={true}
                  isPage={true}
                  rowCount={100}
                  getRowId={getRowId}
                />
              </Box>
            </StyleDataGrid>
            <StyleDataGrid2>
              <TableDataComponent
                columns={columnsOther}
                dataInfo={invoicesCalculateField}
                disableFilter={true}
                isPage={true}
                rowCount={100}
                getRowId={getRowId}
              />
            </StyleDataGrid2>
            <ContainerSum>
              <StyleInputContainer>
                <LabelComponent>Tổng tiền chi</LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  disable="true"
                  value={(totalfee + +watch("shipmentFee")).toString()}
                  // {...register("totalBill")}
                />
              </StyleInputContainer>
              <StyleInputContainer style={{ marginTop: -168 }}>
                <ImageUpload handleGetFile={handleGetFile} filePath="" />
              </StyleInputContainer>
            </ContainerSum>
            <Box
              sx={{
                justifyContent: "flex-end",
                display: "flex",
                marginTop: 3,
                padding: "0px 16px 8px 16px",
              }}
            >
              <Button
                size="small"
                variant="contained"
                type="submit"
                // onClick={handleSubmitInvoice}
              >
                Lưu Hóa Đơn
              </Button>
            </Box>
          </PageContent>
          <NewCardCustomer
            isOpen={isOpenCard}
            handleCloseDrawer={handleCloseAddCard}
          />
        </form>
      </DrawerCustom>
    </>
  );
};
export default InvoiceDrawer;

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
  gap: 4px;
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 64px;
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
const StyleDataGrid = styled.div`
  width: 683px;
  padding: 0px 16px;
`;
const StyleDataGrid2 = styled.div`
  margin-top: -15px;
  width: 432px;
  padding: 0px 16px;
`;
const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const StyleButtonSpan = styled.span`
  position: absolute;
  top: 32px;
  right: -21%;
`;
const TextHelper = styled.span`
  color: red;
  font-size: 12px;
`;
