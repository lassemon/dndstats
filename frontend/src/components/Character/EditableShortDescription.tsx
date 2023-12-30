import React, { useContext, useEffect, useState } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { Alignment, MonsterSubtype, MonsterType, Size } from 'interfaces'
import { CharacterCardContext } from 'services/context'

interface EditableShortDescriptionProps {
  className?: string
  editMode?: boolean
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
  const { editMode = false, className = '' } = props
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
    setIsText(!editMode)
  }, [editMode])

  const onDoubleClick = () => {
    if (isText) {
      setIsText(false)
    }
  }

  const onChangeSize = (event: SelectChangeEvent<string>) => {
    setShortDescription((shortDescription) => {
      return {
        ...shortDescription,
        size: event.target.value
      }
    })
  }

  const onChangeType = (event: SelectChangeEvent<string>) => {
    setShortDescription((shortDescription) => {
      return {
        ...shortDescription,
        type: event.target.value
      }
    })
  }

  const onChangeSubtype = (event: SelectChangeEvent<string>) => {
    setShortDescription((shortDescription) => {
      return {
        ...shortDescription,
        subtype: event.target.value
      }
    })
  }

  const onChangeAlignment = (event: SelectChangeEvent<string>) => {
    setShortDescription((shortDescription) => {
      return {
        ...shortDescription,
        alignment: event.target.value
      }
    })
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

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`} onDoubleClick={onDoubleClick}>
      {isText ? (
        <Typography variant="h2" className={`${classes.shortDescription}`}>
          {character.short_description}
        </Typography>
      ) : (
        <div className={classes.editor}>
          <div className={classes.row}>
            <FormControl sx={{ m: 0, flex: '0 0 12em' }} size="small">
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
            <FormControl sx={{ m: 0, flex: '0 0 12em' }} size="small">
              <InputLabel shrink id="type">
                Type
              </InputLabel>
              <Select labelId={'type'} id="type-select" value={shortDescription.type} label="Type" onChange={onChangeType}>
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
            <FormControl sx={{ m: 0, flex: '0 0 12em' }} size="small">
              <InputLabel shrink id="subtype">
                Subtype
              </InputLabel>
              <Select labelId={'subtype'} id="subtype-select" value={shortDescription.subtype} label="Subtype" onChange={onChangeSubtype}>
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
            <FormControl sx={{ m: 0, flex: '0 0 12em' }} size="small">
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
            <Button variant="contained" size="small" onClick={onSave}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditableShortDescription
