import {useCallback, useState} from "react";


export function useScrollSaveOnChange() {
  const [scrollHeight, setScrollHeight] = useState(0);
  const [element, setElement] = useState<Element | null>(null);


  const scrollRef = useCallback((node: Element | null) => setElement(node), [])


  const addScrollSaveEvent = useCallback(() => {
    if (!element) {
      return () => {};
    }

    const handleScroll = () => {
      const scrollTop = Math.abs(element.scrollTop);
      const height = element.getBoundingClientRect().height;

      if (scrollHeight && scrollTop + height > scrollHeight) {
        element.scrollTo(0, -(scrollHeight - height))
      }
      if (scrollHeight !== element.scrollHeight) {
        setScrollHeight(element.scrollHeight)
      }
    }

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll)
  }, [element, scrollHeight])


  return {
    scrollRef,
    addScrollSaveEvent
  };
}