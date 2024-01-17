import { Button, TextField, Tooltip } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import _ from 'lodash'
import { CharacterCardContext } from 'services/context'

export const useStyles = makeStyles()((theme) => ({
  root: {
    cursor: 'pointer'
  },
  editor: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4em',
    alignItems: 'baseline',
    margin: '0 0 0.8em 0'
  },
  row: {
    display: 'flex',
    gap: '0.4em',
    alignItems: 'center'
  },
  baseStat: {
    textTransform: 'capitalize'
  },
  statHeader: {
    color: theme.status.blood,
    fontSize: '1.1em',
    lineHeight: '1.2em',
    fontWeight: 'bold',
    flexBasis: '16.6%',
    textAlign: 'center'
  },
  statValue: {
    color: theme.status.blood,
    fontSize: '1em',
    fontFamily: '"Helvetica", "Arial", sans-serif',
    flexBasis: '16.6%',
    textTransform: 'capitalize',
    display: 'inline-block',
    marginInlineStart: '0.5em'
  },
  buttonsContainer: {
    display: 'flex',
    gap: '0.6em'
  }
}))

interface EditableChallengeRatingProps {
  className?: string
  textWidth?: number
  editWidth?: number
  editMode?: boolean
  presentationMode?: boolean
}

const EditableChallengeRating: React.FC<EditableChallengeRatingProps> = (props) => {
  const { editMode = false, presentationMode = false, className = '' } = props
  const { character, setCharacter } = useContext(CharacterCardContext)
  const [isText, setIsText] = useState(!editMode)
  const [challengeRating, setChallengeRating] = useState({
    challenge_rating: character.challenge_rating || '',
    xp: character.xp || ''
  })
  const { classes } = useStyles()

  useEffect(() => {
    setChallengeRating({
      challenge_rating: character.challenge_rating || '',
      xp: character.xp || ''
    })
  }, [character.challenge_rating, character.xp])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onDoubleClick = () => {
    if (isText) {
      setIsText(false)
    }
  }

  const onChangeValue = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setChallengeRating((challenge_rating) => {
      return { ..._.cloneDeep(challenge_rating), [key]: event.target.value } // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
    })
  }

  const onCancel = () => {
    setIsText(true)
  }

  const onSave = () => {
    const newValues = {
      ...(challengeRating.challenge_rating !== ''
        ? { challenge_rating: parseFloat(challengeRating.challenge_rating.toString()) }
        : { challenge_rating: undefined }),
      ...(challengeRating.xp !== '' ? { xp: parseFloat(challengeRating.xp.toString()) } : { xp: undefined })
    }
    const oldValues = {
      ...(character.challenge_rating ? { challenge_rating: parseFloat(character.challenge_rating.toString()) } : { challenge_rating: 0 }),
      ...(character.xp ? { xp: parseFloat(character.xp.toString()) } : { xp: undefined })
    }
    const hasChanged = !_.isEqual(oldValues, newValues)
    console.log('challenge rating changed', hasChanged)
    if (hasChanged) {
      const characterCopy = character.clone(newValues)
      setCharacter(characterCopy)
    }
    if (!editMode) {
      setIsText(true)
    }
  }

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`}>
      {isText ? (
        <div className={classes.baseStat} onDoubleClick={onDoubleClick}>
          <span className={classes.statHeader}>Challenge Rating</span>
          <span className={classes.statValue}>{character.challenge_rating_label}</span>
        </div>
      ) : (
        <>
          <div className={classes.editor}>
            <Tooltip title="0.5 = 1/2, 0.25 = 1/4, 0.125 = 1/8" placement="top-end">
              <TextField
                id="challenge_rating"
                label="Challenge Rating"
                type="number"
                value={challengeRating.challenge_rating}
                onChange={onChangeValue('challenge_rating')}
                onBlur={presentationMode ? undefined : onSave}
                variant="outlined"
                size="small"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Tooltip>
            <TextField
              id="xp"
              label="XP"
              type="number"
              value={challengeRating.xp}
              onChange={onChangeValue('xp')}
              onBlur={presentationMode ? undefined : onSave}
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
            />
          </div>
          <div className={classes.buttonsContainer}>
            {!editMode && (
              <Button variant="contained" size="small" onClick={onCancel}>
                Cancel
              </Button>
            )}
            {presentationMode && (
              <Button variant="contained" size="small" onClick={onSave}>
                Save
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default EditableChallengeRating
