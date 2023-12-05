import Dashboard from "@/components/Layout";
import TableDataComponent, { Operators } from "@/components/common/DataGrid";
import { formatDateTime } from "@/utils";
import { GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { RangeNumberFilter } from "../invoiceManagement/InvoiceManagementContent";
import { useForm } from "react-hook-form";
import {
  ColPosManagement,
  PosSearchParams,
} from "@/models/PortManagementModel";
import { RootState } from "@/reducers/rootReducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchPosManagement } from "@/actions/PosManagementActions";
import { Box, Button, IconButton } from "@mui/material";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import NewPosDrawer from "./Drawer/NewPosDrawer";
import FullScreenLoader from "@/components/common/FullScreenLoader";

export default function PosManagementContent() {
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const listOfPos = useSelector(
    (state: RootState) => state.posManagement.posList
  );
  const pagination = useSelector(
    (state: RootState) => state.posManagement.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.posManagement.isLoading
  );
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  //   const { createdDate: "TOTAL", label: "Total", total: 686.4 }
  const columns: GridColDef<
    ColPosManagement | { createdDate: string; label: string; total: number }
  >[] = useMemo(
    () => [
      {
        headerName: "Mã Pos",
        field: "code",
        width: 300,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        // filterOperators: Operators({
        //   inputComponent: () => {
        //     return (
        //       <>
        //         <StyleFilterContainer>
        //           <StyleTitleSearch>Giá trị</StyleTitleSearch>
        //           <TextFieldCustom
        //             type={"text"}
        //             variantshow="standard"
        //             textholder="Lọc giá trị"
        //             focus={"true"}
        //             {...register("receiptCode", { required: true })}
        //           />
        //         </StyleFilterContainer>
        //         <div>
        //           <Button size="small">xác nhận</Button>
        //         </div>
        //       </>
        //     );
        //   },
        //   value: "input",
        //   label: "input",
        // }),
      },
      {
        headerName: "Địa chỉ Pos",
        field: "address",
        width: 320,
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
        headerName: "Tài khoản Pos",
        field: "accountNumber",
        width: 320,
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
        headerName: "Thao Tác",
        field: "actions",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 334,
        renderCell: ({ row }) => {
          return (
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
          );
        },
      },
    ],
    [listOfPos]
  );

  const initialPosSearch = {
    page: 0,
    pageSize: 10,
    sorter: "code",
    sortDirection: "ASC",
  };
  const [searchCondition, setSearchCondition] =
    useState<PosSearchParams>(initialPosSearch);
  useEffect(() => {
    dispatch(fetchPosManagement(searchCondition));
  }, [searchCondition]);

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
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Box sx={{ margin: "7px 16px" }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenModal()}
            >
              Thêm Pos
            </Button>
            {/* <DateRangePicker/> */}
          </Box>
          <form style={{ width: "100%" }}>
            <StyleDataGrid>
              <TableDataComponent
                columns={columns}
                dataInfo={
                  // { createdDate: "TOTAL", label: "Total", total: 686.4 },
                  listOfPos
                }
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
          <NewPosDrawer
            isOpen={isOpenModal}
            handleCloseDrawer={handleCloseModal}
          />
        </>
      )}
    </Dashboard>
  );
}

const StyleDataGrid = styled.div`
  width: "100%";
  padding: 0px 16px;
`;
