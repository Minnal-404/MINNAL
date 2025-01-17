document.getElementById("loading").style.display = "flex";
document.getElementById("loadMessage").textContent = "Please Wait...";



import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
// import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, getDocs, setDoc, getDoc, doc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBGsxpj36xgkU9wCSILp7LZlyA6DRlbU5Q",
    authDomain: "login-9207d.firebaseapp.com",
    projectId: "login-9207d",
    storageBucket: "login-9207d.appspot.com",
    messagingSenderId: "269390570547",
    appId: "1:269390570547:web:49318f71d76faf656baf46"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const loggedInUserId = localStorage.getItem("loggedInUserId");


// Function to get URL parameters
// Function to get the parameter from the URL
// Function to get the parameter from the URL
// Function to get URL parameter (e.g., movie title)
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Fetch the movie title from the URL
const movieTitle = getURLParameter('title');
console.log(movieTitle); // For debugging
profileNameCreator()
// Function to fetch movie details by title from Firestore
async function getMovieDetailsByTitle(title) {
    try {
        const movieRef = doc(db, "movies", title);  // Reference to the movie document in Firestore
        const movieDoc = await getDoc(movieRef);

        if (movieDoc.exists()) {
            return movieDoc.data();  // Return movie data if it exists
        } else {
            console.log("No such movie found:", title);
            return null;  // Return null if the movie doesn't exist
        }
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
    }
}

// Check if movie title exists in URL and fetch movie details
if (movieTitle) {
    // Fetch the movie details using the title
    document.getElementById("subscription").style.display = "none";
    getMovieDetailsByTitle(movieTitle).then(movieDetails => {
        if (movieDetails) {
            // Populate the page with the movie details
            const movieContainer = document.getElementById('movie-details');
            document.getElementById("rentMovie").textContent = `Rent Movie - ${movieDetails.title}`
            // Insert the movie details into the HTML
            movieContainer.innerHTML = `
                <div class="d-flex flex-column align-items-center">
                <img src="${movieDetails.poster}" alt="${movieDetails.title}" />
                </div>
                <p><strong>Year:</strong> ${movieDetails.year}</p>
                <p><strong>Duration:</strong> ${movieDetails.duration}</p>
                <p><strong>Description:</strong> ${movieDetails.description}</p>
                <p><strong>Rating:</strong> ${movieDetails.rating}/5</p>
                </div>
            `;
        } else {
            console.error("Movie details not found.");
        }
        document.getElementById("loading").style.display = "none";
    });
} else {
    document.getElementById("rental").style.display = "none";
    document.getElementById("loading").style.display = "none";

    console.error("Movie title not found in URL.");
}

// Function to update rental price based on selected duration
function updateRentalPrice() {
    const rentalDurationSelect = document.getElementById('rentalDuration');
    const rentalPriceElement = document.getElementById('rentalPrice');

    const rentalDuration = rentalDurationSelect.value;
    let price = 0;

    switch (rentalDuration) {
        case '24':
            price = 2.99;  // Price for 24 hours
            break;
        case '7':
            price = 9.99;  // Price for 7 days
            break;
        case '30':
            price = 29.99;  // Price for 30 days
            break;
        default:
            price = 0;
            break;
    }

    rentalPriceElement.textContent = `Price: $${price.toFixed(2)}`;
}

// Event listener for rental duration change
document.getElementById('rentalDuration').addEventListener('change', updateRentalPrice);

// Function to confirm rental
document.getElementById('confirmRental').addEventListener('click', function () {
    const rentalDuration = document.getElementById('rentalDuration').value;
    const rentalPriceElement = document.getElementById('rentalPrice').textContent;
    const rentalPrice = parseFloat(rentalPriceElement.replace('Price: $', '').trim());

    const orderMessageElement = document.getElementById('orderMessage');

    // Credit Card Validation
    const input1 = document.getElementById("cardNumber1").value;
    const input2 = document.getElementById("cardNumber2").value;
    const input3 = document.getElementById("cardNumber3").value;
    const input4 = document.getElementById("cardNumber4").value;
    const cardNumber = input1 + input2 + input3 + input4; const expirationDate = document.getElementById('expirationDate').value;
    const cvv = document.getElementById('cvv').value.trim();
    let check = true;
    if (!cardNumber) {
        // orderMessageElement.textContent = 'Please fill in all the credit card details.';
        showMessage('Please fill in all the credit card details.', "cardNumberError");
        check = false;
        // return;
    }

    else if (!validateCardNumber(cardNumber)) {
        // orderMessageElement.textContent = 'Invalid credit card number. Please check and try again.';
        showMessage('Invalid credit card number. Please check and try again.', "cardNumberError");
        // return;
        check = false;

    }

    if (!cvv) {
        // orderMessageElement.textContent = 'Please fill in all the credit card details.';
        showMessage('Please fill in all the credit card details.', "cvvError");
        // return;
        check = false;

    }
    else if (!validateCVV(cvv)) {
        // orderMessageElement.textContent = 'Invalid CVV. Please check and try again.';
        showMessage('Invalid CVV. Please check and try again.', "cvvError");
        check = false;

        // return;
    }

    if (!expirationDate) {
        // orderMessageElement.textContent = 'Please fill in all the credit card details.';
        showMessage('Please fill in all the credit card details.', "expirationDateError");
        // return;
        check = false;

    }
    else if (!validateExpiryDate(expirationDate)) {
        // orderMessageElement.textContent = 'Invalid expiration date. Please check and try again.';
        // showMessage('Invalid expiration date. Please check and try again.', "expirationDateError");
        check = false;

        // return;
    }

    if (!rentalPrice > 0) {
        // Assuming loggedInUserId is the user ID of the currently logged-in user

        // Proceed with the rental process (e.g., add to Firestore or call your backend API)
        showMessage('Please select a rental duration before confirming.', "rentalDurationError");
        check = false;
        // Add rental to Firestore (assuming a Firestore function to update the user's rentals)
    }

    if (check) {
        document.getElementById("confirmRental").setAttribute('disabled', 'true');
        document.getElementById("loading").style.display = "flex";
        addRentalToUserOrder(loggedInUserId, movieTitle, rentalDuration, rentalPrice);


    }
});
// document.getElementById("expirationDate").addEventListener("input", formatExpiry)
// document.getElementById("expirationDate").addEventListener("keydown", handleBackspace)
const expiryInput = document.getElementById('expirationDate');
// Add input event listener for formatting the expiry date
expiryInput.addEventListener('input', () => formatExpiry(expiryInput));
// Add keydown event listener for handling backspace
expiryInput.addEventListener('keydown', (event) => handleBackspace(expiryInput, event));

const subExpiryInput = document.getElementById('expirationDate1');
// Add input event listener for formatting the expiry date
subExpiryInput.addEventListener('input', () => formatExpiry(subExpiryInput));
// Add keydown event listener for handling backspace
subExpiryInput.addEventListener('keydown', (event) => handleBackspace(subExpiryInput, event));

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, ''); // Remove all non-numeric characters

    // Add slash after two digits of the month
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
}

// Handle input to ensure the slash is correctly removed on backspace
function handleBackspace(input, event) {
    let value = input.value;

    // If backspace is pressed and the slash is at the end, remove it
    if (event.key === "Backspace" && value.charAt(value.length - 1) === '/') {
        input.value = value.slice(0, -1);  // Remove the slash when backspace is pressed
    }
}

function validateExpiryDate(expiryInput) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Get current month (1-12)
    const currentYear = currentDate.getFullYear() % 100; // Get last two digits of current year

    // Regex to check MM/YY format
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiryInput)) {
        showMessage('Please enter a valid expiry date in MM/YY format.', "expirationDateError");

        // alert("Please enter a valid expiry date in MM/YY format.");
        return false;
    }

    // Extract the month and year from input
    const [inputMonth, inputYear] = expiryInput.split('/').map(Number);

    // Check if the expiry date is in the future
    if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
        showMessage('The expiry date must be a future date.', "expirationDateError");

        // alert("The expiry date must be a future date.");
        return false;
    }

    // alert("Expiry date is valid.");
    return true;
}

function validateExpiryDate1(expiryInput) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Get current month (1-12)
    const currentYear = currentDate.getFullYear() % 100; // Get last two digits of current year

    // Regex to check MM/YY format
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiryInput)) {
        showMessage('Please enter a valid expiry date in MM/YY format.', "expirationDateError1");

        // alert("Please enter a valid expiry date in MM/YY format.");
        return false;
    }

    // Extract the month and year from input
    const [inputMonth, inputYear] = expiryInput.split('/').map(Number);

    // Check if the expiry date is in the future
    if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
        showMessage('The expiry date must be a future date.', "expirationDateError1");

        // alert("The expiry date must be a future date.");
        return false;
    }

    // alert("Expiry date is valid.");
    return true;
}

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    const loading = document.getElementById("loading");
    loading.style.display = "none";
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.innerHTML = "";
        messageDiv.style.opacity = 0;
    }, 5000);
}
// Validate credit card number using Luhn algorithm
function validateCardNumber(cardNumber) {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}
const inputField = document.getElementById('cardNumber1');

inputField.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space after every 4 digits
    e.target.value = value; // Update the input value with spaces
});
// Validate CVV (3 digits)
function validateCVV(cvv) {
    return /^\d{3}$/.test(cvv);
}

// Validate expiration date (ensure it is not in the past)
function validateExpirationDate(expirationDate) {
    const today = new Date();
    const expiration = new Date(expirationDate + '-01');
    return expiration >= today;
}

// Function to add rental to the user's order list in Firestore
async function addRentalToUserOrder(userId, movieTitle, duration, rentalPrice) {
    try {
        const userRef = doc(db, "users", userId);  // Reference to user's document in Firestore
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const rentals = userData.rentals || [];

            // If duration is 24 hours, convert it to 1 day
            let rentalDurationInDays = parseInt(duration);
            if (duration === '24') {
                rentalDurationInDays = 1;  // Treat 24 hours as 1 day
            }

            // Get the current date as rentalDate
            const rentalDate = new Date();
            function calculateExpirationDate(rentalDurationInDays) {
                const rentalDate = new Date(); // Get the current date
                rentalDate.setUTCDate(rentalDate.getUTCDate() + rentalDurationInDays); // Add the rental duration in days
                return rentalDate.toISOString(); // Return the expiration date in ISO format
            }
            // Calculate the rental expiration date
            const rentalExpiration = calculateExpirationDate(rentalDurationInDays);

            // Add the rental info to the user's rentals array
            rentals.push({
                title: movieTitle,
                duration: rentalDurationInDays,
                price: rentalPrice,
                rentalDate: rentalDate.toISOString(),
                rentalExpiration: rentalExpiration  // Store expiration time in ISO format
            });

            // let rentalHistory = [{
            //     rentedDate: rentalDate,
            //     expiredDate: rentalExpiration,
            //     rentedDuration: rentalDurationInDays+" "+" Days"
            // }]
            // // Update the user's rentals array in Firestore
            await updateDoc(userRef, { rentals });
            // await updateDoc(userRef, { rentalHistory });
            const newRentalEntry = {
                rentedDate: rentalDate.toISOString(),
                expiredDate: rentalExpiration,
                rentedDuration: rentalDurationInDays + " Days",
                title: movieTitle
            };

            // Use arrayUnion to add the new rental entry to the rentalHistory array
            await updateDoc(userRef, {
                rentalHistory: arrayUnion(newRentalEntry)
            });
            document.getElementById("loading").style.display = "none";
            document.getElementById("orderMessage").textContent = `Successfully rented ${movieTitle} for ${rentalDurationInDays} day(s)!`;
            setTimeout(() => {
                document.getElementById("loading").style.display = "flex";
                window.history.replaceState(null, null, `../details/details.html?title=${encodeURIComponent(movieTitle)}`);
                window.location.replace(`../details/details.html?title=${encodeURIComponent(movieTitle)}`);
                window.location.href = `../details/details.html?title=${encodeURIComponent(movieTitle)}`;
            }, 2000);

            console.log('Rental added to user order list');
        } else {
            throw new Error("User document not found.");
        }
    } catch (error) {
        console.error("Error adding rental to user order:", error);
    }
}

// Function to remove expired rentals
function calculateExpirationDate() {
    const rentalDate = new Date(); // Get the current date
    rentalDate.setMonth(rentalDate.getMonth() + 1); // Add 1 month to the current date
    return rentalDate.toISOString(); // Return the expiration date in ISO format
}


function profileNameCreator() {
    // document.getElementById("search").value = "";
    document.getElementById("user").classList.remove("bg-black"); // Example: setting random background color
    document.getElementById("user").classList.add("border");
    document.getElementById("user").classList.add("border-white");
    document.getElementById("user").classList.add("border-4");

    // rounded-circle border-white border border-5
    let profileName = localStorage.getItem("name");
    console.log(profileName)
    let color = localStorage.getItem("color");
    console.log(color)
    // document.getElementById("userIcon").style.display = "none";
    if (/^[a-zA-Z]/.test(profileName[0])) {
        document.getElementById("profileName").textContent = profileName[0].toUpperCase();
        // document.getElementById("profile").textContent = profileName[0].toUpperCase();
        document.getElementById("user").style.backgroundColor = color; // Example: setting random background color
        // document.getElementById("prof").style.backgroundColor = color; // Example: setting random background color

    } else {
        document.getElementById("profileName").textContent = "#";
        // document.getElementById("profile").textContent = "#";
        // document.getElementById("prof").style.backgroundColor = color; // Example: setting random background color
        document.getElementById("user").style.backgroundColor = color; // Example: setting random background color
    }
    // document.getElementById("loading").style.display = "none";

}

document.getElementById('confirmSub').addEventListener('click', function () {
    // const rentalDuration = document.getElementById('rentalDuration').value;
    // const rentalPriceElement = document.getElementById('rentalPrice').textContent;
    // const rentalPrice = parseFloat(rentalPriceElement.replace('Price: $', '').trim());

    // const document.getElementById("orderMessage") = document.getElementById('orderMessage');

    // Credit Card Validation
    // const cardNumber = document.getElementById('cardNumber1').value.trim();
    const expirationDate = document.getElementById('expirationDate1').value;
    const cvv = document.getElementById('cvv1').value.trim();
    const input1 = document.getElementById("cardNumber5").value;
    const input2 = document.getElementById("cardNumber6").value;
    const input3 = document.getElementById("cardNumber7").value;
    const input4 = document.getElementById("cardNumber8").value;
    const cardNumber = input1 + input2 + input3 + input4;

    let sub = true;
    if (!cardNumber) {
        // orderMessageElement.textContent = 'Please fill in all the credit card details.';
        showMessage('Please fill in all the credit card details.', "cardNumberError1");
        sub = false;
        // return;
    }

    else if (!validateCardNumber(cardNumber)) {
        // orderMessageElement.textContent = 'Invalid credit card number. Please check and try again.';
        showMessage('Invalid credit card number. Please check and try again.', "cardNumberError1");
        // return;
        sub = false;

    }

    if (!cvv) {
        // orderMessageElement.textContent = 'Please fill in all the credit card details.';
        showMessage('Please fill in all the credit card details.', "cvvError1");
        // return;
        sub = false;

    }
    else if (!validateCVV(cvv)) {
        // orderMessageElement.textContent = 'Invalid CVV. Please check and try again.';
        showMessage('Invalid CVV. Please check and try again.', "cvvError1");
        sub = false;

        // return;
    }

    if (!expirationDate) {
        // orderMessageElement.textContent = 'Please fill in all the credit card details.';
        showMessage('Please fill in all the credit card details.', "expirationDateError1");
        // return;
        sub = false;

    }
    else if (!validateExpiryDate1(expirationDate)) {
        // orderMessageElement.textContent = 'Invalid expiration date. Please check and try again.';
        // showMessage('Invalid expiration date. Please check and try again.', "expirationDateError1");
        sub = false;

        // return;
    }

    // if (!rentalPrice > 0) {
    //     // Assuming loggedInUserId is the user ID of the currently logged-in user

    //     // Proceed with the rental process (e.g., add to Firestore or call your backend API)
    //     showMessage('Please select a rental duration before confirming.', "rentalDurationError");
    //     sub = false;
    //     // Add rental to Firestore (assuming a Firestore function to update the user's rentals)
    // } 

    if (sub) {
        //     orderMessageElement.textContent = `Successfully rented ${movieTitle} for ${rentalDuration} day(s)!`;
        // addRentalToUserOrder(loggedInUserId, movieTitle, rentalDuration, rentalPrice);
        document.getElementById("confirmSub").setAttribute('disabled', 'true');
        document.getElementById("loading").style.display = "flex";
        updateSubscriptionStatus(loggedInUserId, true);
    }
});

async function updateSubscriptionStatus(userId, status) {
    try {
        const userRef = doc(db, "users", userId);  // Reference to user's document in Firestore

        // Update the subscription field
        // userRef.update({
        //     subscription: status // true or false
        // })
        const subscribedOn = new Date().toISOString();
        const subscriptionExpiration = calculateExpirationDate();
        let subscription = {
            status: status,
            expiration: subscriptionExpiration,
            subscribedOn: subscribedOn
        };
        await updateDoc(userRef, { subscription });
        console.log("Subscription status updated successfully!");
        document.getElementById("loading").style.display = "none";
        document.getElementById("subMessage").textContent = `Successfully subscribed for 1 month!`;
        setTimeout(() => {
            document.getElementById("loading").style.display = "flex";
            window.history.replaceState(null, null, `../../index.html`);
            window.location.replace(`../../index.html`);
            window.location.href = `../../index.html`;
        }, 2000);

    }
    catch (error) {
        console.error(error);
    }

}

// try {
//     const userRef = doc(db, "users", userId);  // Reference to user's document in Firestore
//     const userDoc = await getDoc(userRef);

//     if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const rentals = userData.rentals || [];

//         // If duration is 24 hours, convert it to 1 day
//         let rentalDurationInDays = parseInt(duration);
//         if (duration === '24') {
//             rentalDurationInDays = 1;  // Treat 24 hours as 1 day
//         }

//         // Get the current date as rentalDate
//         const rentalDate = new Date();

//         // Calculate the rental expiration date
//         const rentalExpiration = calculateExpirationDate(rentalDurationInDays);

//         // Add the rental info to the user's rentals array
//         rentals.push({
//             title: movieTitle,
//             duration: rentalDurationInDays,
//             price: rentalPrice,
//             rentalDate: rentalDate.toISOString(),
//             rentalExpiration: rentalExpiration  // Store expiration time in ISO format
//         });

//         // Update the user's rentals array in Firestore
//         await updateDoc(userRef, { rentals });
//         window.history.replaceState(null, null, `../details/details.html?title=${encodeURIComponent(movieTitle)}`);
//         window.location.replace( `../details/details.html?title=${encodeURIComponent(movieTitle)}`);
//         window.location.href = `../details/details.html?title=${encodeURIComponent(movieTitle)}`;
//         console.log('Rental added to user order list');
//     } else {
//         throw new Error("User document not found.");
//     }
// } catch (error) {
//     console.error("Error adding rental to user order:", error);
// }



const mediaQuery1 = window.matchMedia('(max-width: 767px)');
// const mediaQuery2 = window.matchMedia('(max-width: 767px)');

// Check if the media query matches
if (mediaQuery1.matches) {
    // Code for small screens (mobile/tablet)
    document.getElementById("rental").classList.remove("row");
    document.getElementById("container").classList.remove("p-5");
    document.getElementById("container").classList.remove("p-5");
} else {
    // Code for larger screens (desktop)
    console.log("Screen is wider than 768px");
}

const cardNumber1 = document.getElementById("cardNumber1");
const cardNumber2 = document.getElementById("cardNumber2");
const cardNumber3 = document.getElementById("cardNumber3");
const cardNumber4 = document.getElementById("cardNumber4");
cardNumber1.addEventListener('input', function (event) {
    moveToNext(event, 'cardNumber2');
});

cardNumber2.addEventListener('input', function (event) {
    moveToNext(event, 'cardNumber3');
});

cardNumber3.addEventListener('input', function (event) {
    moveToNext(event, 'cardNumber4');

    // Optionally, you can loop or reset focus here.
    // In this case, no action is needed as it's the last input field.
});
function moveToNext(event, nextInputId) {
    const currentInput = event.target;
    if (currentInput.value.length === 4) {
        const nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus(); // Move focus to next input
        }
    }
}

function moveFocus(event, currentInputId, nextInputId, prevInputId) {
    const currentInput = event.target;

    // Check if the input reached max length or if the backspace is pressed and the field is empty
    if (currentInput.value.length === 4) {
        const nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus(); // Move focus to next input
        }
    } else if (currentInput.value.length === 0 && event.inputType === 'deleteContentBackward') {
        const prevInput = document.getElementById(prevInputId);
        if (prevInput) {
            prevInput.focus(); // Move focus to previous input when backspace is pressed on an empty field
        }
    }
}

function handleFocus(event) {
    const inputs = document.querySelectorAll('input');
    const allEmpty = Array.from(inputs).every(input => input.value === '');

    if (allEmpty) {
        document.getElementById('cardNumber1').focus(); // Focus on the first input field if all are empty
    }
}

function handleFocus1(event) {
    const inputs = document.querySelectorAll('input');
    const allEmpty = Array.from(inputs).every(input => input.value === '');

    if (allEmpty) {
        document.getElementById('cardNumber5').focus(); // Focus on the first input field if all are empty
    }
}

cardNumber1.addEventListener('input', function (event) {
    moveFocus(event, 'cardNumber1', 'cardNumber2', null);
});

// Input 2
cardNumber2.addEventListener('input', function (event) {
    moveFocus(event, 'cardNumber2', 'cardNumber3', 'cardNumber1');
});

// Input 3
cardNumber3.addEventListener('input', function (event) {
    moveFocus(event, 'cardNumber3', 'cardNumber4', 'cardNumber2');
});

// Input 4
cardNumber4.addEventListener('input', function (event) {
    moveFocus(event, 'cardNumber4', null, 'cardNumber3');
});

const cardNumber5 = document.getElementById("cardNumber5");
const cardNumber6 = document.getElementById("cardNumber6");
const cardNumber7 = document.getElementById("cardNumber7");
const cardNumber8 = document.getElementById("cardNumber8");
cardNumber1.addEventListener('input', function (event) {
    moveToNext(event, 'cardNumber6');
});

cardNumber6.addEventListener('input', function (event) {
    moveToNext(event, 'cardNumber7');
});

cardNumber7.addEventListener('input', function (event) {
    moveToNext(event, 'cardNumber8');

    // Optionally, you can loop or reset focus here.
    // In this case, no action is needed as it's the last input field.
});


cardNumber5.addEventListener('input', function (event) {
    moveFocus(event, 'cardNumber5', 'cardNumber6', null);
});

// Input 2
cardNumber6.addEventListener('input', function (event) {
    moveFocus(event, 'cardNumber6', 'cardNumber7', 'cardNumber5');
});

// Input 3
cardNumber7.addEventListener('input', function (event) {
    moveFocus(event, 'cardNumber7', 'cardNumber8', 'cardNumber6');
});

// Input 4
cardNumber8.addEventListener('input', function (event) {
    moveFocus(event, 'cardNumber8', null, 'cardNumber7');
});


cardNumber1.addEventListener('focus', handleFocus);
cardNumber2.addEventListener('focus', handleFocus);
cardNumber3.addEventListener('focus', handleFocus);
cardNumber4.addEventListener('focus', handleFocus);

cardNumber5.addEventListener('focus', handleFocus1);
cardNumber6.addEventListener('focus', handleFocus1);
cardNumber7.addEventListener('focus', handleFocus1);
cardNumber8.addEventListener('focus', handleFocus1);