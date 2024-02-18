import React, { useEffect, useState } from 'react'

import { List, ListItemButton, ListItemText, Menu, MenuItem } from '@mui/material'
import { useOrientation } from 'utils/hooks'
import { useNavigate } from 'react-router-dom'
import { getPageName } from 'utils/url'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  root: {
    whiteSpace: 'nowrap',
    padding: 0,
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  listItem: {
    padding: '0.7em'
  },
  selectedIndicatorLandscape: {
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.secondary.main,
    width: '6px',
    height: '100%'
  },
  selectedIndicatorPortrait: {
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.secondary.main,
    width: '100%',
    height: '2px'
  }
}))

const STAT_PAGES = {
  '/stats/item': 'Item Stats',
  '/stats/spell': 'Spell Stats',
  '/stats/weapon': 'Weapon Stats',
  '/stats/monster': 'Monster Stats'
}
const statPageTitles = Object.values(STAT_PAGES)

interface StatsPageMenuProps {
  onMenuItemClick: (index: number) => void
}

const isUrlAStatPage = (): boolean => {
  return Object.keys(STAT_PAGES).includes(`/${getPageName()}`)
}

const StatsPageMenu: React.FC<StatsPageMenuProps> = ({ onMenuItemClick }) => {
  const { classes } = useStyles()

  const [statPageSelected, setStatPageSelected] = useState(isUrlAStatPage)
  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'
  const navigate = useNavigate()

  const [statsMenuAnchorElement, setStatsMenuAnchorElement] = React.useState<null | HTMLElement>(null)
  const stasMenuOpen = Boolean(statsMenuAnchorElement)

  const windowLocationIsStatPage = Object.keys(STAT_PAGES).includes(window.location.pathname)

  const [selectedStatsPageIndex, setSelectedStatsPageIndex] = React.useState(
    windowLocationIsStatPage ? Object.keys(STAT_PAGES).indexOf(window.location.pathname) : -1
  )

  useEffect(() => {
    const resetStatPageSelection = () => {
      if (!isUrlAStatPage()) {
        setSelectedStatsPageIndex(-1)
        setStatsMenuAnchorElement(null)
        setStatPageSelected(false)
      } else {
        setStatPageSelected(true)
      }
    }
    resetStatPageSelection()
    return resetStatPageSelection
  }, [window.location.pathname])

  const handleStatsMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setStatsMenuAnchorElement(event.currentTarget)
  }

  const handleStatsMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setSelectedStatsPageIndex(index)
    setStatsMenuAnchorElement(null)
    onMenuItemClick(index)
    navigate(Object.keys(STAT_PAGES)[index])
  }

  const handleStatsMenuClose = () => {
    setStatsMenuAnchorElement(null)
  }

  return (
    <>
      <List component="nav" className={`${classes.root} statsPageMenu`}>
        <ListItemButton className={classes.listItem} onClick={handleStatsMenuClick}>
          <ListItemText
            primary="Stats Editor"
            secondary={statPageTitles[selectedStatsPageIndex]}
            sx={{
              margin: 0,
              '& > span': {
                textTransform: 'uppercase',
                textAlign: 'center',
                letterSpacing: '0.02857em',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'rgba(0, 0, 0, 0.6)'
              },
              '& > p': {
                textAlign: 'right',
                padding: '0 11px 0 0',
                textTransform: 'uppercase',
                fontSize: '0.9rem'
              }
            }}
          />
        </ListItemButton>
        {statPageSelected && <span className={isPortrait ? classes.selectedIndicatorPortrait : classes.selectedIndicatorLandscape}></span>}
      </List>
      <Menu
        id="stats-menu"
        elevation={0}
        anchorEl={statsMenuAnchorElement}
        anchorOrigin={{
          vertical: isPortrait ? 'bottom' : 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={stasMenuOpen}
        onClose={handleStatsMenuClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
          sx: {
            background: (theme) => theme.palette.primary.main,
            '& .Mui-selected': {
              background: (theme) => theme.palette.secondary.main,
              color: (theme) => theme.palette.primary.contrastText,
              opacity: '1'
            }
          }
        }}
      >
        {statPageTitles.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === selectedStatsPageIndex}
            selected={index === selectedStatsPageIndex}
            onClick={(event) => handleStatsMenuItemClick(event, index)}
            sx={{
              padding: '0.7em'
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default StatsPageMenu
