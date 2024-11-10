import './styles.css';

import { $generateHtmlFromNodes } from '@lexical/html';
import { TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { Input } from 'antd';
import { $createParagraphNode, $getRoot, $getSelection } from 'lexical';
import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';

// import NewMentionsPlugin from '@/generic/components/core/RichTextEditor/plugins/MentionsPlugin'
import lexical_config from '@/generic/components/core/RichTextEditor/config';
import ImagesPlugin from '@/generic/components/core/RichTextEditor/plugins/ImagesPlugin';
import SubmitPlugin from '@/generic/components/core/RichTextEditor/plugins/SubmitPlugin';
import ToolbarPlugin from '@/generic/components/core/RichTextEditor/plugins/ToolbarPlugin';
import TreeViewPlugin from '@/generic/components/core/RichTextEditor/plugins/TreeViewPlugin';

import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';

const { TextArea } = Input;

function Placeholder() {
  return <div className="editor-placeholder">Enter some text...</div>;
}

const RichTextEditor = forwardRef((props, ref) => {
  const {
    onChange,
    focused,
    value,
    mentions,
    textAreaProps,
    onSubmit,
    showBold,
    showItalic,
    showUnderline,
    showLineThrough,
    showFormatCode,
    showInsertLink,
  } = props;

  const editorStateRef = useRef();
  const [isFocused, setIsFocused] = useState(focused || false);
  const [editorState, setEditorState] = useState(
    (value && typeof value === 'object' && Object.keys(value).length > 0 && JSON.stringify(value)) || undefined,
  );

  useLayoutEffect(() => {
    if (value) {
      console.log(value);

      _setEditorState(value);
    }
  }, [value]);

  const handleFocus = () => setIsFocused(true);

  function _onChange(editorState, editor) {
    editorStateRef.current = editorState;

    editorState.read(() => {
      const stringifiedEditorState = editorState.toJSON();

      onChange && onChange(stringifiedEditorState);
    });
    editor.update(() => {
      //
    });
  }

  const _setEditorState = stringifiedEditorState => {
    // You need to implement your code here that applies the stringifiedEditorState to your editor.
    // If you're using a Rich Text Editor library, it might provide methods for setting the editor's content.
    // After applying the new state to your editor, update your local state as well:
    console.log(stringifiedEditorState);

    setEditorState(JSON.stringify(stringifiedEditorState));
  };

  const isEmpty = () => {
    const json = editorStateRef.current.toJSON();

    var isEmpty = true;

    for (const child of json.root.children) {
      // check if there's only one paragraph node with no text
      if (!(child.type === 'paragraph' && child.children.length === 0)) {
        isEmpty = false;
        break;
      }
    }

    return isEmpty;
  };

  const clear = () => {
    setEditorState(
      JSON.stringify({
        root: {
          children: [
            {
              children: [],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      }),
    );
  };

  const getEditorStateJSON = () => {
    var json = editorStateRef?.current?.toJSON();

    if (!json) {
      json = {};
    }

    return json;
  };

  console.log(getEditorStateJSON());

  useImperativeHandle(ref, () => ({
    callBack: getEditorStateJSON,
    setIsFocused: setIsFocused,
    setEditorState: _setEditorState,
    isEmpty: isEmpty,
    clear: clear,
  }));

  return isFocused || value ? (
    <div style={{ border: '1px solid lightgray', borderRadius: '4px' }}>
      <LexicalComposer
        initialConfig={{
          ...lexical_config,
          editable: true,
          editorState: editorState,
        }}
      >
        <div className="editor-container" style={{ zIndex: 1000 }}>
          <ToolbarPlugin
            showBold={showBold}
            showItalic={showItalic}
            showUnderline={showUnderline}
            showLineThrough={showLineThrough}
            showFormatCode={showFormatCode}
            showInsertLink={showInsertLink}
          />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            {/* <TreeViewPlugin /> */}
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CheckListPlugin />
            {mentions && <NewMentionsPlugin mentions={mentions} />}
            <LinkPlugin />
            <OnChangePlugin onChange={_onChange} />
            <ImagesPlugin />
            <ClearEditorPlugin />
            <SubmitPlugin onSubmit={onSubmit} />

            {/* <ImagesPlugin /> */}
            {/* <EditorStatePlugin /> */}
            <AutoLinkPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </div>
      </LexicalComposer>
    </div>
  ) : (
    <TextArea className={`textArea ${isFocused ? 'hidden' : 'visible'}`} onFocus={handleFocus} {...textAreaProps} />
  );
});

export default RichTextEditor;
