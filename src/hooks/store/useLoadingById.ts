import { useReadStatusesStore } from "@/store";

type LoadingState = Record<string, boolean | undefined>;

function generateUseLoadingById<T>(
  useStore: <R>(selector: (state: T) => R) => R,
  selectorKey: keyof T
) {
  return function useLoadingById(id?: string) {
    return useStore((state) => {
      if (!id) return;
      const loadingObj = state[selectorKey] as LoadingState;
      return loadingObj?.[id] ?? false;
    });
  };
}

export const useReadStatusLoading = generateUseLoadingById(
  useReadStatusesStore,
  "readStatusesLoading"
);
