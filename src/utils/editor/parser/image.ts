export function parseImageToMarkdown(blocks: any) {
  return `![${blocks.caption}](${blocks.file.url})`.concat('\n')
}
