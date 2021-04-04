import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import { ReceiptDataContext } from '../Store';
import { store } from 'react-notifications-component';

const ScanReceipt = () => {
  const [file, setFile] = useState('');
  const [fileName, setFilename] = useState('Choose File');
  const [tempImageUrl, setTempImageUrl] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [imageStaged, setImageStaged] = useState(false);
  // uploadField is ref used for click & upload
  // ref gives access to manipulate the HTML element directly
  const uploadField = React.useRef(null);
  // receiptDataState is the store
  const [receiptDataState, dispatch] = useContext(ReceiptDataContext);
  // history used to push user to editReceipt page
  const history = useHistory();
  // handles after file has been dropped
  const handleFileDrop = async (file) => {
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
        console.log(data);
        dispatch({ type: 'GET_ITEMS', itemsInfo: data });
        // direct user to edit receipt page
        history.push('/editreceipt');
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div id='scan-receipt-div'>
      <div id='scan-receipt-header'>
        <h2>Scan Receipt</h2>
      </div>
      <div
        // ref is used as a reference to manipulate dom in our functions
        id='drag-drop-div'
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          // ref is used as a reference to manipulate dom in our functions
          id='invisible-input-div'
          type='file'
          ref={uploadField}
          onChange={handleFileUpload}
        />
        <button id='drop-image-div' onClick={onClick}>
          {file ? (
            <img id='image-preview' src={tempImageUrl} />
          ) : (
            <img id='drop-image' src='upload-image.png' />
          )}
        </button>
      </div>
      <div id='submit-div'>
        <button id='scan-submit-button' onClick={onSubmit}>
          Submit Image
        </button>
        {isLoading && (
          <div>
            Reading receipt...{' '}
            <img src='loading-spinner.gif' width='50px' height='50px' />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanReceipt;
