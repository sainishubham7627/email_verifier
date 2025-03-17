import React, { useState , useContext, useRef} from 'react'
import notecontext from '../Context/notes/notecontext';
import { Link, useLocation, useNavigate } from "react-router-dom";

const AddNote = (props) => {
    const context = useContext(notecontext);
    const {addNote} = context;
    
    const [note,setNote] = useState({title: "", description: "",tag: "default", file: null})
    const fileInputRef = useRef(null);

    const handleClick =(e)=>{
      e.preventDefault();
      addNote(note.title, note.description, note.tag, note.file);
      setNote({title: "", description:"", tag: "", file: null})
      fileInputRef.current.value = null;
      props.showAlert("Added Successfully", "success")
    }

    const onChange = (e) => {
      if (e.target.name === 'file') {
          setNote({ ...note, file: e.target.files[0] });
      } else {
          setNote({ ...note, [e.target.name]: e.target.value });
      }
  }

  return (
    <div>
      <div className='container my-3' style={{marginLeft: "300px"}}>
      <i class="fa-solid fa-arrow-left mx-2" style={{color: " rgb(94, 63, 45)"}}></i>
       <Link aria-current="page" to="/" style={{color: "rgb(94, 63, 45)"}}>Home</Link>
      <h2>Create new Notes</h2>
      <p>Add a new note with your info / notes</p>
      <form className='container my-3'>
        <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" className="form-control" id="title" name = "title" aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={4} required style={{width:"700px"}}/>
        </div>
        <div className="mb-3">
            <label htmlFor="description" className="form-label">description</label>
            <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required style={{width:"700px"}}/>
        </div>
        <div className="mb-3">
            <label htmlFor="tag" className="form-label">Tag</label>
            <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} minLength={5} required style={{width:"700px"}}/>
        </div>
        <div className="mb-3">
            <label htmlFor="tag" className="form-label">File</label>
            <input type="file" className="form-control" id="file" name="file" ref={fileInputRef} onChange={onChange} style={{width:"700px"}}/>
        </div>
        <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick} style={{color: "white",backgroundColor: " dark brown", borderRadius: "4px", width: "700px"}}>Add Note</button>
      </form>
      </div>
      
    </div>
  )
}

export default AddNote
