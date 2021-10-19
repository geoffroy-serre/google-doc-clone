import TextEditor from '../../components/TextEditor';
import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import { useRouter } from 'next/dist/client/router';
import { db } from '../../firebase';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { getSession, useSession, signOut } from 'next-auth/client';
import Login from '../../components/Login';

function Doc() {
  const [SESSION] = useSession();
  const ROUTER = useRouter();
  const { ID } = ROUTER.query;
  const [SNAPSHOT, LOADING_SNAPSHOT] = useDocumentOnce(db.collection('userDocs').doc(SESSION?.user.email).collection('docs').doc(ID));

  !SESSION && <Login />;
  if (!LOADING_SNAPSHOT && !SNAPSHOT?.data()?.fileName) {
    ROUTER.replace('/');
  }

  // or use
  //if(!SESSION) return <Login/>;
  // or use
  //   if (!SESSION) {
  //     return <Login />;
  //   }

  return (
    <div>
      <header className="flex justify-between items-center p-3 pb-1">
        <span onClick={() => ROUTER.push('/')} className="cursor-pointer">
          <Icon name="description" size="5xl" color="blue" />
        </span>
        <div className="flex-grow px-2">
          <h2 className="truncate w-80 md:w-full font-semibold">{SNAPSHOT?.data()?.fileName}</h2>
          <div className="flex items-center font-[800] text-smspace-x-1 -ml-1 h-8 text-gray-600">
            <p className="option">File</p>
            <p className="option">Edit</p>
            <p className="option">View</p>
            <p className="option">Insert</p>
            <p className="option">Format</p>
            <p className="option">Tools</p>
          </div>
        </div>
        <Button color="lightBlue" ripple="light" buttonType="filled" size="regular" className="hidden md:!inline-flex h-10" rounded={false} block={false} iconOnly={false}>
          <Icon name="people" size="md" />
          SHARE
        </Button>
        <img className="cursor-pointer rounded-full h-10 w-10 ml-2" src={SESSION?.user.image} alt="user image" />
      </header>

      <TextEditor />
    </div>
  );
}

export default Doc;

export async function getServerSideProps(context) {
  const SESSION = await getSession(context);
  return {
    props: {
      SESSION,
    },
  };
}
