import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bootstrap from 'bootstrap';
// import * as FormData from 'form-data';

const TommyPractice = (props) => {
  const [file, setFile] = useState('');
  const [fileName, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState([]);
  const onChange = (e) => {
    console.log('e.target', e.target);
    console.log('e.target.files', e.target.files);
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
    // console.log('File state', e.target.files[0];
    // console.log('FileName', fileName);
  };
  const onClick = async (e) => {
    e.preventDefault();
    console.log('e.target', e.target);
    const formData = new FormData();
    formData.append('file', file);
    console.log(file);
    console.log(formData);
    try {
      const res = await axios.post('/api/testGoogle/test', formData);
      // const res = await axios.get('/api/testGoogle/test');
      setUploadedFile(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h4>React Hooks Uploader</h4>
      <form className='input-group mb-3'>
        <input
          type='file'
          className='form-control'
          id='inputGroupFile02'
          onChange={onChange}
          name='file'
        />
        <button
          type='submit'
          className='input-group-text'
          for='inputGroupFile02'
          onClick={onClick}
        >
          Upload
        </button>
      </form>
      {uploadedFile.items &&
        uploadedFile.items.map((text) => {
          return (
            <div>
              <span>
                <p>Quantity: {text.quantity}</p>
                <p>Description: {text.description}</p>
                <p>PricePerItem: {text.pricePerItem}</p>
                <p>TotalPrice: {text.totalPrice}</p>
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default TommyPractice;
