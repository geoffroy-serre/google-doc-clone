import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import { useRouter } from 'next/dist/client/router';

function DocumentRow({ id, date, fileName }) {
  const ROUTER = useRouter();
  return (
    <div onClick={() => ROUTER.push(`/doc/${id}`)} className="flex items-center pt-2 pb-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer">
      <Icon name="article" size="3xl" color="blue" />
      <p className="flex-grow pl-5 w-10 pr-10 truncate">{fileName}</p>
      {/* Date is converted to string to avoid an Object error message */}
      <p className="pr-10 text-sm">{date?.toDate().toLocaleDateString()}</p>

      <Button color="gray" buttonType="outline" rounded={true} iconOnly={true} ripple="dark" className="border-0">
        <Icon name="more_vert" size="3xl" />
      </Button>
    </div>
  );
}

export default DocumentRow;
