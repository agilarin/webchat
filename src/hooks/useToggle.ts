import {useReducer, Reducer} from "react";



export function useToggle(initialValue: boolean): [boolean, (nextValue?: boolean) => void] {
  return useReducer<Reducer<boolean, any>>((state, nextValue?) => {
    return typeof nextValue === 'boolean' ? nextValue : !state;
  }, initialValue);
}