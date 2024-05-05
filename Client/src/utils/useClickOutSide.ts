import { useState, useEffect } from 'react';

const useClickOutside = (ref:React.MutableRefObject<HTMLElement>) => {

  const [isOutside, setIsOutside] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (!ref.current.contains(event.target)) {
        setIsOutside(true);
      } else {
        setIsOutside(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref]);

  return isOutside;
};
export default useClickOutside
