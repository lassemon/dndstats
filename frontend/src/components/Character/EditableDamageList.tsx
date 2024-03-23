import { Autocomplete, Button, TextField, TextFieldProps } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { DamageType } from 'interfaces'
import { AutoCompleteItem } from 'components/Autocomplete/AutocompleteItem'
import Stat from 'components/Stat'

export const useStyles = makeStyles()(() => ({
  root: {
    cursor: 'pointer'
  },
  editor: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4em',
    alignItems: 'baseline',
    margin: '0.6em 0 0.8em 0'
  },
  row: {
    display: 'flex',
    gap: '0.4em',
    alignItems: 'center'
  },
  buttonsContainer: {
    display: 'flex',
    gap: '0.6em'
  },
  autocomplete: {
    '& .MuiAutocomplete-tag': {
      textTransform: 'capitalize',
      height: 'auto',
      '& .MuiChip-label': {
        whiteSpace: 'normal'
      }
    },
    '& .MuiInputLabel-animated': {
      transform: 'translate(14px, -9px) scale(0.75)'
    },
    '& legend': {
      maxWidth: '100%'
    }
  }
}))

interface EditableDamageListProps {
  className?: string
  textClass?: string
  header: string
  list: DamageType[]
  valueLabel?: string | number
  textWidth?: number
  editWidth?: number
  type?: TextFieldProps['type']
  editMode?: boolean
  presentationMode?: boolean
  onChange: (list: DamageType[]) => void
}

const EditableDamageList: React.FC<EditableDamageListProps> = (props) => {
  const { header = '', list = [], className = '', editMode = false, presentationMode = false, onChange } = props
  const [isText, setIsText] = useState(!editMode)
  const [damageList, setDamageList] = useState(list)
  const { classes } = useStyles()

  useEffect(() => {
    setDamageList([...list])
  }, [list])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onDoubleClick = () => {
    if (isText) {
      setIsText(false)
    }
  }

  const onChangeValue = (event: React.SyntheticEvent<Element, Event>, newDamageList: DamageType[]) => {
    setDamageList(newDamageList)
    if (!presentationMode) {
      onChange(newDamageList)
    }
  }

  const onCancel = () => {
    setIsText(true)
  }

  const onSave = () => {
    onChange(damageList)
    if (!editMode) {
      setIsText(true)
    }
  }

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`}>
      {isText ? (
        <Stat header={header} value={damageList.join(', ')} onDoubleClick={onDoubleClick} />
      ) : (
        <div className={classes.editor}>
          <Autocomplete
            multiple
            clearOnBlur
            disableCloseOnSelect
            value={damageList}
            className={`${classes.autocomplete}`}
            options={Object.values(DamageType)}
            onChange={onChangeValue}
            getOptionLabel={(option) => option.replaceAll('_', ' ')}
            style={{ width: '100%' }}
            PaperComponent={AutoCompleteItem}
            renderInput={(params) => <TextField {...params} label={header} variant="outlined" size="small" />}
          />

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

export default EditableDamageList
