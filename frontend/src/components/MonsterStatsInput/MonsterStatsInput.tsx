import ImageButtons from 'components/ImageButtons'
import StatsInputContainer from 'components/StatsInputContainer'
import { useAtom } from 'jotai'
import React, { useMemo } from 'react'
import { errorAtom, monsterAtom } from 'infrastructure/dataAccess/atoms'
import { makeStyles } from 'tss-react/mui'
import DownloadJSON from 'components/DownloadJSON'
import UploadJSON from 'components/UploadJSON'
import Character from 'domain/entities/Character'

const useStyles = makeStyles()(() => ({
  inputContainer: {
    '&&': {
      gap: '1em',
      padding: '0 0 3em 0'
    }
  },
  uploadButtons: {
    display: 'flex',
    gap: '1em'
  }
}))

export const MonsterStatsInput: React.FC = () => {
  const [currentMonster, setCurrentMonster] = useAtom(useMemo(() => monsterAtom, []))
  const [, setError] = useAtom(React.useMemo(() => errorAtom, []))
  const { classes } = useStyles()

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

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = (event.target.files || [])[0]

    if (imageFile) {
      const reader = new FileReader()

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

  const onUploadMonster = (monster?: { [key: string]: any }) => {
    try {
      if (monster) {
        const parsedMonster = Character.fromJSON(monster)
        setCurrentMonster(parsedMonster)
      }
    } catch (error) {
      setError(new Error(error?.toString()))
    }
  }

  if (!currentMonster) {
    return null
  }

  return (
    <StatsInputContainer className={classes.inputContainer}>
      <ImageButtons onUpload={onUpload} onDeleteImage={onDeleteImage} />
      <div className={classes.uploadButtons}>
        <UploadJSON onUpload={onUploadMonster}>Import Monster</UploadJSON>
        <DownloadJSON fileName={currentMonster.id} data={currentMonster}>
          Export Monster
        </DownloadJSON>
      </div>
    </StatsInputContainer>
  )
}

export default MonsterStatsInput
