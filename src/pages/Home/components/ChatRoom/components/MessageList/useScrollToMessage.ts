// import { useReadStatusLoading } from "@/hooks/store/useLoadingById";
// import { useReadStatus } from "@/hooks/store/useReadStatus";
import { Message } from "@/types";
import { useCallback } from "react";
import { VirtuosoHandle } from "react-virtuoso";

interface ScrollToMessageByIdParams {
  id: string;
  align?: "start" | "center" | "end";
  behavior?: "smooth" | "auto";
}

interface Options {
  messages: Message[];
  virtuosoRef: React.RefObject<VirtuosoHandle>;
  firstItemIndex: number;
  chatId?: string;
}

export function useScrollToMessage({
  messages,
  virtuosoRef,
  firstItemIndex,
}: Options) {
  // const { lastReadMessageId } = useReadStatus(chatId);
  // const readStatusLoading = useReadStatusLoading(chatId);

  // const didScrollOnMountRef = useRef(false);

  // useLayoutEffect(() => {
  // didScrollOnMountRef.current = false;
  // }, [chatId]);

  const scrollToMessageById = useCallback(
    ({ id, align, behavior = "auto" }: ScrollToMessageByIdParams) => {
      const index = messages.findIndex((m) => m.id === id);
      if (index === -1) return;
      console.log(
        firstItemIndex,
        index,
        firstItemIndex + index,
        messages,
        virtuosoRef
      );
      virtuosoRef.current?.scrollToIndex({
        index: firstItemIndex + index,
        align,
        behavior,
      });
    },
    [messages, firstItemIndex, virtuosoRef]
  );

  const scrollToLast = useCallback(() => {
    if (!messages.length) return;
    virtuosoRef.current?.scrollToIndex({
      index: firstItemIndex + messages.length - 1,
      align: "start",
      behavior: "auto",
    });
  }, [messages, firstItemIndex, virtuosoRef]);

  // const scrollToMessageOnMount = useCallback(() => {
  //   console.log("scrollToMessageOnMount", didScrollOnMountRef.current);
  //   if (
  //     didScrollOnMountRef.current ||
  //     !lastReadMessageId ||
  //     readStatusLoading !== false ||
  //     !messages.length ||
  //     !virtuosoRef.current
  //   ) {
  //     return;
  //   }

  //   scrollToMessageById({
  //     id: lastReadMessageId,
  //     align: "start",
  //     behavior: "auto",
  //   });
  //   didScrollOnMountRef.current = true;
  // }, [
  //   lastReadMessageId,
  //   readStatusLoading,
  //   messages,
  //   scrollToMessageById,
  //   chatId,
  // ]);

  return {
    scrollToMessageById,
    // scrollToMessageOnMount,
    scrollToLast,
  };
}
