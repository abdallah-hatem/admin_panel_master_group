import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { $generateHtmlFromNodes } from '@lexical/html';
import { MentionNode } from '@/generic/components/core/RichTextEditor/nodes/MentionNode';
import { ImageNode } from '@/generic/components/core/RichTextEditor/nodes/ImageNode';
// import {InlineImageNode} from '@/generic/components/core/RichTextEditor/nodes/InlineImageNode';

// import ExampleTheme from "@/components/core/RichTextEditor/themes/ExampleTheme";
import PlaygroundEditorTheme from '@/generic/components/core/RichTextEditor/themes/PlaygroundEditorTheme';

export default {
  // The editor theme
  theme: PlaygroundEditorTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    MentionNode,
    ImageNode,
    LinkNode,
  ],
};
