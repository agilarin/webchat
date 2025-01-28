import {useCallback, useEffect, useState} from "react";



function useChangeScrollHeight() {
  const [scrollHeight, setScrollHeight] = useState(0);
  const [element, setElement] = useState<Element | null>(null);
  const [observedElement, setObservedElement] = useState<Element | null>(null);


  const scrollRef = useCallback((node: Element | null) => setElement(node), [])
  const heightRef = useCallback((node: Element | null) => setObservedElement(node), [])


  useEffect(() => {
    const observer = new ResizeObserver(([entry] ) => {
      if (!element) {
        return;
      }
      const scrollTop = Math.abs(element.scrollTop);
      const height = element.getBoundingClientRect().height;

      if (scrollHeight && scrollTop + height > scrollHeight) {
        element.scrollTo(0, -(scrollHeight - height))
      }
      if (scrollHeight !== entry.target.scrollHeight) {
        setScrollHeight(entry.target.scrollHeight)
      }
    })

    if (!observedElement) {
      return;
    }
    observer.observe(observedElement);
    return () => observer.unobserve(observedElement);

    // function checkScroll() {
    // if (!element) {
    //   return;
    // }
    // const scrollTop = Math.abs(element.scrollTop);
    // const height = element.getBoundingClientRect().height;
    //
    // if (scrollHeight && scrollTop + height > scrollHeight) {
    //   element.scrollTo(0, scrollHeight - height)
    // }
    // if (scrollHeight !== element.scrollHeight) {
    //   setScrollHeight(element.scrollHeight)
    // }
    // }

    // element?.addEventListener("scroll", checkScroll);
    // return () => element?.removeEventListener("scroll", checkScroll)
  }, [element, observedElement, scrollHeight]);


  return {
    scrollRef,
    heightRef
  };
}


export default useChangeScrollHeight;