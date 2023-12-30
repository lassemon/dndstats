import { makeStyles } from 'tss-react/mui'
import bg_player from 'assets/bg_player.png'
import bg_npc from 'assets/bg_npc.png'
import bg_enemy from 'assets/bg_enemy.png'
import ArmorClass from 'assets/ArmorClass.png'
import BloodDrop from 'assets/BloodDrop.png'
import Regeneration from 'assets/Regeneration.png'
import { alpha } from '@mui/material'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => ({
  root: {
    background: theme.status.light,
    padding: '1em 1em',
    margin: '0 0 1em 0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0.1rem 0 0.2rem #afaba5, 0.2rem 0 0.2rem #afaba5',
    display: 'flex',
    flexWrap: 'wrap',
    '&& > ul': {
      flex: '1 1 100%',
      margin: '0 0 3em 0'
    }
  },
  topActionsContainer: {
    display: 'flex',
    gap: '1em'
  },
  sortButton: {
    margin: '0 0 2em 0'
  },
  draggableContainer: {
    '&&&': {
      overflow: 'initial'
    }
  },
  listItem: {
    paddingRight: 0,
    paddingLeft: 0,
    margin: '0 .2em .3em 0em',
    padding: '0.3em 0 0.1em 0.5em',
    '&& > *': {
      marginRight: '.4em'
    },
    border: '1px solid transparent',
    '& .editing': {
      flex: '0 1 2em'
    }
  },
  listItemCurrent: {
    backdropFilter: 'brightness(93%)',
    filter: 'brightness(93%)',
    border: '1px solid rgba(0, 0, 0, .2)'
  },
  listItemBloodied: {
    background: `linear-gradient(90deg, ${alpha(theme.status.blood || '', 0.3)}, 10%, rgba(255, 255, 255, 0) 40%)`,
    position: 'relative',
    '&:before': {
      content: '" "',
      background: `url(${BloodDrop})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '1.5em',
      position: 'absolute',
      top: 0,
      left: 0,
      transform: 'translate(-0.5%, -50%)'
    }
  },
  listItemUnconscious: {
    '&&': {
      background: theme.palette.grey[300],
      color: theme.palette.grey[500]
    }
  },
  listItemPlayer: {
    background: '#c9e5c9'
  },
  listItemPlayerBloodied: {
    background: `linear-gradient(90deg, ${alpha(theme.status.blood || '', 0.3)}, 10%, #c9e5c9 40%)`
  },
  listItemNPC: {
    background: '#C2DEDC'
  },
  listItemNPCBloodied: {
    background: `linear-gradient(90deg, ${alpha(theme.status.blood || '', 0.3)}, 10%, #C2DEDC 40%)`
  },
  textField: {
    width: 'auto',
    '& > div': {
      marginTop: '0'
    },
    '& label': {
      opacity: '0.3'
    },
    '&  .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    '& > .Mui-error .MuiOutlinedInput-notchedOutline': {
      borderWidth: '3px'
    }
  },
  editableTextField: {
    '& > div': {
      marginTop: '0'
    },
    '& > .Mui-error .MuiOutlinedInput-notchedOutline': {
      borderWidth: '3px'
    },
    '& .MuiInputBase-input': {
      padding: '8.5px 0 8.5px 8px'
    }
  },
  nameTextContainer: {
    margin: '0 0 0 0.6em',
    padding: '0 0 0 0'
  },
  nameText: {
    width: '8em',
    textAlign: 'left'
  },
  nameTextTooltip: {
    zIndex: '100',
    '& .MuiTooltip-tooltip': {
      backgroundColor: 'transparent',
      color: 'rgb(0,0,0)',
      fontSize: 'inherit'
    }
  },
  nameBloodied: {
    position: 'relative',
    '& span': {
      color: theme.status.blood,
      fontWeight: 600
    }
  },
  ACText: {
    position: 'relative',
    display: 'flex',
    padding: '0.5em',
    '&:after': {
      background: `url(${ArmorClass})`,
      opacity: '0.1',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      content: '" "',
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'block',
      width: '100%',
      height: '100%'
    },
    '& > span': {
      margin: '0 2px 0 0',
      textAlign: 'center',
      width: '1em'
    }
  },
  initField: {
    flexShrink: 0,
    '&&': {
      width: '1.5em',
      marginLeft: '1em'
    },
    '& label': {
      padding: '0 0 0 4px',
      transform: 'translate(10px, -9px) scale(0.75)'
    }
  },
  initText: {
    position: 'relative',
    '&:before': {
      content: '"init"',
      position: 'absolute',
      opacity: '0.2',
      top: 0,
      left: 0,
      margin: '-12px 0 0 0',
      fontWeight: 600,
      fontSize: '0.8em'
    }
  },
  hpField: {
    '&&': {
      width: '4em',
      minWidth: '4em'
    }
  },
  HPText: {
    minWidth: '3em',
    position: 'relative',
    '&:before': {
      content: '"HP"',
      position: 'absolute',
      opacity: '0.2',
      top: 0,
      left: 0,
      margin: '-12px 0 0 0px',
      fontWeight: 600,
      fontSize: '0.8em'
    }
  },
  regeneration: {
    position: 'relative',
    flex: '0 1 0',
    width: '1em',
    '& .regenIcon': {
      background: `url(${Regeneration})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      width: '1.5em',
      height: '1.5em',
      position: 'absolute',
      top: 0,
      right: 0,
      transform: 'translate(10%, -55%)'
    }
  },
  damageModifiers: {
    display: 'flex',
    flex: '1 1 68px',
    flexWrap: 'wrap',
    maxWidth: '68px',
    minWidth: '45px',
    '&&&': {
      marginRight: '1em'
    }
  },
  resistance: {
    position: 'relative',
    '&:after': {
      content: '"/"',
      position: 'absolute',
      top: '50%',
      left: '50%',
      color: theme.status.blood,
      fontSize: '1.2em',
      fontWeight: '900',
      transform: 'translate(-50%, -50%)'
    }
  },
  immunity: {
    position: 'relative',
    '&:after': {
      content: '"X"',
      position: 'absolute',
      top: '50%',
      left: '50%',
      color: theme.status.blood,
      fontSize: '1.2em',
      fontWeight: '900',
      transform: 'translate(-50%, -50%)'
    }
  },
  hpBarContainer: {
    '&&': {
      display: 'flex',
      flex: '0 0 18%',
      alignItems: 'center',
      height: '3em'
    }
  },
  hpBar: {
    width: '100%',
    '& .MuiLinearProgress-bar1Determinate': {
      transition: 'transform .15s linear'
    }
  },
  deleteIconContainer: {
    minWidth: 'auto',
    '& > button': {
      padding: '0'
    },
    '& > button > svg': {
      fontSize: '1em'
    }
  },
  dragIconContainer: {
    minWidth: 'auto',
    justifyContent: 'end',
    '& > svg': {
      fontSize: '1.5em'
    }
  },
  addContainer: {
    flex: '0 0 100%',
    display: 'flex',
    '& > div': {
      display: 'flex',
      width: 'auto',
      margin: '0 1em 0 0'
    }
  },
  conditionList: {
    display: 'flex',
    position: 'relative',
    flexWrap: 'wrap',
    flex: '1 1 auto',
    zIndex: '1',
    minHeight: '2em',
    width: '12em',
    lineHeight: '0.1em',
    '& .MuiIcon-root': {
      width: '1.8em',
      height: '1.8em',
      display: 'inline-block',
      textAlign: 'center',
      lineHeight: '1.8em'
    },
    '&:before': {
      content: '" "',
      opacity: '.1',
      position: 'absolute',
      top: '45%',
      left: '50%',
      width: '6em',
      height: '2em',
      zIndex: '-1',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      transform: 'translate(-50%, -50%) rotate(-10deg)'
    }
  },
  player: {
    '&:before': {
      backgroundImage: `url(${bg_player})`
    }
  },
  npc: {
    '&:before': {
      backgroundImage: `url(${bg_npc})`
    }
  },
  enemy: {
    '&:before': {
      backgroundImage: `url(${bg_enemy})`
    }
  },
  rowType: {
    position: 'absolute',
    left: '50%',
    top: '45%',
    transform: 'translate(-50%, -50%) rotate(-10deg)',
    opacity: '0.1',
    fontWeight: 600,
    fontSize: '1.5em',
    textTransform: 'uppercase'
  },
  autocomplete: {
    '& .MuiAutocomplete-tag': {
      display: 'none'
    },
    '& .MuiInputLabel-animated': {
      transform: 'translate(14px, -9px) scale(0.75)'
    },
    '& legend': {
      maxWidth: '100%'
    }
  },
  actionsContainer: {
    display: 'flex',
    margin: '0 1em',
    padding: '0 0 8em  0',
    '& > button': {
      margin: '0 1em 0 0'
    }
  },
  actionsSpread: {
    flex: '1 1 auto'
  },
  settingsList: {
    padding: '0.5em'
  },
  settingsListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1em',
    padding: '0.5em'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
