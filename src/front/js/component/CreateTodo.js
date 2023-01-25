import React, { useState, useMemo, useRef, useEffect, useContext } from "react";
import { Box, Typography, TextField, Divider, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Context } from "../store/appContext";
import { newTodo } from "../ApiCalls.js";

const CreateTodo = ({ REF }) => {
  const { store, actions } = useContext(Context);
  const theme = useTheme();
  const [todo, setTodo] = useState({
    name: "",
    description: "",
  });
  return (
    <Box
      className="CreateListWrapper mb-2"
      sx={{
        backgroundColor: theme.palette.primary.light,
      }}
      
    >
      <Box className="CreateListForm">
        <Box>
          <Typography variant="h6" className="CreateListTitle">
            Create a new todo
          </Typography>
        </Box>
        <Divider
          sx={{
            width: "100% !important",
          }}
        />
        <Box>
          <TextField
            variant="standard"
            label="Name"
            inputRef={REF}
            value={todo.name}
            onChange={(e) => setTodo({ ...todo, name: e.target.value })}
          />
        </Box>
        <Box>
          <TextField
            variant="standard"
            label="Description"
            value={todo.description}
            onChange={(e) => setTodo({ ...todo, description: e.target.value })}
          />
        </Box>
        <Box className="CreateListButton">
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.secondary.light,
            }}
            onClick={() => newTodo(todo.name, todo.description)}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTodo;
