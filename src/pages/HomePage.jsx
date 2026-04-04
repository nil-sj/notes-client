import { useState, useEffect } from 'react'
import { getNotes }     from '../api/notesApi'
import { getCategories } from '../api/categoriesApi'
import NoteCard    from '../components/notes/NoteCard'
import CategoryBadge from '../components/categories/CategoryBadge'
import Pagination  from '../components/common/Pagination'
import Spinner     from '../components/common/Spinner'
import styles      from './HomePage.module.css'

function HomePage() {
  const [notes,      setNotes]      = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedTag,      setSelectedTag]      = useState('')
  const [tagInput,         setTagInput]         = useState('')
  const [page,             setPage]             = useState(1)

  // fetch categories once on mount
  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data))
      .catch(() => {})   // non-critical — filters just won't show
  }, [])

  // fetch notes whenever filters or page change
  useEffect(() => {
    setLoading(true)
    setError(null)

    const params = { page, limit: 9 }
    if (selectedCategory) params.category = selectedCategory
    if (selectedTag)      params.tag      = selectedTag

    getNotes(params)
      .then(res => {
        setNotes(res.data.notes)
        setPagination(res.data.pagination)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [page, selectedCategory, selectedTag])

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId)
    setPage(1)
  }

  const handleTagSearch = (e) => {
    e.preventDefault()
    setSelectedTag(tagInput.trim().toLowerCase())
    setPage(1)
  }

  const handleClearFilters = () => {
    setSelectedCategory(null)
    setSelectedTag('')
    setTagInput('')
    setPage(1)
  }

  const hasActiveFilters = selectedCategory || selectedTag

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1>Discover notes</h1>
        <p>Browse notes shared by the community</p>
      </div>

      {/* filters */}
      <div className={styles.filters}>
        {categories.length > 0 && (
          <div className={styles.categoryFilters}>
            {categories.map(cat => (
              <CategoryBadge
                key={cat._id}
                category={cat}
                selected={selectedCategory === cat._id}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        )}

        <form onSubmit={handleTagSearch} className={styles.tagSearch}>
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            placeholder="Search by tag..."
            className={styles.tagInput}
          />
          <button type="submit" className={styles.tagBtn}>Search</button>
        </form>

        {hasActiveFilters && (
          <button onClick={handleClearFilters} className={styles.clearBtn}>
            Clear filters
          </button>
        )}
      </div>

      {/* active filter indicators */}
      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          {selectedCategory && (
            <span className={styles.filterChip}>
              Category: {categories.find(c => c._id === selectedCategory)?.name}
              <button onClick={() => { setSelectedCategory(null); setPage(1) }}>×</button>
            </span>
          )}
          {selectedTag && (
            <span className={styles.filterChip}>
              Tag: #{selectedTag}
              <button onClick={() => { setSelectedTag(''); setTagInput(''); setPage(1) }}>×</button>
            </span>
          )}
        </div>
      )}

      {/* results */}
      {loading ? (
        <Spinner message="Loading notes..." />
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : notes.length === 0 ? (
        <div className={styles.empty}>
          <p>No notes found.</p>
          {hasActiveFilters && (
            <button onClick={handleClearFilters} className={styles.clearBtn}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {notes.map(note => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
          {pagination && (
            <Pagination pagination={pagination} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  )
}

export default HomePage