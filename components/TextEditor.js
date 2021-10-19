import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState } from 'draft-js';
import { db } from '../firebase';
import { useRouter } from 'next/dist/client/router';
import { convertFromRaw, convertToRaw } from 'draft-js';
import { useSession } from 'next-auth/client';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';

const Editor = dynamic(() => import('react-draft-wysiwyg').then((module) => module.Editor), { ssr: false });

function TextEditor() {
  // As nextJS on server side is working on NodeJs, we need to dynamically import 'Editor' only on client side.
  //     Otherwise we have a window is not defined error. This error doesnt appear on client side because js know the window object.
  const [SESSION] = useSession();
  const [EDITOR_STATE, SET_EDITOR_STATE] = useState(EditorState.createEmpty());
  const ROUTER = useRouter();
  const { ID } = ROUTER.query;
  const [SNAPSHOT] = useDocumentOnce(db.collection('userDocs').doc(SESSION?.user?.email).collection('docs').doc(ID));

  // Pushing information to SNAPSHOT to show saved text in a doc
  useEffect(() => {
    if (SNAPSHOT?.data()?.EDITOR_STATE) {
      SET_EDITOR_STATE(EditorState.createWithContent(convertFromRaw(SNAPSHOT?.data()?.EDITOR_STATE)));
    }
  }, [SNAPSHOT]);

  const ON_EDITOR_STATE_CHANGE = (EDITOR_STATE) => {
    SET_EDITOR_STATE(EDITOR_STATE);
    db.collection('userDocs')
      .doc(SESSION?.user?.email)
      .collection('docs')
      .doc(ID)
      .set({ EDITOR_STATE: convertToRaw(EDITOR_STATE.getCurrentContent()) }, { merge: true });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <Editor
        editorState={EDITOR_STATE}
        onEditorStateChange={ON_EDITOR_STATE_CHANGE}
        toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
        editorClassName="mt-6 bg-white shadow-lg max-w-5xl mx-auto mb-12 border p-10"
      />
    </div>
  );
}

export default TextEditor;
