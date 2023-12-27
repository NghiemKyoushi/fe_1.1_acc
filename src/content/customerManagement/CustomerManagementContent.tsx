import Dashboard from "@/components/Layout";
import TableDataComponent, { Operators } from "@/components/common/DataGrid";
import { formatDateTime } from "@/utils";
import {
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  ColCustomer,
  CustomerParams,
  NewCustomer,
} from "@/models/CustomerManager";
import { fetchListCustomer } from "@/actions/CustomerManagerAction";
import NewCustomerDrawer from "./Drawer/NewCustomerDrawer";
import { deleteCustomer, fetchCustomerById } from "@/api/service/customerManagerApis";
import ViewCustomerDrawer from "./Drawer/ViewCustomerDrawer";
import { DialogDeleteComponent } from "@/components/dialogDelete/DialogDelete";
import { enqueueSnackbar } from "notistack";

export default function CustomerManagementContent() {
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [rowInfo, setRowInfo] = useState<NewCustomer | undefined>();
  const [customerId, setCustomerId] = useState("");
  const [isDeleteForm, setIsDeleteForm] = useState(false);

  const listOfCustomer = useSelector(
    (state: RootState) => state.customerManagament.getCustomer
  );
  const pagination = useSelector(
    (state: RootState) => state.customerManagament.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.customerManagament.isLoading
  );
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleCloseViewModal = () => {
    setIsOpenViewModal(false);
  };
  const handleOpenViewDrawer = (id: string) => {
    fetchCustomerById(id).then((res) => {
      setRowInfo(res.data);
      setIsOpenViewModal(true);
    });
  };
  const handleOpenDeleteForm = (id: string) => {
    setCustomerId(id);
    setIsDeleteForm(true);
  };
  const handleCloseDeleteForm = () => {
    setIsDeleteForm(false);
  };
  const handleConfirmDeleteForm = () => {
    deleteCustomer(customerId)
      .then((res) => {
        enqueueSnackbar("Xóa thành công!!", { variant: "success" });
        handleCloseDeleteForm();
        handleSearch();
      })
      .catch(function (error: any) {
        enqueueSnackbar("Xóa thất bại", { variant: "error" });
      });
  };
  const columns: GridColDef<ColCustomer>[] = useMemo(
    () => [
      {
        field: "id",
        width: 40,
        sortable: false,
        headerName: "STT",
        renderCell: (params: GridRenderCellParams<ColCustomer>) => {
          const index = params.api.getRowIndex(params.row.id);
          return +index + 1;
        },
      },
      {
        headerName: "Tên khách hàng",
        field: "name",
        width: 200,
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
        headerName: "Số điện thoại",
        field: "phoneNumber",
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
        headerName: "Địa chỉ",
        field: "address",
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
        headerName: "Căn cước công dân",
        field: "nationalId",
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
        //   value: "input",percentageFee
        //   label: "input",
        // }),
      },
      {
        headerName: "% Phí",
        field: "percentageFee",
        width: 140,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
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
        //   value: "input",percentageFee
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
        width: 300,
        renderCell: ({ row }) => {
          return (
            <>
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
          );
        },
      },
    ],
    [listOfCustomer]
  );

  const initialPosSearch = {
    page: 0,
    pageSize: 10,
    sorter: "name",
    sortDirection: "DESC",
  };
  const [searchCondition, setSearchCondition] =
    useState<CustomerParams>(initialPosSearch);
  useEffect(() => {
    dispatch(fetchListCustomer(searchCondition));
  }, [searchCondition]);

  const handleSearch = () => {
    dispatch(fetchListCustomer(searchCondition));
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
      <h3 style={{ textAlign: "left" }}>QUẢN LÝ KHÁCH HÀNG</h3>
      <>
        <Box sx={{ margin: "7px 16px" }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenModal()}
          >
            Thêm khách hàng
          </Button>
          {/* <DateRangePicker/> */}
        </Box>
        <form style={{ width: "100%" }}>
          <StyleDataGrid>
            <TableDataComponent
              columns={columns}
              dataInfo={listOfCustomer}
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
        <NewCustomerDrawer
          isOpen={isOpenModal}
          handleCloseDrawer={handleCloseModal}
          handleSearch={handleSearch}
        />
        <ViewCustomerDrawer
          isOpen={isOpenViewModal}
          handleCloseDrawer={handleCloseViewModal}
          rowInfo={rowInfo}
          handleSearch={handleSearch}
        />
        <DialogDeleteComponent
          openDialog={isDeleteForm}
          handleClickClose={handleCloseDeleteForm}
          handleClickConfirm={handleConfirmDeleteForm}
        />
      </>
      {/* )} */}
    </Dashboard>
  );
}

const StyleDataGrid = styled.div`
  width: "100%";
  padding: 0px 16px;
`;
