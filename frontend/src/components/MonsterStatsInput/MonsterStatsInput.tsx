import ImageButtons from 'components/ImageButtons'
import StatsInputContainer from 'components/StatsInputContainer'
import { useAtom } from 'jotai'
import React, { useMemo } from 'react'
import { monsterState } from 'infrastructure/dataAccess/atoms'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
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
  },
  settingsList: {
    padding: '0.5em'
  },
  settingsListItem: {
    display: 'flex',
    gap: '1em',
    padding: '0.5em',
    '> p': {
      flex: 1
    },
    '> div': {
      flex: 3
    }
  }
}))

export const MonsterStatsInput: React.FC = () => {
  const [currentMonster, setCurrentMonster] = useAtom(useMemo(() => monsterState, []))

  const onDeleteImage = () => {
    setCurrentMonster((monster) => {
      return monster?.clone({
        imageElement: React.createElement('img', {
          width: 200,
          alt: '',
          src: '',
          hash: 0
        })
      })
    })
  }

  const onUpload = (event: any) => {
    const imageFile = event.target.files[0]

    if (imageFile) {
      var reader = new FileReader()

      reader.onload = (event) => {
        if (event && event.target) {
          const imgtag = React.createElement('img', {
            width: 200,
            alt: imageFile.name,
            src: (event.target.result || '') as string,
            hash: Date.now()
          })
          setCurrentMonster((monster) => {
            return monster?.clone({
              imageElement: imgtag
            })
          })
        }
      }

      reader.readAsDataURL(imageFile)
    }
  }

  if (!currentMonster) {
    return null
  }

  return (
    <StatsInputContainer>
      <ImageButtons onUpload={onUpload} onDeleteImage={onDeleteImage} />
    </StatsInputContainer>
  )
}

export default MonsterStatsInput
