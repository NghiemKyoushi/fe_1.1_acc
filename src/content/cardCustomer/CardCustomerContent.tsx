import Dashboard from "@/components/Layout";
import TableDataComponent, { Operators } from "@/components/common/DataGrid";
import {
  ROLE,
  cookieSetting,
  formatDateTime,
  getValueWithComma,
} from "@/utils";
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
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { fetchListCardCustomer } from "@/actions/CardCustomerActions";
import {
  ColCustomerCard,
  ColCustomerCardDetail,
  PayFeeType,
} from "@/models/CardCustomerModel";
import NewCardCustomer from "./Drawer/NewCardCustomer";
import {
  deleteCardCustomerApi,
  getDetailCardCustomer,
  updatePayFeeCustomer,
} from "@/api/service/cardCustomerApis";
import ViewCardCustomer from "./Drawer/ViewCardCustomer";
import { TextFieldCustom } from "@/components/common/Textfield";
import { DialogDeleteComponent } from "@/components/dialogDelete/DialogDelete";
import { enqueueSnackbar } from "notistack";
import SelectSearchComponent from "@/components/common/AutoComplete";
import { fetchSearchCustomer } from "@/actions/CustomerManagerAction";
import { PayFeeDialogComponent } from "./Drawer/PayFeeDialog";
import UpdateIcon from "@mui/icons-material/Update";
import SearchDrawer from "./Drawer/SearchDrawer";

export default function CardCustomerContent() {
  const dispatch = useDispatch();
  const [listCardCustomer, setListCardCustomer] = useState<
    ColCustomerCardDetail[]
  >([]);
  const [isOpenCard, setIsOpenCard] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [rowInfo, setRowInfo] = useState();
  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [cardCustomerId, setCardCustomerId] = useState("");
  const [openPayFeeDialog, setOpenPayFeeDialog] = useState(false);
  const [isOpenSearchDrawer, setIsOpenSearchDrawer] = useState(false);

  const listOfCardCustomer = useSelector(
    (state: RootState) => state.cardCustomer.cardCustomerList
  );
  const listOfCustomer = useSelector(
    (state: RootState) => state.customerManagament.customerList
  );
  const pagination = useSelector(
    (state: RootState) => state.cardCustomer.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.cardCustomer.isLoading
  );
  const role = cookieSetting.get("roles");
  const handleOpenModalEdit = (id: string) => {
    getDetailCardCustomer(id).then((res) => {
      setRowInfo(res.data);
      setIsOpenModalEdit(true);
    });
  };
  const handleCloseModalEdit = () => {
    setIsOpenModalEdit(false);
  };
  const handleOpenAddCard = () => {
    setIsOpenCard(true);
  };
  const handleCloseAddCard = () => {
    setIsOpenCard(false);
  };
  const handleCloseDeleteForm = () => {
    setIsDeleteForm(false);
  };
  const handleOpenDeleteForm = (id: string) => {
    setCardCustomerId(id);
    setIsDeleteForm(true);
  };
  const handleConfirmDeleteForm = () => {
    deleteCardCustomerApi(cardCustomerId)
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
  //pree pay fee dialog
  const handleOpenPayFeeDialog = (id: string) => {
    setValue("formConfirm.customerCardId", id);
    setOpenPayFeeDialog(true);
  };
  const handleClosePayFeeDialog = () => {
    setOpenPayFeeDialog(false);
  };
  const handleConfirmCreatePayFee = () => {
    const { formConfirm } = getValues();
    if (formConfirm.prePaidFee === "") {
      enqueueSnackbar("Số phí bắt buộc", { variant: "warning" });
      return;
    }
    if (formConfirm.branchIds.key === "") {
      enqueueSnackbar("Chi nhánh bắt buộc chọn", { variant: "warning" });
      return;
    }

    const bodyUpdate: PayFeeType = {
      branchId: formConfirm.branchIds.key,
      customerCardId: formConfirm.customerCardId,
      imageId: formConfirm.imageId,
      prePaidFee: formConfirm.prePaidFee,
    };
    updatePayFeeCustomer(bodyUpdate)
      .then((res) => {
        enqueueSnackbar("Cập nhật phí ứng trước thành công!", {
          variant: "success",
        });
        handleClosePayFeeDialog();
        handleSearch();
      })
      .catch(function (error) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Cập nhật phí ứng trước thất bại", {
            variant: "error",
          });
        }
      });
  };
  const { register, handleSubmit, getValues, setValue, watch, reset, control } =
    useForm({
      defaultValues: {
        customerName: "",
        accountNumber: "",
        name: "",
        fromPaymentDueDate: "",
        toPaymentDueDate: "",
        formConfirm: {
          customerCardId: "",
          imageId: "",
          prePaidFee: "",
          branchIds: {
            key: "",
            values: "",
          },
        },
      },
    });
  const getDataCustomerFromApi = (value: string) => {
    if (value !== "") {
      dispatch(fetchSearchCustomer({ customerName: value }));
    }
  };
  useEffect(() => {
    if (listOfCardCustomer) {
      let arrList: ColCustomerCardDetail[] = [];
      listOfCardCustomer.map((item: ColCustomerCard) => {
        arrList.push({
          name: item.name,
          id: item.id,
          cardType: item.cardType.name,
          accountNumber: item.accountNumber,
          bank: item.bank,
          paymentLimit: item.paymentLimit,
          paymentDueDate: item.paymentDueDate,
          createdDate: item.createdDate,
          customerName: item.customer.name,
          lastModifiedBy: item.lastModifiedBy,
          note: item.note,
        });
      });
      setListCardCustomer(arrList);
    }
  }, [listOfCardCustomer]);
  const columns: GridColDef<ColCustomerCardDetail>[] = useMemo(
    () => [
      {
        headerName: "Ngày tạo thẻ",
        field: "createdDate",
        width: 170,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        valueGetter: ({ row }) => {
          return formatDateTime(row.createdDate);
        },
      },
      {
        headerName: "Tên khách hàng",
        field: "customerName",
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
                    {...register("customerName")}
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
        field: "name",
        width: 190,
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
        headerName: "Loại thẻ",
        field: "cardType",
        width: 150,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
      },
      {
        headerName: "Ngân hàng",
        field: "bank",
        width: 100,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
      },
      {
        headerName: "Hạn mức",
        field: "paymentLimit",
        width: 220,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        valueGetter: ({ row }) => {
          return getValueWithComma(row.paymentLimit);
        },
      },
      {
        headerName: "Hạn thanh toán",
        field: "paymentDueDate",
        width: 120,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        // filterable: false,
        valueGetter: ({ row }) => {
          return row.paymentDueDate;
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <>
                <RangeNumberFilter
                  handleSearch={handleSearch}
                  register={register}
                  fromNumberName="fromPaymentDueDate"
                  toNumberName="toPaymentDueDate"
                />
              </>
            );
          },
          value: "input",
          label: "input",
        }),
      },
      {
        headerName: "Người cập nhật",
        field: "lastModifiedBy",
        width: 120,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        valueGetter: ({ row }) => {
          return row.lastModifiedBy;
        },
      },
      {
        headerName: "Thông tin thẻ khách",
        field: "note",
        width: 150,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        valueGetter: ({ row }) => {
          return row.note;
        },
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        width: 150,
        renderCell: ({ row }) => {
          return (
            <>
              <IconButton
                color="info"
                onClick={() => handleOpenModalEdit(row.id)}
              >
                <EditOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
              {role === ROLE.ADMIN && (
                <IconButton
                  onClick={() => handleOpenDeleteForm(row.id)}
                  color="error"
                >
                  <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              )}

              {role === ROLE.EMPLOYEE ? null : (
                <Tooltip title="Cập nhật phí" placement="top">
                  <IconButton
                    onClick={() => handleOpenPayFeeDialog(row.id)}
                    color="secondary"
                  >
                    <UpdateIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              )}
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listOfCardCustomer]
  );

  const initialPosSearch = {
    page: 0,
    pageSize: 10,
    sorter: "createdDate",
    sortDirection: "DESC",
  };
  const [searchCondition, setSearchCondition] =
    useState<PosSearchParams>(initialPosSearch);
  useEffect(() => {
    dispatch(fetchListCardCustomer(searchCondition));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCondition]);

  const handleSearch = () => {
    const { name, customerName, fromPaymentDueDate, toPaymentDueDate } =
      getValues();
    const bodySend = {
      ...searchCondition,
      name: name,
      customerName: customerName,
      fromPaymentDueDate: fromPaymentDueDate,
      toPaymentDueDate: toPaymentDueDate,
    };
    setSearchCondition(bodySend);
    dispatch(fetchListCardCustomer(bodySend));
  };
  const onPageChange = (pageNumber: number) => {
    const searchPage = {
      ...searchCondition,
      page: pageNumber,
    };
    setSearchCondition(searchPage);
    dispatch(fetchListCardCustomer(searchPage));
  };
  const onPageSizeChange = (pageSize: number) => {
    const searchPage = {
      ...searchCondition,
      pageSize: pageSize,
    };
    setSearchCondition(searchPage);
    dispatch(fetchListCardCustomer(searchPage));
  };

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel[0]) {
      const sortPage = {
        ...searchCondition,
        sorter: sortModel[0].field,
        sortDirection: sortModel[0]?.sort?.toString().toUpperCase(),
      };
      setSearchCondition(sortPage);
      dispatch(fetchListCardCustomer(sortPage));
    }
  };
  const handleCloseSearchDrawer = () => {
    setIsOpenSearchDrawer(false);
  };
  const handleOpenSearchDrawer = () => {
    setIsOpenSearchDrawer(true);
  };
  const handleChangeSearch = (value: any) => {
    setSearchCondition(value);
  };
  const getRowId = (row: any) => {
    return row.id;
  };

  return (
    <Dashboard>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ textAlign: "left" }}>QUẢN LÝ THẺ KHÁCH HÀNG</h3>
      </div>
      <>
        <Box
          sx={{
            margin: "7px 16px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 3,
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenAddCard()}
          >
            Thêm thẻ khách
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenSearchDrawer()}
          >
            Tìm kiếm
          </Button>
          {/* <DateRangePicker/> */}
        </Box>
        <form style={{ width: "100%", padding: "0px 16px" }}>
          <TableDataComponent
            columns={columns}
            dataInfo={listCardCustomer}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            page={pagination?.pageNumber}
            pageSize={pagination?.size}
            rowCount={pagination?.totalElements}
            handleSortModelChange={handleSortModelChange}
            loading={isLoading}
            getRowId={getRowId}
          />
          <NewCardCustomer
            isOpen={isOpenCard}
            handleCloseDrawer={handleCloseAddCard}
            handleSearch={handleSearch}
          />
          <ViewCardCustomer
            isOpen={isOpenModalEdit}
            handleCloseDrawer={handleCloseModalEdit}
            handleSearch={handleSearch}
            rowInfo={rowInfo}
          />
          <DialogDeleteComponent
            openDialog={isDeleteForm}
            handleClickClose={handleCloseDeleteForm}
            handleClickConfirm={handleConfirmDeleteForm}
          />
          <PayFeeDialogComponent
            control={control}
            setValue={setValue}
            handleClickClose={handleClosePayFeeDialog}
            handleClickConfirm={handleConfirmCreatePayFee}
            openDialog={openPayFeeDialog}
          />
          <SearchDrawer
            handleCloseDrawer={handleCloseSearchDrawer}
            isOpen={isOpenSearchDrawer}
            searchCondition={searchCondition}
            handleChangeSearch={handleChangeSearch}
          />
        </form>
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
