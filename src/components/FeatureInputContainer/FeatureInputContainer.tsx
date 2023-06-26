import DeleteButton from 'components/DeleteButton'
import React from 'react'

import useStyles from './FeatureInputContainer.styles'

interface FeatureInputContainerProps {
  children?: React.ReactNode
  onDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const FeatureInputContainer: React.FC<FeatureInputContainerProps> = (props) => {
  const { children, onDelete } = props
  const classes = useStyles()
  return (
    <div className={classes.featureContainer}>
      {children}
      <div className={classes.deleteButtonContainer}>
        <DeleteButton onClick={onDelete} />
      </div>
    </div>
  )
}

export default FeatureInputContainer
