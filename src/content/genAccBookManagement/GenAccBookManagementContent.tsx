import Dashboard from "@/components/Layout";
import TableDataComponent from "@/components/common/DataGrid";
import { Box, Button, IconButton } from "@mui/material";
import { GridCellParams, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import {
  EmpManageParamSearch,
  EmpManageSearchResult,
} from "@/models/EmpManagement";
import { fetchEmp } from "@/actions/EmpManagementAactions";
import { useDispatch } from "react-redux";
import { ColAccountBook } from "@/models/AccountingBookModel";
import { fetchAccBook, fetchSumAccBook } from "@/actions/AccBookActions";
import { formatDateTime } from "@/utils";
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
  deleteGenAccountingBook,
  fetchDetailGenAccountingBook,
} from "@/api/service/genAccountingBook";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { DialogConfirmComponent } from "../accBookManagement/Drawer/DialogConfirm";
import { DialogDeleteComponent } from "@/components/dialogDelete/DialogDelete";
import { enqueueSnackbar } from "notistack";

export const initialPosSearch = {
  page: 0,
  pageSize: 10,
  sorter: "createdDate",
  sortDirection: "ASC",
};
export const GenAccBookManagementContent = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [rowInfo, setRowInfo] = useState();

  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [receiptsId, setReceiptsId] = useState("");
  const [isConfirmForm, setIsConfirmForm] = useState(false);
  const [receiptsIdConfirm, setReceiptsIdConfirm] = useState("");
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
  };
  const onPageSizeChange = (pageSize: number) => {
    const searchPage = {
      ...searchCondition,
      pageSize: pageSize,
    };
    setSearchCondition(searchPage);
  };
  const handleSearch = () => {
    dispatch(fetchEmp(searchCondition));
  };
  useEffect(() => {
    dispatch(fetchAccEntryType());
    dispatch(fetchGenAccBook(searchCondition));
    dispatch(fetchGenSumAccBook(searchCondition));
  }, [searchCondition]);

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
        enqueueSnackbar("Xác nhận thất bại", { variant: "error" });
      });
  };
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
      },
      {
        headerName: "Mã bút toán",
        field: "entryType",
        width: 165,
        headerAlign: "center",
        align: "center",
        // filterOperators: Operators({
        //   inputComponent: () => {
        //     return (
        //       <RangeNumberFilter
        //         register={register}
        //         fromNumberName="fromTransactionTotal"
        //         toNumberName="toTransactionTotal"
        //       />
        //     );
        //   },
        //   value: "input",
        //   label: "input",
        // }),
      },
      {
        headerName: "Định khoản",
        field: "entryCode",
        width: 165,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          if (row.entryCode === "TOTAL") {
            return row.moneyAmount;
          }
          return row.entryCode;
        },
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      {
        headerName: "Thu",
        field: "intake",
        width: 150,
        headerAlign: "center",
        align: "center",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: ({ row }) => {
          if (row.transactionType === "INTAKE") {
            return row.moneyAmount;
          }
          if (row.entryCode === "TOTAL") {
            return row.intake;
          }
          return "";
        },
      },
      {
        headerName: "Chi",
        field: "payout",
        width: 150,
        headerAlign: "center",
        align: "center",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: ({ row }) => {
          if (row.transactionType === "PAYOUT") {
            return row.moneyAmount;
          }
          if (row.entryCode === "TOTAL") {
            return row.payout;
          }
          return "";
        },
      },
      {
        headerName: "Công nợ",
        field: "loan",
        width: 150,
        headerAlign: "center",
        align: "center",
        sortable: false,
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
        width: 150,
        headerAlign: "center",
        align: "center",
        sortable: false,
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
        width: 190,
        renderCell: ({ row }) => {
          return (
            <>
              {row.entryCode !== "TOTAL" && (
                <>
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
                    <EditOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteForm(row.id)}
                  >
                    <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </>
              )}
            </>
          );
        },
      },
    ],
    [accEntryType]
  );

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel[0]) {
      const sortPage = {
        ...searchCondition,
        sorter: sortModel[0].field,
        sortDirection: sortModel[0]?.sort?.toString().toUpperCase(),
      };
        setSearchCondition(sortPage);
    }
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  return (
    <Dashboard>
      <h3 style={{ textAlign: "left" }}>SỔ KẾ TOÁN TỔNG HỢP </h3>

      <Box sx={{ margin: "7px 16px" }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpenModal()}
        >
          Tạo bút toán
        </Button>
      </Box>
      <form style={{ width: "100%" }}>
        <StyleDataGrid>
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
              dataInfo={[sumOfAccBook, ...listOfGenAccBook]}
              // itemFilter={itemFilter}
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
    </Dashboard>
  );
};
export default GenAccBookManagementContent;
const StyleDataGrid = styled.div`
  width: "100%";
  padding: 0px 16px;
`;
