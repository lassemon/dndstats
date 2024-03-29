import { Autocomplete, Button, TextField, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Languages } from 'interfaces'
import { AutoCompleteItem } from 'components/Autocomplete/AutocompleteItem'
import _, { capitalize } from 'lodash'
import EditableText from 'components/CombatTracker/EditableText'
import CardTitle from './CardTitle'
import Stat from 'components/Stat'

export const useStyles = makeStyles()((theme) => ({
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
    width: '100%',
    display: 'flex',
    gap: '0.4em',
    alignItems: 'center'
  },
  baseStat: {
    textTransform: 'capitalize'
  },
  statHeader: {
    color: theme.status.blood,
    fontSize: '1.02em',
    lineHeight: '1.2em',
    fontWeight: 'bold',
    flexBasis: '16.6%',
    textAlign: 'center'
  },
  statValue: {
    color: theme.status.blood,
    fontSize: '1.02em',
    fontFamily: '"Helvetica", "Arial", sans-serif',
    flexBasis: '16.6%',
    textTransform: 'capitalize',
    display: 'inline-block',
    marginInlineStart: '0.5em'
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

interface EditableLanguagesProps {
  className?: string
  language: string
  editMode?: boolean
  presentationMode?: boolean
  onChange: (languages: string) => void
}

const EditableLanguages: React.FC<EditableLanguagesProps> = (props) => {
  const { language, className = '', editMode = false, presentationMode = false, onChange } = props
  const knownLanguages = Object.values(Languages).map((language) => language.toString().toLowerCase())
  const [isText, setIsText] = useState(!editMode)

  const incomingLanguages = language.split(',').map((language) => language.toLowerCase().trim())
  const notKnownLanguages = _.remove(incomingLanguages, (language) => !knownLanguages.includes(language))

  const [languageList, setLanguageList] = useState(incomingLanguages)
  const [customLanguages, setCustomLanguages] = useState(notKnownLanguages.map((language) => capitalize(language)).join(', '))
  const { classes } = useStyles()

  useEffect(() => {
    const _knownLanguages = Object.values(Languages).map((language) => language.toString().toLowerCase())
    const _incomingLanguages = language.split(',').map((language) => language.toLowerCase().trim())
    const _notKnownLanguages = _.remove(_incomingLanguages, (language) => !_knownLanguages.includes(language))
    setLanguageList(_incomingLanguages)
    setCustomLanguages(_notKnownLanguages.map((language) => capitalize(language)).join(', '))
  }, [language])

  useEffect(() => {
    setIsText(!editMode)
  }, [editMode])

  const onDoubleClick = () => {
    if (isText) {
      setIsText(false)
    }
  }

  const onChangeValue = (event: React.SyntheticEvent<Element, Event>, newLanguageList: string[]) => {
    setLanguageList(newLanguageList)
    if (!presentationMode) {
      onChange(formatLanguagesForSave(newLanguageList, customLanguages))
    }
  }

  const onChangeCustomLanguages = (value: string | number) => {
    setCustomLanguages(value.toString())
    if (!presentationMode) {
      onChange(formatLanguagesForSave(languageList, value.toString()))
    }
  }

  const onCancel = () => {
    setIsText(true)
  }

  const onSave = () => {
    const allLanguages = formatLanguagesForSave(languageList, customLanguages)
    onChange(allLanguages)
    if (!editMode) {
      setIsText(true)
    }
  }

  const formatLanguagesForSave = (_languageList: string[], customLanguages: string = '') => {
    return [..._languageList.map((language) => capitalize(language))]
      .concat(customLanguages.length > 0 ? customLanguages.split(',').map((language) => capitalize(language.trim())) : [])
      .join(', ')
  }

  return (
    <div className={`${!isText ? 'editing ' : ''}${classes.root} ${className}`}>
      {isText ? (
        <Stat header="Languages" value={language} onDoubleClick={onDoubleClick} />
      ) : (
        <>
          <CardTitle>Languages</CardTitle>
          <div className={classes.editor}>
            <Autocomplete
              multiple
              clearOnBlur
              disableCloseOnSelect
              value={languageList}
              className={`${classes.autocomplete}`}
              options={knownLanguages}
              onChange={onChangeValue}
              getOptionLabel={(option) => option.replaceAll('_', ' ')}
              style={{ width: '100%' }}
              PaperComponent={AutoCompleteItem}
              renderInput={(params) => <TextField {...params} label="Languages" variant="outlined" size="small" />}
            />
            <Tooltip title="Comma separated list of other languages" placement="top-start">
              <div style={{ width: '100%' }}>
                <EditableText
                  id="custom-languages"
                  label="Custom"
                  value={customLanguages}
                  onChange={onChangeCustomLanguages}
                  editMode={true}
                  presentationMode={false}
                />
              </div>
            </Tooltip>
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
        </>
      )}
    </div>
  )
}

export default EditableLanguages
