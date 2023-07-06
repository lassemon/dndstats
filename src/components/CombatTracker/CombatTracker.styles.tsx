import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.status.light,
    padding: '1em 1em',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: theme.custom.boxShadow,
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
    margin: '0 .5em .5em 0em',
    padding: '1em 0 1em 1em',
    '& > *': {
      display: 'flex',
      width: 'auto',
      paddingRight: '1em'
    },
    '& > p': {
      flex: '1 1 auto'
    }
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
  listItemPC: {
    background: '#C2DEDC',
    margin: '0 0 1em 0',
    padding: '1em 0 1em 2em'
  },
  listItemPCBloodied: {
    '&&': {
      background: '#d1a88c'
    }
  },
  textField: {
    '& > div': {
      marginTop: '0'
    },
    '& > .Mui-error .MuiOutlinedInput-notchedOutline': {
      borderWidth: '3px'
    }
  },
  initField: {
    flexShrink: 0,
    '&&': {
      width: '4em',
      minWidth: '4em'
    },
    '& label': {
      padding: '0 0 0 4px'
    },
    '& input': {
      textAlign: 'center',
      fontSize: '1.5em',
      padding: '18.5px 4px 12px 4px'
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
      flex: '0 0 15%'
    }
  },
  hpBar: {
    '& .MuiLinearProgress-bar1Determinate': {
      transition: 'transform .15s linear'
    }
  },
  deleteIconContainer: {
    minWidth: 'auto',
    '& > button': {
      padding: '0'
    }
  },
  dragIconContainer: {
    minWidth: 'auto',
    justifyContent: 'end'
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
    flexWrap: 'wrap',
    lineHeight: '0.1em',
    '& .MuiIcon-root': {
      width: '1.8em',
      height: '1.8em',
      display: 'inline-block',
      textAlign: 'center',
      lineHeight: '1.8em',
      margin: '0.3rem 0.3rem 0.3rem 0'
    }
  },
  autocomplete: {
    flex: '0 0 170px',
    '& .MuiTextField-root > div': {
      marginTop: 0
    },
    '& .MuiAutocomplete-tag': {
      display: 'none'
    }
  }
}))

export default useStyles
