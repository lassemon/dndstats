import EditableText from 'components/CombatTracker/EditableText'
import React, { useContext, useEffect, useState } from 'react'
import { CharacterCardContext } from 'services/context'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  root: {
    cursor: 'pointer',
    breakInside: 'avoid',
    marginTop: '0.4em'
  },
  actionDescriptionBase: {
    flex: '1 1 100%'
  },
  actionDescriptionInput: {
    '& textarea': {
      fontSize: '0.8em'
    }
  },
  buttonsContainer: {
    display: 'flex',
    gap: '0.6em'
  }
}))

interface EditableDescriptionProps {
  editMode?: boolean
  presentationMode?: boolean
}

const EditableDescription: React.FC<EditableDescriptionProps> = (props) => {
  const { editMode = false, presentationMode = false } = props
  const { character, setCharacter } = useContext(CharacterCardContext)
  const [isText, setIsText] = useState(!editMode)
  const [internalDescription, setInternalDescription] = useState(character.description || '')
  const { classes } = useStyles()

  useEffect(() => {
    if (character.description) {
      setInternalDescription(character.description)
    }
  }, [character.description])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onChangeDescription = (value: string | number) => {
    setInternalDescription(() => {
      if (!presentationMode) {
        setCharacter(character.clone({ description: value.toString() }))
      }
      return value.toString()
    })
  }

  /*
  const onCancel = () => {
    setIsText(true)
  }

  const onSave = () => {
    const hasChanged = !_.isEqual(character.description, internalDescription)
    if (hasChanged) {
      setCharacter(character.clone({ description: internalDescription }))
    }
  }*/

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root}`}>
      {!isText && (
        <>
          <EditableText
            id={'description'}
            className={classes.actionDescriptionBase}
            textFieldClass={classes.actionDescriptionInput}
            value={internalDescription}
            label="Description"
            hideLabelInTextMode
            onChange={onChangeDescription}
            editMode={!isText}
            presentationMode={false}
            multiline={true}
          />
        </>
      )}
      {/*
      Currently description cannot be double clicked open into editMode from textmode
      i.e. EditableDescription is never in presentationMode
      so buttons also are not needed for now
      !isText && (
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
          )*/}
    </div>
  )
}

export default EditableDescription
