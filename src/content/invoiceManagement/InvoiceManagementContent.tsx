"use client";
import Dashboard from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import { Operators } from "@/components/common/DataGrid";
import {
  GridCellParams,
  GridColDef,
  GridSortModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
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
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import styled from "styled-components";
import {
  ROLE,
  cookieSetting,
  formatDate,
  formatDateTime,
  getDateOfPresent,
  getValueWithComma,
} from "@/utils";
import {
  ColReceiptList,
  InvoiceConfirmParams,
  InvoiceSumTotal,
  RangeNumberFilterProps,
  ReceiptParamsConditions,
  RepayConfirmParams,
} from "@/models/InvoiceManagement";
import { DateRangePicker } from "@/components/common/DatePickerComponent";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { TextFieldCustom } from "@/components/common/Textfield";
import SearchDrawer from "./Drawer/SearchDrawer";
import { ApproveDialogComponent } from "./Drawer/ApproveDialog";
import {
  conrimEditNoteInvoice,
  conrimInvoice,
  conrimRepayInvoice,
  deleteInvoice,
  fetchInvoiceDetail,
  fetchInvoiceSumTotal,
  fetchSaveImage,
} from "@/api/service/invoiceManagement";
import { enqueueSnackbar } from "notistack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ViewInvoiceDrawer from "./Drawer/ViewInvoiceDrawer";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { DialogDeleteComponent } from "@/components/dialogDelete/DialogDelete";
import { RepayDialogComponent } from "./Drawer/RepayDialog";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { NoteDialogComponent } from "./Drawer/NoteDialog";
const date = new Date();
const previous = new Date(date.getTime());
previous.setDate(date.getDate() - 30);
const offsetInMinutes = previous.getTimezoneOffset();
previous.setMinutes(previous.getMinutes() - offsetInMinutes);
const dateNext = new Date();
const nextDay = new Date(dateNext.getTime());
nextDay.setDate(dateNext.getDate() + 1);
const offsetInMinutes2 = nextDay.getTimezoneOffset();
nextDay.setMinutes(nextDay.getMinutes() - offsetInMinutes2);

const initialInvoiceSearch = {
  page: 0,
  pageSize: 10,
  sorter: "createdDate",
  sortDirection: "DESC",
  fromCreatedDate: previous.toISOString(),
  toCreatedDate: nextDay.toISOString(),
  branchCodes: "",
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
  const [isOpenRepay, setIsOpenRepay] = useState(false);
  const [isOpenNote, setIsOpenNote] = useState(false);

  const [rowInfo, setRowInfo] = useState();
  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [receiptsId, setReceiptsId] = useState("");
  const [receiptsIdNote, setReceiptsIdNote] = useState("");

  const [imageId, setImageId] = useState("");
  const branchCodes = cookieSetting.get("branchCode");
  const branchesCodeList = cookieSetting.get("branchesCodeList");
  const role = cookieSetting.get("roles");
  const userCode = cookieSetting.get("code");

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
  const [searchCondition, setSearchCondition] = useState({
    ...initialInvoiceSearch,
    branchCodes: "",
    employeeId: "",
    createdBy: role === ROLE.EMPLOYEE ? userCode : "",
  });
  const [openApprovingDialog, setOpenApprovingDialog] = useState(false);

  useEffect(() => {
    if (branchesCodeList) {
      let codeBranch = "";
      JSON.parse(branchesCodeList).map(
        (item: { branch: any }, index: number) => {
          if (JSON.parse(branchesCodeList).length === index + 1) {
            codeBranch = codeBranch + item.branch?.code;
          } else {
            codeBranch = codeBranch + item.branch?.code + ",";
          }
        }
      );
      setSearchCondition({
        ...searchCondition,
        branchCodes: role === ROLE.ADMIN ? codeBranch : "",
      });
      dispatch(
        fetchInvoice({
          ...searchCondition,
          branchCodes: role === ROLE.ADMIN ? codeBranch : "",
        })
      );
      dispatch(
        fetchSumInvoice({
          ...searchCondition,
          branchCodes: role === ROLE.ADMIN ? codeBranch : "",
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchesCodeList]);
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
        fromCreatedDate: formatDate(previous.getTime()),
        toCreatedDate: getDateOfPresent(),
        toRepayment: 0,
        formConfirm: {
          receiptId: "",
          explanation: "",
          imageId: "",
          repaidAmount: 0,
        },
        formRepay: {
          receiptId: "",
          explanation: "",
          repaidAmount: 0,
        },
        noteInfo: "",
      },
    });

  const handleCloseDeleteForm = () => {
    setIsDeleteForm(false);
  };
  const handleOpenDeleteForm = (id: string) => {
    setReceiptsId(id);
    setIsDeleteForm(true);
  };
  const handleConfirmDeleteForm = () => {
    deleteInvoice(receiptsId)
      .then((res) => {
        enqueueSnackbar("Xóa thành công!!", { variant: "success" });
        handleCloseDeleteForm();
        handleSearch();
      })
      .catch(function (error: any) {
        enqueueSnackbar("Xóa thất bại", { variant: "error" });
      });
  };
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
  const handleCloseRepay = () => {
    setValue("formConfirm.explanation", "");
    setValue("formConfirm.receiptId", "");
    setValue("formConfirm.repaidAmount", 0);
    setIsOpenRepay(false);
  };

  const handleOpenRepay = (id: string) => {
    setReceiptsId(id);
    setIsOpenRepay(true);
  };

  const handleClickConfirmRepay = () => {
    const bodySend: RepayConfirmParams = {
      receiptId: receiptsId,
      explanation: watch("formRepay.explanation"),
      repaidAmount: watch("formRepay.repaidAmount"),
      imageId: imageId,
    };
    conrimRepayInvoice(bodySend)
      .then((res) => {
        enqueueSnackbar("Hoàn trả thành công", { variant: "success" });
        handleCloseRepay();
        handleSearch();
      })
      .catch(function (error: any) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Hoàn trả thất bại", { variant: "error" });
        }
      });
  };
  const handleCloseNote = () => {
    setIsOpenNote(false);
  };
  const handleOpenNote = (id: string, note: string) => {
    setReceiptsIdNote(id);
    setValue("noteInfo", note);
    setIsOpenNote(true);
  };
  const handleClickConfirmNote = () => {
    const bodySend = {
      id: receiptsIdNote,
      note: watch("noteInfo"),
    };
    conrimEditNoteInvoice(bodySend)
      .then((res) => {
        enqueueSnackbar("Tạo/Sửa ghi chú thành công", { variant: "success" });
        handleCloseNote();
        handleSearch();
      })
      .catch(function (error: any) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Tạo/Sửa ghi chú thất bại", { variant: "error" });
        }
      });
  };
  const handleGetFile = (file: any) => {
    if (!file || file[0].size > 5 * 1024 * 1024) {
      enqueueSnackbar("File ảnh phải nhỏ hơn 5MB", { variant: "error" });
      return;
    }
    fetchSaveImage(imageId, file[0])
      .then((res) => {
        setImageId(res.data);
      })
      .catch(function (error) {
        enqueueSnackbar("Load ảnh thất bại", { variant: "error" });
      });
  };
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
    const offsetInMinutes = fromDate.getTimezoneOffset();
    fromDate.setMinutes(fromDate.getMinutes() - offsetInMinutes);

    const gettoDate = new Date(toCreatedDate);
    const toDate = new Date(gettoDate.setDate(gettoDate.getDate() + 1));

    const offsetInMinutes2 = toDate.getTimezoneOffset();
    toDate.setMinutes(toDate.getMinutes() - offsetInMinutes2);

    const bodySend = {
      ...searchCondition,
      receiptCode: receiptCode,
      fromTransactionTotal:
        fromTransactionTotal === 0
          ? ""
          : _.toNumber(fromTransactionTotal.toString().replace(",", "")),
      toTransactionTotal:
        toTransactionTotal === 0
          ? ""
          : _.toNumber(toTransactionTotal.toString().replace(",", "")),
      fromIntake: fromIntake === 0 ? "" : +fromIntake,
      fromEstimatedProfit:
        fromEstimatedProfit === 0 ? "" : +fromEstimatedProfit,
      fromLoan: fromLoan === 0 ? "" : +fromLoan,
      fromPayout: fromPayout === 0 ? "" : +fromPayout,
      fromRepayment: fromRepayment === 0 ? "" : +fromRepayment,
      toEstimatedProfit: toEstimatedProfit === 0 ? "" : +toEstimatedProfit,
      toIntake: toIntake === 0 ? "" : +toIntake,
      toLoan: toLoan === 0 ? "" : +toLoan,
      toPayout: toPayout === 0 ? "" : +toPayout,
      toRepayment: toRepayment === 0 ? "" : +toRepayment,
      employeeId: "",
      fromCreatedDate: fromDate.toISOString(),
      toCreatedDate: toDate.toISOString(),
    };
    setSearchCondition(bodySend);
    dispatch(fetchInvoice(bodySend));
    dispatch(fetchSumInvoice(bodySend));
  };

  const handleConfirmInvoice = () => {
    const { formConfirm } = getValues();
    if (formConfirm.explanation === "") {
      enqueueSnackbar("Vui lòng điền thông tin diễn giải", {
        variant: "error",
      });
      return;
    }
    const bodySend: InvoiceConfirmParams = {
      receiptId: formConfirm.receiptId,
      explanation: formConfirm.explanation,
      imageId: formConfirm.imageId,
    };
    conrimInvoice(bodySend)
      .then((res) => {
        enqueueSnackbar("Xác nhận thành công!!", { variant: "success" });
        handleCloseApproveDialog();
        handleSearch();
        setValue("formConfirm.explanation", "");
        setValue("formConfirm.imageId", "");
      })
      .catch(function (error: any) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Dữ liệu không hợp lệ", { variant: "error" });
        }
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
  const handleChangeSearch = (value: any) => {
    setSearchCondition(value);
  };
  const columns: GridColDef<ColReceiptList>[] = [
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
      width: 165,
      headerAlign: "center",
      align: "left",
      valueGetter: ({ row }) => {
        if (row.code === "TOTAL") {
          return "";
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
      headerName: "Tên thẻ",
      field: "customerCardName",
      width: 200,
      headerAlign: "center",
      align: "left",
      valueGetter: ({ row }) => {
        if (row.code === "TOTAL") {
          return "";
        }
        return (
          row.customerCardName +
          "-" +
          row.customerCardNumber.toString().slice(-4)
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      headerName: "Tổng giao dịch",
      field: "transactionTotal",
      width: 130,
      headerAlign: "center",
      align: "center",
      cellClassName: (params: GridCellParams<ColReceiptList>) => {
        if (params.row.code !== "TOTAL") {
          return "";
        }
        return "super-app-theme--cell";
      },
      valueGetter: (params: GridValueGetterParams) => {
        return getValueWithComma(params.value);
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
      width: 130,
      headerAlign: "center",
      align: "center",
      cellClassName: (params: GridCellParams<ColReceiptList>) => {
        if (params.row.code !== "TOTAL") {
          return "";
        }
        return "super-app-theme--cell";
      },
      valueGetter: (params: GridValueGetterParams) => {
        return getValueWithComma(params.value);
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
      width: 130,
      headerAlign: "center",
      align: "center",
      cellClassName: (params: GridCellParams<ColReceiptList>) => {
        if (params.row.code !== "TOTAL") {
          return "";
        }
        return "super-app-theme--cell";
      },
      valueGetter: (params: GridValueGetterParams) => {
        return getValueWithComma(params.value);
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
      width: 130,
      headerAlign: "center",
      align: "center",
      hide: role === ROLE.ADMIN ? false : true,
      valueGetter: (params: GridValueGetterParams) => {
        return getValueWithComma(params.value);
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
      width: 130,
      headerAlign: "center",
      align: "center",
      hide: true,
      valueGetter: (params: GridValueGetterParams) => {
        return getValueWithComma(params.value);
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
      headerName: "Lợi nhuận ước tính",
      field: "estimatedProfit",
      headerAlign: "center",
      align: "center",
      width: 140,
      hide: true,
      valueGetter: (params: GridValueGetterParams) => {
        return getValueWithComma(params.value);
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
            <RangeNumberFilter
              handleSearch={handleSearch}
              register={register}
              fromNumberName="fromEstimatedProfit"
              toNumberName="toEstimatedProfit"
            />
          );
        },
        value: "input",
        label: "input",
      }),
    },
    {
      headerName: "Lợi nhuận thực tế",
      field: "calculatedProfit",
      headerAlign: "center",
      align: "center",
      width: 140,
      valueGetter: (params: GridValueGetterParams) => {
        return getValueWithComma(params.value);
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
    },
    {
      headerName: "Thao Tác",
      field: "actions",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      width: 190,
      renderCell: ({ row }) => {
        return (
          <>
            {row.code !== "TOTAL" ? (
              <Tooltip title={row.note} placement="top">
                <IconButton
                  color="error"
                  onClick={() => handleOpenNote(row.id, row.note)}
                >
                  <EditNoteIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            ) : (
              <div></div>
            )}
            {row.code === null && role !== ROLE.EMPLOYEE ? (
              <IconButton
                color="success"
                onClick={() => handleOpenApproveDialog(row.id)}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
              </IconButton>
            ) : (
              <div></div>
            )}

            {row.code !== "TOTAL" ? (
              <IconButton
                color="info"
                onClick={() => handleOpenViewDrawer(row.id)}
              >
                <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            ) : (
              <div></div>
            )}
            {+row.loan > +row.repayment &&
            row.code !== "TOTAL" &&
            row.code !== null ? (
              // row.receiptStatusEnum === "COMPLETED"
              <IconButton color="info" onClick={() => handleOpenRepay(row.id)}>
                <CurrencyExchangeIcon sx={{ fontSize: 20 }} />
              </IconButton>
            ) : (
              <div></div>
            )}

            {row.code === null ? (
              <IconButton
                color="error"
                onClick={() => handleOpenDeleteForm(row.id)}
              >
                <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            ) : (
              <div></div>
            )}
          </>
        );
      },
    },
  ];
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const onPageChange = (pageNumber: number) => {
    const searchPage = {
      ...searchCondition,
      page: pageNumber,
    };
    setSearchCondition({ ...searchPage });
    dispatch(fetchInvoice(searchPage));
  };
  const onPageSizeChange = (pageSize: number) => {
    const searchPage = {
      ...searchCondition,
      pageSize: pageSize,
    };
    setSearchCondition({ ...searchPage });
    dispatch(fetchInvoice(searchPage));
  };

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel[0]) {
      const sortPage = {
        ...searchCondition,
        sorter: sortModel[0].field,
        sortDirection: sortModel[0]?.sort?.toString().toUpperCase(),
      };
      // setSearchCondition({...sortPage});
      dispatch(fetchInvoice(sortPage));
    }
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  const dynamicColumns = useMemo(
    () =>
      columns.filter((item) => {
        if (
          (item.field === "calculatedProfit" ||
            item.field === "estimatedProfit") &&
          role !== ROLE.ADMIN
        ) {
          return false;
        }
        return true;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listOfInvoice, sumInvoiceRow]
  );
  return (
    <Dashboard>
      <h3 style={{ textAlign: "left" }}>QUẢN LÝ HÓA ĐƠN</h3>
      <div>
        <Box
          sx={{
            margin: "7px 0px",
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
              width: "100%",
              "& .super-app-theme--cell": {
                backgroundColor: "#EAEAEA",
                color: "#1a3e72",
                fontWeight: "600",
                display: "flex",
                justifyContent: "flex-end !important",
              },
            }}
          >
            <TableDataComponent
              columns={dynamicColumns}
              dataInfo={
                listOfInvoice.length !== 0
                  ? [sumInvoiceRow, ...listOfInvoice]
                  : []
              }
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
            setValue={setValue}
            handleClickClose={handleCloseApproveDialog}
            handleClickConfirm={handleConfirmInvoice}
            openDialog={openApprovingDialog}
          />
          <NoteDialogComponent
            openDialog={isOpenNote}
            handleClickConfirm={handleClickConfirmNote}
            control={control}
            handleClickClose={handleCloseNote}
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
          searchCondition={searchCondition}
          handleChangeSearch={handleChangeSearch}
        />
        <ViewInvoiceDrawer
          handleCloseDrawer={handleCloseViewDrawer}
          isOpen={isOpenViewDrawer}
          rowInfo={rowInfo}
          handleSearch={handleSearch}
        />
        <DialogDeleteComponent
          openDialog={isDeleteForm}
          handleClickClose={handleCloseDeleteForm}
          handleClickConfirm={handleConfirmDeleteForm}
        />
        <RepayDialogComponent
          openDialog={isOpenRepay}
          handleClickConfirm={handleClickConfirmRepay}
          control={control}
          handleClickClose={handleCloseRepay}
          handleGetFile={handleGetFile}
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
