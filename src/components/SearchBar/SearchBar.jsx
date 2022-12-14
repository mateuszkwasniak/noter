import classes from "./searchbar.module.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useEffect, useState, useContext } from "react";
import { updateDoc, doc, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { UserContext } from "../../context/userctx";

const SearchBar = ({ notes, categories, setFilteredNotes, setSearching }) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [checkboxContainerHovered, setCheckboxContainerHovered] = useState(-1);
  const { currentUser } = useContext(UserContext);

  const handleCatChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;

    if (checked) {
      setFilteredCategories((prev) => {
        if (prev.includes(value)) return prev;
        else return [...prev, value];
      });
    } else {
      setFilteredCategories((prev) => {
        return prev.filter((cat) => cat !== value);
      });
    }
  };

  const handleCategoryRemoval = async (category) => {
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        categories: arrayRemove(category),
      });
      setCheckboxContainerHovered(-1);
      setFilteredCategories((prev) => {
        return prev.filter((cat) => category !== cat);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (searchValue !== "") {
      const filteredNotes = notes.filter((note) =>
        note.title.toUpperCase().includes(searchValue.toUpperCase())
      );
      if (!filteredCategories.length === 0) {
        const filteredCatNotes = filteredNotes.filter((note) =>
          filteredCategories.includes(note.category)
        );
        setFilteredNotes(filteredCatNotes);
      } else setFilteredNotes(filteredNotes);
      setSearching(true);
    } else {
      if (filteredCategories.length !== 0) {
        const filteredCatNotes = notes.filter((note) => {
          return filteredCategories.includes(note.category);
        });
        setFilteredNotes(filteredCatNotes);
        setSearching(true);
      } else {
        setFilteredNotes(notes);
        setSearching(false);
      }
    }
  }, [notes, setFilteredNotes, searchValue, setSearching, filteredCategories]);

  return (
    <div className={classes.searchWrapper}>
      <div className={classes.searchBar}>
        <input
          type="text"
          placeholder="Search for notes..."
          onChange={(e) => {
            setSearchValue(e.target.value.trim());
          }}
          value={searchValue}
        ></input>
        <SearchOutlinedIcon style={{ fontSize: "3rem", marginRight: "2rem" }} />
      </div>
      <div className={classes.categories}>
        {categories?.map((category, id) => {
          return (
            <div
              key={id}
              className={classes.checkboxContainer}
              onMouseEnter={() => setCheckboxContainerHovered(id)}
              onMouseLeave={() => setCheckboxContainerHovered(-1)}
            >
              <input
                className={classes.checkbox}
                type="checkbox"
                id={id}
                value={category}
                onChange={handleCatChange}
              />
              <label htmlFor={id}>{category}</label>

              <button
                style={{
                  opacity: `${checkboxContainerHovered === id ? "1" : "0"}`,
                }}
                onClick={() => handleCategoryRemoval(category)}
              >
                <CloseOutlinedIcon />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBar;
