import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  DownOutlined,
  EditOutlined,
  FormOutlined,
  ItalicOutlined,
  LinkOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { $createCodeNode, $isCodeNode, getCodeLanguages, getDefaultCodeLanguage } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $isAtNodeEnd, $isParentElementRTL, $wrapNodes } from '@lexical/selection';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BsChatSquareQuote } from 'react-icons/bs';
import { FaAlignCenter, FaQuoteLeft } from 'react-icons/fa6';
import { LuHeading1, LuHeading2, LuListChecks } from 'react-icons/lu';
import { MdChecklist, MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md';

import DropDown, { DropDownItem } from '@/generic/components/core/RichTextEditor/ui/DropDown';

import useModal from '../hooks/useModal';
import { INSERT_IMAGE_COMMAND, InsertImageDialog } from './ImagesPlugin';

const LowPriority = 1;

const supportedBlockTypes = new Set([
  'bullet',
  'check',
  // "code",
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'number',
  'paragraph',
  'quote',
]);

const blockTypeToBlockName = {
  // code: "Code Block",
  bullet: 'Bulleted List',
  check: 'Check List',
  // code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

function Divider() {
  return <div className="divider" />;
}

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = '0';
    editor.style.top = '-1000px';
    editor.style.left = '-1000px';
  } else {
    editor.style.opacity = '1';
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2}px`;
  }
}

function FloatingLinkEditor({ editor }) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
    }

    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;

      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;

        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }

        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }

      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== 'link-input') {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl('');
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();

          return true;
        },
        LowPriority,
      ),
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={event => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault();

              if (lastSelection !== null) {
                if (linkUrl !== '') {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }

                setEditMode(false);
              }
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className="link-edit flex justify-center"
              role="button"
              tabIndex={0}
              onMouseDown={event => event.preventDefault()}
              onClick={e => {
                e.preventDefault();
                setEditMode(true);
              }}
            >
              <EditOutlined />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Select({ onChange, className, options, value }) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();

  if (anchorNode === focusNode) {
    return anchorNode;
  }

  const isBackward = selection.isBackward();

  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function BlockOptionsDropdownList({ editor, blockType, toolbarRef, setShowBlockOptionsDropDown }) {
  const dropDownRef = useRef(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();

      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = event => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };

      document.addEventListener('click', handle);

      return () => {
        document.removeEventListener('click', handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== 'h1') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h1'));
        }
      });
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== 'h2') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h2'));
        }
      });
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    console.log('FORMATING CHECKLIST ', blockType);

    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatCheckList = () => {
    console.log('FORMATING CHECKLIST ', blockType);

    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    console.log('Block type: ', blockType);

    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }

    setShowBlockOptionsDropDown(false);
  };

  return (
    <div className="dropdown" ref={dropDownRef}>
      <button
        className="item"
        onClick={e => {
          e.preventDefault();
          formatParagraph();
        }}
      >
        {/* <span className="icon paragraph" /> */}
        <FaAlignCenter className="icon" />

        <span className="text">Normal</span>
        {blockType === 'paragraph' && <span className="active" />}
      </button>
      <button
        className="item"
        onClick={e => {
          e.preventDefault();
          formatLargeHeading();
        }}
      >
        {/* <span className="icon large-heading" /> */}
        <LuHeading1 className="icon" />

        <span className="text">Large Heading</span>
        {blockType === 'h1' && <span className="active" />}
      </button>
      <button
        className="item"
        onClick={e => {
          e.preventDefault();
          formatSmallHeading();
        }}
      >
        {/* <span className="icon small-heading" /> */}
        <LuHeading2 className="icon" />
        <span className="text">Small Heading</span>

        {blockType === 'h2' && <span className="active" />}
      </button>
      <button
        className="item"
        onClick={e => {
          e.preventDefault();
          formatBulletList();
        }}
      >
        {/* <span className="icon bullet-list" /> */}
        <MdFormatListBulleted className="icon" />

        <span className="text">Bullet List</span>
        {blockType === 'ul' && <span className="active" />}
      </button>

      <button
        className="item"
        onClick={e => {
          e.preventDefault();
          formatNumberedList();
        }}
      >
        {/* <span className="icon numbered-list" /> */}

        <MdFormatListNumbered className="icon" />
        <span className="text">Numbered List</span>
        {blockType === 'ol' && <span className="active" />}
      </button>

      <button
        className="item"
        onClick={e => {
          e.preventDefault();
          formatCheckList();
        }}
      >
        {/* <span className="icon check-list" /> */}

        <LuListChecks className="icon" />
        <span className="text">Check List</span>
        {blockType === 'check' && <span className="active" />}
      </button>

      <button
        className="item"
        onClick={e => {
          e.preventDefault();
          formatQuote();
        }}
      >
        {/* <span className="icon quote" /> */}

        <FaQuoteLeft className="icon" />
        <span className="text">Quote</span>
        {blockType === 'quote' && <span className="active" />}
      </button>
      {/* <button className="item" onClick={(e) => {
        e.preventDefault()
        formatCode()
      }}>
        <span className="icon code" />
        <span className="text">Code Block</span>
        {blockType === "code" && <span className="active" />}
      </button> */}
    </div>
  );
}

export default function ToolbarPlugin({
  showBold = true,
  showItalic = true,
  showUnderline = true,
  showLineThrough = true,
  showFormatCode = true,
  showInsertLink = true,
}) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [modal, showModal] = useModal();
  const [blockType, setBlockType] = useState('paragraph');
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);

  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, e => {
              const parent = e.getParent();

              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      // setIsSubscript(selection.hasFormat("subscript"))
      // setIsSuperscript(selection.hasFormat("superscript"))
      // setIsCode(selection.hasFormat("code"))
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      // const tableNode = $findMatchingParent(node, $isTableNode)
      // if ($isTableNode(tableNode)) {
      //   setRootType("table")
      // } else {
      //   setRootType("root")
      // }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);

        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();

          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();

          if (type in blockTypeToBlockName) {
            setBlockType(type);
          }
          // if ($isCodeNode(element)) {
          //   const language = element.getLanguage()
          //   setCodeLanguage(language ? CODE_LANGUAGE_MAP[language] || language : "")
          //   return
          // }
        }
      }
      // Handle buttons
      // setFontSize(
      //   $getSelectionStyleValueForProperty(selection, "font-size", "15px")
      // )
      // setFontColor($getSelectionStyleValueForProperty(selection, "color", "#000"))
      // setBgColor(
      //   $getSelectionStyleValueForProperty(selection, "background-color", "#fff")
      // )
      // setFontFamily(
      //   $getSelectionStyleValueForProperty(selection, "font-family", "Arial")
      // )
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();

          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        payload => {
          setCanUndo(payload);

          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        payload => {
          setCanRedo(payload);

          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const codeLanguges = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    e => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);

          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const insertGifOnClick = payload => editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={e => {
          e.preventDefault();
          editor.dispatchCommand(UNDO_COMMAND);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        {/* <i className="format undo" /> */}
        <UndoOutlined />
      </button>
      <button
        disabled={!canRedo}
        onClick={e => {
          e.preventDefault();
          editor.dispatchCommand(REDO_COMMAND);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        {/* <i className="format redo" /> */}
        <RedoOutlined />
      </button>
      <Divider />
      {supportedBlockTypes.has(blockType) && (
        <>
          <button
            className="toolbar-item block-controls"
            onClick={e => {
              e.preventDefault();
              setShowBlockOptionsDropDown(!showBlockOptionsDropDown);
            }}
            aria-label="Formatting Options"
          >
            <span className={'icon block-type ' + blockType} />
            <span className="text">{blockTypeToBlockName[blockType]}</span>
            {/* <i className="chevron-down" /> */}
            <DownOutlined />
          </button>
          {showBlockOptionsDropDown &&
            createPortal(
              <BlockOptionsDropdownList
                editor={editor}
                blockType={blockType}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
              />,
              document.body,
            )}
          <Divider />
        </>
      )}
      {blockType === 'code' ? (
        <>
          <Select
            className="toolbar-item code-language"
            onChange={onCodeLanguageSelect}
            options={codeLanguges}
            value={codeLanguage}
          />
          {/* <i className="chevron-down inside" /> */}
          <DownOutlined />
        </>
      ) : (
        <>
          {showBold && (
            <button
              onClick={e => {
                e.preventDefault();
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
              }}
              className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
              aria-label="Format Bold"
            >
              <BoldOutlined />
            </button>
          )}
          {showItalic && (
            <button
              onClick={e => {
                e.preventDefault();
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
              }}
              className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
              aria-label="Format Italics"
            >
              {/* <i className="format italic" /> */}
              <ItalicOutlined />
            </button>
          )}
          {showUnderline && (
            <button
              onClick={e => {
                e.preventDefault();
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
              }}
              className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
              aria-label="Format Underline"
            >
              {/* <i className="format underline" /> */}
              <UnderlineOutlined />
            </button>
          )}
          {showLineThrough && (
            <button
              onClick={e => {
                e.preventDefault();
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
              }}
              className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
              aria-label="Format Strikethrough"
            >
              {/* <i className="format strikethrough" /> */}
              <StrikethroughOutlined />
            </button>
          )}
          {showFormatCode && (
            <button
              onClick={e => {
                e.preventDefault();
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
              }}
              className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
              aria-label="Insert Code"
            >
              {/* <i className="format code" /> */}
              <FormOutlined />
            </button>
          )}
          {showInsertLink && (
            <button
              onClick={e => {
                e.preventDefault();
                insertLink();
              }}
              className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
              aria-label="Insert Link"
            >
              {/* <i className="format link" /> */}
              <LinkOutlined />
            </button>
          )}
          {isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
          <Divider />
          <DropDown
            disabled={false}
            buttonLabel="Align"
            // buttonIconClassName="icon left-align"
            buttonClassName="toolbar-item spaced alignment"
            buttonAriaLabel="Formatting options for text alignment"
            // icon={<DownOutlined />}
          >
            <DropDownItem
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
              }}
              className="item"
            >
              {/* <i className="icon left-align" /> */}
              <AlignLeftOutlined />
              <span className="text ml-5">Left Align</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
              }}
              className="item"
            >
              {/* <i className="icon center-align" /> */}
              <AlignCenterOutlined />
              <span className="text ml-5">Center Align</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
              }}
              className="item"
            >
              {/* <i className="icon right-align" /> */}
              <AlignRightOutlined />
              <span className="text ml-5">Right Align</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
              }}
              className="item"
            >
              <i className="icon justify-align" />
              <span className="text">Justify Align</span>
            </DropDownItem>
            <Divider />
            <DropDownItem
              onClick={() => {
                editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
              }}
              className="item"
            >
              <i className={'icon ' + (isRTL ? 'indent' : 'outdent')} />
              <span className="text">Outdent</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
              }}
              className="item"
            >
              <i className={'icon ' + (isRTL ? 'outdent' : 'indent')} />
              <span className="text">Indent</span>
            </DropDownItem>
          </DropDown>

          {/* <DropDown
            disabled={false}
            buttonClassName="toolbar-item spaced"
            buttonLabel="Insert"
            buttonAriaLabel="Insert specialized editor node"
            buttonIconClassName="icon plus">

            <DropDownItem
              onClick={() => {
                showModal('Insert Image', (onClose) => (
                  <InsertImageDialog
                    activeEditor={editor}
                    onClose={onClose}
                  />
                ));
              }}
              className="item">
              <i className="icon image" />
              <span className="text">Image</span>
            </DropDownItem> */}
          {/* <DropDownItem
              onClick={() => {
                showModal('Insert Inline Image', (onClose) => (
                  <InsertInlineImageDialog
                    activeEditor={editor}
                    onClose={onClose}
                  />
                ));
              }}
              className="item">
              <i className="icon image" />
              <span className="text">Inline Image</span>
            </DropDownItem> */}

          {/* <DropDownItem
              onClick={() => {
                showModal('Insert Table', (onClose) => (
                  <InsertTableDialog
                    activeEditor={editor}
                    onClose={onClose}
                  />
                ));
              }}
              className="item">
              <i className="icon table" />
              <span className="text">Table</span>
            </DropDownItem> 
            <DropDownItem
          {/* <DropDownItem
                  <InsertNewTableDialog
                    onClose={onClose}
                  />
                ));
              }}
              className="item">
              <i className="icon table" />
              <span className="text">Table (Experimental)</span>
            </DropDownItem>
             */}
          {/* </DropDown> */}
        </>
      )}
      {modal}
    </div>
  );
}
