import { combineReducers } from "redux";

import authReducer from "../store/auth/reducer";
import InvoiceManagementReducers from "./InvoiceManagementReducer";
import CustomerManagementReducers from "./CustomerManagementReducer";
import CardCustomertReducers from "./CardCustomer";
import PosManagement from "./PosManagement";
import EmpManagement from "./EmpManagement";
import AccBookReducers from "./AccBookRecuder";
import GenAccBookReducers from "./GenAccBookRecuder";
import BillManagementReducers from "./BillManagementReducer";
import AccEntryTypeReducers from "./AccEntryTypeReducer";
import BranchReducers from "./BranchReducer";
const rootReducer = combineReducers({
  auth: authReducer,
  invoiceManagement: InvoiceManagementReducers,
  customerManagament: CustomerManagementReducers,
  cardCustomer: CardCustomertReducers,
  posManagement: PosManagement,
  empManagement: EmpManagement,
  accBookManagement: AccBookReducers,
  genAccBookManagement: GenAccBookReducers,
  billManagement: BillManagementReducers,
  accEntryType: AccEntryTypeReducers,
  branchManaement: BranchReducers,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
