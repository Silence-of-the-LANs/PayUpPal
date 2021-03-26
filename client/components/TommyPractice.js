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
  };
  const onClick = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await axios.post('/api/receipts/upload', formData);
        setUploadedFile(res.data);
      } catch (err) {
        console.log(err);
      }
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
              {/* <p>{text}</p> */}
              {/* <p>description: {text.description}</p>
              <p>minX: {text.minX}</p>
              <p>minY: {text.minY}</p>
              <p>maxY: {text.maxY}</p> */}
              <p>
                Quantity: {text.quantity} Description: {text.description}
                <br /> PricePerItem: {text.pricePerItem} TotalPrice:{' '}
                {text.totalPrice}
              </p>
            </div>
          );
        })}
      {uploadedFile.miscItems &&
        Object.keys(uploadedFile.miscItems).map((item) => {
          return (
            <p>
              {item} {uploadedFile.miscItems[item]}
            </p>
          );
        })}
    </div>
  );
};

export default TommyPractice;
