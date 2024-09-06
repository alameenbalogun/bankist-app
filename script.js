"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Qawwiyyah Balogun",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Tawwab Oluwanishola",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Feyishara Sulitonat Anike",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Kaosara Damilare",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: "Kory Lawal",
  movements: [500000, 200000, 30000, 50000, 900000],
  interestRate: 1,
  pin: 1234,
};

const account6 = {
  owner: "Dosunmu David",
  movements: [10000, 20000, 30000, -20000, 20000],
  interestRate: 2,
  pin: 1010,
};

const accounts = [account1, account2, account3, account4, account5, account6];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  // console.log(movs);

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
    </div>
    `;
    // console.log(html);

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const displayCalcBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcSummaryBalance = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interests = acc.movements
    .filter((mov) => mov > 0)
    .map((deposits) => (deposits * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interests}€`;
};

const createUsernames = function (accts) {
  accts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //display movements
  displayMovement(acc.movements);

  //calculate balance
  displayCalcBalance(acc);

  //calculate summary
  calcSummaryBalance(acc);
};

let currentAccount;
//EVENT LISTENER
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  //displays UI
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;

    //displays welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    //clear input fields
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferTo.blur();

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== receiverAcc
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //amount added to the moevemnts
    currentAccount.movements.push(amount);

    //update balance
    updateUI(currentAccount);

    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  }

  // console.log('Loan Clicked')
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    //deletes the account
    accounts.splice(index, 1);

    //hides the UI
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = "";
  }
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// console.log(accounts)

// const username = user
//   .toLowerCase()
//   .split(" ")
//   .map((name) => name[0])
//   .join("");
// console.log(username);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
//SLICE
const arr = ["a", "b", "c", "d", "e"];
console.log(arr);
console.log(arr.slice(2));
console.log(arr.slice(-1));

//SPLICE ---mutates the original array
// console.log(arr.splice(3));
// console.log(arr);

//used exmaple is:
//removing an element and logging the rest
console.log(arr.splice(-1))
console.log(arr)

//reverse--also mutates the original array
const arr2 = ['j', 'i', 'h', 'g', 'f']
console.log(arr2.reverse())
console.log(arr2) //get mutated to the reverse

//concat
const letters = arr.concat(arr2)
console.log(letters)

//join
console.log(letters.join(' - '))
*/

/*
//the atMethod
const arr = [23, 10, 24];
console.log(arr[0]);
console.log(arr.at(1));

//last element
console.log(arr[arr.length - 1]);
console.log(...arr.slice(-1));
console.log(arr.at(-1));
*/

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for(const movement of movements){
  if(movement > 0){
    console.log(`You deposited ${movement}`)
  }else {
    console.log(`You withdrew ${Math.abs(movement)}`)
  }
}

console.log('---FOREACH----')
movements.forEach(function(movement){
  if(movement > 0){
    console.log(`You deposited ${movement}`)
  }else {
    console.log(`You withdrew ${Math.abs(movement)}`)
  }
})
*/

/*
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You Deposited ${movement}`);
  } else {
    console.log(`Mocement ${i + 1}: You Withdrew ${Math.abs(movement)}`);
  }
}

//to get the index in forEach, it is of the order
//1. current name, current index, cureent arr

console.log('----FOREACH---')
movements.forEach(function(mov, index, arr){
  if (mov > 0) {
    console.log(`Movement ${index + 1}: You Deposited ${mov}`);
  } else {
    console.log(`Mocement ${index + 1}: You Withdrew ${Math.abs(mov)}`);
  }
})

//foreach loops over the entire array and does not break out
*/
/*
const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

currencies.forEach(function(currency, symbol){
  console.log(`The ${currency} is of the abbreviation ${symbol}`)
})
*/

// const juliaData = [3, 5, 2, 12, 7];
// const kateData = [4, 1, 15, 8, 3];

// const juliaData = [9, 46, 6, 8, 3]
// const kateData = [10, 5, 6, 1, 4]

// const checkDogs = function (juliaData, kateData) {
//   const juliaNewData = juliaData.slice(1, -2);
//   console.log(juliaNewData);

//   const checkedDogs = [...juliaNewData.concat(kateData)];
//   console.log(...checkedDogs);

//   checkedDogs.forEach(function (ages, i) {
//     const growth = ages >= 3 ? "an adult" : "a puppy";
//     console.log(`Dog number ${i + 1} is still an ${growth} and is ${ages} years old`);
//   });
// };
// checkDogs(juliaData, kateData);

/////////////DATA TRANSFORMATION METHOD
/*
//MAP METHOD
const eurToUsd = 1.1;

const movementsUsd = movements.map(function (mov) {
  return mov * eurToUsd;
});
// console.log(movements);
// console.log(movementsUsd);

//using the for of  method
const movementsUsdfor = [];
for (const movementsNewUsd of movements)
  movementsUsdfor.push(movementsNewUsd * eurToUsd);
// console.log(movementsUsdfor);

//arrow function
const movementUsdArrow = movements.map((mov) => {
  return mov * eurToUsd;
});
console.log(movementUsdArrow);

// const movementsDescription = movements.map(function(mov, i){
//   if (mov > 0) {
//     return `Movement ${i + 1}: You Deposited ${mov}`
//   } else {
//     return `Mocement ${i + 1}: You Withdrew ${Math.abs(mov)}`
//   }
// })
// console.log(movementsDescription)

const movementsDescription = movements.map((mov, i) => {
  return `Movement ${i + 1}: You ${
    mov > 0 ? "Deposited" : "Withdrew"
  } ${Math.abs(mov)}`;
});
console.log(movementsDescription);
*/

/*
///filter method
const deposit = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposit);

const withdraw = movements.filter(mov => mov < 0);
console.log(withdraw)
*/

/*
//reduce method
const balance = movements.reduce(function (acc, curr, i) {
  console.log(`Iteration ${i}: the balance is ${acc}`)
  return acc + curr;
}, 0);
console.log(balance)
*/

/*
const calcAverageHumanAge = function (ages) {
  const convertedAges = ages.map(function (age) {
    if (age <= 2) {
      return 2 * age;
    } else {
      return 16 + age * 2;
    }
  });
  console.log(convertedAges);

  const reducedAdultAges = convertedAges.filter((age) => age > 18);
  console.log(reducedAdultAges);

  const averageAdultAges = reducedAdultAges.reduce(function (acc, age) {
    const ages = acc + age
    return reducedAdultAges.length
  }, 0);
  console.log(averageAdultAges);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
*/

/*
const calcAverageHumanAge = ages => {
  const adultHumanAge = ages
    .map((humanAge) => {
      humanAge = ages <= 2 ? 2 * ages : 16 + ages * 2;
    })
    .filter((adults) => adults > 18)
    .reduce((acc, adults) => acc + adults / ages.length);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
*/

/*
//every method

const isEvery = account4.movements.every((mov) => mov > 0);
console.log(isEvery);

//flat method
const arr = [1, 2, [3, 4, 5]];
console.log(arr.flat());

const arr2 = [1, 2, [[3, 4, 5], 6]];
console.log(arr2.flat(2));

// const allMovements = accounts
//   .map((acc) => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(allMovements);

//flatmap
const allMovements = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(allMovements);
*/

/*
/////////////SORTING ARRAYS
///strings
const names = ["Qawiyyah", "Tawwab", "Al-ameen", "Kaosara", "Sulitonat"];
console.log(names.sort());

///numbers
console.log(movements);
// console.log(movements.sort());
///this doesnt work for the number arrays

movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});
console.log(movements);
*/

/*
//creating and filling arrays
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);
//fill method
// x.fill(1)
// console.log(x.fill(1, 4))
console.log(x.fill(4, 5, 7));
arr.fill(23, 4, 7);
console.log(arr);

//ARRAY.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener("click", function (e) {
  e.preventDefault();

  const movementUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => Number(el.textContent.replace("€", ""))
  );
  console.log(movementUI);
  // console.log(movementUI.map(el => el.textContent.replace('€', '')));
});
*/

/*
//1. calculate the movements in the account movement
const movementAll = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov >= 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(movementAll);

//calculates how many number of movements greater than 1000
const movementGreater1000 = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov >= 1000).length;
console.log(movementGreater1000);
//another alternative to doing this
const movementGreater1000Two = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, cur) => (cur >= 1000 ? acc + 1 : acc), 0);
console.log(movementGreater1000Two);

//using the object
const movementType = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposits += cur) : (sums.withdrawal += cur);
      return sums;
    },
    { deposits: 0, withdrawal: 0 }
  );

console.log(movementType);
console.log(accounts.flatMap((acc) => acc.movements));
//another method is
const { deposits, withdrawal } = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? "deposits" : "withdrawal"] += cur;
      return sums;
    },
    { deposits: 0, withdrawal: 0 }
  );
console.log(deposits, withdrawal);
*/

/*
//////////words capitalized

const capitalizedWord = function (text) {
  const capitalized = (str) => str[0].toUpperCase() + str.slice(1);
  // console.log(capitalized)

  const exceptions = [
    "is",
    "an",
    "with",
    "and",
    "the",
    "a",
    "on",
    "in",
    "with",
  ];

  const capitalize = text
    .toLowerCase()
    .split(" ")
    .map((el) => (exceptions.includes(el) ? el : capitalized(el)))
    .join(" ");

  return capitalized(capitalize);
};
console.log(capitalizedWord("this is a nice title"));
console.log(capitalizedWord("this is a LONG nice title but not too long"));
console.log(capitalizedWord("and here is another title with an EXAMPLE"));
*/

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

///1.
dogs.forEach(function (dog) {
  dog.foodRecommended = Math.trunc(dog.weight ** 0.75 * 28);
});
console.log(dogs);

///2.
const sarahDog = dogs.find((owner) => owner.owners.includes("Sarah"));
console.log(sarahDog);

const result =
  sarahDog.curFood > sarahDog.foodRecommended
    ? "It is eating too much"
    : "It is eating little";
console.log(result);

//3.
const ownersEatTooMuch = dogs
  .filter((owner) => owner.curFood > owner.foodRecommended)
  .map((owner) => owner.owners)
  .flat();
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter((owner) => owner.foodRecommended > owner.curFood)
  .flatMap((owner) => owner.owners);
console.log(ownersEatTooLittle);

//4.
console.log(`${ownersEatTooMuch.join(" and ")}'s eat too much`);
console.log(`${ownersEatTooLittle.join(" and ")}'s eat too Little`);

//5.
console.log(dogs.some((dog) => dog.curFood === dog.foodRecommended));

//6.
console.log(
  dogs.some(
    (dog) =>
      dog.curFood > dog.foodRecommended * 0.9 &&
      dog.curFood < dog.recommended * 1.1
  )
);

//7.
// console.log(
//   dogs.filter((dog) =>
//     dogs.some(
//       (dogg) =>
//         dogg.curFood > dogg.foodRecommended * 0.9 &&
//         dogg.curFood < dogg.recommended * 1.1
//     )
//   )
// );

//8.
console.log(dogs.sort((a, b) => a.foodRecommended - b.foodRecommended));
