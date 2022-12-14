import { useState, useContext } from "react";
import classes from "./newnote.module.scss";
import {
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import Modal from "../Modal/Modal";
import { UserContext } from "../../context/userctx";

const NewNote = ({ setAddNote, categories }) => {
  let catCount = 0;
  const [error, setError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCatOptions, setShowCatOptions] = useState(false);
  const [highlightedCatOptionIndex, setHighLightedCatOptionIndex] = useState(0);

  const { currentUser } = useContext(UserContext);

  //choosing select option
  const selectCategory = (option) => {
    if (option !== selectedCategory) setSelectedCategory(option);
  };

  //checking if the category option is currently selected
  const isOptionSelected = (option) => {
    return selectedCategory === option;
  };

  //checking if the option should be highlighted
  const isHighlighted = (id) => {
    return id === highlightedCatOptionIndex;
  };

  const addNewCategoryHandler = async (e) => {
    e.preventDefault();
    setCategoryError(false);
    const newCategory = e.target[0].value;
    if (newCategory === "") {
      setCategoryError("Empty new category name - please fill out the input");
    } else if (newCategory.toUpperCase() === "ADDNEWCATEGORY") {
      setCategoryError("Please choose a different category name.");
    } else {
      //Save category in the firestore
      try {
        await updateDoc(doc(db, "users", currentUser.uid), {
          categories: arrayUnion(newCategory.toLowerCase()),
        });
      } catch (error) {
        setCategoryError(error.message);
      }

      setSelectedCategory(newCategory.toLowerCase());
      setHighLightedCatOptionIndex((prev) => prev + 1);
    }
  };

  const noteSaveHandler = async (e) => {
    e.preventDefault();
    setError(false);

    const title = e.target[0].value;
    const content = e.target[1].value;

    if (title.trim() === "" || content.trim() === "") {
      setError("Please fill out both fields before you save the note.");
      return;
    }

    try {
      const notesCollectionRef = collection(
        db,
        "users",
        currentUser.uid,
        "notes"
      );
      await addDoc(notesCollectionRef, {
        title,
        content,
        category: selectedCategory,
      });
      setAddNote(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Modal>
      <div className={classes.newNote}>
        <div className={classes.corner} />
        <form onSubmit={noteSaveHandler} className={classes.noteForm}>
          <input type="text" placeholder="Title" maxLength={50}></input>
          <textarea
            placeholder="Content"
            maxLength={1000}
            spellCheck="false"
          ></textarea>
          <div className={classes.options}>
            <p className={classes.error}>{error}</p>
            <button className={classes.optionBtn} type="submit">
              Save
            </button>
            <button
              className={classes.optionBtn}
              onClick={() => {
                setAddNote(false);
              }}
            >
              Close
            </button>
          </div>
        </form>
        {selectedCategory === "addNewCategory" ? (
          <form onSubmit={addNewCategoryHandler} className={classes.categories}>
            <label htmlFor="newCat">Enter new category name:</label>
            <input type="text" id="newCat" autoFocus></input>
            <button type="submit" className={classes.optionBtn}>
              add
            </button>
            {categoryError && <p>{categoryError}</p>}
          </form>
        ) : (
          <div className={classes.categories}>
            <label>Choose the category for your note</label>
            <div
              tabIndex={1}
              className={classes.selectContainer}
              onClick={() => {
                setShowCatOptions((showCatOptions) => !showCatOptions);
              }}
              onBlur={() => {
                setShowCatOptions(false);
                setHighLightedCatOptionIndex(0);
              }}
            >
              <span>{selectedCategory}</span>
              <div className={classes.divider}></div>
              <div className={classes.caret}></div>
              <ul
                className={`${classes.options} ${
                  showCatOptions && classes.show
                }`}
              >
                {categories?.map((category, id) => {
                  catCount++;
                  return (
                    <li
                      className={`${classes.option} ${
                        isOptionSelected(category) && classes.selected
                      } ${isHighlighted(id) && classes.highlighted}`}
                      key={id}
                      onClick={() => {
                        selectCategory(category);
                      }}
                      onMouseEnter={() => {
                        setHighLightedCatOptionIndex(id);
                      }}
                    >
                      {category}
                    </li>
                  );
                })}
                <li
                  className={`${classes.option} ${
                    isOptionSelected("") && classes.selected
                  } ${isHighlighted(catCount + 1) && classes.highlighted}`}
                  key={catCount + 1}
                  onClick={() => {
                    selectCategory("");
                  }}
                  onMouseEnter={() => {
                    setHighLightedCatOptionIndex(catCount + 1);
                  }}
                >
                  no category
                </li>
                <li
                  className={`${classes.option} ${
                    isOptionSelected("addNewCategory") && classes.selected
                  } ${isHighlighted(catCount + 2) && classes.highlighted}`}
                  key={catCount + 2}
                  onClick={() => {
                    selectCategory("addNewCategory");
                  }}
                  onMouseEnter={() => {
                    setHighLightedCatOptionIndex(catCount + 2);
                  }}
                >
                  +
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NewNote;
