import React, { useState } from 'react'
import axios from 'axios'

export default function AddFileInput() {
  const [unit, setUnit] = useState('')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [formData, setFormData] = useState({})
  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      formData.unit = unit
      formData.title = title
      formData.file = file
      console.log(formData)
      const response = axios.post('http://localhost:5000/api/ppmp', formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if(response) {
        console.log('File uploaded successfully')
      }
      
    } catch (error) {
      console.log(error)
      
    }

  }
  return (
    <div>
      <form className={`flex flex-col items-center justify-center gap-10`} onSubmit={handleSubmit}>
      <input type="text" placeholder='Unit' className={`bg-blue-100 p-4 rounded-lg`} onChange={(e) => setUnit(e.target.value)}/>
        <input type="text" placeholder='File Title' className={`bg-blue-100 p-4 rounded-lg`} onChange={(e) => setTitle(e.target.value)}/>
        <input type="file" accept='application/pdf' placeholder='Select File' className={`bg-blue-300 p-4 rounded-lg`} onChange={(e) => setFile(e.target.files[0])}/>
        <button type='submit' className={`bg-blue-100 p-4 rounded-lg `}>Submit</button>
      </form>
    </div>
  )
}
