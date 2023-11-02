import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import {
  Control,
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import { useMemo, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
  GridValueSetterParams,
} from "@mui/x-data-grid";
import TableDataComponent from "@/components/common/DataGrid";
import { Box, Button, IconButton } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SelectSearchComponent from "@/components/common/AutoComplete";
import { useDispatch } from "react-redux";
import { fetchPos } from "@/actions/InvoiceManagementActions";
import { RootState } from "@/reducers/rootReducer";
import { useSelector } from "react-redux";

const initialRow = [
  {
    id: 1,
    pos: "",
    posId: "",
    money: 0,
    typeOfCard: 1,
    fee: 0,
    feeafterpay: 0,
    billcode: 1,
  },
  {
    id: 2,
    pos: "",
    posId: "",
    money: 0,
    typeOfCard: 1,
    fee: 0,
    feeafterpay: 0,
    billcode: 1,
  },
  {
    id: 3,
    pos: "",
    posId: "",
    money: 0,
    typeOfCard: 1,
    fee: 0,
    feeafterpay: 0,
    billcode: 1,
  },
];

export interface InputPosProps<T extends FieldValues> {
  name: string;
  index: number;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  control: Control<T>;
}
export const InputSearchPos = <T extends FieldValues>(
  props: InputPosProps<T>
) => {
  const dispatch = useDispatch();

  const { name, index, setValue, watch, control } = props;
  // const [result, setResult] = useState([]);
  const listOfPos = useSelector(
    (state: RootState) => state.invoiceManagement.posList
  );
  let result = [];
  if (listOfPos.length > 0) {
    result = listOfPos.map((item: any) => {
      return {
        values: item.posCode,
        key: item.posId,
      };
    });
  } else {
    result = [];
  }

  const getDataFromApi = (value: string) => {
    dispatch(fetchPos({ posName: value }));
  };
  return (
    <div>
      <SelectSearchComponent
        control={control}
        // nameOnChange="posSearch"
        props={{
          name: name,
          placeHoder: "",
          results: result,
          label: "",
          type: "text",
          setValue: setValue,
          labelWidth: "120",
          getData: getDataFromApi,
          border: "true",
        }}
      />
    </div>
  );
};
export interface InvoiceDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
}
const InvoiceDrawer = (props: InvoiceDrawerProps) => {
  const { isOpen, handleCloseDrawer } = props;
  const [rows, setRows] = useState([...initialRow]);
  const [rows2, setRows2] = useState([initialRow[0]]);

  const { register, handleSubmit, setValue, watch, reset, control } = useForm({
    defaultValues: {
      codeEmployee: "909",
      customerInfo: "",
      customerSearch: "",
      image_Id: "",
      posSearch: "",
      percentageFee: 0,
    },
  });

  const handleSearch = () => {};
  const handleClose = () => {};
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        width: 40,
        sortable: false,
        headerName: "STT",
        // renderCell: (params: GridRenderCellParams<any>) => {
        //   console.log("params.row", params.row);
        //   return params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1;
        // },
      },
      // {
      //   headerName: "Mã Bill",
      //   field: "receiptCode",
      //   width: 100,
      //   sortable: false,
      // },
      {
        headerName: "Mã Pos",
        field: "pos",
        width: 120,
        sortable: false,
        renderCell: ({ row }) => {
          if (row.createdDate === "TOTAL") {
            return;
          }
          const index = row.id;
          return (
            <>
              <InputSearchPos
                control={control}
                name={`invoices[${index}].pos`}
                index={row.id}
                watch={watch}
                setValue={setValue}
              />
            </>
          );
        },
      },
      {
        headerName: "Số tiền",
        field: "money",
        width: 110,
        sortable: false,
        editable: true,
      },
      {
        headerName: "Tiền phí",
        field: "fee",
        width: 110,
        sortable: false,
        editable: true,
        align: "center",
      },
      {
        headerName: "Tiền sau phí",
        field: "feeafterpay",
        width: 110,
        sortable: false,
        editable: true,
        valueGetter: (params: GridValueGetterParams) => {
          const money = params.row.money + params.row.fee;
          return money;
        },
      },
      {
        headerName: "Lợi Nhuận",
        field: "profit",
        width: 100,
        sortable: false,
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        width: 97,
        sortable: false,
        renderCell: ({ row }) => {
          return (
            <>
              <IconButton color="error">
                <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </>
          );
        },
      },
    ],
    []
  );
  const columnsOther: GridColDef[] = useMemo(
    () => [
      {
        headerName: "Thu",
        field: "pos",
        width: 100,
        sortable: false,
      },
      {
        headerName: "Chi",
        field: "money",
        width: 100,
        sortable: false,
        editable: true,
      },
      {
        headerName: "Công nợ",
        field: "fee",
        width: 100,
        sortable: false,
        editable: true,
        align: "center",
      },
      {
        headerName: "Thu nợ",
        field: "feeafterpay",
        width: 100,
        sortable: false,
        editable: true,
        valueGetter: (params: GridValueGetterParams) => {
          const money = params.row.money + params.row.fee;
          return money;
        },
      },
    ],
    []
  );
  const a = 898;
  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: rows.length + 1,
        pos: "",
        posId: "",
        money: 0,
        typeOfCard: 1,
        fee: 0,
        feeafterpay: 0,
        billcode: 1,
      },
    ]);
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  const dispatch = useDispatch();

  const getDataFromApi = (value: string) => {
    dispatch(fetchPos({ posName: value }));
  };
  return (
    <>
      <DrawerCustom
        widthDrawer={750}
        isOpen={isOpen}
        title="Tạo Hóa đơn"
        handleClose={handleCloseDrawer}
      >
        <PageContent>
          <form style={{ padding: 16 }} onSubmit={handleSearch}>
            <SearchContainer>
              <StyleContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Mã Nhân Viên</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    iconend={<SearchIcon />}
                    {...register("codeEmployee", { required: true })}
                    onChange={(e: any) => {
                      const regex = /^[0-9]*$/;
                      if (regex.test(e.target.value)) {
                        setValue("codeEmployee", e.target.value);
                      }
                    }}
                  />
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Phần trăm phí</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    iconend={<p style={{ width: 24 }}>%</p>}
                    {...register("codeEmployee", { required: true })}
                  />
                </StyleInputContainer>

                <StyleInputContainer>
                  <LabelComponent require={true}>Phí vận chuyển</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    iconend={<p style={{ width: 24 }}>VND</p>}
                    {...register("codeEmployee", { required: true })}
                  />
                </StyleInputContainer>
              </StyleContainer>
              <StyleContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Tên Khách Hàng</LabelComponent>
                  <SelectSearchComponent
                    control={control}
                    props={{
                      name: "customerSearch",
                      placeHoder: "",
                      results: [],
                      label: "",
                      type: "text",
                      setValue: setValue,
                      labelWidth: "100",
                      getData: getDataFromApi,
                    }}
                  />
                </StyleInputContainer>

                <StyleInputContainer style={{ position: "relative" }}>
                  <LabelComponent require={true}>Tên Thẻ</LabelComponent>
                  <SelectSearchComponent
                    control={control}
                    props={{
                      name: "customerSearch",
                      placeHoder: "",
                      results: [],
                      label: "",
                      type: "text",
                      setValue: setValue,
                      labelWidth: "100",
                      getData: getDataFromApi,
                    }}
                  />
                  <StyleButtonSpan>
                    <Button variant="contained" size="small">
                      Thêm Thẻ
                    </Button>
                  </StyleButtonSpan>
                </StyleInputContainer>
                <InfoBankCard>
                  <InfoOutlinedIcon />
                  Credit Card - BIDV - 02135466987
                </InfoBankCard>
              </StyleContainer>
            </SearchContainer>
          </form>

          <StyleDataGrid>
            <Button variant="contained" size="small" onClick={handleAddRow}>
              Thêm bill
            </Button>
            <br />
            <TableDataComponent
              columns={columns}
              dataInfo={[...rows]}
              disableFilter={true}
              isPage={true}
              rowCount={100}
              getRowId={getRowId}
            />
          </StyleDataGrid>
          <StyleDataGrid2>
            <TableDataComponent
              columns={columnsOther}
              dataInfo={[...rows2]}
              disableFilter={true}
              isPage={true}
              rowCount={100}
              getRowId={getRowId}
            />
          </StyleDataGrid2>
          <ContainerSum>
            <StyleInputContainer>
              <LabelComponent require={true}>Tổng tiền chi</LabelComponent>
              <TextFieldCustom
                type={"text"}
                {...register("codeEmployee", { required: true })}
              />
            </StyleInputContainer>
            <StyleInputContainer>
              <LabelComponent require={true}>Tổng tiền chi</LabelComponent>
              <TextFieldCustom
                type={"text"}
                {...register("codeEmployee", { required: true })}
              />
            </StyleInputContainer>
          </ContainerSum>
          <Box
            sx={{
              justifyContent: "flex-end",
              display: "flex",
              marginTop: 3,
              padding: "0px 16px 8px 16px",
            }}
          >
            <Button size="small" variant="contained">
              Lưu Hóa Đơn
            </Button>
          </Box>
        </PageContent>
      </DrawerCustom>
    </>
  );
};
export default InvoiceDrawer;

const StyleInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;

const StyleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 64px;
`;
const ContainerSum = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 16px;
  margin-top: -30px;
`;
const InfoBankCard = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #0068a3;
  color: #0068a3;
  border-radius: 10px;
  padding: 10px;
  background-color: #d6f0ff;
`;
const StyleDataGrid = styled.div`
  width: 730px;
  padding: 0px 16px;
`;
const StyleDataGrid2 = styled.div`
  margin-top: -15px;
  width: 432px;
  padding: 0px 16px;
`;
const PageContent = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyleButtonSpan = styled.span`
  position: absolute;
  top: 32px;
  right: -21%;
`;
