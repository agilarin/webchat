import classes from "./SearchResultList.module.scss";
import {useEffect, useMemo, useState} from "react";
import {UserType} from "@/types";
import searchService from "@/services/searchService.ts";
import {ChatItem, ChatItemSkeleton} from "@/pages/Home/components/ChatItem";


interface SearchResultListProps {
  searchQuery: string,
  blackListUsernames: string[],
}

export function SearchResultList({searchQuery, blackListUsernames}: SearchResultListProps) {
  const [searchResult, setSearchResult] = useState<UserType[]>();
  // const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log(isLoading)

  useEffect(() => {
    if (!searchQuery) {
      setIsLoading(false)
      return setSearchResult(undefined);
    }
    setIsLoading(true)
    const timeoutId = setTimeout(async () => {
      const response = await searchService.searchUsers({query: searchQuery})
      setSearchResult(response);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);



  const searchResultFiltered = useMemo(() => {
    setIsLoading(false)
    return searchResult?.filter((user) => {
      return !blackListUsernames.includes(user.username)
    }) || [];
  }, [searchResult, blackListUsernames]);


  if (isLoading) {
    return (
      <div className={classes.searchResultListRoot}>
        <div className={classes.header}>
          <span className={classes.headerTitle}>
            Загрузка...
          </span>
        </div>
        <ul className={classes.list}>
          <div className="not-scroll">
            {Array(20).fill(0).map((_, i) => (
              <ChatItemSkeleton key={i}/>
            ))}
          </div>
        </ul>
      </div>
    );
  }


  if (searchResultFiltered?.length) {
    return (
      <div className={classes.searchResultListRoot}>
        <div className={classes.header}>
          <span className={classes.headerTitle}>
            Результаты поиска
          </span>
        </div>

        <ul className={classes.list}>
          {searchResultFiltered.map(item => (
            <ChatItem
              key={item.id}
              user={item}
            />
          ))}
        </ul>
      </div>
    );
  }


  return (
    <div className={classes.searchResultListRoot}>
      <div className={classes.header}>
        <span className={classes.headerTitle}>
          Результаты поиска
        </span>
      </div>
      <div className={classes.notFound}>
        <span className={classes.notFoundTitle}>Нет результатов</span>
      </div>
    </div>
  );
}