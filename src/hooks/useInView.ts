import {useCallback, useEffect, useState} from "react";


interface CustomIntersectionObserverInit extends Omit<IntersectionObserverInit, "root"> {}

export function useInView(options?: CustomIntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const [target, setTarget] = useState<Element | null>(null);
  const [root, setRoot] = useState<Element | null>(null);


  const ref = useCallback((node: Element | null) => setTarget(node), [])
  const rootRef = useCallback((node: Element | null) => setRoot(node), [])


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, {
        root: root,
        rootMargin: options?.rootMargin,
        threshold: options?.threshold,
      }
    );

    if (!target) {
      return;
    }
    observer.observe(target)
    return () => observer.unobserve(target)
  }, [target, root, options])


  return {
    ref,
    rootRef,
    isVisible
  }
}