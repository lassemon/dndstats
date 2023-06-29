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
  listItem: {
    paddingRight: 0,
    '& > div': {
      display: 'flex',
      width: 'auto',
      margin: '0 1em'
    }
  },
  listItemBloodied: {
    background: theme.status.lightBlood
  },
  listItemDead: {
    background: theme.palette.grey[300],
    color: theme.palette.grey[500]
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
    '&&': {
      width: '9em'
    }
  },
  nameField: {
    '&&': {
      minWidth: '10em'
    }
  },
  hpField: {
    '&&': {
      width: '4em'
    }
  },
  hpText: {
    width: '5em'
  },
  hpBarContainer: {
    '&&': {
      display: 'block',
      flex: '0 1 20%'
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
    flex: '1',
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
  }
}))

export default useStyles
