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
import EmpManagementDrawer from "./EmpManagementDrawer";
import { fetchDetailAccountingBook } from "@/api/service/accountingBook";
import ViewEmpManagementDrawer from "./ViewEmpManagementDrawer";
import { fetchDetailEmp } from "@/api/service/empManagementApis";

export const initialPosSearch = {
  page: 0,
  pageSize: 10,
  sorter: "code",
  sortDirection: "DESC",
};
export const EmpManagementContent = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [rowInfo, setRowInfo] = useState();

  const listOfEmp = useSelector(
    (state: RootState) => state.empManagement.empList
  );
  const pagination = useSelector(
    (state: RootState) => state.empManagement.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.empManagement.isLoading
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
    fetchDetailEmp(id).then((res) => {
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
    dispatch(fetchEmp(searchCondition));
  };
  useEffect(() => {
    dispatch(fetchEmp(searchCondition));
  }, [searchCondition]);
  const columns: GridColDef<EmpManageSearchResult>[] = useMemo(
    () => [
      {
        headerName: "Tên nhân viên",
        field: "name",
        width: 250,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
      },
      {
        headerName: "Mã nhân viên",
        field: "code",
        width: 250,
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
        headerName: "Email",
        field: "email",
        width: 270,
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
        width: 270,
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
        width: 263,
        renderCell: ({ row }) => {
          return (
            <>
              {/* <IconButton color="success">
                <FactCheckOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton> */}
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
      <Box sx={{ margin: "7px 16px" }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpenModal()}
        >
          Tạo nhân viên
        </Button>
        {/* <DateRangePicker/> */}
      </Box>
      <form style={{ width: "100%" }}>
        <StyleDataGrid>
          <TableDataComponent
            columns={columns}
            dataInfo={listOfEmp}
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
        </StyleDataGrid>
      </form>
      <EmpManagementDrawer
        handleCloseDrawer={handleCloseModal}
        isOpen={isOpenModal}
        handleSearch={handleSearch}
      />
      <ViewEmpManagementDrawer
        handleCloseDrawer={handleCloseModalEdit}
        handleSearch={handleSearch}
        isOpen={isOpenModalEdit}
        rowInfo={rowInfo}
      />
    </Dashboard>
  );
};
export default EmpManagementContent;
const StyleDataGrid = styled.div`
  width: "100%";
  padding: 0px 16px;
`;
