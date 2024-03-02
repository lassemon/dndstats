import { IconButton, IconButtonProps } from '@mui/material'
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({}))

interface ScreenshotButtonProps extends IconButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ScreenshotButton: React.FC<ScreenshotButtonProps> = (props) => {
  const { onClick } = props
  const { classes } = useStyles()
  return (
    <IconButton {...props} aria-label="screenshot" onClick={onClick}>
      <ScreenshotMonitorIcon fontSize="large" />
    </IconButton>
  )
}

export default ScreenshotButton
