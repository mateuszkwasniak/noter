import { useState } from "react";
import classes from "./notelist.module.scss";
import Note from "../Note/Note";
import NewNote from "../Newnote/NewNote";

const NoteList = ({ notes, categories, searching }) => {
  const [noteToShow, setNoteToShow] = useState({
    show: false,
    id: "",
    title: "",
    content: "",
    category: "",
  });
  const [addNote, setAddNote] = useState(false);

  const noteClickHandler = (id, title, content, category) => {
    setNoteToShow({ show: true, id, title, content, category });
  };

  return (
    <div className={classes.notelist}>
      {notes?.map((note) => (
        <div
          className={classes.miniNote}
          onClick={noteClickHandler.bind(
            null,
            note.id,
            note.title,
            note.content,
            note.category
          )}
          key={note.id}
        >
          <h2>
            {note.title.length > 20
              ? note.title.substring(0, 15) + "..."
              : note.title}
          </h2>
          <textarea
            style={{ cursor: "pointer" }}
            readOnly
            value={
              note.content.length > 250
                ? note.content.substring(0, 250) + "..."
                : note.content
            }
          ></textarea>
        </div>
      ))}
      {noteToShow.show && (
        <Note noteToShow={noteToShow} setNoteToShow={setNoteToShow} />
      )}
      {!searching && (
        <div
          className={classes.miniNote}
          onClick={() => {
            setAddNote(true);
          }}
        >
          <div>+</div>
        </div>
      )}
      {addNote && <NewNote setAddNote={setAddNote} categories={categories} />}
    </div>
  );
};

export default NoteList;
