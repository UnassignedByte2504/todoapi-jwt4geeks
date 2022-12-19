import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import FlexBetween from "./styled/FlexBetween.jsx";
import { useDispatch } from "react-redux";
import { setMode } from "../state";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Link } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const NavItem = ({ too, title }) => {
    return (
      <Link className="LinkMS" to={too}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.light,
          }}
        >
          {title}
        </Button>
      </Link>
    );
  };

  return (
    <div className="container">
      <AppBar
        sx={{
          position: "static",
          background: "none",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
          }}
        >
          {/* LEFT SIDE */}
          <FlexBetween>
            {/* <IconButton onClick={() => console.log("open/close sidebar")}>
            <MenuIcon />
          </IconButton> */}
            <FlexBetween
              backgroundColor={theme.palette.background.alt}
              borderRadius="9px"
              gap="3rem"
            >
              <NavItem too="/signup" title="Sign up" />
            </FlexBetween>
          </FlexBetween>
          {/* RIGHT SIDE */}
          <FlexBetween gap="1.5rem">
            <Link className="LinkMS" to="/">
              <IconButton>
                <Typography variant="h6">Home</Typography>
                <HomeOutlinedIcon />
              </IconButton>
            </Link>
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlined sx={{ fontSize: "25px" }} />
              ) : (
                <LightModeOutlined sx={{ fontSize: "25px" }} />
              )}
            </IconButton>
            
              <FlexBetween>
                <Link className="LinkMS" to="/login">
                  <IconButton>
                  <Typography variant="h6" fontWeight="bold">
                    Login
                  </Typography>
                  <LoginIcon sx={{ fontSize: "25px" }} />
                  </IconButton>
                </Link>
              </FlexBetween>
            
          </FlexBetween>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
