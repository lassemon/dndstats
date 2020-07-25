import { Typography } from '@material-ui/core'
import StatsInputContainer from 'components/StatsInputContainer'
import React from 'react'

import useStyles from './AboutLayout.styles'

const AboutLayout: React.FC = () => {
  const classes = useStyles()
  return (
    <>
      <Typography variant="h3">About</Typography>
      <StatsInputContainer className={classes.root}>
        <Typography variant="h4">How to use</Typography>
        <Typography variant="h6">Text fields</Typography>
        <Typography>
          Use the edit fields to change generated stats to your liking. Some of
          the stats can be left empty and that will make them disappear from the
          generated result. Mandatory stats are not going to disappear even if
          you leave the input empty (for example the Actions header of a
          monster).
        </Typography>
        <Typography variant="h6">Images</Typography>
        <Typography>
          Upload any image from your computer using the upload button. Try
          adjusting your browser window size for optimal scaling of image and
          text so that you can get a better screenshot.
          <br /> Transparent PNG images work best with the background.
          <br />
          Uploading a new image will always replace the old one.
          <br />
          Use the "clear image" -button to remove the image entirely. This will
          also remove the space the image occupies and leave more room for text.
        </Typography>
        <Typography variant="h6">Printing</Typography>
        <Typography>
          The generator has printing optimized css built in. You can attempt to
          print any of the generatod stat pages and it should hide the input
          fields and only show you the generated stat block.
          <br />
          You can either print the page directly or save the print as PDF.
        </Typography>
        <Typography variant="h6">Credits</Typography>
        <Typography>
          The Shield image and Hammer image, that are shamelessly used on this
          site, are made by{" "}
          <a href="https://brackwall.artstation.com/projects">Erik Dolphin</a>
          .<br />
          The Balor image is stolen from{" "}
          <a href="https://www.dndbeyond.com/monsters/balor">D&D Beyond</a>.
          <br />
          If you find the usage of any of these images objectable, please send
          me a message at{" "}
          <a href="mailto:lassemon.pirinen@gmail.com">
            lassemon.pirinen@gmail.com
          </a>{" "}
          and I will remove them immediately.
          <br />
          If you are an artist and would like to create an image with permission
          for me to use for one or more of the pre-generated stats in return for
          credits on this page, also feel free to contact me.
        </Typography>
        <Typography variant="h6">Feedback</Typography>
        <Typography>
          If you find any bugs or problems with the site, feel free to report{" "}
          <a href="https://github.com/lassemon/dndstats/issues">an issue</a> at
          the{" "}
          <a href="https://github.com/lassemon/dndstats">
            projects github page
          </a>
          .
        </Typography>
      </StatsInputContainer>
    </>
  )
}

export default AboutLayout
