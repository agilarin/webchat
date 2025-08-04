import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { X as XIcon } from "lucide-react";

import classes from "./SearchInput.module.scss";

interface SearchInputProps {
  onChange: (value: string) => void;
}

export function SearchInput({ onChange }: SearchInputProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  const handleClose = () => {
    setValue("");
    onChange("");
  };

  return (
    <div className={classes.search}>
      <SearchIcon
        size={20}
        className={classes.iconSearch}
      />
      <input
        className={classes.input}
        type="text"
        placeholder="Поиск..."
        onChange={handleChange}
        value={value}
      />
      {!!value && (
        <button
          className={classes.buttonClose}
          onClick={handleClose}
        >
          <XIcon size={20} />
        </button>
      )}
    </div>
  );
}
