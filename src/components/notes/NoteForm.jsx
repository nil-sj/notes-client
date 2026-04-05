import { useState } from 'react'
import { useGetCategoriesQuery } from '../../store/categoriesApi'
import styles from './NoteForm.module.css'

function NoteForm({ initialData = {}, onSubmit, submitting, error }) {
  const [formData, setFormData] = useState({
    title:    initialData.title    || '',
    content:  initialData.content  || '',
    category: initialData.category?._id || initialData.category || '',
    tags:     initialData.tags     || [],
  })
  const [tagInput,     setTagInput]     = useState('')
  const [imageFile,    setImageFile]    = useState(null)
  const [imagePreview, setImagePreview] = useState(
    initialData.imageUrl
      ? `http://localhost:5000${initialData.imageUrl}`
      : null
  )

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    const tag = tagInput.trim().toLowerCase()
    if (!tag || formData.tags.includes(tag)) return
    setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove),
    }))
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') handleAddTag(e)
    if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
      handleRemoveTag(formData.tags[formData.tags.length - 1])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('title',    formData.title)
    data.append('content',  formData.content)
    data.append('category', formData.category)
    formData.tags.forEach(tag => data.append('tags', tag))
    if (imageFile) data.append('image', imageFile)
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      {/* title */}
      <div className={styles.field}>
        <label htmlFor="title">
          Title <span className={styles.required}>*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Give your note a title"
          required
          autoFocus
        />
      </div>

      {/* category */}
      <div className={styles.field}>
        <label htmlFor="category">
          Category <span className={styles.required}>*</span>
        </label>
        {categoriesLoading ? (
          <div className={styles.selectSkeleton} />
        ) : (
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* content */}
      <div className={styles.field}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your note here..."
          rows={8}
        />
      </div>

      {/* tags */}
      <div className={styles.field}>
        <label>Tags</label>
        <div className={styles.tagInputWrap}>
          {formData.tags.map(tag => (
            <span key={tag} className={styles.tagChip}>
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className={styles.tagRemove}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={formData.tags.length === 0 ? 'Add tags...' : ''}
            className={styles.tagTextInput}
          />
        </div>
        <p className={styles.hint}>
          Press Enter to add a tag, Backspace to remove the last one
        </p>
      </div>

      {/* image */}
      <div className={styles.field}>
        <label>Cover image</label>
        <div className={styles.imageUpload}>
          {imagePreview ? (
            <div className={styles.imagePreviewWrap}>
              <img
                src={imagePreview}
                alt="Preview"
                className={styles.imagePreview}
              />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null) }}
                className={styles.removeImage}
              >
                Remove image
              </button>
            </div>
          ) : (
            <label className={styles.uploadLabel} htmlFor="image">
              <span className={styles.uploadIcon}>+</span>
              <span>Click to upload a cover image</span>
              <span className={styles.uploadHint}>JPEG, PNG, WebP up to 3MB</span>
            </label>
          )}
          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
        </div>
      </div>

      {/* submit */}
      <div className={styles.submitRow}>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Save note'}
        </button>
      </div>
    </form>
  )
}

export default NoteForm