import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { makeStyles } from 'tss-react/mui'
import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { Root, Parent, Literal, RootContent, PhrasingContent } from 'mdast'

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

const highlightTextPart = (text?: string, toHighlightPart?: string) => {
  if (text && toHighlightPart) {
    const regexp = new RegExp(toHighlightPart, 'gi')
    return text.replaceAll(regexp, '==' + toHighlightPart + '==')
  }
  return text
}

// Custom plugin to handle ==highlight== syntax
const remarkHighlight: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'text', (node: Literal, index, parent: Parent | undefined) => {
      if (parent && typeof node.value === 'string') {
        const regex = /==([^=]+)==/g
        const newChildren: RootContent[] = []
        let lastIndex = 0
        let match

        while ((match = regex.exec(node.value)) !== null) {
          if (match.index > lastIndex) {
            newChildren.push({
              type: 'text',
              value: node.value.slice(lastIndex, match.index)
            })
          }
          newChildren.push({
            type: 'highlight',
            data: {
              hName: 'span',
              hProperties: {
                class: 'highlight'
              }
            },
            children: [{ type: 'text', value: match[1] }]
          } as unknown as PhrasingContent)
          lastIndex = regex.lastIndex
        }

        if (lastIndex < node.value.length) {
          newChildren.push({
            type: 'text',
            value: node.value.slice(lastIndex)
          })
        }

        parent.children.splice(index as number, 1, ...newChildren)
      }
    })
  }
}

interface HighlightProps {
  children: React.ReactNode
}

const Highlight: React.FC<HighlightProps> = ({ children }) => {
  return <>{children}</>
}

// NOTE: this might break is react-markdown is updated, since its highly customized hack
const components: Components = {
  highlight: Highlight
} as unknown as Components

export const Markdown: React.FC<{ text: string; highlightText?: string; className?: string }> = ({
  text,
  highlightText,
  className = ''
}) => {
  const { classes } = useStyles()
  return (
    <ReactMarkdown
      className={`${classes.markdown} ${className}`}
      remarkPlugins={[remarkGfm, remarkHighlight]}
      components={components}
      children={highlightText ? highlightTextPart(text, highlightText) : text}
    />
  )
}

export default Markdown
