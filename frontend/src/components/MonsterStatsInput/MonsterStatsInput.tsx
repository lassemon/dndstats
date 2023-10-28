import { Button, Grid, TextField } from '@mui/material'
import FeatureInputContainer from 'components/FeatureInputContainer'
import ImageButtons from 'components/ImageButtons'
import StatsInputContainer from 'components/StatsInputContainer'
import React from 'react'
import { useRecoilState } from 'recoil'
import { monsterState } from 'recoil/atoms'

const replaceItemAtIndex = (arr: any[], index: number, newValue: any) => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export const MonsterStatsInput: React.FC = () => {
  const [currentMonster, setCurrentMonster] = useRecoilState(monsterState)

  const onChange = (name: string) => (event: any) =>
    setCurrentMonster((monster) => {
      return { ...monster, [name]: event.target.value }
    })

  const onAddFeature = () => {
    setCurrentMonster((monster) => {
      return {
        ...monster,
        features: [
          ...monster.features,
          {
            name: 'Feature name',
            description: 'Feature description'
          }
        ]
      }
    })
  }

  const onAddAction = () => {
    setCurrentMonster((monster) => {
      return {
        ...monster,
        actions: [
          ...monster.actions,
          {
            name: 'Action name',
            description: 'Action description'
          }
        ]
      }
    })
  }

  const onAddReaction = () => {
    setCurrentMonster((monster) => {
      return {
        ...monster,
        reactions: [
          ...monster.reactions,
          {
            name: 'Reaction name',
            description: 'Reaction description'
          }
        ]
      }
    })
  }

  const onChangeFeatureName = (index: number) => (event: any) => {
    setCurrentMonster((monster) => {
      const featuresCopy = replaceItemAtIndex(monster.features, index, {
        name: event.target.value,
        description: monster.features[index].description
      })
      return {
        ...monster,
        features: featuresCopy
      }
    })
  }

  const onChangeActionName = (index: number) => (event: any) => {
    setCurrentMonster((monster) => {
      const actionsCopy = replaceItemAtIndex(monster.actions, index, {
        name: event.target.value,
        description: monster.actions[index].description
      })
      return {
        ...monster,
        actions: actionsCopy
      }
    })
  }

  const onChangeReactionName = (index: number) => (event: any) => {
    setCurrentMonster((monster) => {
      const reactionsCopy = replaceItemAtIndex(monster.reactions, index, {
        name: event.target.value,
        description: monster.reactions[index].description
      })
      return {
        ...monster,
        reactions: reactionsCopy
      }
    })
  }

  const onChangeFeatureDescription = (index: number) => (event: any) => {
    setCurrentMonster((monster) => {
      const featuresCopy = replaceItemAtIndex(monster.features, index, {
        name: monster.features[index].name,
        description: event.target.value
      })
      return {
        ...monster,
        features: featuresCopy
      }
    })
  }

  const onChangeActionDescription = (index: number) => (event: any) => {
    setCurrentMonster((monster) => {
      const actionsCopy = replaceItemAtIndex(monster.actions, index, {
        name: monster.actions[index].name,
        description: event.target.value
      })
      return {
        ...monster,
        actions: actionsCopy
      }
    })
  }

  const onChangeReactionDescription = (index: number) => (event: any) => {
    setCurrentMonster((monster) => {
      const reactionsCopy = replaceItemAtIndex(monster.reactions, index, {
        name: monster.actions[index].name,
        description: event.target.value
      })
      return {
        ...monster,
        reactions: reactionsCopy
      }
    })
  }

  const onDeleteFeature = (index: number) => () => {
    setCurrentMonster((monster) => {
      const featuresCopy = [...monster.features]
      featuresCopy.splice(index, 1)
      return {
        ...monster,
        features: featuresCopy
      }
    })
  }

  const onDeleteAction = (index: number) => () => {
    setCurrentMonster((monster) => {
      const actionsCopy = [...monster.actions]
      actionsCopy.splice(index, 1)
      return {
        ...monster,
        actions: actionsCopy
      }
    })
  }

  const onDeleteReaction = (index: number) => () => {
    setCurrentMonster((monster) => {
      const reactionsCopy = [...monster.reactions]
      reactionsCopy.splice(index, 1)
      return {
        ...monster,
        reactions: reactionsCopy
      }
    })
  }

  const onDeleteImage = () => {
    setCurrentMonster((monster) => {
      return {
        ...monster,
        image: React.createElement('img', {
          width: 200,
          alt: '',
          src: '',
          hash: 0
        })
      }
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
            return {
              ...monster,
              image: imgtag
            }
          })
        }
      }

      reader.readAsDataURL(imageFile)
    }
  }

  return (
    <StatsInputContainer>
      <ImageButtons onUpload={onUpload} onDeleteImage={onDeleteImage} />
      <TextField id="monster-name" label="Name" value={currentMonster.name} onChange={onChange('name')} />
      <TextField id="monster-short-description" label="Short Description" value={currentMonster.shortDescription} onChange={onChange('shortDescription')} />
      <TextField
        id="monster-main-description"
        label="Main Description"
        multiline={true}
        value={currentMonster.mainDescription}
        onChange={onChange('mainDescription')}
      />
      {/* BASE STATS */}
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12} sm={4}>
          <TextField id="monster-AC" label="Armor Class" value={currentMonster.AC} onChange={onChange('AC')} />
        </Grid>
        <Grid item={true} xs={12} sm={4}>
          <TextField id="monster-HP" label="Hit Points" value={currentMonster.HP} onChange={onChange('HP')} />
        </Grid>
        <Grid item={true} xs={12} sm={4}>
          <TextField id="monster-speed" label="Speed" value={currentMonster.speed} onChange={onChange('speed')} />
        </Grid>
      </Grid>
      {/* STATS */}
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={4} sm={2}>
          <TextField id="monster-STR" label="STR" value={currentMonster.STR} onChange={onChange('STR')} />
        </Grid>
        <Grid item={true} xs={4} sm={2}>
          <TextField id="monster-DEX" label="DEX" value={currentMonster.DEX} onChange={onChange('DEX')} />
        </Grid>
        <Grid item={true} xs={4} sm={2}>
          <TextField id="monster-CON" label="CON" value={currentMonster.CON} onChange={onChange('CON')} />
        </Grid>
        <Grid item={true} xs={4} sm={2}>
          <TextField id="monster-INT" label="INT" value={currentMonster.INT} onChange={onChange('INT')} />
        </Grid>
        <Grid item={true} xs={4} sm={2}>
          <TextField id="monster-WIS" label="WIS" value={currentMonster.WIS} onChange={onChange('WIS')} />
        </Grid>
        <Grid item={true} xs={4} sm={2}>
          <TextField id="monster-CHA" label="CHA" value={currentMonster.CHA} onChange={onChange('CHA')} />
        </Grid>
      </Grid>
      {/* EXTRA STATS */}
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12} sm={4}>
          <TextField id="monster-skills" label="Skills" value={currentMonster.skills} onChange={onChange('skills')} />
        </Grid>
        <Grid item={true} xs={12} sm={4}>
          <TextField id="monster-saving-throws" label="Saving Throws" value={currentMonster.savingthrows} onChange={onChange('savingthrows')} />
        </Grid>
        <Grid item={true} xs={12} sm={4}>
          <TextField id="monster-resistance" label="Damage Resistance" value={currentMonster.resistance} onChange={onChange('resistance')} />
        </Grid>
        <Grid item={true} xs={12} sm={4}>
          <TextField id="monster-damage-immunities" label="Damage Immunities" value={currentMonster.damageimmunities} onChange={onChange('damageimmunities')} />
        </Grid>
        <Grid item={true} xs={12} sm={4}>
          <TextField
            id="monster-condition-immunities"
            label="Condition Immunities"
            value={currentMonster.conditionimmunities}
            onChange={onChange('conditionimmunities')}
          />
        </Grid>
        <Grid item={true} xs={12} sm={4}>
          <TextField id="monster-senses" label="Senses" value={currentMonster.senses} onChange={onChange('senses')} />
        </Grid>
        <Grid item={true} xs={12} sm={4}>
          <TextField id="monster-languages" label="Languages" value={currentMonster.languages} onChange={onChange('languages')} />
        </Grid>
        <Grid item={true} xs={12} sm={4}>
          <TextField id="monster-challenge" label="Challenge" value={currentMonster.challenge} onChange={onChange('challenge')} />
        </Grid>
      </Grid>
      <Grid container={true} spacing={2}>
        {currentMonster.features.map((feature, key) => {
          return (
            <Grid key={key} item={true} xs={6}>
              <FeatureInputContainer onDelete={onDeleteFeature(key)}>
                <TextField id={`monster-${key}-feature-name`} label="Feature Name" value={feature.name} onChange={onChangeFeatureName(key)} />
                <TextField
                  id={`monster-${key}-feature-description`}
                  label="Feature Description"
                  multiline={true}
                  value={feature.description}
                  onChange={onChangeFeatureDescription(key)}
                />
              </FeatureInputContainer>
            </Grid>
          )
        })}
      </Grid>
      <Button variant="contained" color="primary" onClick={onAddFeature}>
        Add feature
      </Button>
      <Grid container={true} spacing={2}>
        {currentMonster.actions.map((action, key) => {
          return (
            <Grid key={key} item={true} xs={6}>
              <FeatureInputContainer onDelete={onDeleteAction(key)}>
                <TextField id={`monster-${key}-action-name`} label="Action Name" value={action.name} onChange={onChangeActionName(key)} />
                <TextField
                  id={`monster-${key}-action-description`}
                  label="Action Description"
                  multiline={true}
                  value={action.description}
                  onChange={onChangeActionDescription(key)}
                />
              </FeatureInputContainer>
            </Grid>
          )
        })}
      </Grid>
      <Button variant="contained" color="primary" onClick={onAddAction}>
        Add action
      </Button>

      <Grid container={true} spacing={2}>
        {currentMonster.reactions.map((reaction, key) => {
          return (
            <Grid key={key} item={true} xs={6}>
              <FeatureInputContainer onDelete={onDeleteReaction(key)}>
                <TextField id={`monster-${key}-reaction-name`} label="Reaction Name" value={reaction.name} onChange={onChangeReactionName(key)} />
                <TextField
                  id={`monster-${key}-reaction-description`}
                  label="Reaction Description"
                  multiline={true}
                  value={reaction.description}
                  onChange={onChangeReactionDescription(key)}
                />
              </FeatureInputContainer>
            </Grid>
          )
        })}
      </Grid>
      <Button variant="contained" color="primary" onClick={onAddReaction}>
        Add reaction
      </Button>
    </StatsInputContainer>
  )
}

export default MonsterStatsInput
