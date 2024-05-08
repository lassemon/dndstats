import statblockparch from 'assets/statblockparch.jpg'
import OrangeBorder from 'components/OrangeBorder'
import React from 'react'

import useStyles from './StatsContainer.styles'
import classNames from 'classnames'

interface StatsContainerProps {
  rootClassName?: string
  containerClassName?: string
  size?: 'small' | 'normal'
  resizeable?: boolean
  children?: React.ReactNode
}

export const StatsContainer = React.forwardRef<HTMLDivElement, StatsContainerProps>((props, ref) => {
  const { children, rootClassName = '', containerClassName = '', size = 'normal', resizeable = true } = props
  const { classes } = useStyles()
  const cx = classNames.bind(classes)

  const divStyle = {
    backgroundImage: 'url(' + statblockparch + ')'
  }

  return (
    <div
      className={cx('stats-container', {
        [classes.root]: true,
        [rootClassName]: rootClassName,
        [classes.resizeable]: resizeable
      })}
      ref={ref ? ref : null}
    >
      <OrangeBorder />
      <div className={`${classes.content} stats-background`} style={divStyle}>
        <div
          className={cx('stats-container', {
            [classes.margins]: size === 'normal',
            [classes.marginsSmall]: size !== 'normal',
            [containerClassName]: containerClassName
          })}
        >
          {children}
        </div>
      </div>
      <OrangeBorder />
    </div>
  )
})

export default StatsContainer
