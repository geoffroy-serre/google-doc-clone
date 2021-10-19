import Icon from '@material-tailwind/react/Icon';

function Custom404() {
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      <Icon name="engineering" size="8xl" color="red" />
      <p className="text-gray-500 font-bold">The page you looking for doesn't exist</p>
      <a href="../" className="text-red-500 p-20 font-semibold">
        Back Home
      </a>
    </div>
  );
}

export default Custom404;
