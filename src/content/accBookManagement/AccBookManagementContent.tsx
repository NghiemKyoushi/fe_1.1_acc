import Dashboard from "@/components/Layout";
import TableDataComponent, { Operators } from "@/components/common/DataGrid";
import { Box, Button, IconButton } from "@mui/material";
import { GridCellParams, GridColDef, GridSortModel } from "@mui/x-data-grid";
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
import { ColAccountBook } from "@/models/AccountingBookModel";
import { fetchAccBook, fetchSumAccBook } from "@/actions/AccBookActions";
import { formatDateTime } from "@/utils";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import NewAccountBookDrawer, {
  listTranType,
} from "./Drawer/NewAccountBookDrawer";
import { DateRangePicker } from "@/components/common/DatePickerComponent";
import { useForm } from "react-hook-form";
import { TextFieldCustom } from "@/components/common/Textfield";
import SelectSearchComponent from "@/components/common/AutoComplete";
import { fetchAccEntryType } from "@/actions/AccEntryTypeActions";
import { fetchDetailAccountingBook } from "@/api/service/accountingBook";
import ViewAccountBookDrawer from "./Drawer/ViewAccountBookDrawer";

const date = new Date();
const previous = new Date(date.getTime());
previous.setDate(date.getDate() - 7);
export const initialPosSearch = {
  page: 0,
  pageSize: 10,
  sorter: "createdDate",
  sortDirection: "ASC",
  // fromCreatedDate: new Date(
  //   previous.getTime() - previous.getTimezoneOffset() * 60000
  // ).toISOString(),
  // toCreatedDate: new Date(
  //   date.getTime() - date.getTimezoneOffset() * 60000
  // ).toISOString(),
  // fromCreatedDate:""
};
export const AccBookManagementContent = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [rowInfo, setRowInfo] = useState();
  const listOfAccBook = useSelector(
    (state: RootState) => state.accBookManagement.accBookList
  );
  const sumOfAccBook = useSelector(
    (state: RootState) => state.accBookManagement.totalSumRow
  );
  const pagination = useSelector(
    (state: RootState) => state.accBookManagement.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.accBookManagement.isLoading
  );
  const accEntryType = useSelector(
    (state: RootState) => state.accEntryType.accEntryTypeList
  );
  const [searchCondition, setSearchCondition] =
    useState<EmpManageParamSearch>(initialPosSearch);

  const { register, handleSubmit, getValues, setValue, watch, reset, control } =
    useForm({
      defaultValues: {
        fromCreatedDate: new Date(previous),
        toCreatedDate: new Date(),
        entryCode: "",
        entryType: {
          key: "",
          values: "",
        },
      },
    });
  const dispatch = useDispatch();
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  // const handleOpenViewModal = () => {
  //   setIsOpenViewModal(true);
  // };
  const handleCloseViewModal = () => {
    setIsOpenViewModal(false);
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
  const handleOpenViewDrawer = (id: string) => {
    fetchDetailAccountingBook(id).then((res) => {
      setRowInfo(res.data);
      setIsOpenViewModal(true);
    });
  };
  const handleSearch = async () => {
    const { fromCreatedDate, toCreatedDate, entryCode, entryType } =
      getValues();
    const fromDate = new Date(fromCreatedDate);
    const toDate = new Date(toCreatedDate);
    let arr: any[] = [];
    if (entryType.key) {
      arr.push(entryType.key);
    }
    const bodySend = {
      ...searchCondition,
      fromCreatedDate: new Date(
        fromDate.getTime() - fromDate.getTimezoneOffset() * 60000
      ).toISOString(),
      toCreatedDate: new Date(
        toDate.getTime() - toDate.getTimezoneOffset() * 60000
      ).toISOString(),
      entryCode: entryCode,
      entryType: arr,
    };
    console.log(bodySend);
    dispatch(fetchAccBook(bodySend));
    dispatch(fetchSumAccBook(bodySend));
  };
  useEffect(() => {
    dispatch(fetchAccEntryType());
    dispatch(fetchAccBook(searchCondition));
    dispatch(fetchSumAccBook(searchCondition));
  }, [searchCondition]);
  const getDataCustomerFromApi = (value: string) => {};

  const columns: GridColDef<ColAccountBook>[] = useMemo(
    () => [
      {
        headerName: "Ngày tạo",
        field: "createdDate",
        width: 165,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          if (row.entryCode === "TOTAL") {
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
        headerName: "Mã bút toán",
        field: "entryCode",
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
                    {...register("entryCode")}
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
        headerName: "Định khoản",
        field: "entryTypes",
        width: 165,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          if (row.entryCode === "TOTAL") {
            return row.moneyAmount;
          }
          return row.entryType;
        },
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <>
                <StyleFilterContainer>
                  <StyleTitleSearch>Giá trị</StyleTitleSearch>
                  {/* accEntryType */}
                  <SelectSearchComponent
                    control={control}
                    props={{
                      name: "entryType",
                      placeHoder: "",
                      results: accEntryType,
                      label: "",
                      variantType: "standard",
                      // getData:((value) => setValue("customerName", value)),
                      type: "text",
                      setValue: setValue,
                      labelWidth: "100",
                      getData: getDataCustomerFromApi,
                    }}
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
        headerName: "Thu",
        field: "intake",
        width: 150,
        headerAlign: "center",
        align: "center",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: ({ row }) => {
          if (row.transactionType === "INTAKE") {
            return row.moneyAmount;
          }
          if (row.entryCode === "TOTAL") {
            return row.intake;
          }
          return "";
        },
      },
      {
        headerName: "Chi",
        field: "payout",
        width: 150,
        headerAlign: "center",
        align: "center",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: ({ row }) => {
          if (row.transactionType === "PAYOUT") {
            return row.moneyAmount;
          }
          if (row.entryCode === "TOTAL") {
            return row.payout;
          }
          return "";
        },
      },
      {
        headerName: "Công nợ",
        field: "loan",
        width: 150,
        headerAlign: "center",
        align: "center",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: ({ row }) => {
          if (row.transactionType === "LOAN") {
            return row.moneyAmount;
          }
          if (row.entryCode === "TOTAL") {
            return row.loan;
          }
          return "";
        },
      },
      {
        headerName: "Thu nợ",
        field: "repayment",
        width: 150,
        headerAlign: "center",
        align: "center",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.entryCode !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: ({ row }) => {
          if (row.transactionType === "REPAYMENT") {
            return row.moneyAmount;
          }
          if (row.entryCode === "TOTAL") {
            return row.repayment;
          }
          return "";
        },
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 190,
        renderCell: ({ row }) => {
          return (
            <>
              {row.entryCode !== "TOTAL" && (
                <>
                  <IconButton color="primary">
                    <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton
                    color="info"
                    onClick={() => handleOpenViewDrawer(row.id)}
                  >
                    <EditOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </>
              )}
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accEntryType]
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
      <h3 style={{ textAlign: "left" }}>Sổ kế toán chi nhánh: </h3>

      {/* <Box sx={{ margin: "7px 16px" }}> */}
      <Box
        sx={{
          margin: "0px 13px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpenModal()}
        >
          Tạo bút toán
        </Button>
        <Button
          variant="contained"
          size="small"
          // onClick={() => handleOpenSearchDrawer()}
        >
          Tìm kiếm
        </Button>
      </Box>
      {/* </Box> */}
      <form style={{ width: "100%" }}>
        {/* <StyleDataGrid> */}
        <Box
          sx={{
            // height: 300,
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
            dataInfo={[sumOfAccBook, ...listOfAccBook]}
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
        </Box>
        {/* </StyleDataGrid> */}
      </form>
      <NewAccountBookDrawer
        handleCloseDrawer={handleCloseModal}
        handleSearch={handleSearch}
        isOpen={isOpenModal}
      />
      <ViewAccountBookDrawer
        handleCloseDrawer={handleCloseViewModal}
        isOpen={isOpenViewModal}
        rowInfo={rowInfo}
      />
    </Dashboard>
  );
};
export default AccBookManagementContent;
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
