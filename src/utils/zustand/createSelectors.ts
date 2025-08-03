import { StoreApi, useStore as zustandUseStore } from "zustand";

type WithSelectors<
  S extends StoreApi<object>,
  R = ReturnType<S["getState"]>
> = S & {
  use: { [K in keyof R]: () => R[K] };
};

export function createSelectors<T extends object, S extends StoreApi<T>>(
  store: S
): WithSelectors<S> {
  type State = ReturnType<S["getState"]>;

  const typedStore = store as WithSelectors<S>;
  typedStore.use = {} as { [K in keyof State]: () => State[K] };

  const state = store.getState() as State;
  const keys = Object.keys(state) as Array<keyof State>;

  for (const key of keys) {
    typedStore.use[key] = (() =>
      zustandUseStore(
        store,
        (s) => s[key as keyof typeof s]
      )) as () => State[typeof key];
  }

  return typedStore;
}
