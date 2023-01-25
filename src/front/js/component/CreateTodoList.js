import React, { useState, useMemo, useRef, useEffect, useContext } from "react";
import { Box, Typography, TextField, Divider, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Context } from "../store/appContext";
import { createTodoList } from "../ApiCalls.js";
const CreateTodoList = ({ REF }) => {
  const { actions, store } = useContext(Context);
  const theme = useTheme();

  const [todoList, setTodoList] = useState({
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
            Create a new list
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
            label="List name"
            inputRef={REF}
            value={todoList.name}
            onChange={(e) => setTodoList({ ...todoList, name: e.target.value })}
          />
        </Box>
        <Box>
          <TextField
            variant="standard"
            label="Description"
            value={todoList.description}
            onChange={(e) =>
              setTodoList({ ...todoList, description: e.target.value })
            }
          />
        </Box>
        <Box className="CreateListButton">
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.secondary.light,
            }}
            onClick={() => createTodoList(todoList.name, todoList.description)}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTodoList;
