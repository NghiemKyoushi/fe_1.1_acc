"use client";
import Dashboard from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import { Operators } from "@/components/common/DataGrid";
import DrawerCustom from "@/components/common/Drawer";
import { InputNumber } from "@/components/common/InputCustom";
import BasicSelect from "@/components/common/Select";
import {
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
  GridSortModel,
} from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { fetchInvoice } from "@/actions/InvoiceManagementActions";
import _ from "lodash";
import TableDataComponent from "@/components/common/DataGrid";
import InvoiceDrawer from "./Drawer/InvoiceDrawer";
import { Box, Button } from "@mui/material";
import styled from "styled-components";
import { formatDateTime } from "@/utils";
import { ColReceiptList } from "@/models/InvoiceManagement";
const initialInvoiceSearch = {
  page: 0,
  pageSize: 1,
  sorter: "code",
  sortDirection: "ASC",
};
export interface searchConditionParams {
  sorter?: string;
  sortDirection?: string | undefined;
  employeeId?: string;
  customerCardId?: string;
  posId?: string;
  title?: string;
  page?: number;
  pageSize?: number;
}

export default function InvoiceManagementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isOpenDrawInvoice, setIsOpenDrawInvoice] = useState(false);
  const listOfInvoice = useSelector(
    (state: RootState) => state.invoiceManagement.listOfInvoice
  );
  const pagination = useSelector(
    (state: RootState) => state.invoiceManagement.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.invoiceManagement.isLoading
  );
  const percentageFee = searchParams.get("percentageFee");
  const [searchCondition, setSearchCondition] =
    useState<searchConditionParams>(initialInvoiceSearch);
  const { register, handleSubmit, setValue, watch, reset, control } = useForm({
    defaultValues: useMemo(() => {
      return {
        percentageFee: percentageFee,
        codeEmployee: "909",
      };
    }, [percentageFee]),
  });
  const [percenUrl] = useDebounce(watch("percentageFee"), 500);
  const handleCloseInvoiceDraw = () => {
    setIsOpenDrawInvoice(false);
  };
  const handleOpenInvoiceDraw = () => {
    setIsOpenDrawInvoice(true);
  };
  useEffect(() => {
    dispatch(fetchInvoice(searchCondition));
  }, [searchCondition]);
  useEffect(() => {
    reset({
      percentageFee: percentageFee,
    });
  }, [percentageFee]);
  useEffect(() => {
    if (percenUrl) {
      router.push(`?percentageFee=${percenUrl}`);
    } else {
      router.push("");
    }
  }, [percenUrl]);

  const itemFilter = [
    {
      id: "nghiem333333",
      columnField: "percentageFee",
      value: "input",
      operatorValue: "input",
    },
    {
      id: "nghiem1",
      columnField: "percentageFee",
      value: "SelectItem",
      operatorValue: "SelectItem",
    },
  ];
  const columns1: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerClassName: "super-app-theme--header",
        headerName: "ID",
        width: 90,
      },
      {
        field: "firstName",
        headerName: "First name",
        headerClassName: "super-app-theme--header",
        width: 250,
      },
      {
        field: "lastName",
        headerName: "Last name",
        width: 250,
        headerClassName: "super-app-theme--header",
        type: "string",

        filterOperators: Operators({
          inputComponent: BasicSelect,
          value: "SelectItem",
          label: "SelectItem",
        }),
      },
      {
        field: "age",
        headerName: "Age",
        type: "number",
        width: 210,
        headerClassName: "super-app-theme--header",
        // filterOperators: Operators({
        //   inputComponent: (value: any) => {
        //     // return <InputNumber name={`age`} control={control} key={"age"} />;
        //     return (
        //       <input defaultValue="test" type={"number"} {...register("age")} />
        //     );
        //   },
        //   value: "input",
        //   label: "input",
        // }),
      },
    ],
    []
  );

  // const rows = [
  //   ...dataRow,
  //   { createdDate: "TOTAL", label: "Total", total: 686.4 },
  // ];
  const columns: GridColDef<ColReceiptList>[] = useMemo(
    () => [
      {
        headerName: "Ngày Tạo Hóa Đơn",
        field: "createdDate",
        width: 150,
        valueGetter: ({ row }) => {
          if (row.createdDate === "TOTAL") {
            return "TOTAL";
          }
          return formatDateTime(row.createdDate);
        },
      },
      {
        headerName: "Mã Hóa Đơn",
        field: "",
        width: 140,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
      },
      {
        headerName: "Tổng giao dịch",
        field: "1",
        width: 140,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
      },
      {
        headerName: "Thu",
        field: "2",
        width: 140,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
      },
      {
        headerName: "Chi",
        field: "3",
        width: 140,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
      },
      {
        headerName: "Công nợ",
        field: "4",
        width: 140,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
      },
      {
        headerName: "Thu nợ",
        field: "5",
        width: 140,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
      },

      // {
      //   headerName: "Thu nợ",
      //   field: "percentageFee",
      //   width: 250,
      //   filterOperators: Operators({
      //     inputComponent: (value: any) => {
      //       return (
      //         <div
      //           style={{
      //             display: "flex",
      //             flexDirection: "column",
      //           }}
      //         >
      //           <p
      //             style={{
      //               fontSize: 12,
      //               fontWeight: 400,
      //               padding: "0px 23px",
      //               margin: "-5px",
      //             }}
      //           >
      //             Gía trị
      //           </p>
      //           <InputNumber
      //             InputWidth={"100%"}
      //             {...register("percentageFee")}
      //             name={`percentageFee`}
      //             key={"percentageFee"}
      //             control={control}
      //           />
      //         </div>
      //       );
      //       // return (
      //       //   <input
      //       //     defaultValue="test"
      //       //     type={"number"}
      //       //     {...register("percentageFee")}
      //       //   />
      //       // );
      //     },
      //     value: "input",
      //     label: "input",
      //   }),
      // },
      {
        headerName: "Lợi nhuận gộp",
        field: "receiptId",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        width: 150,
        valueGetter: ({ row }) => {
          if (row.createdDate === "TOTAL") {
            console.log("row", row);
            // return row.total;
          }
          return 0;
        },
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        width: 164,
      },
    ],
    [listOfInvoice?.content]
  );
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
    if (!_.isEmpty(sortModel)) {
      const sortPage = {
        ...searchCondition,
        sorter:
          sortModel[0].field.toString().toUpperCase() === "CREATEDDATE"
            ? "CREATED_DATE"
            : sortModel[0].field.toString().toUpperCase(),
        sortDirection: sortModel[0].sort?.toString().toUpperCase(),
      };
      setSearchCondition(sortPage);
    }
  };
  const handleSearch = () => {
    console.log("check2323322");
  };
  const getRowId = (row: any) => {
    return row.createdDate;
  };

  return (
    <Dashboard>
      <StylePageContent>
        <Box sx={{ margin: "7px 16px" }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenInvoiceDraw()}
          >
            Thêm Hóa Đơn
          </Button>
        </Box>
        <form style={{ width: "100%" }}>
          {listOfInvoice?.content && (
            <StyleDataGrid>
              <TableDataComponent
                columns={columns}
                dataInfo={[
                  { createdDate: "TOTAL", label: "Total", total: 686.4 },
                  ...listOfInvoice?.content,
                ]}
                itemFilter={itemFilter}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                page={pagination?.pageNumber}
                pageSize={pagination?.size}
                rowCount={pagination?.totalElements}
                handleSortModelChange={handleSortModelChange}
                loading={isLoading}
                getRowId={getRowId}
              />
            </StyleDataGrid>
          )}
        </form>

        <InvoiceDrawer
          isOpen={isOpenDrawInvoice}
          handleCloseDrawer={handleCloseInvoiceDraw}
        />
      </StylePageContent>
    </Dashboard>
  );
}
const StylePageContent = styled.div`
  // display: flex;
  // flex-direction: column;
  // gap: 4px;
`;
const StyleDataGrid = styled.div`
  width: "100%";
  padding: 0px 16px;
`;
