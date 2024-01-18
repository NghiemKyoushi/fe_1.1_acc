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
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { fetchListCardCustomer } from "@/actions/CardCustomerActions";
import {
  ColCustomerCard,
  ColCustomerCardDetail,
} from "@/models/CardCustomerModel";
import NewCardCustomer from "./Drawer/NewCardCustomer";
import {
  deleteCardCustomerApi,
  getDetailCardCustomer,
} from "@/api/service/cardCustomerApis";
import ViewCardCustomer from "./Drawer/ViewCardCustomer";
import { TextFieldCustom } from "@/components/common/Textfield";
import { DialogDeleteComponent } from "@/components/dialogDelete/DialogDelete";
import { enqueueSnackbar } from "notistack";

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

  const listOfCardCustomer = useSelector(
    (state: RootState) => state.cardCustomer.cardCustomerList
  );
  const pagination = useSelector(
    (state: RootState) => state.cardCustomer.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.cardCustomer.isLoading
  );
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
        enqueueSnackbar("Xóa thất bại", { variant: "error" });
      });
  };
  const { register, handleSubmit, getValues, setValue, watch, reset, control } =
    useForm({
      defaultValues: {
        customerName: "",
        name: "",
      },
    });
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
        });
      });
      setListCardCustomer(arrList);
    }
  }, [listOfCardCustomer]);
  const columns: GridColDef<ColCustomerCardDetail>[] = useMemo(
    () => [
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
        headerName: "Loại thẻ",
        field: "cardType",
        width: 150,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
      },
      {
        headerName: "Ngân hàng",
        field: "bank",
        width: 150,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
      },
      {
        headerName: "Hạn mức",
        field: "paymentLimit",
        width: 250,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
      },
      {
        headerName: "Hạn thanh toán",
        field: "paymentDueDate",
        width: 153,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          return formatDateTime(row.paymentDueDate);
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
        width: 200,
        renderCell: ({ row }) => {
          return (
            <>
              <IconButton
                color="info"
                onClick={() => handleOpenModalEdit(row.id)}
              >
                <EditOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                onClick={() => handleOpenDeleteForm(row.id)}
                color="error"
              >
                <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
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
    sorter: "name",
    sortDirection: "DESC",
  };
  const [searchCondition, setSearchCondition] =
    useState<PosSearchParams>(initialPosSearch);
  useEffect(() => {
    dispatch(fetchListCardCustomer(searchCondition));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCondition]);

  const handleSearch = () => {
    const { name, customerName } = getValues();
    const bodySend = {
      ...searchCondition,
      name: name,
      customerName: customerName,
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
  const getRowId = (row: any) => {
    return row.id;
  };
  return (
    <Dashboard>
      <h3 style={{ textAlign: "left" }}>QUẢN LÝ THẺ KHÁCH HÀNG</h3>
      <>
        <Box sx={{ margin: "7px 0px" }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenAddCard()}
          >
            Thêm thẻ khách
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
