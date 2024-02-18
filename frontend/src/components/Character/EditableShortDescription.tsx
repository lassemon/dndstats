import React, { useContext, useEffect, useState } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { Alignment, MonsterSubtype, MonsterType, Size } from 'interfaces'
import { CharacterCardContext } from 'services/context'

interface EditableShortDescriptionProps {
  className?: string
  editMode?: boolean
  presentationMode?: boolean
}

export const useStyles = makeStyles()((theme) => ({
  root: {
    cursor: 'pointer'
  },
  shortDescription: {
    marginTop: 0,
    fontWeight: 'normal',
    fontStyle: 'italic',
    fontSize: '0.95em'
  },
  editor: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4em',
    alignItems: 'baseline',
    margin: '0 0 0.8em 0'
  },
  row: {
    width: '100%',
    display: 'flex',
    gap: '0.4em',
    alignItems: 'center'
  },
  buttonsContainer: {
    display: 'flex',
    gap: '0.6em'
  }
}))

const EditableShortDescription: React.FC<EditableShortDescriptionProps> = (props) => {
  const { editMode = false, presentationMode = false, className = '' } = props
  const { character, setCharacter } = useContext(CharacterCardContext)
  const [isText, setIsText] = useState(!editMode)
  const [shortDescription, setShortDescription] = useState({
    size: character.size || '',
    type: character.type || '',
    subtype: character.subtype || '',
    alignment: character.alignment || ''
  })
  const { classes } = useStyles()

  useEffect(() => {
    setShortDescription({
      size: character.size || '',
      type: character.type || '',
      subtype: character.subtype || '',
      alignment: character.alignment || ''
    })
  }, [character.size, character.type, character.subtype, character.alignment])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onDoubleClick = () => {
    if (isText) {
      setIsText(false)
    }
  }

  const onChangeSize = (event: SelectChangeEvent<string>) => {
    const { value } = event.target
    setShortDescription((shortDescription) => {
      return {
        ...shortDescription,
        size: value
      }
    })
    if (!presentationMode) {
      setCharacter(character.clone({ ...shortDescription, size: value }))
    }
  }

  const onChangeType = (event: SelectChangeEvent<string>) => {
    const { value } = event.target
    setShortDescription((shortDescription) => {
      return {
        ...shortDescription,
        type: value
      }
    })
    if (!presentationMode) {
      setCharacter(character.clone({ ...shortDescription, type: value }))
    }
  }

  const onChangeSubtype = (event: SelectChangeEvent<string>) => {
    const { value } = event.target
    setShortDescription((shortDescription) => {
      return {
        ...shortDescription,
        subtype: value
      }
    })
    if (!presentationMode) {
      setCharacter(character.clone({ ...shortDescription, subtype: value }))
    }
  }

  const onChangeAlignment = (event: SelectChangeEvent<string>) => {
    const { value } = event.target
    setShortDescription((shortDescription) => {
      return {
        ...shortDescription,
        alignment: value
      }
    })
    // has changed is not needed here because Select does not trigger onChange event otherwise
    if (!presentationMode) {
      setCharacter(character.clone({ ...shortDescription, alignment: value }))
    }
  }

  const onCancel = () => {
    setIsText(true)
  }

  const onSave = () => {
    setCharacter(character.clone({ ...shortDescription }))
    if (!editMode) {
      setIsText(true)
    }
  }

  const editWidth = '100%'

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`} onDoubleClick={onDoubleClick}>
      {isText ? (
        <Typography variant="h2" className={`${classes.shortDescription}`}>
          {character.short_description}
        </Typography>
      ) : (
        <div className={classes.editor}>
          <div className={classes.row}>
            <FormControl sx={{ m: 0, flex: `0 0 ${editWidth}` }} size="small">
              <InputLabel shrink id="size">
                Size
              </InputLabel>
              <Select labelId={'size'} id="size-select" value={shortDescription.size} label="Size" onChange={onChangeSize}>
                {Object.values(Size).map((value, index) => {
                  return (
                    <MenuItem key={index} value={value}>
                      {value}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </div>
          <div className={classes.row}>
            <FormControl sx={{ m: 0, flex: `0 0 ${editWidth}` }} size="small">
              <InputLabel shrink id="type">
                Type
              </InputLabel>
              <Select labelId={'type'} id="type-select" value={shortDescription.type.toLowerCase()} label="Type" onChange={onChangeType}>
                {Object.values(MonsterType).map((value, index) => {
                  return (
                    <MenuItem key={index} value={value}>
                      {value}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </div>
          <div className={classes.row}>
            <FormControl sx={{ m: 0, flex: `0 0 ${editWidth}` }} size="small">
              <InputLabel shrink id="subtype">
                Subtype
              </InputLabel>
              <Select labelId={'subtype'} id="subtype-select" value={shortDescription.subtype.toLowerCase()} label="Subtype" onChange={onChangeSubtype}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {Object.values(MonsterSubtype).map((value, index) => {
                  return (
                    <MenuItem key={index} value={value}>
                      {value}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </div>
          <div className={classes.row}>
            <FormControl sx={{ m: 0, flex: `0 0 ${editWidth}` }} size="small">
              <InputLabel shrink id="alignment">
                Alignment
              </InputLabel>
              <Select labelId={'alignment'} id="alignment-select" value={shortDescription.alignment} label="Armor Class" onChange={onChangeAlignment}>
                {Object.values(Alignment).map((value, index) => {
                  return (
                    <MenuItem key={index} value={value}>
                      {value}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
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
        </div>
      )}
    </div>
  )
}

export default EditableShortDescription
