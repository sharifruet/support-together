import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
function MytextEditor() {
    const [editorState, setEditorState] = useState(() =>
      EditorState.createEmpty()
    );
  
    const onChange = (newEditorState) => {
      setEditorState(newEditorState);
    };
  
    return (
      <div>
        <Editor editorState={editorState} onChange={onChange} />
      </div>
    );
  }
  
  export default MytextEditor;
  