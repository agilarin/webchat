import {ChangeEvent, useState} from "react";
import clsx from "clsx";
import {SearchContent} from "./components/SearchContent";
import classes from "./Search.module.scss";
import SearchIcon from "@/assets/icons/search.svg?react";
import CloseIcon from "@/assets/icons/close.svg?react";


export function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleClose = () => {
    setSearchQuery("");
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }


  return (
    <div className={clsx(classes.root, searchQuery && classes.active)}>
      <div className={classes.searchContainer}>
        <div className={classes.search}>
          <SearchIcon className={classes.iconSearch}/>
          <input
            className={classes.input}
            type="text"
            placeholder={"Search"}
            onChange={handleSearchChange}
            value={searchQuery}
          />
          {!!searchQuery && (
            <button
              className={classes.btnClose}
              onClick={handleClose}
            >
              <CloseIcon className={classes.iconClose}/>
            </button>
          )}
        </div>
      </div>

      {searchQuery && (
        <SearchContent searchQuery={searchQuery}/>
      )}
    </div>
  );
}