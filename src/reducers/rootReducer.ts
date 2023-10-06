import { combineReducers } from "redux";

import authReducer from "../store/auth/reducer";
import InvoiceManagementReducers from "./InvoiceManagementReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  invoiceManagement: InvoiceManagementReducers,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;