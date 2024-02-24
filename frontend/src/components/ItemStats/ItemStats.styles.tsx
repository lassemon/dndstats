import { makeStyles } from 'tss-react/mui'

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme) => {
  return {
    root: {
      display: 'flex'
    },
    imageContainer: {
      display: 'flex',
      alignItems: 'center',
      '& > img': {
        width: '100%'
      },
      '& > div': {
        alignItems: 'center',
        '& .MuiCircularProgress-root': {
          margin: '6em'
        }
      }
    },
    textContainer: {
      flex: '1 0 60%'
    },
    name: {
      margin: '0',
      fontFamily:
        '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
      color: theme.status.blood,
      fontSize: '1.7em',
      letterSpacing: '1px',
      fontVariant: 'small-caps'
    },
    shortDescription: {
      marginTop: 0,
      fontWeight: 'normal',
      fontStyle: 'italic',
      fontSize: '0.95em'
    },
    mainDescription: {
      background: '#e0e4c3',
      padding: '0',
      margin: '1em 0 0 0',
      borderTop: '3px solid #1b1b1b',
      borderBottom: '3px solid #1b1b1b',
      '&> p': {
        margin: '0.5em'
      }
    },
    blockDescription: {
      margin: '0 0.5em 0.5em 0.5em'
    },
    inlineDescription: {
      display: 'inline'
    },
    featureContainer: {
      margin: '0 0 0.5em 0'
    },
    featureName: {
      color: '#1b1b1b',
      display: 'inline',
      letterSpacing: '1px',
      fontVariant: 'small-caps',
      padding: '0 4px 0 0',
      margin: 0
    },
    autocomplete: {}
  }
})

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles
