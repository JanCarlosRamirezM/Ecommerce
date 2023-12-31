import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productDetailsReducer,
  productsReducer,
} from "../reducers/productReducers";
import { authReducer, userReducer } from "../reducers/userReducers";

const reducer = combineReducers({
  products: productsReducer,
  produtDetails: productDetailsReducer,
  auth: authReducer,
  user: userReducer,
});

let initialState = {};
const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
