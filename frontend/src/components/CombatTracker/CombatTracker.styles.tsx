import { makeStyles } from 'tss-react/mui'
import bg_player from 'assets/bg_player.png'
import bg_npc from 'assets/bg_npc.png'
import bg_enemy from 'assets/bg_enemy.png'
import ArmorClass from 'assets/ArmorClass.png'

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
  sortButton: {
    margin: '0 0 2em 0'
  },
  listItem: {
    paddingRight: 0,
    paddingLeft: 0,
    margin: '0 .2em .3em 0em',
    padding: '0.5em 0 0.3em 0.5em',
    '&& > *': {
      display: 'flex',
      marginRight: '.4em'
    },
    border: '1px solid transparent'
  },
  listItemCurrent: {
    filter: 'brightness(93%)',
    border: '1px solid rgba(0, 0, 0, .2)'
  },
  listItemBloodied: {
    background: theme.status.lightBlood
  },
  listItemDead: {
    '&&': {
      background: theme.palette.grey[300],
      color: theme.palette.grey[500]
    }
  },
  listItemPlayer: {
    background: '#c9e5c9'
  },
  listItemPlayerBloodied: {
    '&&': {
      background: '#d1a88c'
    }
  },
  listItemNPC: {
    background: '#C2DEDC'
  },
  textField: {
    '& > div': {
      marginTop: '0'
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
  ACText: {
    position: 'relative',
    display: 'flex',
    padding: '0.5em',
    '&:after': {
      background: `url(${ArmorClass})`,
      opacity: '0.2',
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
  HPText: {
    position: 'relative',
    '&:before': {
      content: '"HP"',
      position: 'absolute',
      opacity: '0.3',
      top: 0,
      left: 0,
      margin: '-10px 0 0px -10px',
      fontWeight: 600,
      fontSize: '0.8em'
    }
  },
  initField: {
    flexShrink: 0,
    '&&': {
      width: '3em',
      minWidth: '3em'
    },
    '& label': {
      padding: '0 0 0 4px',
      transform: 'translate(10px, -9px) scale(0.75)'
    },
    '& input': {
      textAlign: 'center',
      fontSize: '1.3em',
      padding: '4.5px 0 3px 0'
    }
  },
  hpField: {
    '&&': {
      width: '4em',
      minWidth: '4em'
    }
  },
  hpText: {
    minWidth: '3em',
    padding: '0 1em 0 0',
    '&&': {
      flex: '0 1 auto'
    }
  },
  hpBarContainer: {
    '&&': {
      display: 'block',
      flex: '0 0 12%'
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
    position: 'relative',
    flexWrap: 'wrap',
    flex: '1 1 auto',
    zIndex: '1',
    minHeight: '2em',
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
      top: '60%',
      left: '40%',
      width: '12em',
      height: '2em',
      zIndex: '-1',
      backgroundRepeat: 'no-repeat',
      transform: 'translate(-55%, -50%) rotate(-10deg)'
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
    flex: '0 0 170px',
    '& .MuiAutocomplete-tag': {
      display: 'none'
    }
  },
  actionsContainer: {
    display: 'flex',
    margin: '0 1em',
    '& > button': {
      margin: '0 1em 0 0'
    }
  },
  actionsSpread: {
    flex: '1 1 auto'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
