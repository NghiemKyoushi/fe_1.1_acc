import Dashboard from "@/components/Layout";
import TableDataComponent, { Operators } from "@/components/common/DataGrid";
import { Box, Button, IconButton } from "@mui/material";
import {
  GridCellParams,
  GridColDef,
  GridRowParams,
  GridSelectionModel,
  GridSortModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { fetchEmp } from "@/actions/EmpManagementAactions";
import { useDispatch } from "react-redux";
import {
  formatDate,
  formatDateTime,
  getDateOfPresent,
  getValueWithComma,
} from "@/utils";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { DateRangePicker } from "@/components/common/DatePickerComponent";
import { useForm } from "react-hook-form";
import { TextFieldCustom } from "@/components/common/Textfield";
import { fetchBills, fetchSumBills } from "@/actions/BillManagementActions";
import { ColBillInfo } from "@/models/BillManagementModel";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import FilterBill from "./Drawer/FilterBill";
import { ConfirmBillsDialogComponent } from "./Drawer/ConfirmBills";
import { enqueueSnackbar } from "notistack";
import { fetchConfirmFilterBill } from "@/api/service/billManagement";
import { fetchSaveImage } from "@/api/service/invoiceManagement";
import SearchDrawer from "./Drawer/SearchDrawer";
import ChangePosFee from "./Drawer/ChangePos";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ViewPosFeeDrawer from "./Drawer/EditPosFeeDrawer";

const date = new Date();
const previous = new Date(date.getTime());
previous.setDate(date.getDate() - 30);
const offsetInMinutes = previous.getTimezoneOffset();
previous.setMinutes(previous.getMinutes() - offsetInMinutes);
const dateNext = new Date();
const nextDay = new Date(dateNext.getTime());
nextDay.setDate(dateNext.getDate());
const offsetInMinutes2 = nextDay.getTimezoneOffset();
nextDay.setMinutes(nextDay.getMinutes() - offsetInMinutes2);
export const initialPosSearch = {
  page: 0,
  pageSize: 10,
  sorter: "createdDate",
  sortDirection: "DESC",
  fromCreatedDate: previous.toISOString(),
  toCreatedDate: nextDay.toISOString(),
};

export const BillManagementContent = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenPosFeeModal, setIsOpenPosFeeModal] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isOpenSearchDrawer, setIsOpenSearchDrawer] = useState(false);
  const [rowData, setRowData] = useState<ColBillInfo[]>([]);
  const [listOfSelection, setListOfSelection] = useState<
    Array<string | number>
  >([]);
  const [imageId, setImageId] = useState("");
  const [rowInfo, setRowInfo] = useState({
    idBill: "",
    posFee: "",
    posId: "",
    percen: "",
  });

  const listOfBills = useSelector(
    (state: RootState) => state.billManagement.billsList
  );
  const sumOfBills = useSelector(
    (state: RootState) => state.billManagement.totalSumRow
  );
  const pagination = useSelector(
    (state: RootState) => state.billManagement.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.billManagement.isLoading
  );
  const [searchCondition, setSearchCondition] = useState<any>(initialPosSearch);

  const { register, handleSubmit, getValues, setValue, watch, reset, control } =
    useForm({
      defaultValues: {
        fromCreatedDate: formatDate(previous.getTime()),
        toCreatedDate: getDateOfPresent(),
        entryCode: "",
        entryType: "",
        explanation: "",
        billId: "",
        code: "",
      },
    });
  const dispatch = useDispatch();
  const handleCloseSearchDrawer = () => {
    setIsOpenSearchDrawer(false);
  };
  const handleOpenSearchDrawer = () => {
    setIsOpenSearchDrawer(true);
  };
  const handleOpenPosFeeModal = () => {
    setIsOpenPosFeeModal(true);
  };
  const handleClosePosFeeModal = () => {
    setIsOpenPosFeeModal(false);
  };
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleOpenConfirmBillDialog = () => {
    if (listOfSelection.length < 1) {
      enqueueSnackbar("Vui lòng chọn trước khi khớp bill", {
        variant: "warning",
      });
      return;
    }
    setOpenConfirmDialog(true);
  };
  const handleCloseConfirmBillDialog = () => {
    setValue("explanation", "");
    setOpenConfirmDialog(false);
  };
  const handleGetListOfSelect = (value: Array<string | number>) => {
    let totalTrading = 0;
    let totalEstimateReturnFromBank = 0;
    let totalReturnFromBank = 0;
    if (value.length > 0) {
      rowData.map((row) => {
        value.map((select) => {
          if (row.id === select) {
            totalTrading += row.moneyAmount;
            totalEstimateReturnFromBank += row.estimateReturnFromBank;
            totalReturnFromBank += row.returnedFromBank;
          }
        });
      });
    }
    const shadowData = rowData.map((row) => {
      if (row.createdBy === "TOTAL") {
        return {
          ...row,
          moneyAmount: value.length > 0 ? totalTrading : sumOfBills.moneyAmount,
          estimateReturnFromBank:
            value.length > 0 ? totalEstimateReturnFromBank : 0,
          returnFromBank:
            value.length > 0 ? totalTrading : sumOfBills.moneyAmount,
        };
      }
      return row;
    });
    setRowData([...shadowData]);
    setListOfSelection(value);
  };
  const handleConfirmInvoice = () => {
    const { explanation } = getValues();
    if (explanation === "") {
      enqueueSnackbar("Vui lòng nhập diễn giải", {
        variant: "warning",
      });
      return;
    }
    const bodySend = {
      explanation: explanation,
      imageId: imageId,
      billIds: listOfSelection,
    };
    fetchConfirmFilterBill(bodySend)
      .then((res) => {
        enqueueSnackbar("Khớp bill thành công", { variant: "success" });
        handleCloseConfirmBillDialog();
        handleSearch();
        setListOfSelection([]);
      })
      .catch(function (error) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Khớp bill thất bại", { variant: "error" });
        }
      });
  };
  useMemo(() => {
    setRowData([sumOfBills, ...listOfBills]);
  }, [sumOfBills, listOfBills]);
  const handleGetFile = async (file: Array<any>) => {
    if (!file || file[0].size > 5 * 1024 * 1024) {
      enqueueSnackbar("File ảnh phải nhỏ hơn 5MB", { variant: "error" });
      return;
    }
    fetchSaveImage(imageId, file[0])
      .then((res) => {
        setImageId(res.data);
      })
      .catch(function (error) {
        enqueueSnackbar("Load ảnh thất bại", { variant: "error" });
      });
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
    const { fromCreatedDate, toCreatedDate, entryCode, entryType, code } =
      getValues();
    const fromDate = new Date(fromCreatedDate);
    const offsetInMinutes = fromDate.getTimezoneOffset();
    fromDate.setMinutes(fromDate.getMinutes() - offsetInMinutes);

    const gettoDate = new Date(toCreatedDate);
    const toDate = new Date(gettoDate.setDate(gettoDate.getDate()));

    const offsetInMinutes2 = toDate.getTimezoneOffset();
    toDate.setMinutes(toDate.getMinutes() - offsetInMinutes2);

    let arr: any[] = [];
    if (entryCode) {
      arr.push(entryCode);
    }
    const bodySend = {
      ...searchCondition,
      fromCreatedDate: fromDate.toISOString(),
      toCreatedDate: toDate.toISOString(),
      entryCode: arr,
      entryType: entryType,
      code: code,
    };
    dispatch(fetchBills(bodySend));
    dispatch(fetchSumBills(bodySend));
  };
  useEffect(() => {
    dispatch(fetchBills(searchCondition));
    dispatch(fetchSumBills(searchCondition));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCondition]);

  const handleOpenModalEdit = (
    idBill: string,
    posFee: string,
    posId: string,
    percen: string
  ) => {
    setRowInfo({
      idBill,
      posFee,
      posId,
      percen,
    });
    setIsOpenModalEdit(true);
  };
  const handleCloseModalEdit = () => {
    setIsOpenModalEdit(false);
  };
  const columns: GridColDef<ColBillInfo>[] = useMemo(
    () => [
      {
        headerName: "Ngày tạo",
        field: "createdDate",
        width: 165,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          if (row.createdBy === "TOTAL") {
            return "";
          }
          return formatDateTime(row.createdDate);
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <Box width={198} sx={{ padding: "12px 0px" }}>
                <DateRangePicker
                  setvalue={setValue}
                  watch={watch}
                  fromdatename={"fromCreatedDate"}
                  todatename={"toCreatedDate"}
                  fromdateValue={watch("fromCreatedDate")}
                  todateValue={watch("toCreatedDate")}
                />
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
              </Box>
            );
          },
          value: "input",
          label: "input",
        }),
      },
      {
        headerName: "Mã bill",
        field: "code",
        width: 165,
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
        headerName: "POS",
        field: "posCode",
        width: 165,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          return row.posCode;
        },
      },
      {
        headerName: "Tổng giao dịch ",
        field: "moneyAmount",
        width: 160,
        headerAlign: "center",
        align: "center",
        sortable: false,
        valueGetter: (params: GridValueGetterParams) => {
          return getValueWithComma(+params.value);
        },
        cellClassName: (params: GridCellParams) => {
          if (params.row.createdBy !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      {
        headerName: "%Phí",
        field: "posFeeStamp",
        width: 160,
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        valueGetter: (params: GridValueGetterParams) => {
          if (params.row.createdBy === "TOTAL") {
            return "";
          }
          return params.row.posFeeStamp;
        },
      },
      {
        headerName: "Tiền từ ngân hàng",
        field: "returnFromBank",
        width: 160,
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        valueGetter: (params: GridValueGetterParams) => {
          return getValueWithComma(+params.value);
        },
        cellClassName: (params: GridCellParams) => {
          if (params.row.createdBy !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      {
        headerName: "Dự tính tiền ngân hàng",
        field: "estimateReturnFromBank",
        width: 160,
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        valueGetter: (params: GridValueGetterParams) => {
          // if (params.row.createdBy === "TOTAL") {
          //   return "";
          // }
          return getValueWithComma(+params.value);
        },
        cellClassName: (params: GridCellParams) => {
          if (params.row.createdBy !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      {
        headerName: "Thời gian tiền về",
        field: "returnedTime",
        width: 150,
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        valueGetter: (params: GridValueGetterParams) => {
          if (params.row.createdBy === "TOTAL") {
            return "";
          }
          if (params.row.returnedTime) {
            return formatDateTime(params.row.returnedTime);
          }
          return "";
        },
      },
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 100,
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        width: 90,
        renderCell: ({ row }) => {
          return (
            <div>
              {row.createdBy !== "TOTAL" && (
                <IconButton
                  color="info"
                  onClick={() =>
                    handleOpenModalEdit(
                      row.id,
                      row.posCode,
                      row.posId,
                      row.posFeeStamp
                    )
                  }
                >
                  <EditOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              )}
            </div>
          );
        },
      },
    ],
    []
  );
  const handleChangeSearch = (value: any) => {
    setSearchCondition(value);
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
      <h3 style={{ textAlign: "left" }}>QUẢN LÝ BILL </h3>

      <Box
        sx={{
          margin: "7px 0px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenModal()}
          >
            Tính toán khớp bill
          </Button>
          <Button
            variant="contained"
            size="small"
            color="warning"
            onClick={() => handleOpenPosFeeModal()}
          >
            Chỉnh sửa phí POS
          </Button>
        </div>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpenSearchDrawer()}
        >
          Tìm kiếm
        </Button>
      </Box>
      <form style={{ width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            "& .super-app-theme--cell": {
              backgroundColor: "#EAEAEA",
              color: "#1a3e72",
              fontWeight: "600",
              justifyContent: "flex-end !important",
            },
          }}
        >
          <TableDataComponent
            columns={columns}
            dataInfo={rowData}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            page={pagination?.pageNumber}
            pageSize={pagination?.size}
            rowCount={pagination?.totalElements}
            handleSortModelChange={handleSortModelChange}
            loading={isLoading}
            getRowId={getRowId}
            checkboxSelection={true}
            selectionModel={listOfSelection}
            handleGetListOfSelect={handleGetListOfSelect}
            isRowSelectable={(params: GridRowParams) => {
              if (
                params.row.returnedTime !== null ||
                params.row.createdBy === "TOTAL"
              ) {
                return false;
              }
              return true;
            }}
          />
        </Box>
        <ConfirmBillsDialogComponent
          control={control}
          handleGetFile={handleGetFile}
          openDialog={openConfirmDialog}
          handleClickClose={handleCloseConfirmBillDialog}
          handleClickConfirm={handleConfirmInvoice}
        />
      </form>
      <Box
        sx={{
          justifyContent: "flex-end",
          display: "flex",
          marginTop: 3,
          padding: "0px 16px 8px 16px",
        }}
      >
        <Button
          size="small"
          variant="contained"
          type="submit"
          onClick={handleOpenConfirmBillDialog}
        >
          Xác nhận khớp bill
        </Button>
      </Box>
      <FilterBill
        handleSearchGeneral={handleSearch}
        handleCloseDrawer={handleCloseModal}
        isOpen={isOpenModal}
      />
      <ChangePosFee
        handleSearchGeneral={handleSearch}
        handleCloseDrawer={handleClosePosFeeModal}
        isOpen={isOpenPosFeeModal}
      />
      <SearchDrawer
        handleCloseDrawer={handleCloseSearchDrawer}
        isOpen={isOpenSearchDrawer}
        searchCondition={searchCondition}
        handleChangeSearch={handleChangeSearch}
      />
      <ViewPosFeeDrawer
        isOpen={isOpenModalEdit}
        handleCloseDrawer={handleCloseModalEdit}
        rowInfo={rowInfo}
        handleSearch={handleSearch}
      />
    </Dashboard>
  );
};
export default BillManagementContent;
const StyleDataGrid = styled.div`
  width: "100%";
  padding: 0px 16px;
`;
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
