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

export const initialPosSearch = {
  page: 0,
  pageSize: 10,
  sorter: "createdDate",
  sortDirection: "ASC",
};
export const AccBookManagementContent = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const listOfAccBook = useSelector(
    (state: RootState) => state.accBookManagement.accBookList
  );
  const sumOfAccBook = useSelector(
    (state: RootState) => state.accBookManagement.totalSumRow
  );
  const pagination = useSelector(
    (state: RootState) => state.accBookManagement.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.accBookManagement.isLoading
  );
  const [searchCondition, setSearchCondition] =
    useState<EmpManageParamSearch>(initialPosSearch);

  const dispatch = useDispatch();
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
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
    dispatch(fetchAccBook(searchCondition));
    dispatch(fetchSumAccBook(searchCondition));
  }, [searchCondition]);
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
                  <IconButton color="success">
                    <FactCheckOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton color="info">
                    <EditOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </>
              )}
            </>
          );
        },
      },
    ],
    []
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
      <h3 style={{ textAlign: "left" }}>Sổ kế toán chi nhánh: </h3>

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
              dataInfo={[sumOfAccBook, ...listOfAccBook]}
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
    </Dashboard>
  );
};
export default AccBookManagementContent;
const StyleDataGrid = styled.div`
  width: "100%";
  padding: 0px 16px;
`;
