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

  console.log(debts);

  return (
    <div>
      <h2>You are owed a total of: ${totalOwed / 100}</h2>
      <ul>
        {debts.length > 0
          ? debts.map((debt) => (
              <div key={debt.id} className={debt.paid ? 'paid' : ''}>
                {debt.friend.name} owes {debt.balance / 100}
                <button>Send Reminder</button>
                <button
                  onClick={async () =>
                    setTotalOwed(calcTotalOwed(await markPaid(debt.id)))
                  }
                >
                  Mark as Paid
                </button>
              </div>
            ))
          : 'Loading debts...'}
      </ul>
    </div>
  );
};

export default ViewDebts;
