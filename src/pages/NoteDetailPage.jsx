import { useParams } from 'react-router-dom'

function NoteDetailPage() {
  const { id } = useParams()
  return <div><h1>Note detail — ID: {id}</h1></div>
}
export default NoteDetailPage