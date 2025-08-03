import { useEffect, useState } from "react";
import { ChatItemWithChat } from "@/pages/Home/components/ChatList/ChatItem";
import classes from "./SearchContent.module.scss";
import { SearchList } from "@/pages/Home/components/Search/components/SearchList";
import {
  useActiveChatStore,
  useCurrentUserStore,
  useUserChatsStore,
} from "@/store";
import { ChatType } from "@/types";

interface SearchContentProps {
  searchQuery: string;
}

export function SearchContent({ searchQuery }: SearchContentProps) {
  const items = useUserChatsStore.use.chats();
  const activeChat = useActiveChatStore.use.chat();
  const userProfile = useCurrentUserStore.use.userProfile();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [blackListUsernames, setBlackListUsernames] = useState<string[]>([]);

  useEffect(() => {
    const newChats = Object.values(items).filter((chat) => {
      return chat.username?.includes(searchQuery);
    });
    const newBlackListUsernames = newChats.map((chat) => {
      return chat.username;
    });
    if (userProfile?.username) {
      newBlackListUsernames.push(userProfile.username);
    }
    setChats(newChats);
    setBlackListUsernames(newBlackListUsernames);
  }, [items, activeChat, userProfile?.username, searchQuery]);

  return (
    <div className={classes.searchContentRoot}>
      <ul className={classes.list}>
        {chats.map((chat) => (
          <ChatItemWithChat
            key={chat.id}
            chatId={chat.id}
          />
        ))}
      </ul>

      <SearchList
        searchQuery={searchQuery}
        blackListUsernames={blackListUsernames}
      />
    </div>
  );
}
