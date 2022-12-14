import { useState, useContext } from "react";
import { UserContext } from "../../context/userctx";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

import Modal from "../Modal/Modal";
import classes from "./note.module.scss";

const Note = ({ noteToShow, setNoteToShow }) => {
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const { currentUser } = useContext(UserContext);

  const closeModal = () => {
    setNoteToShow({
      show: false,
      id: "",
      title: "",
      content: "",
      category: "",
    });
  };

  //Saving note
  const noteSaveHandler = async (e) => {
    e.preventDefault();
    setError(false);

    const title = e.target[0].value;
    const content = e.target[1].value;

    if (title === noteToShow.title && content === noteToShow.content) {
      closeModal();
      return;
    }

    if (title.trim() === "" || content.trim() === "") {
      setError("Please fill out both fields before you save the note.");
      return;
    }

    try {
      const noteRef = doc(
        db,
        "users",
        currentUser?.uid,
        "notes",
        noteToShow.id
      );
      await updateDoc(noteRef, {
        title,
        content,
      });
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  //deleteNote
  const deleteNote = async () => {
    setError(false);
    const noteRef = doc(db, "users", currentUser?.uid, "notes", noteToShow.id);
    try {
      await deleteDoc(noteRef);
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Modal>
      <div className={classes.note}>
        <div className={classes.corner} />
        {edit ? (
          <form onSubmit={noteSaveHandler} className={classes.wrapper}>
            <div className={classes.titleControl}>
              <input
                className={classes.title}
                type="text"
                autoFocus={true}
                maxLength={50}
                defaultValue={noteToShow.title}
              ></input>
            </div>
            <textarea
              className={classes.content}
              placeholder="Content"
              maxLength={1000}
              defaultValue={noteToShow.content}
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
                  setEdit(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className={classes.wrapper}>
            <div className={classes.titleControl}>
              <h2 className={classes.title}>{noteToShow.title}</h2>
            </div>
            <textarea
              className={classes.content}
              readOnly
              value={noteToShow.content}
            ></textarea>
            {noteToShow.category !== "" && (
              <div className={classes.category}>
                <span>category: {noteToShow.category}</span>
              </div>
            )}

            <div className={classes.options}>
              <button
                className={classes.optionBtn}
                onClick={() => {
                  setEdit(true);
                }}
              >
                Edit
              </button>
              <button
                className={classes.optionBtn}
                onClick={() => {
                  setDeletePopUp(true);
                }}
              >
                Delete
              </button>
              <button className={classes.optionBtn} onClick={closeModal}>
                Close
              </button>
            </div>
            {deletePopUp && (
              <div className={classes.deletePopUp}>
                <h3>Are you sure, you want to delete this note permanently?</h3>
                <div>
                  <button onClick={deleteNote}>Yes</button>
                  <button
                    onClick={() => {
                      setDeletePopUp(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Note;
