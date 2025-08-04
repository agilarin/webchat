import clsx from "clsx";
import { useDebounce } from "use-debounce";

import { useUserChatsStore } from "@/store";
import { SearchInput } from "./components/SearchInput";
import { ExistingChatsList } from "./components/ExistingChatsList";
import { UserSearchList } from "./components/UserSearchList";
import classes from "./Search.module.scss";

export function Search() {
  const [searchQuery, setSearchQuery] = useDebounce("", 300);

  const chats = useUserChatsStore.use.chats();
  const existingChats = Object.values(chats).filter((chat) =>
    chat.username.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className={clsx(classes.root, searchQuery && classes.active)}>
      <div className={classes.searchContainer}>
        <SearchInput onChange={setSearchQuery} />
      </div>

      {searchQuery && (
        <div className={classes.result}>
          <ExistingChatsList chats={existingChats} />
          <UserSearchList
            searchQuery={searchQuery}
            chats={existingChats}
          />
        </div>
      )}
    </div>
  );
}
