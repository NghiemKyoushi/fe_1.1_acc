import SelectSearchComponent from "@/components/common/AutoComplete";
import TableDataComponent from "@/components/common/DataGrid";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import {
  ReceiptCreationParams,
  ValueFormCreate,
} from "@/models/InvoiceManagement";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import styled from "styled-components";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Button, IconButton } from "@mui/material";
import {
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { InputSearchPos } from "./InvoiceDrawer";
import { InputNumber } from "@/components/common/InputCustom";
import { cookieSetting, getValueWithComma } from "@/utils";
import { enqueueSnackbar } from "notistack";
import {
  fetchImagePath,
  fetchSaveImage,
  updateInvoice,
} from "@/api/service/invoiceManagement";
import ImageUpload from "@/components/common/ImageUpload";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import NewCardCustomer from "@/content/cardCustomer/Drawer/NewCardCustomer";

export interface ViewInvoiceDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  rowInfo: any;
  handleSearch: () => void;
}
export const ViewInvoiceDrawer = (props: ViewInvoiceDrawerProps) => {
  const { isOpen, handleCloseDrawer, rowInfo, handleSearch } = props;
  const branchId = cookieSetting.get("branchId");
  const [imageId, setImageId] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [isOpenCard, setIsOpenCard] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
    control,
  } = useForm<ValueFormCreate>({
    defaultValues: useMemo(() => {
      return {
        codeEmployee: rowInfo?.percentageFee,
        check: "",
        invoicesCalculate: [
          {
            intake: 0, //thu
            payout: 0, // chi
            loan: 0, // công nợ
            repayment: 0,
          },
        ],
      };
    }, [rowInfo]),
    // defaultValues: {
    //   codeEmployee: "",
    //   customerInfo: "",
    //   customerName: {
    //     key: "",
    //     values: "",
    //     nationalId: "",
    //   },
    //   image_Id: "",
    //   posSearch: "",
    //   percentageFee: rowInfo?.percentageFee,
    //   shipmentFee: rowInfo?.shipmentFee,
    //   cardCustomer: {
    //     key: "",
    //     values: "",
    //   },
    //   totalBill: "",
    //   invoices: [],
    // },
  });
  const role = cookieSetting.get("roles");

  const { fields: invoicesCalculateField } = useFieldArray({
    control,
    name: "invoicesCalculate",
  } as never);
  const handleGetFile = (file: any) => {
    fetchSaveImage(file[0])
      .then((res) => {
        setImageId(res.data);
      })
      .catch(function (error) {
        enqueueSnackbar("Load ảnh thất bại", { variant: "error" });
      });
  };
  const getPathImage = async (id: string) => {
    const getFile = await fetchImagePath(id);
    return getFile;
  };
  const handleOpenAddCard = () => {
    setIsOpenCard(true);
  };
  const handleCloseAddCard = () => {
    setIsOpenCard(false);
  };
  useEffect(() => {
    if (rowInfo) {
      getPathImage(rowInfo.imageId).then((res) => {
        URL.createObjectURL(res.data);
        setImagePath(URL.createObjectURL(res.data));
      });

      let dataTable: any[] = [];
      let invoicesCalculate = [
        {
          intake: rowInfo.intake, //thu
          payout: rowInfo.payout, // chi
          loan: rowInfo.number, // công nợ
          repayment: rowInfo.number,
        },
      ];
      if (rowInfo.bills.length > 0) {
        rowInfo.bills.map((item: any) => {
          dataTable.push({
            ...item,
            money: item.moneyAmount,
            calculatedProfit: item.calculatedProfit,
            pos: {
              values: item.pos.code,
              key: item.pos.id,
            },
            check: "",
          });
        });
        dataTable.unshift({
          pos: {
            values: "",
            key: "",
          },
          id: "",
          money: "",
          fee: "",
          check: "TOTAL",
          calculatedProfit: "",
        });
      }
      reset({
        codeEmployee: rowInfo?.employee.name,
        percentageFee: rowInfo?.percentageFee,
        shipmentFee: rowInfo?.percentageFee,
        customerName: {
          key: rowInfo?.customerCard.id,
          values: rowInfo?.customerCard.name,
          nationalId: "",
        },
        cardCustomer: {
          key: rowInfo?.customerCard.id,
          values: rowInfo?.customerCard.name,
        },
        invoices: dataTable,
        invoicesCalculate: invoicesCalculate,
        imageId: rowInfo?.imageId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowInfo]);
  const {
    fields: invoicesField,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "invoices",
  });

  const onAdd = () => {
    const item = {
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
      feeafterpay: 0,
      billcode: "",
      check: "",
    };
    append(item);
  };
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        width: 20,
        sortable: false,
        headerName: "STT",
        renderCell: (params: GridRenderCellParams) => {
          if (params.row.check === "TOTAL") {
            return "";
          }
          const index = params.api.getRowIndex(params.row.id);
          return +index;
        },
      },
      {
        headerName: "Mã Pos",
        field: "pos",
        width: 120,
        headerAlign: "left",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.check !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        // editable: true,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.check !== "TOTAL") {
            return (
              <InputSearchPos
                control={control}
                name={`invoices.${index}.pos`}
                watch={watch}
                setValue={setValue}
              />
            );
          }
          return <p></p>;
        },
      },
      {
        headerName: "Số tiền",
        field: "money",
        width: 120,
        sortable: false,
        // editable: true,
        type: "number",
        headerAlign: "left",
        align: "left",
        cellClassName: (params: GridCellParams) => {
          if (params.row.check !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.check !== "TOTAL") {
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
          if (isNaN(money)) {
            return 0;
          }
          return getValueWithComma(money);
        },
      },
      {
        headerName: "Tiền phí",
        field: "fee",
        width: 120,
        headerAlign: "left",
        sortable: false,
        editable: false,
        align: "left",
        type: "number",
        valueGetter: (params: GridValueGetterParams) => {
          const index = params.api.getRowIndex(params.row.id);
          const restOfFee =
            +watch(`invoices.${index}.money`) * (+watch("percentageFee") / 100);
          if (params.row.check === "TOTAL") {
            let fee = 0;
            fee = watch("invoices").reduce(
              (total, { money }) =>
                (total += +money * (+watch("percentageFee") / 100)),
              0
            );
            return fee;
          }
          return restOfFee;
        },
        cellClassName: (params: GridCellParams) => {
          if (params.row.check !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      {
        headerName: "Tiền sau phí",
        field: "feeafterpay",
        headerAlign: "left",
        width: 120,
        sortable: false,
        editable: false,
        align: "left",
        type: "number",
        valueGetter: (params: GridValueGetterParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.check === "TOTAL") {
            let fee = 0;
            fee = watch("invoices").reduce(
              (total, { money }) =>
                (total += +money - +money * (+watch("percentageFee") / 100)),
              0
            );
            return fee;
          }
          const feeafterpay =
            +watch(`invoices.${index}.money`) -
            +watch(`invoices.${index}.money`) * (+watch("percentageFee") / 100);
          return feeafterpay;
        },
        cellClassName: (params: GridCellParams) => {
          if (params.row.check !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        width: 120,
        sortable: false,
        align: "center",
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.check !== "TOTAL" && params.row?.code === null) {
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
        width: 162,
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
        width: 162,
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
        width: 162,
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
        width: 162,
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
  const handleSubmitInvoice = () => {
    let receiptBills: any[] = [];
    watch("invoices").map((item, index) => {
      if (item?.check !== "TOTAL") {
        if (item.pos.key !== "") {
          receiptBills.push({
            billId: "",
            posId: item?.pos?.key,
            moneyAmount: +item?.money,
            fee: +item?.money * (+watch("percentageFee") / 100),
          });
        }
      }
      return item;
    });

    const request: ReceiptCreationParams = {
      imageId: watch("imageId"),
      branchId: branchId,
      customerCardId: watch("cardCustomer").key,
      percentageFee: +watch("percentageFee"),
      shipmentFee: +watch("shipmentFee"),
      intake: watch("invoicesCalculate")[0].intake,
      payout: watch("invoicesCalculate")[0].payout,
      loan: watch("invoicesCalculate")[0].loan,
      repayment: watch("invoicesCalculate")[0].repayment,
      employeeId: rowInfo.employee.id,
      receiptBills: receiptBills,
    };
    updateInvoice(rowInfo.id, request)
      .then((res) => {
        enqueueSnackbar("Cập nhật hóa đơn thành công!!", {
          variant: "success",
        });
        reset();
        handleCloseDrawer();
        handleSearch();
      })
      .catch(function (error) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Dữ liệu không hợp lệ", { variant: "error" });
        }
      });
  };
  const getDataCustomerFromApi = (value: string) => {
    if (value !== "") {
      // dispatch(fetchSearchCustomer({ customerName: value }));
    }
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  let totalfee = 0;
  if (watch("invoices")) {
    totalfee = watch("invoices").reduce(
      (total, { money }) =>
        (total += +money - +money * (+watch("percentageFee") / 100)),
      0
    );
  }
  const handleGetCard = () => {};
  const handleSearchCheck = () => {};

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  return (
    <DrawerCustom
      widthDrawer={750}
      isOpen={isOpen}
      title="Thông tin hóa đơn"
      handleClose={handleCloseDrawer}
    >
      {rowInfo && (
        <form
          style={{ padding: 16 }}
          onKeyPress={handleKeyPress}
          onSubmit={handleSubmit(handleSubmitInvoice)}
        >
          <PageContent>
            <SearchContainer>
              <StyleContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Mã Nhân Viên</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    {...register("codeEmployee")}
                    disable={"true"}
                  />
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Phần trăm phí</LabelComponent>
                  <TextFieldCustom
                    iconend={<p style={{ width: 24 }}>%</p>}
                    {...register("percentageFee", {
                      required: "Phần trăm phí bắt buộc",
                    })}
                    onChange={(e: any) => {
                      setValue(
                        "percentageFee",
                        e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                      );
                    }}
                  />
                  <TextHelper>
                    {errors.percentageFee && errors.percentageFee.message}
                  </TextHelper>
                </StyleInputContainer>

                <StyleInputContainer>
                  <LabelComponent require={true}>Phí vận chuyển</LabelComponent>
                  <TextFieldCustom
                    iconend={<p style={{ width: 24 }}>VND</p>}
                    {...register("shipmentFee", {
                      required: "Phí vận chuyển bắt buộc",
                    })}
                    onChange={(e: any) => {
                      setValue(
                        "shipmentFee",
                        e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                      );
                    }}
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
                      results: [],
                      label: "",
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
                      results: [],
                      label: "",
                      type: "text",
                      setValue: setValue,
                      labelWidth: "100",
                      getData: handleGetCard,
                    }}
                  />
                  <StyleButtonSpan>
                    {rowInfo?.code === null && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleOpenAddCard}
                      >
                        Thêm Thẻ
                      </Button>
                    )}
                  </StyleButtonSpan>
                </StyleInputContainer>
                <InfoBankCard>
                  <InfoOutlinedIcon />
                  {`${rowInfo.customerCard.cardType.name} - ${rowInfo.customerCard.bank} - ${rowInfo.customerCard.accountNumber}`}
                </InfoBankCard>
              </StyleContainer>
            </SearchContainer>

            <StyleDataGrid>
              {rowInfo?.code === null && (
                <Button variant="contained" size="small" onClick={onAdd}>
                  Thêm bill
                </Button>
              )}

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
                  // processRowUpdate={handleProcessRowUpdate}
                  rowCount={100}
                  getRowId={getRowId}
                />
              </Box>
            </StyleDataGrid>
            <StyleDataGrid2>
              <label style={{ fontSize: 16, fontWeight: "bold" }}>
                Cân đối kế toán
              </label>
              <TableDataComponent
                columns={columnsOther}
                dataInfo={invoicesCalculateField}
                disableFilter={true}
                isPage={true}
                // processRowUpdate={handleProcessRowUpdate2}
                rowCount={100}
                getRowId={getRowId}
              />
            </StyleDataGrid2>
            <ContainerSum>
              <StyleInputContainer>
                <label style={{ fontSize: 17, fontWeight: "bold" }}>
                  TỔNG TIỀN SAU PHÍ
                </label>
                <TextFieldCustom
                  type={"text"}
                  disable="true"
                  value={
                    !isNaN(+totalfee)
                      ? getValueWithComma(
                          totalfee - +watch("shipmentFee")
                        ).toString()
                      : "0"
                  }
                />
              </StyleInputContainer>
              <StyleInputContainer>
                <ImageUpload
                  handleGetFile={handleGetFile}
                  filePath={imagePath}
                />
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
              {rowInfo?.code === null && (
                <Button size="small" variant="contained" type="submit">
                  Cập nhật
                </Button>
              )}
            </Box>
          </PageContent>
          <NewCardCustomer
            isOpen={isOpenCard}
            handleCloseDrawer={handleCloseAddCard}
            handleSearch={handleSearchCheck}
          />
        </form>
      )}
    </DrawerCustom>
  );
};

export default ViewInvoiceDrawer;
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
  width: 683px;
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
