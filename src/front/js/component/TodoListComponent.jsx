import {
  Box,
  Typography,
  IconButton,
  Fade,
  Modal,
  Backdrop,
  Button,
  Alert,
  AlertTitle,
  TextField,
  Icon,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import FlexBetween from "./styled/FlexBetween.jsx";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { red, green } from "@mui/material/colors";
import { deleteList, updateList } from "../ApiCalls.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export const TodoListComponent = ({
  name,
  description,
  todosCount,
  selectedList,
  onClick,
}) => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editedList, setEditedList] = useState({
    name: name,
    description: description,
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { actions, store } = useContext(Context);
  const theme = useTheme();
  const warningMessage = "Are you sure to delete this List?";
  const handleDelete = async () => {
    await actions.setDeletedList(sessionStorage.getItem("listName"));
    await deleteList();
    handleClose();
  };
  const handleUpdate = async (name, description) => {
    const listName = sessionStorage.getItem("listName");
    await actions.setUpdatedList(listName);
    await updateList(name, description);
    setIsEdit(false);
  };
  return (
    <Box
      className="TodoListComponent"
      sx={{
        backgroundColor: theme.palette.primary.light,
        height: `${isEdit ? "max-content" : null}`,
        padding: `${isEdit ? "1rem" : null}`,
      }}
      onClick={onClick}
    >
      <FlexBetween>
        {isEdit ? (
          <Fade in={isEdit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box>
                <TextField
                  variant="standard"
                  placeholder={name}
                  label="List Name"
                  onChange={(e) =>
                    setEditedList({ ...editedList, name: e.target.value })
                  }
                />
              </Box>
              <Box>
                <TextField
                  variant="standard"
                  placeholder={description}
                  label="List Description"
                  onChange={(e) =>
                    setEditedList({
                      ...editedList,
                      description: e.target.value,
                    })
                  }
                />
              </Box>
            </Box>
          </Fade>
        ) : (
          <Box>
            <Box>
              <Typography variant="h4">{name}</Typography>
            </Box>
            <Box>
              <Typography variant="h6">{description}</Typography>
            </Box>
          </Box>
        )}
        <FlexBetween>
          {isEdit ? (
            <>
              <IconButton
                onClick={() =>
                  handleUpdate(editedList.name, editedList.description)
                }
              >
                <CheckCircleIcon
                  sx={{
                    color: green[500],
                  }}
                />
              </IconButton>
              <IconButton onClick={() => setIsEdit(false)}>
                <CancelIcon
                  sx={{
                    color: red[500],
                  }}
                />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={() => setIsEdit(true)}>
                <ModeEditOutlinedIcon />
              </IconButton>
              <IconButton onClick={() => handleOpen()}>
                <DeleteForeverOutlinedIcon
                  sx={{
                    color: red[500],
                  }}
                />
              </IconButton>
            </>
          )}
        </FlexBetween>
      </FlexBetween>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {warningMessage}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: red[500],
                }}
                onClick={() => handleDelete()}
              >
                Yes
              </Button>
              <Button variant="contained" onClick={() => handleClose()}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};
