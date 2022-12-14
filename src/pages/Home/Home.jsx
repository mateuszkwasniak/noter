import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userctx";
import { db } from "../../firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import Menu from "../../components/Menu/Menu";
import NoteList from "../../components/Notelist/NoteList";
import SearchBar from "../../components/SearchBar/SearchBar";

import classes from "./home.module.scss";

const Home = () => {
  const { currentUser } = useContext(UserContext);
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searching, setSearching] = useState(false);

  //fetching notes
  useEffect(() => {
    if (currentUser.uid) {
      const unsub2 = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        setCategories(doc.data().categories);
      });

      const unsub1 = onSnapshot(
        collection(db, "users", currentUser.uid, "notes"),
        (notesQuerySnapshot) => {
          const notes = [];
          notesQuerySnapshot.forEach((note) => {
            notes.push({
              id: note.id,
              title: note.data().title,
              content: note.data().content,
              category: note.data().category.toLowerCase(),
            });
          });
          setNotes(notes);
        }
      );
      return () => {
        unsub1();
        unsub2();
      };
    }
  }, [currentUser.uid]);

  return (
    <div className={classes.home}>
      <Menu>
        <SearchBar
          notes={notes}
          categories={categories}
          setFilteredNotes={setFilteredNotes}
          setSearching={setSearching}
        />
      </Menu>
      <NoteList
        notes={filteredNotes}
        categories={categories}
        searching={searching}
      ></NoteList>
    </div>
  );
};

export default Home;
