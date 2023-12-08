"use client";

import BarChartIcon from "@mui/icons-material/BarChart";
import { SvgIcon } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FaceIcon from "@mui/icons-material/Face";
import LoginIcon from "@mui/icons-material/Login";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CallToActionOutlinedIcon from "@mui/icons-material/CallToActionOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
export const items = [
  // {
  //   title: "Tổng quan",
  //   path: "/",
  //   icon: (
  //     <SvgIcon fontSize="medium">
  //       <BarChartIcon />
  //     </SvgIcon>
  //   ),
  //   disabled: false,
  // },
  {
    title: "Quản Lý Hóa Đơn",
    path: "/invoiceManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <FileCopyIcon />
      </SvgIcon>
    ),
    disabled: false,
  },
  {
    title: "Sổ kế Toán",
    path: "/accBookManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <AccountBalanceWalletOutlinedIcon />
      </SvgIcon>
    ),
    disabled: false,
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
  },
  {
    title: "Quản lý pos",
    path: "/posManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <CallToActionOutlinedIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Quản lý nhân viên",
    path: "/empManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <ManageAccountsOutlinedIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Quản lý thẻ khách",
    path: "/invoice",
    icon: (
      <SvgIcon fontSize="medium">
        <DescriptionIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Cài đặt",
    path: "/settings",
    icon: (
      <SvgIcon fontSize="small">
        <SettingsOutlinedIcon />
      </SvgIcon>
    ),
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
  // {
  //   title: 'Register',
  //   path: '/auth/register',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserPlusIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Error',
  //   path: '/404',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <XCircleIcon />
  //     </SvgIcon>
  //   )
  // }
];
