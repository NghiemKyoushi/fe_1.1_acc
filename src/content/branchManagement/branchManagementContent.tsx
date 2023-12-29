import Dashboard from "@/components/Layout";
import TableDataComponent from "@/components/common/DataGrid";
import { Box, Button, IconButton } from "@mui/material";
import { GridColDef, GridSortModel } from "@mui/x-data-grid";
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
import { fetchDetailAccountingBook } from "@/api/service/accountingBook";
import { fetchDetailEmp } from "@/api/service/empManagementApis";
import { fetchBranch } from "@/actions/BranchManagementAction";
import { colBranch } from "@/models/BranchManagementModel";
import NewCardCustomer from "./Drawer/NewBranchDrawer";
import { getDetailBranch } from "@/api/service/branchManagement";
import ViewBranchDrawer from "./Drawer/ViewBranchDrawer";

export const initialPosSearch = {
  page: 0,
  pageSize: 10,
  sorter: "code",
  sortDirection: "DESC",
};
export const BranchManagementContent = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [rowInfo, setRowInfo] = useState();

  const listOfBranch = useSelector(
    (state: RootState) => state.branchManaement.branchList
  );
  const isLoading = useSelector(
    (state: RootState) => state.branchManaement.isLoading
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
  const handleOpenModalEdit = (id: string) => {
    getDetailBranch(id).then((res) => {
      setRowInfo(res.data);
      setIsOpenModalEdit(true);
    });
  };
  const handleCloseModalEdit = () => {
    setIsOpenModalEdit(false);
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
    dispatch(fetchBranch());
  };
  useEffect(() => {
    dispatch(fetchBranch());
  }, []);
  const columns: GridColDef<colBranch>[] = useMemo(
    () => [
      {
        headerName: "Tên chi nhánh",
        field: "name",
        width: 200,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
      },
      {
        headerName: "Mã chi nhánh",
        field: "code",
        width: 200,
        headerClassName: "super-app-theme--header",
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
        headerName: "Số điện thoại",
        field: "phoneNumber",
        width: 200,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
      },
      {
        headerName: "Số tài khoản",
        field: "accountNumber",
        width: 200,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
      },
      {
        headerName: "Ngân hàng",
        field: "bank",
        width: 200,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 270,
        renderCell: ({ row }) => {
          return (
            <>
              <IconButton
                color="info"
                onClick={() => handleOpenModalEdit(row.id)}
              >
                <EditOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton color="error">
                <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
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
      <h3 style={{ textAlign: "left" }}>QUẢN LÝ CHI NHÁNH</h3>
      <Box sx={{ margin: "7px 16px" }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpenModal()}
        >
          Tạo chi nhánh
        </Button>
        {/* <DateRangePicker/> */}
      </Box>
      <form style={{ width: "100%" }}>
        <StyleDataGrid>
          <TableDataComponent
            columns={columns}
            dataInfo={listOfBranch}
            loading={isLoading}
            getRowId={getRowId}
            isPage={true}
          />
        </StyleDataGrid>
      </form>
      <NewCardCustomer
        handleCloseDrawer={handleCloseModal}
        handleSearch={handleSearch}
        isOpen={isOpenModal}
      />
      <ViewBranchDrawer
        handleCloseDrawer={handleCloseModalEdit}
        isOpen={isOpenModalEdit}
        rowInfo={rowInfo}
      />
    </Dashboard>
  );
};
export default BranchManagementContent;
const StyleDataGrid = styled.div`
  width: "100%";
  padding: 0px 16px;
`;
