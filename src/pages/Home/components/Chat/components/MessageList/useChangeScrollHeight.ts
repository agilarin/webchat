import {useCallback, useEffect, useState} from "react";
// import {debounce} from "@/utils/debounce.ts";



function useChangeScrollHeight() {
  const [scrollHeight, setScrollHeight] = useState(0);
  const [element, setElement] = useState<Element | null>(null);
  const [observedElement, setObservedElement] = useState<Element | null>(null);


  const scrollRef = useCallback((node: Element | null) => setElement(node), [])
  const scrollInnerRef = useCallback((node: Element | null) => setObservedElement(node), [])


  useEffect(() => {
    if (!element) {
      return;
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

    const observer = new ResizeObserver(handleScroll);

    if (!observedElement) {
      return;
    }
    observer.observe(observedElement);
    return () => observer.unobserve(observedElement);


    // if (!element) {
    //   return;
    // }
    //
    // const handleScroll = debounce(() => {
    //   const scrollTop = Math.abs(element.scrollTop);
    //   const height = element.getBoundingClientRect().height;
    //
    //   if (scrollHeight && scrollTop + height > scrollHeight) {
    //     element.scrollTo(0, -(scrollHeight - height))
    //   }
    //   if (scrollHeight !== element.scrollHeight) {
    //     setScrollHeight(element.scrollHeight)
    //   }
    // }, 500)
    //
    // element?.addEventListener("scroll", handleScroll);
    // return () => element?.removeEventListener("scroll", handleScroll)
  // }, [element, scrollHeight]);

  }, [element, observedElement, scrollHeight]);


  return {
    scrollRef,
    scrollInnerRef
  };
}


export default useChangeScrollHeight;


// console.group()
// console.log("scrollHeight - height", -(scrollHeight - height))
// console.log("scrollTop", element.scrollTop)
// console.log("scrollHeight", scrollHeight)
// console.log("scrollTop + height", scrollTop + height)
// console.log("scrollTop", scrollTop)
// console.log("height", height)
// console.groupEnd()