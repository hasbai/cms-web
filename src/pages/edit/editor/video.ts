import { $inputRule, $node, $remark } from '@milkdown/utils'
import directive from 'remark-directive'
import { Node } from '@milkdown/prose/model'
import { InputRule } from '@milkdown/prose/inputrules'

const remarkDirective = $remark(() => directive)
const directiveNode = $node('video', () => ({
  group: 'block',
  atom: true,
  isolating: true,
  marks: '',
  attrs: {
    src: { default: null },
  },
  parseDOM: [
    {
      tag: 'video',
      getAttrs: (dom) => ({
        src: (dom as HTMLElement).getAttribute('src'),
      }),
    },
  ],
  toDOM: (node: Node) => [
    'video',
    {
      src: node.attrs.src + '#t=0.1',
      contenteditable: false,
      controls: true,
      preload: 'metadata',
    },
    0,
  ],
  parseMarkdown: {
    match: (node) => node.type === 'leafDirective' && node.name === 'video',
    runner: (state, node, type) => {
      state.addNode(type, { src: (node.attributes as { src: string }).src })
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === 'video',
    runner: (state, node) => {
      state.addNode('leafDirective', undefined, undefined, {
        name: 'video',
        attributes: { src: node.attrs.src },
      })
    },
  },
}))

const inputRule = $inputRule(
  () =>
    new InputRule(
      /::video\{src\="(?<src>[^"]+)?"?\}/,
      (state, match, start, end) => {
        const [okay, src = ''] = match
        const { tr } = state
        if (okay) {
          tr.replaceWith(start - 1, end, directiveNode.type().create({ src }))
        }

        return tr
      }
    )
)

export default [remarkDirective, directiveNode, inputRule]
