import {
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Button,
  Fab,
  Alert,
  AlertTitle,
  Fade,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { red } from "@mui/material/colors";
import { useContext, useEffect, useState, useMemo, useRef } from "react";
import { Context } from "../store/appContext";
import { Navigate, useNavigate, useParams } from "react-router";
import React from "react";
import FlexBetween from "../component/styled/FlexBetween.jsx";
import CreateTodoList from "../component/CreateTodoList.js";
import { TodoListComponent } from "../component/TodoListComponent.jsx";
import { TodoComponent } from "../component/TodoComponent.jsx";
import CreateTodo from "../component/CreateTodo";
import CancelIcon from "@mui/icons-material/Cancel";
const InfoItem = ({ title, value }) => {
  return (
    <FlexBetween>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="h6">{value}</Typography>
    </FlexBetween>
  );
};
const UserProfile = () => {
  const firstInput = useRef();
  const { store, actions } = useContext(Context);
  const [user, setUser] = useState({});
  const [userTodoList, setUserTodoList] = useState([]);
  const [todoListCount, setTodoListCount] = useState(0);
  const [listOpen, setListOpen] = useState(false);
  const [addTodo, setAddTodo] = useState(false);
  const [newTodo, setNewTodo] = useState({});
  const [alertOpen, setAlertOpen] = useState();
  const [alertOpenEdit, setAlertOpenEdit] = useState(false);
  const [selectedTodoList, setSelectedTodoList] = useState("");
  const [todos, setTodos] = useState("");
  const theme = useTheme();
  const params = useParams();
  const Navigate = useNavigate();

  // get the username from the url
  const username = params.username;
  const token = sessionStorage.getItem("token");

  const selectTodolist = (name, Todos) => {
    const listedTodos = Todos;
    setSelectedTodoList(name);
    sessionStorage.setItem("listName", name);
    setTodos(listedTodos);
    console.log("todos are ", listedTodos);
    console.log("and the Todos are:", todos);
  };

  const openCreateList = async () => {
    if (!listOpen) {
      setListOpen(true);
      firstInput.current?.focus();
    } else {
      setListOpen(false);
    }
  };

  // useEffect((username))
  useEffect(() => {
    actions.fetchUser(token, username);
  }, []);

  useEffect(() => {
    if (store.user_info) {
      setUser(store.user_info);
    }
  }, [store.user_info]);

  useEffect(() => {
    if (store.deletedList !== "") {
      setAlertOpen(true);
    }

    return () => {
      if (store.deletedList !== "") {
        setTimeout(() => {
          setAlertOpen(false);
          actions.setDeletedList("");
          window.location.reload();
        }, 3000);
      }
    };
  }, [store.deletedList]);

  useEffect(() => {
    if (store.updatedList !== "") {
      setAlertOpenEdit(true);
    }

    return () => {
      if (store.updatedList !== "") {
        setTimeout(() => {
          setAlertOpenEdit(false);
          window.location.reload();
          actions.setUpdatedList("");
        }, 3000);
      }
    };
  }, [store.updatedList]);

  useEffect(() => {
    if (store.user_info) {
      setUserTodoList(store.user_info.todo_list);
    }
    let todolistcount = userTodoList?.length;
    setTodoListCount(todolistcount);
  }, [store.user_info]);

  return (
    <Box
      className="container MainTodoView shadow"
      sx={{
        backgroundColor: theme.palette.secondary.main,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FlexBetween className="HeaderWrapper">
        <Box className="TodoViewTitle">
          <Typography variant="h3">
            {selectedTodoList === ""
              ? "This is your dashboard, please select a list."
              : `You are working on ${selectedTodoList} list.`}
          </Typography>
          <hr />
        </Box>

        <Box
          className="UserInfo"
          gap="1rem"
          sx={{
            backgroundColor: theme.palette.primary.light,
          }}
        >
          <Typography variant="h3">Your information</Typography>
          <hr />
          <Box gap="1rem !important">
            <InfoItem title="Username: " value={user.username} />
            <InfoItem title="Email: " value={user.email} />
            <InfoItem title="Active Todo Lists " value={todoListCount} />
          </Box>
        </Box>
      </FlexBetween>
      <FlexBetween className="BodyWrapper" gap=".50rem" p="1rem">
        <Box className="TodoViews">
          <FlexBetween className="mb-3">
            {selectedTodoList !== "" ? (
              <Fab
                variant="extended"
                aria-label="New Todo"
                className="CreateTodo"
                onClick={() => setAddTodo(!addTodo)}
                sx={{
                  backgroundColor: theme.palette.secondary.light,
                }}
              >
                <AddIcon />
                New todo on {selectedTodoList}
              </Fab>
            ) : null}
            {addTodo ? (
              <Fade in={addTodo}>
                <Fab
                  variant="extended"
                  aria-label="cancel"
                  className="cancelTodoList"
                  sx={{
                    backgroundColor: red[500],
                    fontWeight: 700,
                  }}
                  onClick={() => setAddTodo(false)}
                >
                  <CancelIcon />
                  Discard
                </Fab>
              </Fade>
            ) : null}
          </FlexBetween>
          {addTodo ? <CreateTodo /> : null}
          {addTodo ? null : todos && todos?.map((todo) => (
              <TodoComponent
                key={todo.id}
                name={todo.name}
                description={todo.description}
                id={todo.id}
                completed={todo.is_completed}
              />
            )) }
        </Box>
        <Box className="TodoListViews">
          <FlexBetween className="mb-3">
            <Fab
              variant="extended"
              aria-label="add"
              className="addTodoList"
              onClick={() => openCreateList()}
              sx={{
                backgroundColor: theme.palette.secondary.light,
              }}
            >
              <AddIcon />
              Create a new list
            </Fab>
            {listOpen ? (
              <Fade in={listOpen}>
                <Fab
                  variant="extended"
                  aria-label="cancel"
                  className="cancelTodoList"
                  sx={{
                    backgroundColor: red[500],
                    fontWeight: 700,
                  }}
                  onClick={() => setListOpen(false)}
                >
                  <CancelIcon />
                  Discard
                </Fab>
              </Fade>
            ) : null}
          </FlexBetween>
          {listOpen ? <CreateTodoList REF={firstInput} /> : null}
          {listOpen
            ? null
            : userTodoList?.map((todoList) => (
                <TodoListComponent
                  key={todoList.id}
                  name={todoList.name}
                  description={todoList.description}
                  onClick={() => {
                    selectTodolist(todoList.name, todoList.todos);
                  }}
                />
              ))}
          <Fade in={alertOpen}>
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              The <strong>{store?.deletedList}</strong> list has been deleted.
            </Alert>
          </Fade>
          <Fade in={alertOpenEdit}>
            <Alert severity="success">
              <AlertTitle>Updated Successfully</AlertTitle>
              The <strong>{store?.updatedList}</strong> has been updated.
            </Alert>
          </Fade>
        </Box>
      </FlexBetween>
    </Box>
  );
};

export default UserProfile;
