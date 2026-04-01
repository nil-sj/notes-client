import { useParams } from 'react-router-dom'

function EditNotePage() {
  const { id } = useParams()
  return <div><h1>Edit note — ID: {id}</h1></div>
}
export default EditNotePage