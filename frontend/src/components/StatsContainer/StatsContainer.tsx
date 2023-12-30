import statblockparch from 'assets/statblockparch.jpg'
import OrangeBorder from 'components/OrangeBorder'
import React from 'react'

import useStyles from './StatsContainer.styles'
import classNames from 'classnames'

interface StatsContainerProps {
  className?: string
  size?: 'small' | 'normal'
  resizeable?: boolean
  children?: React.ReactNode
}

export const StatsContainer = React.forwardRef<HTMLDivElement, StatsContainerProps>((props, ref) => {
  const { children, className = '', size = 'normal', resizeable = true } = props
  const { classes } = useStyles()
  const cx = classNames.bind(classes)

  const divStyle = {
    backgroundImage: 'url(' + statblockparch + ')'
  }

  return (
    <div
      className={cx('stats-container', {
        [classes.root]: true,
        [className]: true,
        [classes.resizeable]: resizeable
      })}
      ref={ref ? ref : null}
    >
      <OrangeBorder />
      <div className={`${classes.content} stats-background`} style={divStyle}>
        <div className={size === 'normal' ? classes.margins : classes.marginsSmall}>{children}</div>
      </div>
      <OrangeBorder />
    </div>
  )
})

export default StatsContainer
