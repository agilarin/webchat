import { useEffect, useMemo, useState } from "react";
import { UserType } from "@/types";
import searchService from "@/services/searchService.ts";
import {
  ChatList,
  ChatListSkeleton,
  ChatItem,
} from "@/pages/Home/components/ChatList";
import classes from "./SearchList.module.scss";

interface SearchListProps {
  searchQuery: string;
  blackListUsernames: string[];
}

export function SearchList({
  searchQuery,
  blackListUsernames,
}: SearchListProps) {
  const [searchResult, setSearchResult] = useState<UserType[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!searchQuery) {
      setIsLoading(false);
      return setSearchResult(undefined);
    }
    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      const response = await searchService.searchUsers(searchQuery);
      setSearchResult(response);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchResultFiltered = useMemo(() => {
    setIsLoading(false);
    return (
      searchResult?.filter((user) => {
        return !blackListUsernames.includes(user.username);
      }) || []
    );
  }, [searchResult, blackListUsernames]);

  if (isLoading) {
    return (
      <div className={classes.SearchListRoot}>
        <div className={classes.header}>
          <span className={classes.headerTitle}>Загрузка...</span>
        </div>
        <ChatListSkeleton />
        {/* <ul className={classes.list}>
          <div className="not-scroll">
            {Array(20)
              .fill(0)
              .map((_, i) => (
                <ChatItemSkeleton key={i} />
              ))}
          </div>
        </ul> */}
      </div>
    );
  }

  if (searchResultFiltered?.length) {
    return (
      <div className={classes.SearchListRoot}>
        <div className={classes.header}>
          <span className={classes.headerTitle}>Результаты поиска</span>
        </div>

        <ChatList>
          {searchResultFiltered.map((item) => (
            <ChatItem
              key={item.id}
              title={[item.firstName, item.lastName].join(" ")}
              subtitle={"@" + item.username}
            />
          ))}
        </ChatList>
        {/* <ul className={classes.list}>
          {searchResultFiltered.map((item) => (
            <ChatItem
              key={item.id}
              user={item}
            />
          ))}
        </ul> */}
      </div>
    );
  }

  return (
    <div className={classes.SearchListRoot}>
      <div className={classes.header}>
        <span className={classes.headerTitle}>Результаты поиска</span>
      </div>
      <div className={classes.notFound}>
        <span className={classes.notFoundTitle}>Нет результатов</span>
      </div>
    </div>
  );
}
