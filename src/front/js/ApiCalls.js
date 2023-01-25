import React from "react";

export const createTodoList = async (listName, description) => {
  const username = sessionStorage.getItem("username");
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: `{
        "name": "${listName}",
        "description": "${description}"}`,
  };
  await fetch(`${process.env.BACKEND_URL}/api/${username}/todolists`, opts)
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

export const updateList = async (listName, description) => {
  const username = sessionStorage.getItem("username");
  const listname = sessionStorage.getItem("listName");

  const opts = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: `{
        "name": "${listName}",
        "description": "${description}"}`,
  };
  await fetch(
    `${process.env.BACKEND_URL}/api/${username}/todolists/${listname}`,
    opts
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

export const deleteList = async () => {
  const listname = sessionStorage.getItem("listName");
  const opts = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };
  await fetch(
    `${process.env.BACKEND_URL}/api/${sessionStorage.getItem(
      "username"
    )}/todolists/${listname}`,
    opts
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

// >>>>>>>>>>>>>>TODOS

export const newTodo = async (todoName, todoDescription) => {
  const username = sessionStorage.getItem("username");
  const listname = sessionStorage.getItem("listName");
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: `{
        "name": "${todoName}",
        "description": "${todoDescription}"}`,
  };
  await fetch(
    `${process.env.BACKEND_URL}/api/${username}/todolists/${listname}`,
    opts
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));


};

export const deleteTodo = async (todoName) => {
  const username = sessionStorage.getItem("username");
  const listname = sessionStorage.getItem("listName");
  const opts = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };
  await fetch(
    `${process.env.BACKEND_URL}/api/${username}/todolists/${listname}/${todoName}`,
    opts
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

export const updateTodo = async (oldName, todoName, todoDescription) => {
  const username = sessionStorage.getItem("username");
  const listname = sessionStorage.getItem("listName");
  const opts = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: `{
        "name": "${todoName}",
        "description": "${todoDescription}"}`,
  };
  await fetch(
    `${process.env.BACKEND_URL}/api/${username}/todolists/${listname}/${oldName}`,
    opts
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

export const completeTodo = async (todoName) => {
  const username = sessionStorage.getItem("username");
  const listname = sessionStorage.getItem("listName");
  const opts = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };
  await fetch(
    `${process.env.BACKEND_URL}/api/${username}/todolists/${listname}/${todoName}/complete`,
    opts
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

// <<<<<<<<<<<<<<TODOS
