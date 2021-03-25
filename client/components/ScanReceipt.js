import React, { useState, useContext } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import axios from 'axios';
import { useHistory } from 'react-router';
import { ReceiptDataContext } from '../Store';
// import * as FormData from 'form-data';

const divStyle = {
  // width: '100vw',
  maxWidth: '80vw',
  height: '75vh',
  // margin: '5em auto auto auto',
  border: 'orange solid',
};

const headerStyle = {
  textAlign: 'center',
};

const dragDrop = {
  maxWidth: '80vh',
  // width: '40vw',
  height: '60vh',
  margin: '0em auto 1em auto',
  border: 'black solid',
};

const imageStyle = {
  width: '25vw',
  height: '95%',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const buttonStyle = {
  width: '100%',
  height: '92%',
  background: 'white',
  border: 'none',
  cursor: 'pointer',
};

const submitStyle = {
  textAlign: 'center',
};

const ScanReceipt = () => {
  const [file, setFile] = useState('');
  const [fileName, setFilename] = useState('Choose File');
  const [tempImageUrl, setTempImageUrl] = useState({});
  const inputfield = React.useRef(null);
  const uploadField = React.useRef(null);
  const [receiptDataState, dispatch] = useContext(ReceiptDataContext);
  const history = useHistory();
  const handleFileDrop = (file) => {
    console.log(file);
    setTempImageUrl(URL.createObjectURL(file[0]));
    setFile(file[0]);
    setFilename(file[0].name);
  };
  const handleFileUpload = (e) => {
    console.log(file);
    setTempImageUrl(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileDrop(e.dataTransfer.files);
    }
  };
  const onClick = () => {
    // `current` points to the mounted file input element
    uploadField.current.click();
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(file);
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const { data } = await axios.post('/api/receipts', formData);
        dispatch({ type: 'GET_ITEMS', itemsInfo: data });
        history.push('/editreceipt');
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div style={divStyle}>
      <h2 style={headerStyle}>Scan Receipt</h2>
      {/* <DropzoneArea /> */}
      <div
        id='drag-drop'
        ref={inputfield}
        style={dragDrop}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <h6 style={{ textAlign: 'center' }}>
          Drag and drop an image or click to upload!
        </h6>
        <input
          type='file'
          ref={uploadField}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <button style={buttonStyle} onClick={onClick}>
          {file && (
            <img id='image-preview' style={imageStyle} src={tempImageUrl} />
          )}
        </button>
      </div>
      <button onClick={onSubmit} style={submitStyle}>
        Submit Image
      </button>
    </div>
  );
};

export default ScanReceipt;
