import {ChangeEvent, useEffect, useState} from "react";
import clsx from "clsx";
import {UserType} from "@/types";
import searchService from "@/services/searchService.ts";
import {ChatsList} from "@/pages/Home/components/ChatsList";
import classes from "./Search.module.scss";
import SearchIcon from "@/assets/icons/search.svg?react"


function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<UserType[]>();
  const [isSuccess, setIsSuccess] = useState(false);


  useEffect(() => {
    if (!searchQuery) {
      setIsSuccess(true)
      return setSearchResult(undefined);
    }

    const timeoutId = setTimeout(async () => {
      const response = await searchService.searchUsers({query: searchQuery})
      setSearchResult(response);
      setIsSuccess(true)
    }, 700);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);


  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }


  return (
    <div className={clsx(classes.root, searchQuery && classes.active)}>
      <div className={classes.searchContainer}>
        <div className={classes.search}>
          <SearchIcon className={classes.icon}/>
          <input
            className={classes.input}
            type="text"
            placeholder={"Search"}
            onChange={handleSearchChange}
            value={searchQuery}
          />
        </div>
      </div>


      <div className={classes.content}>
        <ChatsList users={searchResult} isSuccess={isSuccess}/>
      </div>
    </div>
  );
}

export default Search;