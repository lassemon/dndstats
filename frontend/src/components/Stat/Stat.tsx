import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  root: {
    textTransform: 'capitalize'
  },
  statHeader: {
    color: theme.status.blood,
    fontSize: '1.1em',
    lineHeight: '1.2em',
    fontWeight: 'bold',
    flexBasis: '16.6%',
    textAlign: 'center'
  },
  statValue: {
    color: theme.status.blood,
    fontSize: '1.07em',
    fontFamily: '"Helvetica", "Arial", sans-serif',
    flexBasis: '16.6%',
    textTransform: 'capitalize',
    display: 'inline-block',
    marginInlineStart: '0.5em',
    whiteSpace: 'nowrap'
  }
}))

interface StatProps {
  header: string
  value: string | number
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}

const Stat: React.FC<StatProps> = ({ header, value, onClick, onDoubleClick }) => {
  const { classes } = useStyles()

  return (
    <div
      className={`baseStat ${classes.root}`}
      onClick={onClick ? onClick : undefined}
      onDoubleClick={onDoubleClick ? onDoubleClick : undefined}
    >
      <span className={classes.statHeader}>{header}</span>
      <span className={classes.statValue}>{value}</span>
    </div>
  )
}

export default Stat
