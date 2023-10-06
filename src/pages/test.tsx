"use client"
import Dashboard from "@/components/Layout";
import { useEffect, useMemo } from "react";
import CustomMultiValueOperator, {
  Operators,
} from "@/components/common/DataGrid";
import DrawerCustom from "@/components/common/Drawer";
import { InputNumber } from "@/components/common/InputCustom";
import BasicSelect from "@/components/common/Select";
import { TextFieldCustom } from "@/components/common/Textfield";
import {
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
} from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { usePathname, useSearchParams } from "next/navigation";

function useQuery() {
  // const { search } = useLocation();
  const router = useRouter();
  const query = router.query;
  console.log("pathname", query);
  return useMemo(() => new URLSearchParams(query), [query]);
}
export default function Test() {
  const searchParams = useSearchParams();
  const router = useRouter();
  let query = useQuery();

  const searchAge = query.get("age");
  // const searchAge = searchParams.get("age");
  console.log("searchAge", searchAge)

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      age: searchAge
    }
  });

  const age = watch("age");
  console.log('age', age)
  const [debouncedValue] = useDebounce(age, 500);
  console.log("debouncedValue", debouncedValue);
  useEffect(() => {
  if (debouncedValue) {
    router.push(`?age=${debouncedValue}`);
  } 
  // else {
  //   router.push(" ");
  // }
  }, [debouncedValue]);

  // const itemFilter = [
  //   {
  //     id: "nghiem333333",
  //     columnField: "age",
  //     value: "input",
  //     operatorValue: "input",
  //   },
  //   {
  //     id: "nghiem1",
  //     columnField: "lastName",
  //     value: "SelectItem",
  //     operatorValue: "SelectItem",
  //   },
  // ];
  // const row = [
  //   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  //   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  //   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  //   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  //   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  //   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  //   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  //   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  //   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  // ];
  // const columns1: GridColDef[] = useMemo(
  //   () => [
  //     { field: "id", headerName: "ID", width: 90 },
  //     {
  //       field: "firstName",
  //       headerName: "First name",
  //       width: 250,
  //       // pinnable: true,
  //     },
  //     {
  //       field: "lastName",
  //       headerName: "Last name",
  //       width: 250,
  //       type: "string",

  //       filterOperators: Operators({
  //         inputComponent: BasicSelect,
  //         value: "SelectItem",
  //         label: "SelectItem",
  //       }),
  //     },
  //     {
  //       field: "age",
  //       headerName: "Age",
  //       type: "number",
  //       width: 210,
  //       filterOperators: Operators({
  //         inputComponent: (value: any) => {
  //           // return <InputNumber name={`age`} control={control} key={"age"} />;
  //           return (
  //             <input defaultValue="test" type={"number"} {...register("age")} />
  //           );
  //         },
  //         value: "input",
  //         label: "input",
  //       }),
  //     },
  //   ],
  //   []
  // );

  return (
    <div>
      {/* <DrawerCustom widthDrawer={450} /> */}
      <form style={{ width: "100%" }}>
        {/* <CustomMultiValueOperator
          columns={columns1}
          dataInfo={row}
          itemFilter={itemFilter}
        /> */}
         <input  type={"number"} {...register("age")} />
      </form>
    </div>
  );
}
