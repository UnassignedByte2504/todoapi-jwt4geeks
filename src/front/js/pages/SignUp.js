import React, { useContext } from "react";
import { useState, useEffect } from "react";
import FlexBetween from "../component/styled/FlexBetween.jsx";
import { Navigate, useNavigate } from "react-router";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { signupSchema } from "../schemas/index.js";


import { Context } from "../store/appContext";

import FlexCentered from "../component/styled/FlexCentered.jsx";

function SignUp() {
  const [trigger, setTrigger] = useState(false)
  const Navigate = useNavigate();
  const {actions, store} = useContext(Context);
  const theme = useTheme();
  
  const onSubmit = async (values, ax) => {
    console.log(values.userName + " " + values.password + " " + values.email);
    const response = await actions.signUp(values.userName, values.email, values.password)

    await ax.resetForm();
    
    await setTrigger(true)
    console.log(response)
    }

  
  useEffect (() => {
    console.log("use effect called")
    if (trigger) {
      console.log("use effect triggered")
      Navigate("/login")
    }
  }, [trigger])

  
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: "",
      confirmEmail:"",
      password: "",
      confirmPassword: "",
      userName: "",
      confirmUsername:"",
    },
    validationSchema: signupSchema,
    onSubmit,
  });

  return (
    <Box className="container">
      <form onSubmit={handleSubmit} className="form" autoComplete="off">
        <FlexCentered>
          <Typography variant="h2" className="mb-2">
            Sign up
          </Typography>
        </FlexCentered>
        <hr/>
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
          <FlexCentered gap="0.75rem">
            <TextField
              id="userName"
              label="User Name"
              variant="outlined"
              name="userName"
              value={values.userName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.userName && touched.userName}
              helperText={errors.userName && touched.userName && errors.userName}
            />
            <TextField
              id="confirmUsername"
              label="Confirm username"
              variant="outlined"
              name="confirmUsername"
              value={values.confirmUsername}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmUsername && touched.confirmUsername}
              helperText={errors.confirmUsername && touched.confirmUsername && errors.confirmUsername}
            />

          </FlexCentered>
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
          id="confirmEmail"
          name="confirmEmail"
          label="Confirm Email address"
          type="email"
          value={values.confirmEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmEmail && touched.confirmEmail}
          helperText={errors.confirmEmail && touched.confirmEmail && errors.confirmEmail}
          variant="outlined"
        />
        <FlexCentered gap="0.75rem">
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
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword && touched.confirmPassword}
            helperText={
              errors.confirmPassword &&
              touched.confirmPassword &&
              errors.confirmPassword
            }
            variant="outlined"
          />
        </FlexCentered>
        <Button variant="contained" type="submit" disabled={isSubmitting} 
          backgroundcolor= {theme.palette.secondary.light}
        >Register</Button>
        </Box>

      </form>
    </Box>
  );
}

export default SignUp;
