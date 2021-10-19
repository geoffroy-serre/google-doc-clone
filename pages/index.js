import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import Head from 'next/head';
import Header from '../components/Header';
import Image from 'next/image';
import { getSession, useSession } from 'next-auth/client';
import Login from '../components/Login';
import Modal from '@material-tailwind/react/Modal';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import { useState } from 'react';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
import DocumentRow from '../components/DocumentRow';

export default function Home() {
  const [SESSION] = useSession();
  const [SHOW_MODAL, SET_SHOW_MODAL] = useState(false);
  const [INPUT, SET_INPUT] = useState();
  const [SNAPSHOT] = useCollectionOnce(db.collection('userDocs').doc(SESSION?.user.email).collection('docs').orderBy('timestamp', 'desc'));
  if (!SESSION) {
    return <Login />;
  }
  const CREATE_DOCUMENT = () => {
    if (!INPUT) return;
    db.collection('userDocs').doc(SESSION.user.email).collection('docs').add({
      fileName: INPUT,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    SET_INPUT('');
    SET_SHOW_MODAL(false);
  };
  const MODAL = (
    <Modal size="sm" active={SHOW_MODAL} toggler={() => SET_SHOW_MODAL(false)}>
      <ModalBody>
        <input
          type="text"
          value={INPUT}
          onChange={(e) => SET_INPUT(e.target.value)}
          className="outline-none w-full"
          placeholder="Enter name of document..."
          // Syntax like an IF. It will trigger the CREATE_DOCUMENT only if e.key is strictly Enter. Else nothing happens.
          onKeyDown={(e) => e.key === 'Enter' && CREATE_DOCUMENT}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="blue" buttonType="link" onClick={(e) => SET_SHOW_MODAL(false)} ripple="dark">
          Cancel
        </Button>
        {/* Here CREATE_DOCUMENT is called with the parenthesis to avoid its automatic launch. */}
        <Button color="blue" onClick={CREATE_DOCUMENT} ripple="light">
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );
  return (
    <div>
      <Head>
        <title>Google Doc Clone (Unofficial)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {MODAL}
      <Header />
      <section className="bg-gray-50 pb-10 px-10">
        <div className="max-w-3xl mx-auto">
          <div className="py-6 flex items-center justify-between">
            <h2 className="text-gray-700 text-lg">Start a new document</h2>
            <Button color="gray" buttonType="outline" rounded={true} iconOnly={true} ripple="dark" className="border-0">
              <Icon name="more_vert" size="3xl" />
            </Button>
          </div>
          <div>
            <div onClick={() => SET_SHOW_MODAL(true)} className="relative h-52 w-40 border-2 cursor-pointer hover:border-blue-400">
              <Image src="https://links.papareact.com/pju" layout="fill" />
            </div>
            <p className="ml-2 mt-2 font-semibold text-sm text-gray-700">Blank</p>
          </div>
        </div>
      </section>
      <section className="bg-white px-10 lg:px-0">
        <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
          <div className="flex items-center justify-between pb-5">
            <h2 className="font-medium flex-grow">My Documents</h2>
            <p className="mr-12">Date created</p>
            <Icon name="folder" size="3xl" color="gray" />
          </div>

          {SNAPSHOT?.docs.map((doc) => (
            <DocumentRow key={doc.id} id={doc.id} date={doc.data().timestamp} fileName={doc.data().fileName} />
          ))}
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  const SESSION = await getSession(context);
  return {
    props: {
      SESSION,
    },
  };
}
