const checkIfItem = (textByLines) => {
  let itemArr = [];
  // checks index if contains '.' and if the -1,1,2 index are numbers.
  // also checks if 3rd character is undefined, tells us we are at a dollar amount
  textByLines.forEach((line) => {
    if (line.includes('.')) {
      let lastIndex = line.lastIndexOf('.');
      if (
        !isNaN(line[lastIndex + 1]) &&
        !isNaN(line[lastIndex + 2]) &&
        !isNaN(line[lastIndex - 1]) &&
        !line[lastIndex + 3]
      ) {
        itemArr.push(line);
      }
    }
  });
  // helper function to convert itemArr into an array of objects
  // with quantity, description, and price per item
  let newArrObj = convertToArrObj(itemArr);
  console.log('newArrObj', newArrObj);
  return newArrObj;
};

const convertToArrObj = (itemArr) => {
  let miscItems = {};
  // function  to add non-items like subtotal, total, tax into a seperate obj
  itemArr.forEach((line) => {
    let lineSplit = line.split(' ');
    let dollarText = lineSplit[lineSplit.length - 1];
    // adds
    if (/tax/i.test(line)) {
      if (dollarText.includes('$') || dollarText.includes('S')) {
        miscItems.tax = Number(dollarText.slice(1));
      } else {
        miscItems.tax = Number(dollarText);
      }
    }
    if (/subtotal/i.test(line)) {
      if (dollarText.includes('$') || dollarText.includes('S')) {
        miscItems.subTotal = Number(dollarText.slice(1));
      } else {
        miscItems.subTotal = Number(dollarText);
      }
    }
    if (/total/i.test(line)) {
      if (dollarText.includes('$') || dollarText.includes('S')) {
        miscItems.subTotal = Number(dollarText.slice(1));
      } else {
        miscItems.subTotal = Number(dollarText);
      }
    }
  });

  const filterItemArr = itemArr.filter((line) => {
    if (
      /tax/i.test(line) ||
      /total/i.test(line) ||
      /%/i.test(line) ||
      /description/i.test(line) ||
      /food/i.test(line) ||
      /visa/i.test(line) ||
      /change/i.test(line) ||
      /cash/i.test(line)
    ) {
      return false;
    } else {
      return true;
    }
  });

  const newItemArrObj = filterItemArr.map((line) => {
    let obj = {};
    let splitLine = line.split(' ');
    if (!isNaN(splitLine[0])) {
      parseInt();
      obj.quantity = Number(splitLine[0]);
      obj.description = splitLine.slice(1, splitLine.length - 1).join(' ');
      if (splitLine[splitLine.length - 1][0] === '$') {
        obj.pricePerItem =
          Number(splitLine[splitLine.length - 1].slice(1)) / obj.quantity;

        obj.totalPrice = parseInt(
          Number(splitLine[splitLine.length - 1].slice(1))
        );
      } else {
        obj.pricePerItem =
          Number(splitLine[splitLine.length - 1]) / obj.quantity;

        obj.totalPrice = parseInt(Number(splitLine[splitLine.length - 1]));
      }
    } else {
      obj.quantity = 1;
      obj.description = splitLine.slice(0, splitLine.length - 1).join(' ');
      if (splitLine[splitLine.length - 1][0] === '$') {
        obj.pricePerItem =
          Number(splitLine[splitLine.length - 1].slice(1)) / obj.quantity;
        obj.totalPrice = Number(splitLine[splitLine.length - 1].slice(1));
      } else {
        obj.pricePerItem =
          Number(splitLine[splitLine.length - 1]) / obj.quantity;
        obj.totalPrice = Number(splitLine[splitLine.length - 1]);
      }
    }
    return obj;
  });
  const filterEmptyValues = newItemArrObj.filter((item) => {
    if (item.description && item.totalPrice) {
      return true;
    }
    return false;
  });
  const includeAll = { items: filterEmptyValues, miscItems };
  return includeAll;
};

module.exports = {
  checkIfItem,
};
