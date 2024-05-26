import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  markdown: {
    '& p': {
      margin: '0.2em 0',
      whiteSpace: 'pre-wrap'
    },
    '& p + p': {
      margin: '-12px 0 0 0'
    },
    '& > table': {
      margin: '0.2em 0 0.4em 0',
      borderCollapse: 'collapse',
      '& td:first-of-type': {
        whiteSpace: 'nowrap'
      },
      '& th': {
        padding: '0 16px 0 4px'
      },
      '& td': {
        verticalAlign: 'text-top',
        border: `1px solid ${theme.palette.grey[600]}`,
        padding: '4px 8px'
      }
    },
    '& > ul': {
      margin: '0.5em 0'
    },
    '& > ul > li': {
      whiteSpace: 'pre-wrap'
    }
  }
}))

export const Markdown: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const { classes } = useStyles()
  return (
    <ReactMarkdown className={`${classes.markdown} ${className}`} remarkPlugins={[remarkGfm]}>
      {text}
    </ReactMarkdown>
  )
}

export default Markdown
