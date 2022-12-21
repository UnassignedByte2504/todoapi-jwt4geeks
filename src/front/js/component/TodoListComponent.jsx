import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { useContext } from "react";
import { Context } from "../store/appContext";

export const TodoListComponent = ({ name, description, todosCount, selectedList, onClick}) => {
const {actions, store} = useContext(Context);
  const theme = useTheme();

  return (
    <Box
        className="TodoListComponent"
      sx={{
        backgroundColor: theme.palette.secondary.light,
      }}
      onClick={onClick}
    >
      <Box><Typography variant="h4">{name}</Typography></Box>
      <Box><Typography variant="h6">{description}</Typography></Box>
    </Box>
  );
};
