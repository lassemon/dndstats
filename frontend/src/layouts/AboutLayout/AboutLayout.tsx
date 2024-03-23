import { Typography } from '@mui/material'
import React from 'react'

import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  root: {
    background: theme.status.light,
    height: '100%',
    '&& > *': {
      margin: 0,
      padding: '0 2rem'
    },
    '&& > *:last-child': {
      paddingBottom: '3rem'
    },
    '&& > h6': {
      margin: '1.2em 0 0 0'
    }
  }
}))

const AboutLayout: React.FC = () => {
  const { classes } = useStyles()
  return (
    <div className={classes.root}>
      <Typography
        variant="h3"
        sx={{
          margin: '1em 0 0 0'
        }}
      >
        How to use
      </Typography>
      <Typography variant="h6">Text fields</Typography>
      <Typography>
        Use the edit fields to change generated stats to your liking. Some of the stats can be left empty and that will make them disappear
        from the generated result. Mandatory stats are not going to disappear even if you leave the input empty (for example the Actions
        header of a monster).
      </Typography>
      <Typography variant="h6">Images</Typography>
      <Typography>
        Upload any image from your computer using the upload button. Try adjusting your browser window size for optimal scaling of image and
        text so that you can get a better screenshot.
        <br /> Transparent PNG images work best with the background.
        <br />
        Uploading a new image will always replace the old one.
        <br />
        Use the "clear image" -button to remove the image entirely. This will also remove the space the image occupies and leave more room
        for text.
      </Typography>
      <Typography variant="h6">Monster Stats</Typography>
      <Typography>
        Doubleclick on the character display card to open a singular edit view OR click the pen button at the bottom of the card to open the
        full edit view of everything.
      </Typography>
      <Typography variant="h6">Combat Tracker</Typography>
      <Typography>
        Most of the features should be self explanatory for any DM. <br />
        Check tooltips for more info by hovering.
        <br />
        Tip: You can remove a condition by either reselecting it from the list <strong>or by mouse wheel clicking</strong>
      </Typography>
      <Typography variant="h6">Printing</Typography>
      <Typography>
        The generator has printing optimized css built in. You can attempt to print any of the generated stat pages and it should hide the
        input fields and only show you the generated stat block.
        <br />
        You can either print the page directly or save the print as PDF.
      </Typography>
      <Typography variant="h6">Credits</Typography>
      <Typography>
        The Shield image and Hammer image, that are shamelessly used on this site, are made by{' '}
        <a href="https://brackwall.artstation.com/projects">Erik Dolphin</a>
        .<br />
        The Balor image is stolen from <a href="https://www.dndbeyond.com/monsters/balor">D&D Beyond</a>.
      </Typography>
      <Typography variant="h6">Feedback</Typography>
      <Typography>
        If you find any bugs or problems with the site, feel free to report{' '}
        <a href="https://github.com/lassemon/dndstats/issues">an issue</a> at the{' '}
        <a href="https://github.com/lassemon/dndstats">projects github page</a>.
      </Typography>
    </div>
  )
}

export default AboutLayout
