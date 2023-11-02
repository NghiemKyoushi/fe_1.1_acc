"use client";
import Dashboard from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import { Operators } from "@/components/common/DataGrid";
import DrawerCustom from "@/components/common/Drawer";
import { InputNumber } from "@/components/common/InputCustom";
import BasicSelect from "@/components/common/Select";
import { TextFieldCustom } from "@/components/common/Textfield";
import {
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
  GridSortModel,
} from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { usePathname, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { fetchInvoice } from "@/actions/InvoiceManagementActions";
import _ from "lodash";
import TableDataComponent from "@/components/common/DataGrid";
import SearchIcon from "@mui/icons-material/Search";
import { LabelComponent } from "@/components/common/LabelComponent";
import styled from "styled-components";
import { Button } from "@mui/material";
const initialInvoiceSearch = {
  employeeId: "",
  customerCardId: "",
  posId: "",
  title: "",
  // startDate: " ",
  // endDate: " ",
  page: 0,
  pageSize: 10,
  sorter: "CREATED_DATE",
  sortDirection: "DESC",
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

export default function Test() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const percentageFee = searchParams.get("percentageFee");
  const listOfInvoice = useSelector(
    (state: RootState) => state.invoiceManagement.listOfInvoice
  );
  const pagination = useSelector(
    (state: RootState) => state.invoiceManagement.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.invoiceManagement.isLoading
  );
  const [searchCondition, setSearchCondition] =
    useState<searchConditionParams>(initialInvoiceSearch);
  const dispatch = useDispatch();

  const { register, handleSubmit, setValue, watch, reset, control } = useForm({
    defaultValues: useMemo(() => {
      return {
        percentageFee: percentageFee,
        codeEmployee: "909",
      };
    }, [percentageFee]),
  });
  const age = watch("percentageFee");
  const [debouncedValue] = useDebounce(age, 500);

  useEffect(() => {
    dispatch(fetchInvoice(searchCondition));
  }, [searchCondition]);
  useEffect(() => {
    reset({
      percentageFee: percentageFee,
    });
  }, [percentageFee]);
  useEffect(() => {
    if (debouncedValue) {
      router.push(`?percentageFee=${debouncedValue}`);
    } else {
      router.push("");
    }
  }, [debouncedValue]);

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
  const columns: GridColDef[] = useMemo(
    () => [
      {
        headerName: "Ngày Tạo Hóa Đơn",
        field: "createdDate",
        width: 250,
      },
      {
        headerName: "Mã Hóa Đơn",
        field: "receiptCode",
        width: 250,
      },
      {
        headerName: "Phần trăm phí",
        field: "percentageFee",
        width: 250,
        filterOperators: Operators({
          inputComponent: (value: any) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 400,
                    padding: "0px 23px",
                    margin: "-5px",
                  }}
                >
                  Gía trị
                </p>
                <InputNumber
                  InputWidth={"100%"}
                  {...register("percentageFee")}
                  name={`percentageFee`}
                  key={"percentageFee"}
                  control={control}
                />
              </div>
            );
            // return (
            //   <input
            //     defaultValue="test"
            //     type={"number"}
            //     {...register("percentageFee")}
            //   />
            // );
          },
          value: "input",
          label: "input",
        }),
      },
      {
        headerName: "Id hóa đơn",
        field: "receiptId",
        width: 250,
        valueGetter: ({ row }) => {
          if (row.createdDate === "TOTAL") {
            return row.total;
          }
          return 0;
        },
      },
      // {
      //   headerName: "Thao Tác",
      //   field: "actions",
      //   width: 250,
      // },
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
  return (
    <Dashboard>
      {/* <form onSubmit={handleSubmit(handleSearch)}>
      <label htmlFor="username">User Name</label>
      <input placeholder="codeEmployee" {...register("codeEmployee")} />

      <input type="submit" />
    </form> */}
      <form style={{ width: "100%" }}>
        <DrawerCustom widthDrawer={750}>
          <form style={{padding: 32}} onSubmit={handleSearch}>
            <StyleInputContainer>
              <LabelComponent require={true}>Mã Nhân Viên</LabelComponent>
              <TextFieldCustom
                // textfieldprops={{ variant: "standard" }}
                type={"text"}
                iconend={<SearchIcon />}
                {...register("codeEmployee", { required: true })}
                onChange={(e: any) => {
                  const regex = /^[0-9]*$/;
                  if (regex.test(e.target.value)) {
                    console.log("target.value", e.target.value);
                    setValue("codeEmployee", e.target.value);
                  }
                }}
              />
            </StyleInputContainer>
            <StyleInputContainer>
              <LabelComponent require={true}>Mã Nhân Viên</LabelComponent>
              <TextFieldCustom
                // textfieldprops={{ variant: "standard" }}
                type={"text"}
                iconend={<SearchIcon />}
                {...register("codeEmployee", { required: true })}
                onChange={(e: any) => {
                  const regex = /^[0-9]*$/;
                  if (regex.test(e.target.value)) {
                    console.log("target.value", e.target.value);
                    setValue("codeEmployee", e.target.value);
                  }
                }}
              />
            </StyleInputContainer>

            <StyleInputContainer>
              <LabelComponent require={true}>Mã Nhân Viên</LabelComponent>
              <TextFieldCustom
                // textfieldprops={{ variant: "standard" }}
                type={"text"}
                iconend={<SearchIcon />}
                {...register("codeEmployee", { required: true })}
                onChange={(e: any) => {
                  const regex = /^[0-9]*$/;
                  if (regex.test(e.target.value)) {
                    console.log("target.value", e.target.value);
                    setValue("codeEmployee", e.target.value);
                  }
                }}
              />
            </StyleInputContainer>
            <StyleInputContainer>
              <LabelComponent require={true}>Mã Nhân Viên</LabelComponent>
              <TextFieldCustom
                // textfieldprops={{ variant: "standard" }}
                type={"text"}
                iconend={<SearchIcon />}
                {...register("codeEmployee", { required: true })}
                onChange={(e: any) => {
                  const regex = /^[0-9]*$/;
                  if (regex.test(e.target.value)) {
                    console.log("target.value", e.target.value);
                    setValue("codeEmployee", e.target.value);
                  }
                }}
              />
            </StyleInputContainer>
          </form>
        </DrawerCustom>

        {listOfInvoice?.content && (
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
          />
        )}
      </form>
    </Dashboard>
  );
}

const StyleInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8;
`;
