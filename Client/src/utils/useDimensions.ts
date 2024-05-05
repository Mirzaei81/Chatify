import {useEffect,useState} from "react"

function getWindowDimensions(){
	const  {innerWidth:width,innerHeight:height} = window
	return({
		width,height
	})

}
export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
	// on umounting the obj
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
