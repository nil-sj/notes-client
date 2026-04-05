import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNote, clearNotesError } from "../store/notesSlice";
import NoteForm from "../components/notes/NoteForm";
import styles from "./CreateNotePage.module.css";

function CreateNotePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.notes);

  const handleSubmit = async (formData) => {
    dispatch(clearNotesError());
    const result = await dispatch(addNote(formData));
    if (addNote.fulfilled.match(result)) {
      navigate(`/notes/${result.payload._id}`);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Create a note</h1>
          <p>Your note will be private until you request to publish it</p>
        </div>
        <NoteForm onSubmit={handleSubmit} submitting={loading} error={error} />
      </div>
    </div>
  );
}

export default CreateNotePage;
