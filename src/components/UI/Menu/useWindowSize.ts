import {useEffect, useState} from "react";
import {debounce} from "@/utils/debounce.ts";


export function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);


  useEffect(() => {
    const debouncedResizeHandler = debounce(() => {
      setSize([window.innerWidth, window.innerHeight]);
    }, 100);

    window.addEventListener('resize', debouncedResizeHandler);
    return () => window.removeEventListener('resize', debouncedResizeHandler);
  }, []);


  return size;
}