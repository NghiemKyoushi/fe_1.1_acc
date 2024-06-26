import cookie from "js-cookie";
import dayjs from "dayjs";
export const cookieSetting = {
  get: (name: string) => cookie.get(name),
  set: (name: string, value: string) =>
    cookie.set(name, value, { expires: 1 / 24 }),
  clear: (name: string) => cookie.remove(name),
  setWithoutTime: (name: string, value: string) => cookie.set(name, value),
};

export const getDateOfPresent = () => {
  const dates = new Date();
  const years = dates.getFullYear();
  const months = ("0" + (1 + dates.getMonth())).slice(-2);
  const days = ("0" + dates.getDate()).slice(-2);
  return years + "/" + months + "/" + days;
};
export const getValueWithComma = (res: any) => {
  // return res.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  let parts = res.toString().split(".");
  let integerPart = parts[0];
  let decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Thêm dấu phẩy phân cách hàng nghìn vào phần nguyên
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Kết hợp phần nguyên và phần thập phân
  let formattedNumber = integerPart + decimalPart;

  return formattedNumber;
};

export const handleKeyPress = (event: any) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
};
export const formatDateTime = (currentDate: string | number | Date) => {
  const date = dayjs(currentDate);
  return date.format("DD-MM-YYYY HH:mm");
};
export const formatDate = (currentDate: string | number | Date) => {
  const date = dayjs(currentDate);
  return date.format("YYYY/MM/DD");
};

export enum ROLE {
  ADMIN = "ADMIN",
  SUBMANAGER = "SUB-MANAGER",
  EMPLOYEE = "EMPLOYEE",
  VIEWER = "VIEWER",
}
export const LIST_STATUS_RECEIPT = [
  { key: "COMPLETED", values: "Hoàn thành" },
  { key: "LOANED", values: "Nợ" },
];
// export enum STATUS_RECEIPT {
//   COMPLETED = "COMPLETED",
//   LOANED = "LOANED",
// }
