import {
  fetchBills,
  fetchFilterBills,
  fetchSumBills,
} from "@/actions/BillManagementActions";
import TableDataComponent, { Operators } from "@/components/common/DataGrid";
import { DateRangePicker } from "@/components/common/DatePickerComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { ColBillInfo, ColFilterBill } from "@/models/BillManagementModel";
import { RootState } from "@/reducers/rootReducer";
import { formatDateTime, getValueWithComma, handleKeyPress } from "@/utils";
import { Box, Button } from "@mui/material";
import {
  GridCellParams,
  GridColDef,
  GridRowParams,
  GridSortModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import SelectSearchComponent from "@/components/common/AutoComplete";
import { fetchPos } from "@/actions/InvoiceManagementActions";
import { enqueueSnackbar } from "notistack";
import { fetchConfirmFilterBill } from "@/api/service/billManagement";
import { ConfirmBillsDialogComponent } from "./ConfirmBills";
import { fetchSaveImage } from "@/api/service/invoiceManagement";

const date = new Date();
const previous = new Date(date.getTime());
previous.setDate(date.getDate() - 30);
export const initialPosSearch = {
  fromCreatedDate: new Date(
    previous.getTime() - previous.getTimezoneOffset() * 60000
  ).toISOString(),
  toCreatedDate: new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString(),
  posId: "",
  moneyAmount: 0,
};
export interface NEmpManagementDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
}
export const FilterBill = (props: NEmpManagementDrawerProps) => {
  const { isOpen, handleCloseDrawer } = props;
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [listOfSelection, setListOfSelection] = useState<
    Array<string | number>
  >([]);
  const [sumBill, setSumBill] = useState<ColFilterBill>();

  const [imageId, setImageId] = useState("");
  const [listOfBills, setListOfBills] = useState<ColFilterBill[]>([]);

  const listOfFilterBills = useSelector(
    (state: RootState) => state.billManagement.filterBill
  );
  const isLoading = useSelector(
    (state: RootState) => state.billManagement.isLoading
  );
  const listOfPos = useSelector(
    (state: RootState) => state.invoiceManagement.posList
  );
  let result = [];
  if (listOfPos.length > 0) {
    result = listOfPos.map((item: any) => {
      return {
        values: item.code,
        key: item.id,
      };
    });
  } else {
    result = [];
  }
  const dispatch = useDispatch();

  const [searchCondition, setSearchCondition] = useState(initialPosSearch);
  const { register, handleSubmit, getValues, setValue, watch, reset, control } =
    useForm({
      defaultValues: {
        fromCreatedDate: new Date(previous),
        toCreatedDate: new Date(),
        entryCode: "",
        entryType: "",
        posId: {
          key: "",
          values: "",
        },
        moneyAmount: "",
        explanation: "",
      },
    });
  const handleSearch = () => {
    const {
      fromCreatedDate,
      toCreatedDate,
      entryCode,
      entryType,
      posId,
      moneyAmount,
    } = getValues();
    const fromDate = new Date(fromCreatedDate);
    const toDate = new Date(toCreatedDate);
    let arr: any[] = [];
    if (entryCode) {
      arr.push(entryCode);
    }
    const bodySend = {
      fromCreatedDate: fromDate.toISOString(),
      toCreatedDate: toDate.toISOString(),
      posId: posId.key,
      moneyAmount: parseFloat(moneyAmount.replace(/,/g, "")),
    };
    dispatch(fetchFilterBills(bodySend));
  };
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

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel[0]) {
      const sortPage = {
        ...searchCondition,
        sorter: sortModel[0].field,
        sortDirection: sortModel[0]?.sort?.toString().toUpperCase(),
      };
      dispatch(fetchFilterBills(sortPage));
    }
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  useEffect(() => {
    if (listOfFilterBills.length > 0) {
      let countSum = 0;
      let estimateBill = 0;
      listOfFilterBills.map((item: ColFilterBill) => {
        countSum = countSum + item.moneyAmount;
      });
      const sumBill: ColFilterBill = {
        createdBy: "",
        createdDate: "",
        lastModifiedBy: "",
        lastModifiedDate: "",
        recordStatusEnum: "",
        id: "12233",
        code: "TOTAL",
        timeStampSeq: 0,
        moneyAmount: countSum,
        fee: 0,
        returnedProfit: 0,
        returnedTime: "0",
      };
      setSumBill(sumBill);
      setListOfBills([sumBill, ...listOfFilterBills]);
    } else {
      setListOfBills([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOfFilterBills]);

  const getDataFromApi = (value: string) => {
    dispatch(fetchPos({ posName: value }));
  };
  const handleGetListOfSelect = (value: Array<string | number>) => {
    let totalTrading = 0;
    if (value.length > 0) {
      listOfBills.map((row) => {
        value.map((select) => {
          if (row.id === select) {
            totalTrading += row.moneyAmount;
          }
        });
      });
    }
    const shadowData: ColFilterBill[] = listOfBills.map((row) => {
      if (row.code === "TOTAL") {
        return {
          ...row,
          moneyAmount:
            value.length > 0
              ? totalTrading
              : sumBill?.moneyAmount
              ? sumBill?.moneyAmount
              : 0,
        };
      }
      return row;
    });
    setListOfBills([...shadowData]);
    setListOfSelection(value);
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
  const handleConfirmInvoice = () => {
    const { explanation } = getValues();
    const bodySend = {
      explanation: explanation,
      imageId: imageId,
      billIds: listOfSelection,
    };
    fetchConfirmFilterBill(bodySend)
      .then((res) => {
        enqueueSnackbar("Khớp bill thành công", { variant: "success" });
        handleSearch();
        setListOfSelection([]);
        handleCloseConfirmBillDialog();
      })
      .catch(function (error) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Khớp bill thất bại", { variant: "error" });
        }
      });
  };
  const columns: GridColDef<ColBillInfo>[] = useMemo(
    () => [
      {
        headerName: "Ngày tạo",
        field: "createdDate",
        width: 145,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          if (row.code === "TOTAL") {
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
        headerName: "Mã bill",
        field: "code",
        width: 145,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          if (row.code === "TOTAL") {
            return "";
          }
          //   return row.entryCode;
          return row.code;
        },
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
                    {...register("entryType")}
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
        width: 100,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          //   if (row.entryCode === "TOTAL") {
          //     return row.moneyAmount;
          //   }
          //   return row.entryCode;
          return row.posCode;
        },
      },
      {
        headerName: "Tổng giao dịch ",
        field: "moneyAmount",
        width: 145,
        headerAlign: "center",
        align: "center",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.code !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: (params: GridValueGetterParams) => {
          return getValueWithComma(params.value);
        },
      },
      {
        headerName: "Phí",
        field: "fee",
        width: 145,
        headerAlign: "center",
        align: "center",
        sortable: false,
        valueGetter: (params: GridValueGetterParams) => {
          if (params.row.code === "TOTAL") {
            return "";
          }
          return params.row.fee;
        },
      },
      // {
      //   headerName: "Ước tính",
      //   field: "estimatedProfit",
      //   width: 145,
      //   headerAlign: "center",
      //   align: "center",
      //   sortable: false,
      //   valueGetter: (params: GridValueGetterParams) => {
      //     return getValueWithComma(params.value);
      //   },
      //   cellClassName: (params: GridCellParams) => {
      //     if (params.row.code !== "TOTAL") {
      //       return "";
      //     }
      //     return "super-app-theme--cell";
      //   },
      // },

      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 100,
        // field: "id",
        // checkboxSelection: true,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listOfBills]
  );
  return (
    <DrawerCustom
      widthDrawer={750}
      isOpen={isOpen}
      title="Tạo bút toán"
      handleClose={handleCloseDrawer}
    >
      <form
        onKeyPress={handleKeyPress}
        style={{ width: "100%" }}
        onSubmit={handleSubmit(handleSearch)}
      >
        <PageContent>
          <SearchContainer>
            <StyleContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Ngày tạo</LabelComponent>
                <DateRangePicker
                  setvalue={setValue}
                  fromdatename={"fromCreatedDate"}
                  todatename={"toCreatedDate"}
                />
              </StyleInputContainer>

              <StyleInputContainer>
                <LabelComponent require={true}>Số tiền</LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  iconend={<p style={{ width: 24 }}>VND</p>}
                  {...register("moneyAmount")}
                  onChange={(e: any) => {
                    setValue(
                      "moneyAmount",
                      getValueWithComma(
                        e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                      )
                    );
                  }}
                />
              </StyleInputContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Mã Pos</LabelComponent>
                <SelectSearchComponent
                  control={control}
                  props={{
                    name: "posId",
                    placeHoder: "",
                    results: result,
                    label: "",
                    type: "text",
                    setValue: setValue,
                    labelWidth: "120",
                    getData: getDataFromApi,
                  }}
                />
              </StyleInputContainer>
              <StyleInputContainer style={{ justifyContent: "flex-end" }}>
                <Button variant="contained" size="small" type="submit">
                  Tìm kiếm
                </Button>
              </StyleInputContainer>
            </StyleContainer>
          </SearchContainer>
          <Box
            sx={{
              // height: 300,
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
              dataInfo={listOfBills}
              rowCount={100}
              handleSortModelChange={handleSortModelChange}
              loading={isLoading}
              isPage={true}
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
        </PageContent>
      </form>
    </DrawerCustom>
  );
};

export default FilterBill;
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
const StyleInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;

const StyleContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 64px;
`;
const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
`;
