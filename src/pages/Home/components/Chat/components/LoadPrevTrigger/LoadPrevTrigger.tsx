import {useEffect} from "react";
import {useInView} from "@/hooks/useInView.ts";
import classes from "./LoadPrevTrigger.module.scss";


interface LoadPrevTriggerProps {
  rootElement: Element | null,
  onVisible: (visible: boolean) => void,
}

export function LoadPrevTrigger({ rootElement, onVisible }: LoadPrevTriggerProps) {
  const {ref, rootRef, isVisible} = useInView({ rootMargin: "1000px" });


  useEffect(() => {
  rootRef(rootElement)
  }, [rootElement])


  useEffect(() => {
    onVisible(isVisible)
  }, [isVisible])


  return (
    <div
      ref={ref}
      className={classes.loadPrevRoot}
    />
  );
}