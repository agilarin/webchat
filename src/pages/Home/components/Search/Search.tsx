import { ChangeEvent, useState } from "react";
import clsx from "clsx";
import { Search as SearchIcon } from "lucide-react";
import { X as XIcon } from "lucide-react";

import { SearchContent } from "./components/SearchContent";
import classes from "./Search.module.scss";

export function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleClose = () => {
    setSearchQuery("");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={clsx(classes.root, searchQuery && classes.active)}>
      <div className={classes.searchContainer}>
        <div className={classes.search}>
          <SearchIcon
            size={20}
            className={classes.iconSearch}
          />
          <input
            className={classes.input}
            type="text"
            placeholder={"Search"}
            onChange={handleSearchChange}
            value={searchQuery}
          />
          {!!searchQuery && (
            <button
              className={classes.buttonClose}
              onClick={handleClose}
            >
              <XIcon size={20} />
            </button>
          )}
        </div>
      </div>

      {searchQuery && <SearchContent searchQuery={searchQuery} />}
    </div>
  );
}
