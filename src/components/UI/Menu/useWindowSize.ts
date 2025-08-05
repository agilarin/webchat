import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function useWindowSize() {
  const isClient = typeof window !== "undefined";
  const [size, setSize] = useState({
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
  });
  const debouncedResizeHandler = useDebouncedCallback(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 100);

  useEffect(() => {
    debouncedResizeHandler();
    window.addEventListener("resize", debouncedResizeHandler);
    return () => window.removeEventListener("resize", debouncedResizeHandler);
  }, [debouncedResizeHandler]);

  return size;
}
