document.getElementById("loading").style.display = "flex";
document.getElementById("loadMessage").textContent = "Please Wait...";



import { getAuth,  onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

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

            // Insert the movie details into the HTML
            movieContainer.innerHTML = `
                <h1 class="text-start">${movieDetails.title}</h1>
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
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const expirationDate = document.getElementById('expirationDate').value;
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

    if ( !cvv) {
        // orderMessageElement.textContent = 'Please fill in all the credit card details.';
        showMessage('Please fill in all the credit card details.', "cvvError");
        // return;
        check = false;

    }
    else if(!validateCVV(cvv)) {
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
    else if (!validateExpirationDate(expirationDate)) {
        // orderMessageElement.textContent = 'Invalid expiration date. Please check and try again.';
        showMessage('Invalid expiration date. Please check and try again.', "expirationDateError");
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

    if (check){
            orderMessageElement.textContent = `Successfully rented ${movieTitle} for ${rentalDuration} day(s)!`;
        addRentalToUserOrder(loggedInUserId, movieTitle, rentalDuration, rentalPrice);
        document.getElementById("loading").style.display = "flex";

    }
});
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

            // Update the user's rentals array in Firestore
            await updateDoc(userRef, { rentals });
            window.history.replaceState(null, null, `../details/details.html?title=${encodeURIComponent(movieTitle)}`);
            window.location.replace( `../details/details.html?title=${encodeURIComponent(movieTitle)}`);
            window.location.href = `../details/details.html?title=${encodeURIComponent(movieTitle)}`;
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
    document.getElementById("user").classList.add("border-5");

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

    // const orderMessageElement = document.getElementById('orderMessage');

    // Credit Card Validation
    const cardNumber = document.getElementById('cardNumber1').value.trim();
    const expirationDate = document.getElementById('expirationDate1').value;
    const cvv = document.getElementById('cvv1').value.trim();
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

    if ( !cvv) {
        // orderMessageElement.textContent = 'Please fill in all the credit card details.';
        showMessage('Please fill in all the credit card details.', "cvvError1");
        // return;
        sub = false;

    }
    else if(!validateCVV(cvv)) {
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
    else if (!validateExpirationDate(expirationDate)) {
        // orderMessageElement.textContent = 'Invalid expiration date. Please check and try again.';
        showMessage('Invalid expiration date. Please check and try again.', "expirationDateError1");
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

    if (sub){
        //     orderMessageElement.textContent = `Successfully rented ${movieTitle} for ${rentalDuration} day(s)!`;
        // addRentalToUserOrder(loggedInUserId, movieTitle, rentalDuration, rentalPrice);
        document.getElementById("loading").style.display = "flex";
        updateSubscriptionStatus(loggedInUserId, true);
    }
});

async function updateSubscriptionStatus(userId, status) {
    try{
    const userRef = doc(db, "users", userId);  // Reference to user's document in Firestore

    // Update the subscription field
    // userRef.update({
    //     subscription: status // true or false
    // })
    const subscriptionExpiration = calculateExpirationDate();
    let subscription = {
        status: status,
        expiration: subscriptionExpiration
    };
    await updateDoc(userRef, { subscription });
    console.log("Subscription status updated successfully!");
    window.history.replaceState(null, null, `../../index.html`);
    window.location.replace( `../../index.html`);
    window.location.href = `../../index.html`;
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