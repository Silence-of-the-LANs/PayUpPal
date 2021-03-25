import React, { useState, useEffect } from 'react';
import bootstrap from 'bootstrap';
import axios from 'axios';

const markPaid = async (debtId) => {
  const { data } = await axios.put(`api/debts/markPaid/${debtId}`);
  return data;
};

const calcTotalOwed = (balances) => {
  return balances.reduce((total, balance) => {
    if (!balance.paid) {
      total = total + balance.balance;
      return total;
    } else {
      return total;
    }
  }, 0);
};

const ViewDebts = () => {
  const [debts, setDebts] = useState([]);
  const [totalOwed, setTotalOwed] = useState(0);

  useEffect(() => {
    // initial data fetch of debts
    const fetchDebts = async () => {
      let { data } = await axios.get('api/debts/displayDebts');
      const total = calcTotalOwed(data);

      setDebts(data);
      setTotalOwed(total);
    };

    fetchDebts();
  }, [totalOwed]);

  // get a unique list of borrowers
  const listOfBorrowers = [];
  const listOfBorrowerIds = [];

  debts.forEach((balanceObj) => {
    // if a borrower is not on the list of borrowers, add them to the list of borrowers
    if (!listOfBorrowerIds.includes(balanceObj.friendId)) {
      listOfBorrowerIds.push(balanceObj.friendId);
      listOfBorrowers.push({
        friendId: balanceObj.friendId,
        friendName: balanceObj.friend.name,
      });
    }
  });

  // sort the list of borrowers by name
  listOfBorrowers.sort((friendOne, friendTwo) => {
    if (friendOne.friendName > friendTwo.friendName) {
      return 1;
    } else if (friendOne.friendName < friendTwo.friendName) {
      return -1;
    } else {
      return 0;
    }
  });

  return (
    <div>
      <h2>You are owed a grand total of: ${totalOwed / 100}</h2>
      <div>
        {/* for each borrower in our list of borrowers... */}
        {listOfBorrowers.map((borrower) => {
          let debtsOwedByFriend = debts.filter(
            (balance) => balance.friendId === borrower.friendId
          );
          return (
            <div className='border' key={borrower.friendId}>
              <p>
                {borrower.friendName} - Total Owed: $
                {(calcTotalOwed(debtsOwedByFriend) / 100).toFixed(2)}
              </p>
              {/* list out the debts for each borrower */}
              {debtsOwedByFriend.map((debt) => (
                <div key={debt.id}>
                  <span className={debt.paid ? 'paid' : ''}>
                    EventName - ${(debt.balance / 100).toFixed(2)}
                  </span>
                  <button>Send Reminder</button>
                  <button
                    onClick={async () =>
                      setTotalOwed(calcTotalOwed(await markPaid(debt.id)))
                    }
                  >
                    Mark as Paid
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewDebts;
