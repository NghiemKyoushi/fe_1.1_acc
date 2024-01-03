import Dashboard from "@/components/Layout";
import TableDataComponent, { Operators } from "@/components/common/DataGrid";
import { Box, Button, IconButton } from "@mui/material";
import {
  GridCellParams,
  GridColDef,
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

const date = new Date();
const previous = new Date(date.getTime());
previous.setDate(date.getDate() - 30);
const offsetInMinutes = previous.getTimezoneOffset();
previous.setMinutes(previous.getMinutes() - offsetInMinutes);
const dateNext = new Date();
const nextDay = new Date(dateNext.getTime());
nextDay.setDate(dateNext.getDate() + 1);
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
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isOpenSearchDrawer, setIsOpenSearchDrawer] = useState(false);

  const [listOfSelection, setListOfSelection] = useState<
    Array<string | number>
  >([]);
  const [imageId, setImageId] = useState("");

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
    if (imageId === "") {
      enqueueSnackbar("Vui lòng tải ảnh dẫn chứng", {
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
        enqueueSnackbar("Khớp bill thất bại", { variant: "error" });
      });
  };
  const handleGetFile = async (file: Array<any>) => {
    fetchSaveImage(file[0])
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
    const toDate = new Date(gettoDate.setDate(gettoDate.getDate() + 1));

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
  const getDataCustomerFromApi = (value: string) => {};

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
        field: "posCardFee",
        width: 160,
        headerAlign: "center",
        align: "center",
        sortable: false,

        valueGetter: (params: GridValueGetterParams) => {
          if (params.row.createdBy === "TOTAL") {
            return "";
          }
          return params.row.posCardFee;
        },
      },
      {
        headerName: "Ước tính",
        field: "estimatedProfit",
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
        // valueGetter: ({ row }) => {
        //   //   if (row.transactionType === "LOAN") {
        //   //     return row.moneyAmount;
        //   //   }
        //   //   if (row.entryCode === "TOTAL") {
        //   return row.pos.code;
        //   //   }
        //   //   return "";
        // },
      },
      {
        headerName: "Thời gian tiền về",
        field: "repayment",
        width: 150,
        headerAlign: "center",
        align: "center",
        sortable: false,
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
      <h3 style={{ textAlign: "left" }}>QUẢN LÝ BILL </h3>

      <Box
        sx={{
          margin: "7px 0px",
          display: "flex",
          justifyContent: "space-between",
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
          onClick={() => handleOpenSearchDrawer()}
        >
          Tìm kiếm
        </Button>
      </Box>
      {/* </Box> */}
      <form style={{ width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            "& .super-app-theme--cell": {
              backgroundColor: "#EAEAEA",
              color: "#1a3e72",
              fontWeight: "600",
            },
          }}
        >
          <TableDataComponent
            columns={columns}
            dataInfo={[sumOfBills, ...listOfBills]}
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
      <FilterBill handleCloseDrawer={handleCloseModal} isOpen={isOpenModal} />
      <SearchDrawer
        handleCloseDrawer={handleCloseSearchDrawer}
        isOpen={isOpenSearchDrawer}
        searchCondition={searchCondition}
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
const StyleRangeFilter = styled.div`
  display: flex;
  flex-direction: row;
  padding: 3px 3px;
`;
