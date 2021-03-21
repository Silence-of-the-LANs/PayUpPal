import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bootstrap from 'bootstrap';
// import * as FormData from 'form-data';

const TommyPractice = (props) => {
  const [file, setFile] = useState('');
  const [fileName, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState([]);
  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };
  const onClick = async (e) => {
    e.preventDefault();
    console.log('e.target', e.target);
    const formData = new FormData();
    formData.append('file', file);
    console.log(file);
    console.log(formData);
    try {
      const res = await axios.post('/api/testGoogle', formData);
      // setUploaded(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h4>React Hooks Uploader</h4>
      <div className='input-group mb-3'>
        <input
          type='file'
          className='form-control'
          id='inputGroupFile02'
          onChange={onChange}
        />
        <button
          type='submit'
          className='input-group-text'
          for='inputGroupFile02'
          onClick={onClick}
        >
          Upload
        </button>
      </div>
      {uploadedFile &&
        uploadedFile.map((text) => {
          return <p>{text}</p>;
        })}
    </div>
  );
};

export default TommyPractice;
