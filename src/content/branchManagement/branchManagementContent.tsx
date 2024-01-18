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
import {
  deleteBranchApis,
  getDetailBranch,
} from "@/api/service/branchManagement";
import ViewBranchDrawer from "./Drawer/ViewBranchDrawer";
import { DialogDeleteComponent } from "@/components/dialogDelete/DialogDelete";
import { enqueueSnackbar } from "notistack";

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
  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [branchId, setBranchId] = useState("");

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
  const handleCloseDeleteForm = () => {
    setIsDeleteForm(false);
  };
  const handleOpenDeleteForm = (id: string) => {
    setBranchId(id);
    setIsDeleteForm(true);
  };
  const handleConfirmDeleteForm = () => {
    deleteBranchApis(branchId)
      .then((res) => {
        enqueueSnackbar("Xóa thành công!!", { variant: "success" });
        handleCloseDeleteForm();
        handleSearch();
      })
      .catch(function (error: any) {
        enqueueSnackbar("Xóa thất bại", { variant: "error" });
      });
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
        width: 250,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
      },
      {
        headerName: "Mã chi nhánh",
        field: "code",
        width: 250,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
      },
      {
        headerName: "Số điện thoại",
        field: "phoneNumber",
        width: 250,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
      },
      // {
      //   headerName: "Số tài khoản",
      //   field: "accountNumber",
      //   width: 200,
      //   headerClassName: "super-app-theme--header",
      //   headerAlign: "center",
      //   align: "center",
      //   sortable: false,
      //   filterable: false,
      // },
      // {
      //   headerName: "Ngân hàng",
      //   field: "bank",
      //   width: 200,
      //   headerClassName: "super-app-theme--header",
      //   headerAlign: "center",
      //   align: "center",
      //   sortable: false,
      //   filterable: false,
      // },
      {
        headerName: "Thao Tác",
        field: "actions",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        width: 300,
        renderCell: ({ row }) => {
          return (
            <>
              <IconButton
                color="info"
                onClick={() => handleOpenModalEdit(row.id)}
              >
                <EditOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
              {/* <IconButton
                onClick={() => handleOpenDeleteForm(row.id)}
                color="error"
              >
                <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton> */}
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
      <DialogDeleteComponent
        openDialog={isDeleteForm}
        handleClickClose={handleCloseDeleteForm}
        handleClickConfirm={handleConfirmDeleteForm}
      />
    </Dashboard>
  );
};
export default BranchManagementContent;
const StyleDataGrid = styled.div`
  width: "100%";
  padding: 0px 16px;
`;
