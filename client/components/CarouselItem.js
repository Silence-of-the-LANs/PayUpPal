import React from 'react';
import { Paper } from '@material-ui/core';

const CarouselItem = (props) => {
  const { item } = props;

  return (
    <Paper
      className='carousel'
      style={{
        backgroundColor: item.color,
        position: 'relative',
        height: '400px',
        overflow: 'hidden',
        padding: '20px',
        margin: '5vw',
      }}
      elevation={10}
    >
      <div className='carousel-text'>
        <h2 style={{ color: item.header, marginBottom: '20px' }}>
          {props.item.name}
        </h2>
        <p
          style={{ fontSize: '1.5rem', color: item.descColor, padding: '2rem' }}
        >
          {props.item.description}
        </p>
      </div>
      <div className='carousel-img'>
        <img style={{ width: '100%', height: '100%' }} src={item.imgUrl} />
      </div>
    </Paper>
  );
};

export default CarouselItem;
