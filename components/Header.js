import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import { signOut, useSession } from 'next-auth/client';

function Header() {
  const [SESSION] = useSession();
  return (
    <header className="flex items-center sticky z-50 top-0 px-4 py-2 shadow-md bg-white">
      <Button color="gray" buttonType="outline" ripple="dark" rounded={true} iconOnly={true} className="h-20 w-20 border-0">
        <Icon name="menu" size="3xl" />
      </Button>
      <Icon name="description" size="5xl" color="blue" />
      <h1 className="hidden md:inline-flex ml-2 text-gray-700 text-2xl">Docs</h1>
      <div className="flex flex-grow items-center mx-5 md:mx-20 px-5 py-2 bg-gray-100 text-gray-600 rounded-lg focus-within:text-gray-600 focus-within:shadow-md">
        <Icon name="search" size="3xl" color="gray" />
        <input type="text" placeholder="Search" className="flex-grow px-5 text-base bg-transparent outline-none" />
      </div>
      <Button color="gray" buttonType="outline" rounded={true} iconOnly={true} ripple="dark" className="hidden md:inline-flex ml-5 md:ml-20 h-20 w-20 border-0">
        <Icon name="apps" size="3xl" color="gray" />
      </Button>
      <img loading="lazy" onClick={signOut} className="cursor-pointer h-12 w-12 rounded-full ml-2" src={SESSION?.user?.image} alt="Log out" />
    </header>
  );
}

export default Header;
