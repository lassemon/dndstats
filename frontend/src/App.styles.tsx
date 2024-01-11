import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    minHeight: '100%',
    width: '100%'
  },
  main: {
    margin: 0,
    padding: 0,
    width: '100%',
    overflowAnchor: 'none'
  },
  appBar: {
    margin: '0',
    minHeight: '100%'
  },
  tabs: {
    '& .MuiTabs-flexContainer': {
      justifyContent: 'center'
    }
  },
  tabsPortrait: {
    flexGrow: 1,
    minWidth: '170px',
    width: '100%'
  },
  tabsLandscape: {
    flexGrow: 1,
    minWidth: '170px'
  },
  toolbarPortrait: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: '0',
    gap: '1em',
    padding: '0 0 1em 0'
  },
  toolbarLandscape: {
    flexDirection: 'column',
    margin: '2em 0 0 0',
    gap: '1em'
  }
}))

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
