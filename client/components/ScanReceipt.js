import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import { ReceiptDataContext } from '../Store';
import { store } from 'react-notifications-component';

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
  const [isLoading, setLoading] = useState(false);
  // inputfield is ref used for drag & drop
  const inputfield = React.useRef(null);
  // uploadField is ref used for click & upload
  // ref gives access to manipulate the HTML element directly
  const uploadField = React.useRef(null);
  // receiptDataState is the store
  const [receiptDataState, dispatch] = useContext(ReceiptDataContext);
  // history used to push user to editReceipt page
  const history = useHistory();
  // handles after file has been dropped
  const handleFileDrop = (file) => {
    // creates a temp URL to preview image
    store.addNotification({
      title: '',
      message: `${file[0].name} added to staging area`,
      type: 'success',
      insert: 'bottom',
      container: 'bottom-left',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 2000,
        onScreen: true,
      },
    });
    setTempImageUrl(URL.createObjectURL(file[0]));
    setFile(file[0]);
    setFilename(file[0].name);
  };
  // handles user uploading a file
  const handleFileUpload = (e) => {
    store.addNotification({
      title: '',
      message: `${e.target.files[0].name} added to staging area`,
      type: 'success',
      insert: 'bottom',
      container: 'bottom-left',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 2000,
        onScreen: true,
      },
    });
    setTempImageUrl(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };
  // handles the dragging event motion
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  // handles the user dropping a file
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileDrop(e.dataTransfer.files);
    }
  };
  const onClick = () => {
    // `current` points to the mounted file input element
    // upload on click is referenced
    uploadField.current.click();
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(file);
    if (file) {
      // formData creates an empty file obj, we can append our file to formData
      const formData = new FormData();
      formData.append('file', file);
      try {
        setLoading(true);
        // send formData on as our request
        const { data } = await axios.post('/api/receipts/upload', formData);
        // dispatch data onto our store
        dispatch({ type: 'GET_ITEMS', itemsInfo: data });
        // direct user to edit receipt page
        history.push('/editreceipt');
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div style={divStyle}>
      <h2 style={headerStyle}>Scan Receipt</h2>
      <div
        // ref is used as a reference to manipulate dom in our functions
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
          // ref is used as a reference to manipulate dom in our functions
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
      {isLoading && (
        <div>
          Reading receipt...{' '}
          <img src='loading-spinner.gif' width='50vw' height='50vh' />
        </div>
      )}
    </div>
  );
};

export default ScanReceipt;
