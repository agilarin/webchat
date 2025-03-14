import {useEffect, useState} from "react";
import {useUserChatsContext} from "@/hooks/useUserChatsContext.ts";
import {useChatContext} from "@/hooks/useChatContext.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {ChatItem} from "@/pages/Home/components/ChatItem";
import classes from "./SearchContent.module.scss";
import {SearchResultList} from "@/pages/Home/components/Search/components/SearchResultList";



interface SearchContentProps {
  searchQuery: string
}

export function SearchContent({searchQuery}: SearchContentProps) {
  const {items} = useUserChatsContext();
  const {activeChat} = useChatContext();
  const {userInfo} = useAuthContext();
  const [chats, setChats] = useState<any[]>([]);
  const [blackListUsernames, setBlackListUsernames] = useState<string[]>([]);



  useEffect(() => {
    const newChats = items.filter(({chat}) => {
      return (chat.username || chat.user?.username)?.includes(searchQuery)
    })
    const newBlackListUsernames = newChats.map(({chat}) => {
      return chat.username || chat.user?.username as string;
    })
    if (userInfo?.username) {
      newBlackListUsernames.push(userInfo.username);
    }
    setChats(newChats);
    setBlackListUsernames(newBlackListUsernames);
  }, [items, activeChat, userInfo]);


  return (
    <div className={classes.searchContentRoot}>
      <ul className={classes.list}>
        {chats.map(({chat, lastMessage, unreadCount}) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            lastMessage={lastMessage}
            count={unreadCount}
            active={chat.id === activeChat?.id}
          />
        ))}
      </ul>

      <SearchResultList
        searchQuery={searchQuery}
        blackListUsernames={blackListUsernames}
      />
    </div>
  );
}