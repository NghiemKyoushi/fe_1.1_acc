import Dashboard from "@/components/Layout";
import TableDataComponent, { Operators } from "@/components/common/DataGrid";
import { ROLE, cookieSetting, formatDateTime } from "@/utils";
import {
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { RootState } from "@/reducers/rootReducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
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
import {
  deleteCustomer,
  fetchCustomerById,
} from "@/api/service/customerManagerApis";
import ViewCustomerDrawer from "./Drawer/ViewCustomerDrawer";
import { DialogDeleteComponent } from "@/components/dialogDelete/DialogDelete";
import { enqueueSnackbar } from "notistack";
import { TextFieldCustom } from "@/components/common/Textfield";

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
  const role = cookieSetting.get("roles");

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
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Xóa thất bại", { variant: "error" });
        }
      });
  };
  const { register, handleSubmit, getValues, setValue, watch, reset, control } =
    useForm({
      defaultValues: {
        name: "",
        phoneNumber: "",
      },
    });
  const columns: GridColDef<ColCustomer>[] = useMemo(
    () => [
      {
        headerName: "Tên khách hàng",
        field: "name",
        width: 200,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
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
                    {...register("name")}
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
        headerName: "Số điện thoại",
        field: "phoneNumber",
        width: 180,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
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
                    {...register("name")}
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
        headerName: "Địa chỉ",
        field: "address",
        width: 200,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
      },
      {
        headerName: "Căn cước công dân",
        field: "nationalId",
        width: 200,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
      },
      {
        headerName: "% Phí",
        field: "percentageFee",
        width: 140,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
      },
      {
        headerName: "Thông tin khách",
        field: "note",
        width: 210,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        width: 200,
        renderCell: ({ row }) => {
          return (
            <>
              <IconButton
                color="info"
                onClick={() => handleOpenViewDrawer(row.id)}
              >
                <EditOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
              {role === ROLE.ADMIN && (
                <IconButton
                  color="error"
                  onClick={() => handleOpenDeleteForm(row.id)}
                >
                  <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              )}
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCondition]);

  const handleSearch = () => {
    const { name, phoneNumber } = getValues();
    const bodySend = {
      ...searchCondition,
      name: name,
      phoneNumber: phoneNumber,
    };
    setSearchCondition(bodySend);
    dispatch(fetchListCustomer(bodySend));
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
        <Box sx={{ margin: "7px 0px" }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenModal()}
          >
            Thêm khách hàng
          </Button>
        </Box>
        <form style={{ width: "100%" }}>
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
