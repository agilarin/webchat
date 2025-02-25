import {useReducer, Reducer} from "react";


function useToggle(initialValue: boolean): [boolean, (nextValue?: boolean) => void] {
  return useReducer<Reducer<boolean, any>>((state, nextValue?) => {
    return typeof nextValue === 'boolean' ? nextValue : !state;
  }, initialValue);
}


export default useToggle;