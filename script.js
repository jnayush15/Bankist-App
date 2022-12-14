'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const displayMovements = function (movements) {
  containerMovements.innerHTML = ``;
  movements.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
        <div class="movements__value">${movement} EUR</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterBegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (accumulator, movement) => accumulator + movement,
    0
  );
  labelBalance.textContent = `${account.balance} EUR`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((accumulator, movement) => accumulator + movement);

  labelSumIn.textContent = `${incomes} EUR`;

  const out = account.movements
    .filter(movement => movement < 0)
    .reduce((accumulator, movement) => accumulator + movement);

  labelSumOut.textContent = `${Math.abs(out)} EUR`;

  const interest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => deposit * (account.interestRate / 100))
    .filter(interest => interest >= 1)
    .reduce((accumulator, interest) => accumulator + interest);

  labelSumInterest.textContent = `${interest} EUR`;
};

const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

function updateUI(account) {
  // Display movements
  displayMovements(account.movements);

  // Display balance
  calcDisplayBalance(account);

  // Display summary
  calcDisplaySummary(account);
}

let currentAccount;

btnLogin.addEventListener('click', function (event) {
  // prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value.toLowerCase()
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  // prevent form from submitting
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    recieverAccount &&
    amount <= currentAccount.balance &&
    recieverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

// const deposits = account1.movements.filter(movement => movement > 0);
// console.log(deposits);

// const withdrawal = account1.movements.filter(movement => movement < 0);
// console.log(withdrawal);

// const max = account1.movements.reduce(
//   (max, movement) => (max < movement ? movement : max),
//   account1.movements[0]
// );

// const euroToUsd = 1.1;
// const totalDepositsUSD = account1.movements
//   .filter(movement => movement > 0)
//   .map(movement => movement * 1.1)
//   .reduce((accumulator, movement) => accumulator + movement, 0);
// console.log(totalDepositsUSD);

// const firstWithdrawl = account1.movements.find(movement => movement < 0);
// console.log(firstWithdrawl);

// const account = accounts.find(account => account.owner === 'Jessica Davis');
// console.log(account);

// for (const account of accounts) {
//   if (account.owner === 'Jessica Davis') console.log(account);
// }
