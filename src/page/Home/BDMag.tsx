import MoreTitle from '../../components/layout/MoreTitle';
import BDMagItem from './BDMagItem';

const BDMag = () => {
  return (
    <div className='col'>
      <MoreTitle title='애개매거진' />
      <div className='flex justify-between gap-2 pb-[15px]'>
        <BDMagItem />
        <BDMagItem />
      </div>
    </div>
  );
};

export default BDMag;
