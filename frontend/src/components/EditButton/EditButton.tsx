import { IconButton, IconButtonProps } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

interface EditButtonProps extends IconButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const EditButton: React.FC<EditButtonProps> = (props) => {
  const { onClick } = props
  return (
    <IconButton {...props} aria-label="screenshot" onClick={onClick}>
      <EditIcon fontSize="large" />
    </IconButton>
  )
}

export default EditButton
