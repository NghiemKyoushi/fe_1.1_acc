import { applyMiddleware } from "redux";
import { legacy_createStore as createStore} from 'redux'

import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";

import rootReducer from "../reducers/rootReducer";
import { rootSaga } from "../sagas/rootSaga";

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Mount it on the Store
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

// Run the saga
sagaMiddleware.run(rootSaga);

export default store;