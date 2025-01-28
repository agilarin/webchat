import {Ref, MutableRefObject} from "react";


export function combineRefs(...refs: Ref<Element | null>[]) {
  return (node: Element | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        (ref as MutableRefObject<Element | null>).current = node;
      }
    });
  }
}