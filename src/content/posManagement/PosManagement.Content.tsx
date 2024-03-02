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
import ViewPosDrawer from "./Drawer/ViewPosDrawer";
import {
  deletePosDetailApi,
  fetchPosDetail,
} from "@/api/service/posManagerApis";
import { TextFieldCustom } from "@/components/common/Textfield";
import { DialogDeleteComponent } from "@/components/dialogDelete/DialogDelete";
import { enqueueSnackbar } from "notistack";

export default function PosManagementContent() {
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [rowInfo, setRowInfo] = useState();
  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [posIds, setPosIds] = useState("");

  const listOfPos = useSelector(
    (state: RootState) => state.posManagement.posList
  );
  const pagination = useSelector(
    (state: RootState) => state.posManagement.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.posManagement.isLoading
  );
  const { register, handleSubmit, getValues, setValue, watch, reset, control } =
    useForm({
      defaultValues: {
        code: "",
        accountNumber: "",
        bank: "",
      },
    });
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleOpenViewModal = (id: string) => {
    fetchPosDetail(id).then((res) => {
      setRowInfo(res.data);
      setIsOpenViewModal(true);
    });
  };
  const handleCloseViewModal = () => {
    setIsOpenViewModal(false);
  };
  const handleCloseDeleteForm = () => {
    setIsDeleteForm(false);
  };
  const handleOpenDeleteForm = (id: string) => {
    setPosIds(id);
    setIsDeleteForm(true);
  };
  const handleConfirmDeleteForm = () => {
    deletePosDetailApi(posIds)
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
  const columns: GridColDef<ColPosManagement>[] = useMemo(
    () => [
      {
        headerName: "Mã Pos",
        field: "code",
        width: 250,
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
                    {...register("code")}
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
        headerName: "Tài khoản Pos",
        field: "accountNumber",
        width: 150,
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
                    {...register("accountNumber")}
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
        headerName: "Ngân hàng",
        field: "bank",
        width: 150,
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
                    {...register("bank")}
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
        headerName: "Địa chỉ Pos",
        field: "address",
        width: 250,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
      },
      {
        headerName: "Thông tin Pos",
        field: "note",
        width: 250,
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
        width: 284,
        renderCell: ({ row }) => {
          return (
            <>
              <IconButton
                onClick={() => handleOpenViewModal(row.id)}
                color="info"
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
    [listOfPos]
  );

  const initialPosSearch = {
    page: 0,
    pageSize: 10,
    sorter: "code",
    sortDirection: "DESC",
  };
  const [searchCondition, setSearchCondition] =
    useState<PosSearchParams>(initialPosSearch);
  useEffect(() => {
    dispatch(fetchPosManagement(searchCondition));
  }, []);

  const handleSearch = () => {
    const { accountNumber, bank, code } = getValues();
    const bodySend = {
      ...searchCondition,
      accountNumber: accountNumber,
      bank: bank,
      code: code,
    };
    setSearchCondition(bodySend);
    dispatch(fetchPosManagement(bodySend));
  };
  const onPageChange = (pageNumber: number) => {
    const searchPage = {
      ...searchCondition,
      page: pageNumber,
    };
    setSearchCondition(searchPage);
    dispatch(fetchPosManagement(searchPage));
  };
  const onPageSizeChange = (pageSize: number) => {
    const searchPage = {
      ...searchCondition,
      pageSize: pageSize,
    };
    setSearchCondition(searchPage);
    dispatch(fetchPosManagement(searchPage));
  };

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel[0]) {
      const sortPage = {
        ...searchCondition,
        sorter: sortModel[0].field,
        sortDirection: sortModel[0]?.sort?.toString().toUpperCase(),
      };
      setSearchCondition(sortPage);
      dispatch(fetchPosManagement(sortPage));
    }
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  return (
    <Dashboard>
      <h3 style={{ textAlign: "left" }}>QUẢN LÝ POS</h3>

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
        <TableDataComponent
          columns={columns}
          dataInfo={listOfPos}
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
      <NewPosDrawer
        searchCondition={searchCondition}
        isOpen={isOpenModal}
        handleCloseDrawer={handleCloseModal}
      />
      <ViewPosDrawer
        searchCondition={searchCondition}
        isOpen={isOpenViewModal}
        handleCloseDrawer={handleCloseViewModal}
        rowInfo={rowInfo}
      />
      <DialogDeleteComponent
        openDialog={isDeleteForm}
        handleClickClose={handleCloseDeleteForm}
        handleClickConfirm={handleConfirmDeleteForm}
      />
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
