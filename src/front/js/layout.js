import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./pages/home";
import SignUp from "./pages/SignUp";

import Navbar from "./component/Navbar.jsx";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import { useContext } from "react";
import injectContext from "./store/appContext";
import { Context } from "./store/appContext";
// Theme related imports >>
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useSelector } from "react-redux";
import { useMemo } from "react";
// Theme related imports <<

//create your first component
const Layout = () => {
  const hasJWT  = () => {
    const token = localStorage.getItem("token")
    const localToken = store.localToken;

    if (token && localToken) {
      return true;
    } else {
      return false;
    }
  };
  
  const {store, actions} = useContext(Context);
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<h1>Not found!</h1>} />
            <Route element={<SignUp />} path="/signup" />
            <Route element={<Login />} path="/login" />
            <Route element={<UserProfile />} path="user/:username" />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
