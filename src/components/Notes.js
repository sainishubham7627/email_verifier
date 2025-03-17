import React, { useContext, useEffect, useRef, useState } from 'react'
import notecontext from '../Context/notes/notecontext';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import {Link, useNavigate } from 'react-router-dom';
import Image1 from './Leonardo_Phoenix_Clean_White_edit.jpg';
import Image2 from './Noteify_darker_brown_logo.jpg';



const Notes = (props) => {
    const context = useContext(notecontext);
    let navigate = useNavigate();
    const {notes, getNotes, editNote} = context;
    useEffect(()=> {
      if(localStorage.getItem('token')){
        console.log(localStorage.getItem('token'));
        getNotes()
      }
      else{
        navigate("/login")
      }
      // eslint-disable-next-line
    },[])

    const ref = useRef(null)
    const refClose = useRef(null)
    const [note,setNote] = useState({id: "", etitle: "", edescription: "",etag: "",efile: null})
    const fileInputRef = useRef(null);
    

    const updateNote = (currentNote)=>{
      ref.current.click();
      setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag, efile: currentNote.file})
    }

    const handleClick =(e)=>{
      editNote(note.id, note.etitle, note.edescription, note.etag, note.efile)
      refClose.current.click();
      props.showAlert("Updated Successfully", "success")
    }

    const onChange =(e)=>{
      if (e.target.name === 'file') {
        setNote({ ...note, file: e.target.files[0] });
    } else {
        setNote({ ...note, [e.target.name]: e.target.value });
    }
    }

      const containerStyle = {
        display: "flex",
        height: "60vh",
      };
    
      const leftStyle = {
        flex: 1,
        backgroundColor: "#ffffff", // Light gray background for the left side
        padding: "20px",
        boxSizing: "border-box",
      };
    
      const rightStyle = {
        flex: 1,
        backgroundColor: "#ffffff", // White background for the right side
        padding: "20px",
        boxSizing: "border-box",
      };

  return (
    <>
    <div style={containerStyle}>
      <div style={leftStyle}>
      <img src={Image2} style={{width: "450px"}}></img>
      <h4>  Simplify Your Notes, Amplify Your Productivity</h4><hr /><hr />
      <p>An online web platform where you can create, edit, upload, delete your notes/information privately and securely without any disturbancee. For more info you can checkout our    <Link to="/about">About Page</Link></p><hr /><hr />
<pre><Link to = "/addnote"><button className='btn-btn' style={{width: "150px", height: "37px", color: "white",backgroundColor: " rgb(94, 63, 45)", borderRadius: "400000px"}} ><h7>Create New Note</h7></button></Link><hr /><hr />
</pre>      </div>
      <div style={rightStyle}>
       <img src={Image1} style={{width: "650px",height: "450px"}}></img>
      </div>
    </div>
    
    <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">Launch demo modal</button>
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"  aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Edit Notes</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
            </button>
          </div>
          <div className="modal-body">
          <form className='container my-3'>
            <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" className="form-control" id="etitle" name = "etitle" value = {note.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">description</label>
                <input type="text" className="form-control" id="edescription" name="edescription" value = {note.edescription} onChange={onChange} minLength={5} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="tag" className="form-label">Tag</label>
                <input type="text" className="form-control" id="etag" name="etag" value = {note.etag} onChange={onChange} minLength={5} required/>
            </div>
            <div className="mb-3">
            <label htmlFor="tag" className="form-label">File</label>
            <input type="file" className="form-control" id="file" name="file" ref={fileInputRef} onChange={onChange}/>
        </div>
          </form>
          </div>
          <div className="modal-footer">
            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button disabled={note.etitle.length<5 || note.edescription.length<5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
          </div>
        </div>
      </div>
    </div>
    <div className='row my-3'>
      <h1 style={{fontWeight: "bold"}}> <pre> Your notes:</pre></h1>
      <div className="container">
      {notes.length===0 && 'No notes to display'}
      </div>
      {notes.map((note)=>{
        return <Noteitem key={note._id} updateNote={updateNote} showAlert = {props.showAlert} note={note}/>
      })}
      </div>
      </>
  )
}

export default Notes
