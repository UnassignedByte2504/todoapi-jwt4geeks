import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Context } from "../store/appContext.js";
import { Navigate, useNavigate } from "react-router";
import { Box, Button, TextField, Typography, useTheme, dividerClasses, CircularProgress} from "@mui/material";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { loginSchema } from "../schemas/index.js";
import FlexCentered from "../component/styled/FlexCentered.jsx";

const Login = () => {
  const theme = useTheme();
  const Navigate = useNavigate();
  const {store, actions} = useContext(Context);
  const [trigger, setTrigger] = useState(false);

  const onSubmit = async (values, ax) => {

    const response = await actions.loginUser(values.email, values.password)
    
    if (sessionStorage.getItem("token")){
      setTrigger(true)
    }
  
  }

  useEffect (()=> {
    if (trigger){
      Navigate("/")
      setTrigger(false)
    }
  }, [trigger])


  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmiting,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit,
  });
  return (
    <Box className="container">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <FlexCentered>
          <Typography variant="h2" className="mb-2">
            Login
          </Typography>
        </FlexCentered>
        <hr />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px))",
            gridGap: "1rem",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "1rem",
            backgroundColor: theme.palette.secondary.main,
            borderRadius: "10px",
            boxShadow: "0px 0px 10px #00000029",
          }}
        >
                    
            <TextField
            id="email"
            name="email"
            label="Email address"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email && touched.email}
            helperText={errors.email && touched.email && errors.email}
            variant="outlined"
            />
            <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password && touched.password}
            helperText={errors.password && touched.password && errors.password}
            variant="outlined"
            />
            <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmiting}
            >
              Log in
              {isSubmiting && (
                <CircularProgress
                size={24}
                className="buttonProgress"
                />
              )}
            </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
