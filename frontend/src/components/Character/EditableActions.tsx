import { Button, ListItemIcon, Typography } from '@mui/material'
import EditableText from 'components/CombatTracker/EditableText'
import DeleteButton from 'components/DeleteButton'
import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { CharacterCardContext } from 'services/context'
import { makeStyles } from 'tss-react/mui'
import { replaceItemAtIndex } from 'utils/utils'
import CardTitle from './CardTitle'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { arrayMoveImmutable } from 'array-move'
import { Container, Draggable } from 'react-smooth-dnd'

export const useStyles = makeStyles()((theme) => ({
  root: {
    cursor: 'pointer',
    breakInside: 'avoid'
  },
  header: {
    fontFamily:
      '"Libre Baskerville", "Lora", "Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',
    margin: '0',
    color: theme.status.blood,
    letterSpacing: '0.02em',
    fontVariant: 'small-caps'
  },
  actionsHeader: {
    fontSize: '1.8em',
    margin: '0.5em 0',
    borderBottom: `1px solid ${theme.status.blood}`
  },
  actionContainer: {
    margin: '0 0 0.5em 0',
    fontSize: '1em'
  },
  actionName: {
    fontSize: '1.05em',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontVariant: 'small-caps',
    letterSpacing: '1px',
    color: `${theme.palette.text.primary}`,
    padding: '0 0.5em 0 0'
  },
  actionNameInput: {},
  actionDescription: {
    fontWeight: '400',
    fontSize: '1.05em',
    lineHeight: '1.43',
    letterSpacing: '0.01071em',
    fontFamily: "'Noto Sans','Myriad Pro',Calibri,Helvetica,Arial,sans-serif",
    textAlign: 'start',
    whiteSpace: 'pre-wrap'
  },
  actionDescriptionBase: {
    flex: '1 1 100%'
  },
  actionDescriptionInput: {
    '& textarea': {
      fontSize: '0.8em'
    }
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.8em',
    alignItems: 'flex-start',
    margin: '0.5em 0 1.2em 0'
  },
  buttonsContainer: {
    display: 'flex',
    gap: '0.6em'
  },
  draggableContainer: {
    position: 'relative'
  },
  dragIconContainer: {
    position: 'absolute',
    right: '1em',
    zIndex: '100',
    cursor: 'pointer',
    minWidth: 'auto',
    justifyContent: 'end',
    '& > svg': {
      fontSize: '1.5em'
    }
  }
}))

interface EditableActionsProps {
  editMode?: boolean
  presentationMode?: boolean
}

const EditableActions: React.FC<EditableActionsProps> = (props) => {
  const { editMode = false, presentationMode = false } = props
  const { character, setCharacter } = useContext(CharacterCardContext)
  const [isText, setIsText] = useState(!editMode)
  const [internalActions, setInternalActions] = useState([...(character.actions || [])])
  const { classes } = useStyles()

  useEffect(() => {
    setInternalActions([...character.actions])
  }, [character.actions])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onDrop = ({ removedIndex, addedIndex }: { removedIndex: any; addedIndex: any }) => {
    setInternalActions((actions) => {
      const actionsCopy = arrayMoveImmutable(actions, removedIndex, addedIndex)
      setCharacter(character.clone({ actions: actionsCopy }))
      return actionsCopy
    })
  }

  const onDoubleClick = () => {
    if (isText) {
      setIsText(false)
    }
  }

  const onChangeName = (index: number) => (value: string | number) => {
    setInternalActions((actions) => {
      let newAction = _.cloneDeep(actions[index]) // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
      newAction = { ...newAction, name: value.toString() }
      const newActions = replaceItemAtIndex(actions, index, newAction)
      if (!presentationMode) {
        setCharacter(character.clone({ actions: newActions }))
      }
      return newActions
    })
  }

  const onChangeDescription = (index: number) => (value: string | number) => {
    setInternalActions((actions) => {
      let newAction = _.cloneDeep(actions[index]) // clonedeep is a MUST because otherwise the object is readonly and lodash set does nothing
      newAction = { ...newAction, desc: value.toString() }
      const newActions = replaceItemAtIndex(actions, index, newAction)
      if (!presentationMode) {
        setCharacter(character.clone({ actions: newActions }))
      }
      return newActions
    })
  }

  const onDelete = (index: number) => () => {
    setInternalActions((actions) => {
      const actionsCopy = [...actions]
      actionsCopy.splice(index, 1)
      setCharacter(character.clone({ actions: actionsCopy }))
      return actionsCopy
    })
  }

  const onCancel = () => {
    setIsText(true)
  }

  const onAdd = () => {
    setInternalActions((actions) => {
      return [...actions, { name: '', desc: '' }]
    })
    setCharacter(character.clone({ actions: [...internalActions, { name: '', desc: '' }] }))
  }

  const onSave = () => {
    const hasChanged = !_.isEqual(character.actions, internalActions)
    if (hasChanged) {
      setCharacter(character.clone({ actions: internalActions }))
    }
    if (!editMode) {
      setIsText(true)
    }
  }

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root}`}>
      <CardTitle>Actions</CardTitle>
      {isText ? (
        <div onDoubleClick={onDoubleClick}>
          {internalActions.map((action, index) => {
            return (
              <Typography key={index} variant="body2" className={classes.actionContainer}>
                <span className={`${classes.actionName}`}>{action.name}</span>
                <span className={classes.actionDescription}>{action.desc}</span>
              </Typography>
            )
          })}
        </div>
      ) : (
        <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
          {internalActions.map((action, index) => {
            return (
              <Draggable key={index} className={`${classes.draggableContainer}`}>
                <div key={index} className={classes.row}>
                  <ListItemIcon className={`drag-handle ${classes.dragIconContainer}`}>
                    <DragHandleIcon fontSize="large" />
                  </ListItemIcon>
                  <div style={{ display: 'flex', alignItems: 'center', flex: '1', margin: '' }}>
                    <DeleteButton size="small" onClick={onDelete(index)} sx={{ padding: 0 }} />
                    <EditableText
                      id={'action-name-' + index}
                      textFieldClass={`${classes.actionNameInput}`}
                      value={action.name}
                      label="Action Name"
                      onChange={onChangeName(index)}
                      editMode={!isText}
                      presentationMode={false}
                    />
                  </div>
                  <EditableText
                    id={'action-description-' + index}
                    className={classes.actionDescriptionBase}
                    textFieldClass={classes.actionDescriptionInput}
                    value={action.desc}
                    label="Action Description"
                    onChange={onChangeDescription(index)}
                    editMode={!isText}
                    presentationMode={false}
                    multiline={true}
                  />
                </div>
              </Draggable>
            )
          })}
        </Container>
      )}
      {!isText && (
        <div className={classes.buttonsContainer}>
          {!editMode && (
            <Button variant="contained" size="small" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button variant="contained" size="small" onClick={onAdd}>
            Add Action
          </Button>
          {presentationMode && (
            <Button variant="contained" size="small" onClick={onSave}>
              Save
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default EditableActions
