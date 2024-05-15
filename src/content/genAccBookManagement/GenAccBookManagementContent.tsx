import Dashboard from "@/components/Layout";
import TableDataComponent, { Operators } from "@/components/common/DataGrid";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { GridCellParams, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { useDispatch } from "react-redux";
import { ColAccountBook } from "@/models/AccountingBookModel";
import {
  cookieSetting,
  formatDate,
  formatDateTime,
  getDateOfPresent,
  getValueWithComma,
} from "@/utils";
import {
  fetchGenAccBook,
  fetchGenSumAccBook,
} from "@/actions/GenAccBookActions";
import { GenAccountingBookSearchParams } from "@/models/GenAccountingBookModel";
import NewAccountBookDrawer from "./Drawer/NewAccountBookDrawer";
import ViewAccountBookDrawer from "./Drawer/ViewAccountBookDrawer";
import { fetchAccEntryType } from "@/actions/AccEntryTypeActions";
import {
  confirmGenNewEntry,
  conrimEditNoteGenAccountingBook,
  deleteGenAccountingBook,
  fetchDetailGenAccountingBook,
} from "@/api/service/genAccountingBook";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { DialogConfirmComponent } from "../accBookManagement/Drawer/DialogConfirm";
import { DialogDeleteComponent } from "@/components/dialogDelete/DialogDelete";
import { enqueueSnackbar } from "notistack";
import { TextFieldCustom } from "@/components/common/Textfield";
import { useForm } from "react-hook-form";
import { DateRangePicker } from "@/components/common/DatePickerComponent";
// import SelectSearchComponent from "@/components/common/AutoComplete";
import SearchDrawer from "./Drawer/SearchDrawer";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { fetchDetailEmp } from "@/api/service/empManagementApis";
import { NoteDialogComponent } from "../invoiceManagement/Drawer/NoteDialog";
import EditNoteIcon from "@mui/icons-material/EditNote";

const date = new Date();
const previous = new Date(date.getTime());
previous.setDate(date.getDate() - 30);
const offsetInMinutes = previous.getTimezoneOffset();
previous.setMinutes(previous.getMinutes() - offsetInMinutes);
const dateNext = new Date();
const nextDay = new Date(dateNext.getTime());
nextDay.setDate(dateNext.getDate());
const offsetInMinutes2 = nextDay.getTimezoneOffset();
nextDay.setMinutes(nextDay.getMinutes() - offsetInMinutes2);
export const initialPosSearch = {
  page: 0,
  pageSize: 10,
  sorter: "createdDate",
  sortDirection: "DESC",
  fromCreatedDate: previous.toISOString(),
  toCreatedDate: nextDay.toISOString(),
};
export const GenAccBookManagementContent = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [rowInfo, setRowInfo] = useState();

  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [receiptsId, setReceiptsId] = useState("");
  const [isConfirmForm, setIsConfirmForm] = useState(false);
  const [receiptsIdConfirm, setReceiptsIdConfirm] = useState("");
  const [isOpenSearchDrawer, setIsOpenSearchDrawer] = useState(false);
  const employeeId = cookieSetting.get("employeeId");
  const [receiptsIdNote, setReceiptsIdNote] = useState("");
  const [isOpenNote, setIsOpenNote] = useState(false);

  const listOfGenAccBook = useSelector(
    (state: RootState) => state.genAccBookManagement.genAccBookList
  );
  const sumOfAccBook = useSelector(
    (state: RootState) => state.genAccBookManagement.totalSumRow
  );
  const pagination = useSelector(
    (state: RootState) => state.genAccBookManagement.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.genAccBookManagement.isLoading
  );
  const [searchCondition, setSearchCondition] =
    useState<GenAccountingBookSearchParams>(initialPosSearch);
  const accEntryType = useSelector(
    (state: RootState) => state.accEntryType.accEntryTypeList
  );

  const { register, handleSubmit, getValues, setValue, watch, reset, control } =
    useForm({
      defaultValues: {
        fromCreatedDate: formatDate(previous.getTime()),
        toCreatedDate: getDateOfPresent(),
        entryCode: "",
        entryType: "",
        accountBalance: "",
        noteInfo: "",
      },
    });
  const dispatch = useDispatch();
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleOpenViewDrawer = (id: string) => {
    fetchDetailGenAccountingBook(id).then((res) => {
      setRowInfo(res.data);
      setIsOpenViewModal(true);
    });
  };
  const onPageChange = (pageNumber: number) => {
    const searchPage = {
      ...searchCondition,
      page: pageNumber,
    };
    setSearchCondition(searchPage);
    dispatch(fetchGenAccBook(searchPage));
  };
  const onPageSizeChange = (pageSize: number) => {
    const searchPage = {
      ...searchCondition,
      pageSize: pageSize,
    };
    setSearchCondition(searchPage);
    dispatch(fetchGenAccBook(searchPage));
  };
  const handleSearch = () => {
    const { fromCreatedDate, toCreatedDate, entryCode, entryType } =
      getValues();
    // let arr: any[] = [];
    // if (entryType.key) {
    //   arr.push(entryType.key);
    // }
    const fromDate = new Date(fromCreatedDate);
    const offsetInMinutes = fromDate.getTimezoneOffset();
    fromDate.setMinutes(fromDate.getMinutes() - offsetInMinutes);

    const gettoDate = new Date(toCreatedDate);
    const toDate = new Date(gettoDate.setDate(gettoDate.getDate()));

    const offsetInMinutes2 = toDate.getTimezoneOffset();
    toDate.setMinutes(toDate.getMinutes() - offsetInMinutes2);

    const bodySend = {
      ...searchCondition,
      fromCreatedDate: fromDate.toISOString(),
      toCreatedDate: toDate.toISOString(),
      entryCode: entryCode,
      entryType: entryType,
    };
    setSearchCondition(bodySend);
    dispatch(fetchGenAccBook(bodySend));
    dispatch(fetchGenSumAccBook(bodySend));
  };
  useEffect(() => {
    dispatch(fetchAccEntryType());
    dispatch(fetchGenAccBook(searchCondition));
    dispatch(fetchGenSumAccBook(searchCondition));
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchDetailEmp(employeeId).then((res: any) => {
        const rowInfo = res.data;
        setValue("accountBalance", getValueWithComma(rowInfo?.accountBalance));
      });
    }
  }, [employeeId]);
  const handleCloseSearchDrawer = () => {
    setIsOpenSearchDrawer(false);
  };
  const handleOpenSearchDrawer = () => {
    setIsOpenSearchDrawer(true);
  };
  const handleCloseViewModal = () => {
    setIsOpenViewModal(false);
  };
  const handleCloseDeleteForm = () => {
    setIsDeleteForm(false);
  };
  const handleOpenDeleteForm = (id: string) => {
    setReceiptsId(id);
    setIsDeleteForm(true);
  };
  const handleConfirmDeleteForm = () => {
    deleteGenAccountingBook(receiptsId)
      .then((res) => {
        enqueueSnackbar("Xóa thành công!!", { variant: "success" });
        handleCloseDeleteForm();
        handleSearch();
      })
      .catch(function (error: any) {
        enqueueSnackbar("Xóa thất bại", { variant: "error" });
      });
  };

  const handleCloseConfirmForm = () => {
    setIsConfirmForm(false);
  };
  const handleOpenConfirmForm = (id: string) => {
    setReceiptsIdConfirm(id);
    setIsConfirmForm(true);
  };
  const handleConfirmForm = () => {
    confirmGenNewEntry(receiptsIdConfirm)
      .then((res) => {
        enqueueSnackbar("Xác nhận thành công!!", { variant: "success" });
        handleSearch();
        handleCloseConfirmForm();
      })
      .catch(function (error: any) {
        // enqueueSnackbar("Xác nhận thất bại", { variant: "error" });
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Xác nhận thất bại", { variant: "error" });
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
    conrimEditNoteGenAccountingBook(bodySend)
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
  const getDataCustomerFromApi = (value: string) => {};

  const columns: GridColDef<ColAccountBook>[] = useMemo(
    () => [
      {
        headerName: "Ngày tạo",
        field: "createdDate",
        width: 165,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          if (row.entryCode === "TOTAL") {
            return "";
          }
          return formatDateTime(row.createdDate);
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <Box width={198} sx={{ padding: "12px 0px" }}>
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
        headerName: "Mã bút toán",
        field: "entryCode",
        width: 160,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          if (row.entryCode === "TOTAL") {
            return "";
          }
          return row.entryCode;
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
                    {...register("entryCode", { required: true })}
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
        headerName: "Định khoản",
        field: "entryType",
        width: 165,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          if (row.entryCode === "TOTAL") {
            return getValueWithComma(row.moneyAmount);
          }
          return row.entryType;
        },
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
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
                    {...register("entryType", { required: true })}
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
        headerName: "Số dư",
        field: "remainingBalance",
        width: 149,
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: ({ row }) => {
          if (row?.remainingBalance) {
            return getValueWithComma(row?.remainingBalance);
          }
          return "";
        },
      },
      {
        headerName: "Thu",
        field: "intake",
        width: 149,
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: ({ row }) => {
          if (row.transactionType === "INTAKE") {
            return getValueWithComma(row.moneyAmount);
          }
          if (row.entryCode === "TOTAL") {
            return getValueWithComma(row.intake);
          }
          return "";
        },
      },
      {
        headerName: "Chi",
        field: "payout",
        width: 149,
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: ({ row }) => {
          if (row.transactionType === "PAYOUT") {
            return getValueWithComma(row.moneyAmount);
          }
          if (row.entryCode === "TOTAL") {
            return getValueWithComma(row.payout);
          }
          return "";
        },
      },
      {
        headerName: "Công nợ",
        field: "loan",
        width: 149,
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: ({ row }) => {
          if (row.transactionType === "LOAN") {
            return row.moneyAmount;
          }
          if (row.entryCode === "TOTAL") {
            return row.loan;
          }
          return "";
        },
      },
      {
        headerName: "Thu nợ",
        field: "repayment",
        width: 149,
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: ({ row }) => {
          if (row.transactionType === "REPAYMENT") {
            return row.moneyAmount;
          }
          if (row.entryCode === "TOTAL") {
            return row.repayment;
          }
          return "";
        },
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        width: 134,
        renderCell: ({ row }) => {
          return (
            <>
              {row.entryCode !== "TOTAL" && (
                <>
                  <Tooltip title={row.note} placement="top">
                    <IconButton
                      color="error"
                      onClick={() => handleOpenNote(row.id, row.note)}
                    >
                      <EditNoteIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    color="success"
                    onClick={() => handleOpenConfirmForm(row.id)}
                  >
                    {row.entryCode === null && (
                      <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
                    )}{" "}
                  </IconButton>
                  <IconButton
                    color="info"
                    onClick={() => handleOpenViewDrawer(row.id)}
                  >
                    {row.entryCode === null ? (
                      <EditOutlinedIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteForm(row.id)}
                  >
                    {row.entryCode === null && (
                      <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </>
              )}
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accEntryType]
  );
  const handleChangeSearch = (value: any) => {
    setSearchCondition(value);
  };
  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel[0]) {
      const sortPage = {
        ...searchCondition,
        sorter: sortModel[0].field,
        sortDirection: sortModel[0]?.sort?.toString().toUpperCase(),
      };
      setSearchCondition(sortPage);
      dispatch(fetchGenAccBook(sortPage));
    }
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  return (
    <Dashboard>
      <h3 style={{ textAlign: "left" }}>SỔ KẾ TOÁN TỔNG HỢP </h3>

      <Box
        sx={{
          margin: "7px 0px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <StyleFilterContainer2>
          <StyleTitleSearch2>Số dư hiện tại</StyleTitleSearch2>
          <TextFieldCustom
            type={"text"}
            variantshow="outlined"
            textholder="Số dư hiện tại"
            disable="true"
            {...register("accountBalance")}
            iconend={<p style={{ width: 24 }}>VND</p>}
          />
        </StyleFilterContainer2>
        <div
          style={{
            margin: "7px 0px",
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "flex-end",
          }}
        >
          <div>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenModal()}
            >
              Tạo bút toán
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenSearchDrawer()}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </Box>
      <form style={{ width: "100%" }}>
        <StyleDataGrid>
          <Box
            sx={{
              width: "100%",
              "& .super-app-theme--cell": {
                backgroundColor: "#EAEAEA",
                color: "#1a3e72",
                fontWeight: "600",
                justifyContent: "flex-end !important",
              },
            }}
          >
            <TableDataComponent
              columns={columns}
              dataInfo={[sumOfAccBook, ...listOfGenAccBook]}
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
        </StyleDataGrid>
        <NoteDialogComponent
          openDialog={isOpenNote}
          handleClickConfirm={handleClickConfirmNote}
          control={control}
          handleClickClose={handleCloseNote}
        />
      </form>
      <NewAccountBookDrawer
        handleCloseDrawer={handleCloseModal}
        handleSearch={handleSearch}
        isOpen={isOpenModal}
      />
      <ViewAccountBookDrawer
        handleCloseDrawer={handleCloseViewModal}
        isOpen={isOpenViewModal}
        rowInfo={rowInfo}
        handleSearch={handleSearch}
      />
      <DialogDeleteComponent
        openDialog={isDeleteForm}
        handleClickClose={handleCloseDeleteForm}
        handleClickConfirm={handleConfirmDeleteForm}
      />
      <DialogConfirmComponent
        openDialog={isConfirmForm}
        handleClickClose={handleCloseConfirmForm}
        handleClickConfirm={handleConfirmForm}
      />
      <SearchDrawer
        handleCloseDrawer={handleCloseSearchDrawer}
        isOpen={isOpenSearchDrawer}
        searchCondition={searchCondition}
        handleChangeSearch={handleChangeSearch}
      />
    </Dashboard>
  );
};
export default GenAccBookManagementContent;
const StyleDataGrid = styled.div`
  width: "100%";
  padding: 0px 16px;
`;
const StyleTitleSearch = styled.p`
  font-size: 12px;
  font-weight: 400px;
  margin: 0.5px;
`;
const StyleTitleSearch2 = styled.p`
  font-size: 16px;
  font-weight: bold;
  width: 200px;
  margin: 0.5px;
`;
const StyleFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3px 3px;
`;
const StyleFilterContainer2 = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1px;
  width: 45%;
`;
const StyleRangeFilter = styled.div`
  display: flex;
  flex-direction: row;
  padding: 3px 3px;
`;
