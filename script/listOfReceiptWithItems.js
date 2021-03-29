const receipt1 = {
  eventName: 'test event',
  imageUrl: 'https://payuppal-bucket.s3.amazonaws.com/receipt1.jpeg',
  date: '2020-03-20',
  tax: 778,
  tip: 0,
  total: 8753,
  items: [
    {
      quantity: 1,
      description: 'GARLICBREAD',
      pricePerItem: 395,
      totalPrice: 395,
    },
    {
      quantity: 2,
      description: 'Diet',
      pricePerItem: 300,
      totalPrice: 600,
    },
    {
      quantity: 2,
      description: 'Iced Tea',
      pricePerItem: 300,
      totalPrice: 600,
    },
    {
      quantity: 2,
      description: 'TASTE OF NO',
      pricePerItem: 1695,
      totalPrice: 339,
    },
    {
      quantity: 1,
      description: 'whole Muff',
      pricePerItem: 1495,
      totalPrice: 1495,
    },
    {
      quantity: 1,
      description: 'Alfredo',
      pricePerItem: 1495,
      totalPrice: 1495,
    },
  ],
};

module.exports = receipt1;
