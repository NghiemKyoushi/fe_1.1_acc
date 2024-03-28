import Dashboard from "@/components/Layout";
import TableDataComponent, { Operators } from "@/components/common/DataGrid";
import { Box, Button, IconButton } from "@mui/material";
import {
  GridColDef,
  GridSortModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
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
import ViewEmpManagementDrawer from "./ViewEmpManagementDrawer";
import {
  deleteDetailEmp,
  fetchDetailEmp,
} from "@/api/service/empManagementApis";
import { TextFieldCustom } from "@/components/common/Textfield";
import { useForm } from "react-hook-form";
import { getValueWithComma } from "@/utils";
import { DialogDeleteComponent } from "@/components/dialogDelete/DialogDelete";
import { enqueueSnackbar } from "notistack";

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
  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [entryId, setEntryId] = useState("");

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

  const { register, handleSubmit, getValues, setValue, watch, reset, control } =
    useForm({
      defaultValues: {
        name: "",
        phoneNumber: "",
        code: "",
      },
    });
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
    dispatch(fetchEmp(searchPage));
  };
  const onPageSizeChange = (pageSize: number) => {
    const searchPage = {
      ...searchCondition,
      pageSize: pageSize,
    };
    setSearchCondition(searchPage);
    dispatch(fetchEmp(searchPage));
  };
  const handleSearch = () => {
    const { name, phoneNumber, code } = getValues();
    const bodySend = {
      ...searchCondition,
      name: name,
      phoneNumber: phoneNumber,
      code: code,
    };
    setSearchCondition(bodySend);
    dispatch(fetchEmp(bodySend));
  };
  useEffect(() => {
    dispatch(fetchEmp(searchCondition));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseDeleteForm = () => {
    setIsDeleteForm(false);
    setEntryId("");
  };
  const handleOpenDeleteForm = (id: string) => {
    setEntryId(id);
    setIsDeleteForm(true);
  };
  const handleConfirmDeleteForm = () => {
    deleteDetailEmp(entryId)
      .then((res) => {
        enqueueSnackbar("Xóa thành công!!", { variant: "success" });
        handleCloseDeleteForm();
        dispatch(fetchEmp(searchCondition));
      })
      .catch(function (error: any) {
        enqueueSnackbar("Xóa thất bại", { variant: "error" });
      });
  };
  const columns: GridColDef<EmpManageSearchResult>[] = useMemo(
    () => [
      {
        headerName: "Tên nhân viên",
        field: "name",
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
        headerName: "Mã nhân viên",
        field: "code",
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
        headerName: "Số dư tài khoản",
        field: "accountBalance",
        width: 170,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        valueGetter: (params: GridValueGetterParams) => {
          return getValueWithComma(params.value);
        },
      },
      {
        headerName: "Email",
        field: "email",
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
                    {...register("phoneNumber")}
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
        headerName: "Thao Tác",
        field: "actions",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        width: 250,
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
      dispatch(fetchEmp(sortPage));
    }
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  return (
    <Dashboard>
      <h3 style={{ textAlign: "left" }}>QUẢN LÝ NHÂN VIÊN</h3>

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
        <TableDataComponent
          columns={columns}
          dataInfo={listOfEmp}
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
      <DialogDeleteComponent
        openDialog={isDeleteForm}
        handleClickClose={handleCloseDeleteForm}
        handleClickConfirm={handleConfirmDeleteForm}
      />
    </Dashboard>
  );
};
export default EmpManagementContent;

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
