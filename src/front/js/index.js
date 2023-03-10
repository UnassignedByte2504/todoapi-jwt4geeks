//import react into the bundle
import React from "react";
import ReactDOM from "react-dom/client";

import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./state/index";
import { Provider } from "react-redux";

//include your index.scss file into the bundle
import "../styles/index.css";

// redux state/store
const store = configureStore({
  reducer: {
    global: globalReducer,
  },
});

//import your own components
import Layout from "./layout";

//render your react application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Layout />
    </Provider>
  </React.StrictMode>
);
