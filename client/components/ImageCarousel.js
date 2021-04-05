import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@material-ui/core';
import CarouselItem from './CarouselItem';

const items = [
  {
    name: 'PayUpPal',
    description:
      "Introducing an easy way to split and track your shared expenses. Scan your receipt, choose your splitting option and assign your friends. It's that easy!",
    color: '#179BE0',
    header: 'white',
    descColor: 'white',
    imgUrl:
      'https://payuppal-site-images.s3.amazonaws.com/payuppal-resized.jpg',
  },
  {
    name: 'Scan Receipts',
    description:
      'Scan your receipts and the items will automatically be detected. No more excel docs needed to split expenses with friends!',
    color: '#7D85B1',
    header: 'white',
    descColor: 'white',
    imgUrl:
      'https://payuppal-site-images.s3.amazonaws.com/scan--receipts-logged-out.jpeg',
  },
  {
    name: 'Differently Splitting Options',
    description:
      'Split your expenses evenly or assign items to different people - your choice!',
    color: '#fff79c',
    header: 'black',
    descColor: 'black',
    imgUrl:
      'https://payuppal-site-images.s3.amazonaws.com/split-bill-resized.jpg',
  },
  {
    name: 'Track Your Money',
    description:
      'Keep track of the money you are owed, and send email/text reminders to your friends. A great way to ensure you are paid back.',
    color: '#59C9A5',
    header: 'white',
    descColor: 'white',
    imgUrl: 'https://payuppal-site-images.s3.amazonaws.com/money.jpeg',
  },
];

const ImageCarousel = (props) => {
  return (
    <div style={{ color: '#494949' }}>
      <Carousel
        className='image-carousel'
        autoPlay={true}
        animation={'slide'}
        indicators={true}
        timeout={700}
        navButtonsAlwaysVisible={true}
        style={{ padding: '5vw' }}
      >
        {items.map((item, index) => {
          return <CarouselItem item={item} key={index} />;
        })}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
