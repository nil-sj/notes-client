import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyNotes, removeNote, requestPublish } from "../store/notesSlice";
import Spinner from "../components/common/Spinner";
import Pagination from "../components/common/Pagination";
import { NoteRowSkeleton } from "../components/common/Skeleton";
import styles from "./MyNotesPage.module.css";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Private", value: "private" },
  { label: "Pending", value: "pending" },
  { label: "Public", value: "public" },
];

function MyNotesPage() {
  const dispatch = useDispatch();
  const {
    myItems: notes,
    myPagination: pagination,
    loading,
    error,
  } = useSelector((state) => state.notes);

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (status) params.status = status;
    dispatch(fetchMyNotes(params));
  }, [dispatch, page, status]);

  const handleStatusFilter = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    dispatch(removeNote(id));
  };

  const handlePublish = (id) => {
    dispatch(requestPublish(id));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>My notes</h1>
          <p>Manage and publish your notes</p>
        </div>
        <Link to="/notes/new" className={styles.newBtn}>
          + New note
        </Link>
      </div>

      <div className={styles.tabs}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            className={`${styles.tab} ${status === f.value ? styles.activeTab : ""}`}
            onClick={() => handleStatusFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.list}>
          {Array.from({ length: 5 }).map((_, i) => (
            <NoteRowSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {notes.map((note) => (
              <MyNoteRow
                key={note._id}
                note={note}
                onDelete={handleDelete}
                onPublish={handlePublish}
              />
            ))}
          </div>
          {pagination && (
            <Pagination pagination={pagination} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}

function MyNoteRow({ note, onDelete, onPublish }) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className={styles.row}>
      {note.imageUrl && (
        <img
          src={`http://localhost:5000${note.imageUrl}`}
          alt={note.title}
          className={styles.rowThumb}
        />
      )}
      <div className={styles.rowBody}>
        <div className={styles.rowTop}>
          <Link to={`/notes/${note._id}`} className={styles.rowTitle}>
            {note.title}
          </Link>
          <span className={`${styles.statusBadge} ${styles[note.status]}`}>
            {note.status}
          </span>
        </div>
        <div className={styles.rowMeta}>
          {note.category && (
            <span
              className={styles.category}
              style={{ color: note.category.color }}
            >
              {note.category.name}
            </span>
          )}
          {note.tags?.length > 0 && (
            <span className={styles.tags}>
              {note.tags.map((t) => `#${t}`).join(" ")}
            </span>
          )}
          <span className={styles.date}>{formattedDate}</span>
        </div>
      </div>
      <div className={styles.rowActions}>
        <Link to={`/notes/${note._id}/edit`} className={styles.editBtn}>
          Edit
        </Link>
        {note.status === "private" && (
          <button
            onClick={() => onPublish(note._id)}
            className={styles.publishBtn}
          >
            Publish
          </button>
        )}
        {note.status === "pending" && (
          <span className={styles.pendingBadge}>Pending review</span>
        )}
        <button
          onClick={() => onDelete(note._id, note.title)}
          className={styles.deleteBtn}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default MyNotesPage;
