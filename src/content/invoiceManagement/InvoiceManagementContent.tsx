"use client";
import Dashboard from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import { Operators } from "@/components/common/DataGrid";
import DrawerCustom from "@/components/common/Drawer";
import { InputNumber } from "@/components/common/InputCustom";
import BasicSelect from "@/components/common/Select";
import {
  GridCellParams,
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import {
  fetchInvoice,
  fetchSumInvoice,
} from "@/actions/InvoiceManagementActions";
import _ from "lodash";
import TableDataComponent from "@/components/common/DataGrid";
import InvoiceDrawer from "./Drawer/InvoiceDrawer";
import { Box, Button, IconButton } from "@mui/material";
import styled from "styled-components";
import { formatDateTime } from "@/utils";
import {
  ColReceiptList,
  InvoiceConfirmParams,
  InvoiceSumTotal,
  RangeNumberFilterProps,
  ReceiptParamsConditions,
} from "@/models/InvoiceManagement";
import { DateRangePicker } from "@/components/common/DatePickerComponent";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { TextFieldCustom } from "@/components/common/Textfield";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import SearchDrawer from "./Drawer/SearchDrawer";
import { ApproveDialogComponent } from "./Drawer/ApproveDialog";
import {
  conrimInvoice,
  fetchInvoiceDetail,
  fetchInvoiceSumTotal,
} from "@/api/service/invoiceManagement";
import { enqueueSnackbar } from "notistack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import clsx from "clsx";
import ViewInvoiceDrawer from "./Drawer/ViewInvoiceDrawer";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
const initialInvoiceSearch = {
  page: 0,
  pageSize: 10,
  sorter: "code",
  sortDirection: "ASC",
};

export const RangeNumberFilter = (props: RangeNumberFilterProps) => {
  const { fromNumberName, toNumberName, register, handleSearch } = props;
  return (
    <>
      <StyleRangeFilter>
        <StyleFilterContainer>
          <StyleTitleSearch>Từ</StyleTitleSearch>
          <TextFieldCustom
            type={"number"}
            variantshow="standard"
            textholder="Lọc giá trị"
            {...register(fromNumberName, { required: true })}
          />
        </StyleFilterContainer>
        <StyleFilterContainer>
          <StyleTitleSearch>Đến</StyleTitleSearch>
          <TextFieldCustom
            type={"number"}
            variantshow="standard"
            textholder="Lọc giá trị"
            {...register(toNumberName, { required: true })}
          />
        </StyleFilterContainer>
      </StyleRangeFilter>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 2,
        }}
      >
        <Button size="small" onClick={handleSearch} style={{ width: 81 }}>
          xác nhận
        </Button>
      </div>
    </>
  );
};
export default function InvoiceManagementContent() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [isOpenDrawInvoice, setIsOpenDrawInvoice] = useState(false);
  const [isOpenSearchDrawer, setIsOpenSearchDrawer] = useState(false);
  const [isOpenViewDrawer, setIsOpenViewDrawer] = useState(false);
  const [rowInfo, setRowInfo] = useState();

  const listOfInvoice = useSelector(
    (state: RootState) => state.invoiceManagement.listOfInvoice
  );
  const sumInvoiceRow = useSelector(
    (state: RootState) => state.invoiceManagement.totalSumRow
  );
  const pagination = useSelector(
    (state: RootState) => state.invoiceManagement.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.invoiceManagement.isLoading
  );
  const [searchCondition, setSearchCondition] = useState(initialInvoiceSearch);
  const [openApprovingDialog, setOpenApprovingDialog] = useState(false);

  const { register, handleSubmit, getValues, setValue, watch, reset, control } =
    useForm({
      defaultValues: {
        receiptCode: "",
        fromTransactionTotal: 0,
        toTransactionTotal: 0,
        fromIntake: 0,
        fromEstimatedProfit: 0,
        fromLoan: 0,
        fromPayout: 0,
        fromRepayment: 0,
        toEstimatedProfit: 0,
        toIntake: 0,
        toLoan: 0,
        toPayout: 0,
        fromCreatedDate: new Date(),
        toCreatedDate: new Date(),
        toRepayment: 0,
        formConfirm: {
          receiptId: "",
          category1: 1,
          explanation: "",
        },
      },
    });
  const handleCloseInvoiceDraw = () => {
    setIsOpenDrawInvoice(false);
  };
  const handleOpenInvoiceDraw = () => {
    setIsOpenDrawInvoice(true);
  };
  const handleCloseSearchDrawer = () => {
    setIsOpenSearchDrawer(false);
  };
  const handleOpenSearchDrawer = () => {
    setIsOpenSearchDrawer(true);
  };
  const handleCloseViewDrawer = () => {
    setIsOpenViewDrawer(false);
  };
  const handleOpenViewDrawer = (id: string) => {
    fetchInvoiceDetail(id).then((res) => {
      setRowInfo(res.data);
      setIsOpenViewDrawer(true);
    });
  };
  const getSumTotalRow = async () => {
    const response = await fetchInvoiceSumTotal(searchCondition);
    return response;
  };
  useEffect(() => {
    dispatch(fetchInvoice(searchCondition));
    dispatch(fetchSumInvoice(searchCondition));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    const {
      fromEstimatedProfit,
      toEstimatedProfit,
      fromIntake,
      toIntake,
      fromLoan,
      toLoan,
      fromPayout,
      toPayout,
      fromRepayment,
      toRepayment,
      fromTransactionTotal,
      toTransactionTotal,
      receiptCode,
      fromCreatedDate,
      toCreatedDate,
    } = getValues();
    const fromDate = new Date(fromCreatedDate);
    const toDate = new Date(toCreatedDate);
    const bodySend = {
      ...searchCondition,
      receiptCode: receiptCode,
      fromTransactionTotal:
        fromTransactionTotal === 0 ? "" : fromTransactionTotal,
      toTransactionTotal: toTransactionTotal === 0 ? "" : toTransactionTotal,
      fromIntake: fromIntake === 0 ? "" : fromIntake,
      fromEstimatedProfit: fromEstimatedProfit === 0 ? "" : fromEstimatedProfit,
      fromLoan: fromLoan === 0 ? "" : fromLoan,
      fromPayout: fromPayout === 0 ? "" : fromPayout,
      fromRepayment: fromRepayment === 0 ? "" : fromRepayment,
      toEstimatedProfit: toEstimatedProfit === 0 ? "" : toEstimatedProfit,
      toIntake: toIntake === 0 ? "" : toIntake,
      toLoan: toLoan === 0 ? "" : toLoan,
      toPayout: toPayout === 0 ? "" : toPayout,
      toRepayment: toRepayment === 0 ? "" : toRepayment,
      fromCreatedDate: fromDate.toISOString(),
      toCreatedDate: toDate.toISOString(),
    };
    setSearchCondition(bodySend);
    dispatch(fetchInvoice(bodySend));
    dispatch(fetchSumInvoice(bodySend));
  };

  // const itemFilter = [
  //   // {
  //   //   id: "1",
  //   //   columnField: "code",
  //   //   value: "input",
  //   //   operatorValue: "input",
  //   // },
  //   {
  //     id: "2",
  //     columnField: "percentageFee",
  //     value: "SelectItem",
  //     operatorValue: "SelectItem",
  //   },
  // ];
  const handleConfirmInvoice = () => {
    const bodySend: InvoiceConfirmParams = {
      receiptId: watch().formConfirm.receiptId,
      explanation: watch().formConfirm.explanation,
    };
    conrimInvoice(bodySend)
      .then((res) => {
        enqueueSnackbar("Xác nhận thành công!!", { variant: "success" });
        handleCloseApproveDialog();
        handleSearch();
        setValue("formConfirm.explanation", "");
      })
      .catch(function (error) {
        enqueueSnackbar("Xác nhận thất bại", { variant: "error" });
      });
  };
  const handleOpenApproveDialog = (id: string) => {
    setValue("formConfirm.receiptId", id);
    setOpenApprovingDialog(true);
  };
  const handleCloseApproveDialog = () => {
    setValue("formConfirm.explanation", "");
    setOpenApprovingDialog(false);
  };
  const columns: GridColDef<ColReceiptList>[] = useMemo(
    () => [
      {
        headerName: "Ngày Tạo",
        field: "createdDate",
        headerAlign: "center",
        width: 147,
        valueGetter: ({ row }) => {
          if (row.code === "TOTAL") {
            return "";
          }
          return formatDateTime(row.createdDate);
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <Box width={203} sx={{ padding: "12px 0px" }}>
                <DateRangePicker
                  setvalue={setValue}
                  fromdatename={"fromCreatedDate"}
                  todatename={"toCreatedDate"}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 2,
                  }}
                >
                  <Button
                    onClick={handleSearch}
                    size="small"
                    style={{ width: 81 }}
                  >
                    xác nhận
                  </Button>
                </div>
              </Box>
            );
          },
          value: "input",
          label: "input",
        }),
      },
      {
        headerName: "Mã Hóa Đơn",
        field: "code",
        width: 140,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          if (row.code === "TOTAL") {
            return "TỔNG";
          }
          return row.code;
        },
        cellClassName: (params: GridCellParams<ColReceiptList>) => {
          if (params.row.code !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <>
                <StyleFilterContainer>
                  <StyleTitleSearch>Giá trị</StyleTitleSearch>
                  <TextFieldCustom
                    type={"text"}
                    variantshow="standard"
                    textholder="Lọc giá trị"
                    focus={"true"}
                    {...register("receiptCode", { required: true })}
                  />
                </StyleFilterContainer>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 2,
                  }}
                >
                  <Button
                    onClick={handleSearch}
                    size="small"
                    style={{ width: 81 }}
                  >
                    xác nhận
                  </Button>
                </div>
              </>
            );
          },
          value: "input",
          label: "input",
        }),
      },
      {
        headerName: "Tổng giao dịch",
        field: "transactionTotal",
        width: 140,
        headerAlign: "center",
        align: "center",
        cellClassName: (params: GridCellParams<ColReceiptList>) => {
          if (params.row.code !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <RangeNumberFilter
                handleSearch={handleSearch}
                register={register}
                fromNumberName="fromTransactionTotal"
                toNumberName="toTransactionTotal"
              />
            );
          },
          value: "input",
          label: "input",
        }),
      },
      {
        headerName: "Thu",
        field: "intake",
        width: 140,
        headerAlign: "center",
        align: "center",
        cellClassName: (params: GridCellParams<ColReceiptList>) => {
          if (params.row.code !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <RangeNumberFilter
                handleSearch={handleSearch}
                register={register}
                fromNumberName="fromIntake"
                toNumberName="toIntake"
              />
            );
          },
          value: "input",
          label: "input",
        }),
      },
      {
        headerName: "Chi",
        field: "payout",
        width: 140,
        headerAlign: "center",
        align: "center",
        cellClassName: (params: GridCellParams<ColReceiptList>) => {
          if (params.row.code !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <RangeNumberFilter
                handleSearch={handleSearch}
                register={register}
                fromNumberName="fromPayout"
                toNumberName="toPayout"
              />
            );
          },
          value: "input",
          label: "input",
        }),
      },
      {
        headerName: "Công nợ",
        field: "loan",
        width: 140,
        headerAlign: "center",
        align: "center",
        cellClassName: (params: GridCellParams<ColReceiptList>) => {
          if (params.row.code !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <RangeNumberFilter
                handleSearch={handleSearch}
                register={register}
                fromNumberName="fromLoan"
                toNumberName="toLoan"
              />
            );
          },
          value: "input",
          label: "input",
        }),
      },
      {
        headerName: "Thu nợ",
        field: "repayment",
        width: 140,
        headerAlign: "center",
        align: "center",
        cellClassName: (params: GridCellParams<ColReceiptList>) => {
          if (params.row.code !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <RangeNumberFilter
                handleSearch={handleSearch}
                register={register}
                fromNumberName="fromRepayment"
                toNumberName="torePayment"
              />
            );
          },
          value: "input",
          label: "input",
        }),
      },
      {
        headerName: "Lợi nhuận gộp",
        field: "calculatedProfit",
        headerAlign: "center",
        align: "center",
        width: 140,
        cellClassName: (params: GridCellParams<ColReceiptList>) => {
          if (params.row.code !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <RangeNumberFilter
                handleSearch={handleSearch}
                register={register}
                fromNumberName="fromCalculatedProfit"
                toNumberName="toCalculatedProfit"
              />
            );
          },
          value: "input",
          label: "input",
        }),
        // valueGetter: ({ row }) => {
        //   if (row.createdDate === "TOTAL") {
        //     // return row.total;
        //   }
        //   return 0;
        // },
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 197,
        renderCell: ({ row }) => {
          return (
            <>
              <IconButton
                color="success"
                onClick={() => handleOpenApproveDialog(row.id)}
              >
                {row.code === null && (
                  <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
              <IconButton
                color="info"
                onClick={() => handleOpenViewDrawer(row.id)}
              >
                {row.code !== "TOTAL" && (
                  <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
              <IconButton color="error">
                {row.code === null && (
                  <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </>
          );
        },
      },
    ],
    []
  );
  const onPageChange = (pageNumber: number) => {
    const searchPage = {
      ...searchCondition,
      page: pageNumber,
    };
    dispatch(fetchInvoice(searchPage));
  };
  const onPageSizeChange = (pageSize: number) => {
    const searchPage = {
      ...searchCondition,
      pageSize: pageSize,
    };
    dispatch(fetchInvoice(searchPage));
  };

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel[0]) {
      const sortPage = {
        ...searchCondition,
        sorter: sortModel[0].field,
        sortDirection: sortModel[0]?.sort?.toString().toUpperCase(),
      };
      // setSearchCondition(sortPage);
      dispatch(fetchInvoice(sortPage));
    }
  };
  const getRowId = (row: any) => {
    return row.id;
  };

  return (
    <Dashboard>
      <h3 style={{ textAlign: "center" }}>QUẢN LÝ HÓA ĐƠN</h3>
      <div>
        <Box
          sx={{
            margin: "0px 13px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenInvoiceDraw()}
          >
            Thêm Hóa Đơn
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenSearchDrawer()}
          >
            Tìm kiếm
          </Button>
        </Box>
        <form style={{ width: "100%" }}>
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
              dataInfo={[sumInvoiceRow, ...listOfInvoice]}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              page={pagination?.pageNumber}
              pageSize={pagination?.size}
              rowCount={pagination?.totalElements}
              handleSortModelChange={handleSortModelChange}
              loading={isLoading}
              getRowId={getRowId}
            />
          </Box>
          <ApproveDialogComponent
            control={control}
            handleClickClose={handleCloseApproveDialog}
            handleClickConfirm={handleConfirmInvoice}
            openDialog={openApprovingDialog}
          />
        </form>
        <InvoiceDrawer
          isOpen={isOpenDrawInvoice}
          handleCloseDrawer={handleCloseInvoiceDraw}
          handleSearch={handleSearch}
        />
        <SearchDrawer
          handleCloseDrawer={handleCloseSearchDrawer}
          isOpen={isOpenSearchDrawer}
        />
        <ViewInvoiceDrawer
          handleCloseDrawer={handleCloseViewDrawer}
          isOpen={isOpenViewDrawer}
          rowInfo={rowInfo}
        />
      </div>
    </Dashboard>
  );
}
const StyleTitleSearch = styled.p`
  font-size: 12px;
  font-weight: 400px;
  margin: 0.5px;
`;
const StyleFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3px 3px;
`;
const StyleRangeFilter = styled.div`
  display: flex;
  flex-direction: row;
  padding: 3px 3px;
`;
