import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchNoteById,
  removeNote,
  requestPublish,
  clearCurrentNote,
} from "../store/notesSlice";
import Spinner from "../components/common/Spinner";
import styles from "./NoteDetailPage.module.css";

function NoteDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentNote: note,
    loading,
    error,
  } = useSelector((state) => state.notes);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchNoteById(id));
    return () => dispatch(clearCurrentNote());
  }, [dispatch, id]);

  const isOwner = user && note && user.id === note.createdBy?._id;

  const handleDelete = async () => {
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    const result = await dispatch(removeNote(id));
    if (removeNote.fulfilled.match(result)) {
      toast.success("Note deleted");
      navigate("/my-notes");
    } 
  };

  const handlePublish = async () => {
    const result = await dispatch(requestPublish(id));
    if (requestPublish.fulfilled.match(result)) {
      toast.success("Note submitted for review");
    }
  };

  const formattedDate = note
    ? new Date(note.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (loading) return <Spinner message="Loading note..." />;

  if (error)
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <p>{error}</p>
          <Link to="/" className={styles.backLink}>
            ← Back to home
          </Link>
        </div>
      </div>
    );

  if (!note) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          ← Back to notes
        </Link>

        {note.imageUrl && (
          <img
            src={`http://localhost:5000${note.imageUrl}`}
            alt={note.title}
            className={styles.coverImage}
          />
        )}

        <div className={styles.header}>
          {note.category && (
            <div className={styles.category}>
              {note.category.iconUrl && (
                <img
                  src={`http://localhost:5000${note.category.iconUrl}`}
                  alt={note.category.name}
                  className={styles.categoryIcon}
                />
              )}
              <span
                className={styles.categoryName}
                style={{
                  backgroundColor: note.category.color + "22",
                  color: note.category.color,
                }}
              >
                {note.category.name}
              </span>
            </div>
          )}
          <span className={`${styles.status} ${styles[note.status]}`}>
            {note.status}
          </span>
        </div>

        <h1 className={styles.title}>{note.title}</h1>

        <div className={styles.meta}>
          <span>By {note.createdBy?.name || "Unknown"}</span>
          <span className={styles.dot}>·</span>
          <span>{formattedDate}</span>
        </div>

        {note.content && (
          <div className={styles.content}>
            {note.content
              .split("\n")
              .map((para, i) =>
                para.trim() ? <p key={i}>{para}</p> : <br key={i} />,
              )}
          </div>
        )}

        {note.tags?.length > 0 && (
          <div className={styles.tags}>
            {note.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {isOwner && (
          <div className={styles.actions}>
            <Link to={`/notes/${id}/edit`} className={styles.editBtn}>
              Edit note
            </Link>
            {note.status === "private" && (
              <button onClick={handlePublish} className={styles.publishBtn}>
                Request publish
              </button>
            )}
            {note.status === "pending" && (
              <span className={styles.pendingNote}>
                Awaiting admin approval
              </span>
            )}
            <button
              onClick={handleDelete}
              disabled={loading}
              className={styles.deleteBtn}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteDetailPage;
