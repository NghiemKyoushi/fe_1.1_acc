"use client";
import { SvgIcon } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import LoginIcon from "@mui/icons-material/Login";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CallToActionOutlinedIcon from "@mui/icons-material/CallToActionOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
export const items = [
  {
    title: "Quản Lý Hóa Đơn",
    path: "/invoiceManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <FileCopyIcon />
      </SvgIcon>
    ),
    disabled: false,
    roles: ["ADMIN", "EMPLOYEE", "SUB-MANAGER"],
  },
  {
    title: "Sổ thu chi quản lý",
    path: "/accBookManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <AccountBalanceWalletOutlinedIcon />
      </SvgIcon>
    ),
    disabled: false,
    roles: ["ADMIN", "SUB-MANAGER"],
  },
  {
    title: "Sổ kế toán tổng hợp",
    path: "/genAccBookManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <SummarizeOutlinedIcon />
      </SvgIcon>
    ),
    disabled: false,
    roles: ["ADMIN"],
  },
  {
    title: "Quản lý bill",
    path: "/billManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <MenuBookIcon />
      </SvgIcon>
    ),
    disabled: false,
    roles: ["ADMIN"],
  },
  {
    title: "Quản lý pos",
    path: "/posManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <CallToActionOutlinedIcon />
      </SvgIcon>
    ),
    roles: ["ADMIN"],
  },
  {
    title: "Quản lý chi nhánh",
    path: "/branchManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <AccountTreeOutlinedIcon />
      </SvgIcon>
    ),
    roles: ["ADMIN"],
  },
  {
    title: "Quản lý nhân viên",
    path: "/empManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <ManageAccountsOutlinedIcon />
      </SvgIcon>
    ),
    roles: ["ADMIN"],
  },
  {
    title: "Quản lý khách hàng",
    path: "/customerManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <ContactMailOutlinedIcon />
      </SvgIcon>
    ),
    roles: ["ADMIN", "EMPLOYEE"],
  },
  {
    title: "Quản lý thẻ khách",
    path: "/cardCustomer",
    icon: (
      <SvgIcon fontSize="medium">
        <DescriptionIcon />
      </SvgIcon>
    ),
    roles: ["ADMIN", "EMPLOYEE"],
  },
  {
    title: "Thông tin tài khoản",
    path: "/infoAccount",
    icon: (
      <SvgIcon fontSize="medium">
        <AccountBoxOutlinedIcon />
      </SvgIcon>
    ),
    roles: ["ADMIN", "EMPLOYEE", "SUB-MANAGER"],
  },
  {
    title: "Cài đặt",
    path: "/settingManagement",
    icon: (
      <SvgIcon fontSize="small">
        <SettingsOutlinedIcon />
      </SvgIcon>
    ),
    roles: ["ADMIN"],
  },
  {
    title: "Đăng xuất",
    path: "/auth/login",
    icon: (
      <SvgIcon fontSize="small">
        <LoginIcon />
      </SvgIcon>
    ),
    disabled: false,
  },
];
