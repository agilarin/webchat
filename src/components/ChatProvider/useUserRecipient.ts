import {Dispatch, SetStateAction, useEffect} from "react";
import {ChatType} from "@/types";
import {subscribeToUserStatusOnline} from "@/services/presenceService.ts";



interface UseUserRecipientProps {
  recipientId?: string,
  setCurrentChat:  Dispatch<SetStateAction<ChatType | null>>
}

export function useUserRecipient({recipientId, setCurrentChat}: UseUserRecipientProps) {


  useEffect(() => {
    if (!recipientId) {
      return;
    }
    const unsub = subscribeToUserStatusOnline(recipientId, (isOnline, lastOnline) => {
      setCurrentChat(prev => {
        if (prev?.user) {
          prev.user.isOnline = isOnline;
          prev.user.lastOnline = lastOnline;
        }
        return prev;
      })
    })

    return () => unsub()
  }, [recipientId]);
}