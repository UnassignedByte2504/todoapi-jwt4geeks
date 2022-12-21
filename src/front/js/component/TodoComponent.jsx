import { Typography, Box, useTheme } from '@mui/material'
import React from 'react'

export const TodoComponent = ({name, description}) => {
  const theme = useTheme()
  return (
    <Box
    className="TodoListComponent"
  sx={{
    backgroundColor: theme.palette.primary.light,
  }}
  
> 
  <Box><Typography variant="h4">{name}</Typography></Box>
  <Box><Typography variant="h6">{description}</Typography></Box>
</Box>
  )
}
