import {
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Button,
} from "@mui/material";
import { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../store/appContext";
import { Navigate, useNavigate, useParams } from "react-router";
import React from "react";
import FlexBetween from "../component/styled/FlexBetween.jsx";

import { TodoListComponent } from "../component/TodoListComponent.jsx";
import { TodoComponent } from "../component/TodoComponent.jsx";

const InfoItem = ({ title, value }) => {
  return (
    <FlexBetween>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="h6">{value}</Typography>
    </FlexBetween>
  );
};
const UserProfile = () => {
  const { store, actions } = useContext(Context);
  const [user, setUser] = useState({});
  const [userTodoList, setUserTodoList] = useState([]);
  const [todoListCount, setTodoListCount] = useState(0);
  const [selectedTodoList, setSelectedTodoList] = useState('')
  const [todos, setTodos] = useState('')
  const theme = useTheme();
  const params = useParams();
  const Navigate = useNavigate();

  // get the username from the url
  const username = params.username;
  const token = sessionStorage.getItem("token");


  const selectTodolist = (name, Todos) => {
    const listedTodos = Todos
    setSelectedTodoList(name)
    setTodos(listedTodos)
    console.log("todos are ", listedTodos)
    console.log("and the Todos are:", todos)
  }
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
    if (store.user_info) {
      setUserTodoList(store.user_info.todo_list);
    }
    let todolistcount = userTodoList?.length;
    setTodoListCount(todolistcount);
  }, [store.user_info]);

  console.log(userTodoList);
  console.log(selectedTodoList);
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
          <Typography variant="h3">You are working on the current {selectedTodoList} list.</Typography>
          <hr />
        </Box>

        <Box className="UserInfo" gap="1rem" sx={{
          backgroundColor: theme.palette.primary.light
        }}>
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
        <Box className="TodoDetailedView">
          hola
        </Box>
        <Box className="TodoViews">
          {todos && todos?.map((todo) => (
            <TodoComponent 
            key={todo.id}
            name={todo.name}
            description={todo.description}
            id={todo.id}
            />))}
        </Box>
        <Box className="TodoListViews">
          {userTodoList?.map((todoList) => (
            <TodoListComponent
              key={todoList.id}
              name={todoList.name}
              description={todoList.description}
              onClick={() => {
                selectTodolist(todoList.name, todoList.todos)
                }
              }
            />
          ))}
        </Box>
      </FlexBetween>
    </Box>
  );
};

export default UserProfile;
