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
    if (!listOfBorrowerIds.includes(balanceObj.friendId)) {
      listOfBorrowerIds.push(balanceObj.friendId);
      listOfBorrowers.push({
        friendId: balanceObj.friendId,
        friendName: balanceObj.friend.name,
      });
    }
  });

  // console.log('list of borrowers: ', listOfBorrowers);
  // const DarylDebts = debts.filter((balance) => balance.friendId === 4);
  // console.log('Daryl owes these balances: ', DarylDebts);
  // console.log('for a total of: ', calcTotalOwed(DarylDebts) / 100);
  return (
    <div>
      <h2>You are owed a total of: ${totalOwed / 100}</h2>
      <div>
        {listOfBorrowers.map((borrower) => {
          let debtsOwedByFriend = debts.filter(
            (balance) => balance.friendId === borrower.friendId
          );
          return (
            <div className='border'>
              <p>
                {borrower.friendName} - {calcTotalOwed(debtsOwedByFriend)}
              </p>
              {debtsOwedByFriend.map((debt) => (
                <div>
                  <p className={debt.paid ? 'paid' : ''}>
                    {debt.id} - {debt.balance}
                  </p>
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
