import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { CLEAR_EDITOR_COMMAND } from 'lexical'

export default function SubmitPlugin({ onSubmit }) {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        if (!onSubmit) {
            return
        }
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)
    }, [onSubmit])

    return null
}
