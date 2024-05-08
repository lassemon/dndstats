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

const CARD_PAGES = {
  '/card/item': 'Item Card',
  '/card/spell': 'Spell Card',
  '/card/monster': 'Monster Card'
}
const pageTitles = Object.values(CARD_PAGES)

interface CardMenuProps {
  onMenuItemClick: (index: number) => void
}

const isUrlACardPage = (): boolean => {
  return getPageName() === 'card'
}

const CardMenu: React.FC<CardMenuProps> = ({ onMenuItemClick }) => {
  const { classes } = useStyles()

  const [isCardPageSelected, setIsCardPageSelected] = useState(isUrlACardPage)
  const orientation = useOrientation()
  const isPortrait = orientation === 'portrait'
  const navigate = useNavigate()

  const [menuAnchorElement, setMenuAnchorElement] = React.useState<null | HTMLElement>(null)
  const stasMenuOpen = Boolean(menuAnchorElement)

  const windowLocationIsStatPage = Object.keys(CARD_PAGES).includes(window.location.pathname)

  const [selectedPageIndex, setSelectedPageIndex] = React.useState(
    windowLocationIsStatPage ? Object.keys(CARD_PAGES).indexOf(window.location.pathname) : -1
  )

  useEffect(() => {
    const resetPageSelection = () => {
      if (!isUrlACardPage()) {
        setSelectedPageIndex(-1)
        setMenuAnchorElement(null)
        setIsCardPageSelected(false)
      } else {
        onMenuItemClick(0)
        setIsCardPageSelected(true)
      }
    }
    resetPageSelection()
    return resetPageSelection
  }, [window.location.pathname])

  const handleStatsMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorElement(event.currentTarget)
  }

  const handleStatsMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setSelectedPageIndex(index)
    setMenuAnchorElement(null)
    onMenuItemClick(index)
    navigate(Object.keys(CARD_PAGES)[index])
  }

  const handleStatsMenuClose = () => {
    setMenuAnchorElement(null)
  }

  return (
    <>
      <List component="nav" className={`${classes.root} statsPageMenu`}>
        <ListItemButton className={classes.listItem} onClick={handleStatsMenuClick}>
          <ListItemText
            primary="Cards"
            secondary={pageTitles[selectedPageIndex]}
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
                padding: isPortrait ? '0' : '0 0.5em 0 0',
                textTransform: 'uppercase',
                fontSize: '0.9rem'
              }
            }}
          />
        </ListItemButton>
        {isCardPageSelected && (
          <span className={isPortrait ? classes.selectedIndicatorPortrait : classes.selectedIndicatorLandscape}></span>
        )}
      </List>
      <Menu
        id="card-menu"
        elevation={2}
        anchorEl={menuAnchorElement}
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
        slotProps={{
          paper: {
            sx: {
              '& .MuiList-root': {
                padding: 0
              }
            }
          }
        }}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
          sx: {
            background: (theme) => theme.palette.primary.light,
            '& .Mui-selected': {
              background: (theme) => theme.palette.secondary.main,
              color: (theme) => theme.palette.primary.contrastText,
              opacity: '1'
            }
          }
        }}
      >
        {pageTitles.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === selectedPageIndex}
            selected={index === selectedPageIndex}
            onClick={(event) => handleStatsMenuItemClick(event, index)}
            sx={{
              padding: '0.7em 1em'
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default CardMenu
