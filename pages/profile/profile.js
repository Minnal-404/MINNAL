document.getElementById("loading").style.display = "flex";
document.getElementById("loadMessage").textContent = "Please Wait...";

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
// import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, getDocs, setDoc, getDoc, doc, updateDoc, arrayUnion, arrayRemove, deleteField } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyBGsxpj36xgkU9wCSILp7LZlyA6DRlbU5Q",
    authDomain: "login-9207d.firebaseapp.com",
    projectId: "login-9207d",
    storageBucket: "login-9207d.appspot.com",
    messagingSenderId: "269390570547",
    appId: "1:269390570547:web:49318f71d76faf656baf46"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const auth = getAuth();
const db = getFirestore();

let check = false;
let color1 = null;
function checkUserExists() {
    // This could be a check for a cookie, local storage, or API request
    return localStorage.getItem('loggedInUserId') !== null; // Example using local storage
}

// Redirect to home page if user exists
const loggedInUserId = localStorage.getItem("loggedInUserId");

if (checkUserExists()) {
    check = true;
    onAuthStateChanged(auth, (user) => {
        if (loggedInUserId) {
            const docRef = doc(db, "users", loggedInUserId);
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        localStorage.setItem("name", userData.name);
                        document.getElementById("profName").textContent = userData.name;
                        document.getElementById("profEmail").textContent = userData.email;
                        profileNameCreator();

                        // profileNameCreator();
                    } else {
                        console.log("No document found matching id")
                    }
                })
                .catch((error) => {
                    console.log("Error getting document", error);
                })
        } else {
            console.log("User Id not found in local storage")
        }
    });

    //   window.location.href = 'pages/home/home.html'; // Replace with your home page URL
}

function profileNameCreator() {
    // document.getElementById("search").value = "";
    // const userData = docSnapshot.data();
    let profileImage = localStorage.getItem("profileImage");

  if (profileImage){
    document.getElementById("preview").style.display = "block";
    document.getElementById("profileImage").style.display = "block";
    document.getElementById("profileName").style.display = "none";
    document.getElementById("removeIcon").classList.remove('d-none')
    document.getElementById("colorIcon").classList.add('d-none')

    document.getElementById("user").classList.add("border");
    document.getElementById("user").classList.add("border-white");
    document.getElementById("user").classList.add("border-4");
    document.getElementById("user").classList.add("rounded-circle");
    document.getElementById("user").style.width = "3rem";
    // document.getElementById("user").classList.add("justify-content-center");
    document.getElementById("profileImage").src = profileImage;
    document.getElementById("preview").src = profileImage;
  } else {
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
            document.getElementById("profile").textContent = profileName[0].toUpperCase();
            document.getElementById("user").style.backgroundColor = color; // Example: setting random background color
            document.getElementById("prof").style.backgroundColor = color; // Example: setting random background color

        } else {
            document.getElementById("profileName").textContent = "#";
            document.getElementById("profile").textContent = "#";
            document.getElementById("prof").style.backgroundColor = color; // Example: setting random background color
            document.getElementById("user").style.backgroundColor = color; // Example: setting random background color
        }
    }
    document.getElementById("loading").style.display = "none";

}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {


    signOut(auth)
        .then(() => {
            localStorage.clear();

            window.history.replaceState(null, null, "../../index.html"); // Prevent going back
            window.location.replace("../../index.html");
        })
        .catch((error) => {
            console.error("Error Signing out", error);
        });

});

const mediaQuery = window.matchMedia('(max-width: 767px)');
const mediaQuery1 = window.matchMedia('(max-width: 1023px)');


const rentalsSection = document.getElementById("rentalsSection");
const wishlistSection = document.getElementById("wishlistSection");
const profileSection = document.getElementById("profileSection");
const profileSec = document.getElementById("profileSec");
const rented = document.getElementById("rented");
const wishlist = document.getElementById("wishlist");

profileSec.style.backgroundImage = 'linear-gradient(to  right, green, black)';


profileSec.addEventListener("click", () => {

    if (mediaQuery1.matches) {
        rentalsSection.style.display = "none";
        wishlistSection.style.display = "none";

        profileSec.classList.add("text-white");
        profileSec.style.backgroundImage = 'linear-gradient(to  right, green, black)';

        // profileSec.classList.remove("border-success");
        // profileSec.classList.remove("border-top-0");
        // profileSec.classList.remove("border-bottom-0");
        // profileSec.classList.remove("border-end-0");

        // wishlist.classList.add("border-success");
        wishlist.classList.remove("text-white");
        wishlist.style.backgroundImage = '';

        // wishlist.classList.add("border-top");

        // rented.classList.add("border-bottom");
        // rented.classList.remove("border-white");
        // rented.classList.add("border-success");
        rented.classList.remove("text-white");
        rented.style.background = '';

        // rented.classList.add("border-top-0");



        profileSection.style.display = "block";
    } else {

        rentalsSection.style.display = "none";
        wishlistSection.style.display = "none";

        profileSec.classList.add("text-white");
        // profileSec.classList.remove("border-success");
        // profileSec.classList.remove("border-top-0");
        // profileSec.classList.remove("border-bottom-0");

        // wishlist.classList.add("border-success");
        wishlist.classList.remove("text-white");

        // wishlist.classList.add("border-top");

        // rented.classList.add("border-bottom");
        // rented.classList.remove("border-white");
        // rented.classList.add("border-success");
        rented.classList.remove("text-white");
        // rented.classList.add("border-top-0");

        profileSec.style.backgroundImage = 'linear-gradient(to  right, green, black)';
        wishlist.style.background = '';
        rented.style.background = '';

        profileSection.style.display = "block";
    }
});
rented.addEventListener("click", () => {
    if (mediaQuery1.matches) {

        wishlistSection.style.display = "none";
        profileSection.style.display = "none";

        // rented.classList.remove("border-success");
        // rented.classList.remove("border-top-0");
        rented.classList.add("text-white");
        rented.style.backgroundImage = 'linear-gradient(to  right, green, black)';

        // rented.classList.remove("border-bottom-0");
        // rented.classList.remove("border-end-0");


        profileSec.classList.remove("text-white");
        profileSec.style.background = '';

        // profileSec.classList.add("border-success");
        // profileSec.classList.remove("border-top-0");
        // profileSec.classList.add("border-bottom-0");

        // wishlist.classList.add("border-success");
        wishlist.classList.remove("text-white");
        wishlist.style.background = '';

        // wishlist.classList.add("border-top-0");

        rentalsSection.style.display = "flex";
    } else {
        wishlistSection.style.display = "none";
        profileSection.style.display = "none";

        // rented.classList.remove("border-success");
        // rented.classList.remove("border-top-0");
        rented.classList.add("text-white");
        // rented.classList.remove("border-bottom-0");
        // // rented.classList.remove("border-end-0");


        profileSec.classList.remove("text-white");
        // profileSec.classList.add("border-success");
        // profileSec.classList.add("border-top-0");
        // profileSec.classList.add("border-bottom-0");

        // wishlist.classList.add("border-success");
        wishlist.classList.remove("text-white");
        // wishlist.classList.add("border-top-0");

        rented.style.backgroundImage = 'linear-gradient(to  right, green, black)';
        profileSec.style.background = '';
        wishlist.style.background = '';


        rentalsSection.style.display = "flex";
    }
});
wishlist.addEventListener("click", () => {
    if (mediaQuery1.matches) {

        rentalsSection.style.display = "none";
        profileSection.style.display = "none";

        profileSec.classList.remove("text-white");
        profileSec.style.background = '';


        // profileSec.classList.add("border-success");
        // profileSec.classList.remove("border-top-0");
        // profileSec.classList.add("border-bottom-0");
        // wishlist.classList.remove("border-success");
        // wishlist.classList.remove("border-top-0");
        wishlist.classList.add("text-white");
        // wishlist.classList.remove("border-end-0");
        wishlist.style.backgroundImage = 'linear-gradient(to  right, green, black)';



        // rented.classList.add("border-bottom-0");
        // rented.classList.remove("border-white");
        // rented.classList.add("border-success");
        rented.classList.remove("text-white");
        rented.style.background = '';


        wishlistSection.style.display = "flex";
    } else {
        rentalsSection.style.display = "none";
        profileSection.style.display = "none";

        profileSec.classList.remove("text-white");
        // profileSec.classList.add("border-success");
        // profileSec.classList.add("border-top-0");
        // // profileSec.classList.add("border-bottom-0");
        // wishlist.classList.remove("border-success");
        // wishlist.classList.remove("border-top-0");
        wishlist.classList.add("text-white");
        // // wishlist.classList.remove("border-end-0");


        // rented.classList.add("border-bottom-0");
        // rented.classList.remove("border-white");
        // rented.classList.add("border-success");
        rented.classList.remove("text-white");

        wishlist.style.backgroundImage = 'linear-gradient(to  right, green, black)';
        profileSec.style.background = '';
        rented.style.background = '';


        wishlistSection.style.display = "flex";
    }
});

// Assuming `loggedInUserId` is the email or ID of the logged-in user

// Function to fetch the wishlist from Firestore
function fetchWishlist(loggedInUserId) {
    const userDocRef = doc(db, "users", loggedInUserId); // Reference to the user's document

    // Get the user's document
    getDoc(userDocRef)
        .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                // Document exists, get the wishlist array
                const wishlist = docSnapshot.data().wishlist;

                if (wishlist && wishlist.length > 0) {
                    // Do something with the wishlist, e.g., display it on the page
                    console.log("Wishlist:", wishlist);
                    displayWishlist(wishlist);
                } else {
                    console.log("Wishlist is empty.");
                    // document.getElementById("wishlistError").textContent = "Your wishlist is empty!";
                }
            } else {
                // If the document doesn't exist, handle the case
                console.error("User document does not exist!");
                document.getElementById("wishlistError").textContent = "User document does not exist!";
            }
        })
        .catch((error) => {
            console.error("Error fetching wishlist: ", error);
            document.getElementById("wishlistError").textContent = "Error fetching wishlist!";
        });
}

// Function to display the wishlist
// Display the wishlist items by fetching the full movie details from Firestore
function displayWishlist(wishlist) {
    const wishlistSection = document.getElementById("wishlistSection");
    wishlistSection.innerHTML = "";  // Clear previous content

    // Loop through the wishlist and fetch details for each movie
    wishlist.forEach(async (movieTitle) => {
        console.log(movieTitle, "Fetching details...");

        // Fetch movie details based on title (asynchronously)
        const movieDetails = await getMovieDetailsByTitle(movieTitle);

        if (movieDetails) {
            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie';

            // Create a link for each movie poster (ensure the query parameter is 'title')
            // const movieLink = document.createElement('a');
            // movieLink.href = `pages/details/details.html?title=${encodeURIComponent(movieDetails.title)}`;  // Correctly passing 'title'

            // Insert the movie poster and title inside the link
            movieDiv.innerHTML = `<img src="${movieDetails.poster}" alt="${movieDetails.title}"><h2>${movieDetails.title}</h2><p>${movieDetails.year}</p>
            <div class="popups flex-column" >
              <div class="p-0">
                  <img src="${movieDetails.thumbnails}" alt="${movieDetails.title}"></div>
                  <div class="p-3 d-flex flex-column gap-3">
                  <h2>${movieDetails.title}</h2>
                  <div class="d-flex gap-4 justify-content-between">
                  <a href="../details/details.html?title=${encodeURIComponent(movieDetails.title)}">
                  <button id="watch" class="btn btn-success">Watch Now</button>
                  </a>
                  <button id="add" class="add-to-wishlist btn " data-title="${movieDetails.title}"><i class="fa-regular fa-heart fa-2xl"></i></button>
                  </div>
                  <p id="wishlistError" class="m-0 text- wishlist-error"></p>
                  <p id="wishlistSuccess" class="m-0 text-success wishlist-"></p>
                  <div class="d-flex justify-content-evenly">
                  <p class="m-0">${movieDetails.year}</p> <p class="m-0">•</p> <p class="m-0">${movieDetails.duration}</p> <p class="m-0">•</p> <p class="m-0 bg-success px-2 rounded-1"><strong>${movieDetails.rating}/5</strong></p>
                  </div>
            <p class="m-0">${movieDetails.description}</p>  
            </div>
          </div>`;

            // Append the movie link div to the container
            // movieDiv.appendChild(movieLink);
            wishlistSection.appendChild(movieDiv);

            const buttons = document.querySelectorAll('.add-to-wishlist');
            buttons.forEach(button => {
                const movieTitle = button.getAttribute('data-title');
                const buttonIcon = button.querySelector('i'); // Get the icon inside the button
                const errorMessageElement = document.getElementById("wishlistError");

                // Add click event listener to toggle the button icon and remove the movie
                button.addEventListener('click', function () {
                    document.getElementById("loading").style.display = "flex";

                    toggleWishlist(loggedInUserId, movieTitle, button, buttonIcon, errorMessageElement);
                });

                // Check if the movie is in the wishlist on page load to set the correct button icon
                checkMovieInWishlist(loggedInUserId, movieTitle, buttonIcon);
            });

            // Function to check if the movie is already in the wishlist
            function checkMovieInWishlist(loggedInUserId, movieTitle, buttonIcon) {
                const userDocRef = doc(db, "users", loggedInUserId); // Reference to the user's document in Firestore

                // Get the current wishlist array from Firestore
                getDoc(userDocRef).then(docSnapshot => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data();
                        const currentWishlist = userData.wishlist || [];

                        // If the movie is in the wishlist, show the minus icon (fa-minus)
                        if (currentWishlist.includes(movieTitle)) {
                            buttonIcon.classList.remove('fa-regular');
                            buttonIcon.style.color = 'red';
                            buttonIcon.classList.add('fa-solid');
                        } else {
                            buttonIcon.classList.remove('fa-solid');
                            buttonIcon.style.color = 'white';
                            buttonIcon.classList.add('fa-regular');
                        }
                    }
                }).catch((error) => {
                    console.error("Error fetching user document: ", error);
                });
            }

            // Function to toggle the movie in the wishlist and update the UI
            // Function to toggle the movie in the wishlist and update the UI
            // Function to toggle the movie in the wishlist and update the UI
            function toggleWishlist(loggedInUserId, movieTitle, button, buttonIcon, errorMessageElement) {
                const userDocRef = doc(db, "users", loggedInUserId); // Reference to the user's document in Firestore

                // Clear previous error message
                errorMessageElement.textContent = "";

                // Get the current wishlist array from Firestore
                getDoc(userDocRef).then(docSnapshot => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data();
                        const currentWishlist = userData.wishlist || [];

                        console.log("Current Wishlist: ", currentWishlist);

                        // Check if the movie title is already in the wishlist
                        if (currentWishlist.includes(movieTitle)) {
                            // Movie is already in the wishlist, remove it
                            updateDoc(userDocRef, {
                                wishlist: arrayRemove(movieTitle) // Remove the movie title from the wishlist array
                            })
                                .then(() => {
                                    console.log(`${movieTitle} removed from wishlist in Firestore!`);
                                    showMessage(`${movieTitle} removed from your wishlist.`, errorMessageElement, "red");

                                    // Change the button icon to plus after removal
                                    buttonIcon.classList.remove('fa-solid');
                                    buttonIcon.style.color = 'white';
                                    buttonIcon.classList.add('fa-regular');

                                    // Remove the movie element from the DOM
                                    button.closest('.movie').remove();  // Remove the movie div from the page

                                    // After removal, check if the wishlist is empty and update the UI
                                    checkIfWishlistIsEmpty(loggedInUserId);
                                })
                                .catch((error) => {
                                    console.error("Error removing from wishlist: ", error);
                                    showMessage(`Error removing from wishlist: ${error.message}`, errorMessageElement, "red");
                                });
                        } else {
                            // If movie is not in the wishlist, add it using arrayUnion
                            updateDoc(userDocRef, {
                                wishlist: arrayUnion(movieTitle)
                            })
                                .then(() => {
                                    console.log(`${movieTitle} added to wishlist in Firestore!`);
                                    showMessage(`${movieTitle} added to your wishlist!`, errorMessageElement, "green");

                                    // Change the button icon to minus after adding
                                    buttonIcon.classList.remove('fa-regular');
                                    buttonIcon.style.color = 'red';
                                    buttonIcon.classList.add('fa-solid');

                                })
                                .catch((error) => {
                                    console.error("Error adding to wishlist: ", error);
                                    showMessage(`Error adding to wishlist: ${error.message}`, errorMessageElement, "red");
                                });
                        }
                    } else {
                        // If the user document doesn't exist, create a new one with the wishlist field
                        console.error("User document does not exist. Creating a new document...");
                        showMessage("User document does not exist. Creating a new document...", errorMessageElement, "red");

                        // Create a new document with the wishlist containing the movie title
                        setDoc(userDocRef, { wishlist: [movieTitle] })
                            .then(() => {
                                console.log("New user document created with wishlist!");
                                showMessage("New user document created with wishlist!", errorMessageElement, "green");

                                // Change the button icon to minus after adding
                                buttonIcon.classList.remove('fa-regular');
                                buttonIcon.style.color = 'red';
                                buttonIcon.classList.add('fa-solid');
                            })
                            .catch((error) => {
                                console.error("Error creating new user document: ", error);
                                showMessage(`Error creating new user document: ${error.message}`, errorMessageElement, "red");
                            });
                    }
                }).catch((error) => {
                    console.error("Error fetching user document: ", error);
                    showMessage(`Error fetching user document: ${error.message}`, errorMessageElement, "red");
                });

            }

            // Function to check if the wishlist is empty and update the UI
            // Function to check if the wishlist is empty and update the UI
            // Function to check if the wishlist is empty and update the UI
            function checkIfWishlistIsEmpty(loggedInUserId) {
                const userDocRef = doc(db, "users", loggedInUserId); // Reference to the user's document in Firestore

                // Get the current wishlist array from Firestore
                getDoc(userDocRef).then(docSnapshot => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data();
                        const currentWishlist = userData.wishlist || [];

                        // Find the container where we want to display the error message
                        const wishlistSection = document.getElementById("wishlistSection");

                        if (currentWishlist.length === 0) {
                            // If the wishlist is empty, create a new p tag to show the empty message
                            const emptyMessage = document.createElement("h1");
                            emptyMessage.textContent = "Your wishlist is empty!";
                            emptyMessage.classList.add("text-white");

                            // Append the message to the wishlist section (or wherever you prefer in the DOM)
                            wishlistSection.appendChild(emptyMessage);
                            document.getElementById("loading").style.display = "none";

                        } else {
                            // If the wishlist is not empty, clear any previous empty message
                            const existingErrorMessage = wishlistSection.querySelector(".wishlist-error");
                            if (existingErrorMessage) {
                                wishlistSection.removeChild(existingErrorMessage);
                            }
                        }
                    }
                }).catch((error) => {
                    console.error("Error checking if wishlist is empty: ", error);
                });
            }



            // Helper function to display messages in the error container (specific for each poster)
            function showMessage(message, messageElement, color) {
                messageElement.textContent = message;  // Set the message text
                messageElement.style.color = color;    // Set color (red for errors, green for success)

                // Hide the message after 5 seconds
                setTimeout(() => {
                    messageElement.textContent = "";
                }, 5000);
            }




        } else {
            console.log("Movie not found: " + movieTitle);
        }
    });
}

// Example function to fetch the movie details based on title from Firestore
async function getMovieDetailsByTitle(title) {
    try {
        const movieRef = doc(db, "movies", title);  // Assuming "movies" collection in Firestore
        const movieDoc = await getDoc(movieRef);

        if (movieDoc.exists()) {
            return movieDoc.data();  // Return movie data if exists
        } else {
            console.log("No such movie found:", title);
            return null;  // Return null if movie doesn't exist
        }
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;  // Return null on error
    }
}

fetchWishlist(loggedInUserId);


const postersContainer = document.getElementById('wishlistSection');


const observer = new MutationObserver(() => {
    const posters = document.querySelectorAll('.movie');
    posters.forEach(poster => {
        let timeout;

        // Mouse enter event
        poster.addEventListener('mouseenter', () => {
            console.log("Hover started on", poster.id);

            const popup = poster.querySelector('.popups');
            console.log("Popup found:", popup);

            // Hide all popups immediately when hovering starts
            document.querySelectorAll('.popups').forEach(popup => popup.style.opacity = 0);

            // Set a timeout to show the popup after 2 seconds
            timeout = setTimeout(() => {
                popup.style.display = 'flex';
                popup.classList.add("fade");
                popup.style.opacity = 1;
            }, 500);
        });

        // Mouse leave event
        poster.addEventListener('mouseleave', () => {
            console.log("Hover ended on", poster.id);
            clearTimeout(timeout);
            poster.querySelector('.popups').style.display = 'none';
        });
    });
});

// Start observing the posters container for child changes (new posters added)
observer.observe(postersContainer, { childList: true });



// Function to fetch and display rentals for a logged-in user
function fetchRentals(loggedInUserId) {
    const userDocRef = doc(db, "users", loggedInUserId); // Reference to the user's document

    // Get the user's document
    getDoc(userDocRef)
        .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                // Document exists, get the rentals array
                let rentals = docSnapshot.data().rentals;
                let rentalHistory = docSnapshot.data().rentalHistory;
                if (rentalHistory) {
                    document.getElementById("rentalHistory").style.display = 'none';
                    displayRentalHistory(rentalHistory);
                }
                if (rentals && rentals.length > 0) {
                    // Remove expired rentals
                    rentals = removeExpiredRentals(rentals);

                    if (rentals.length > 0) {
                        // Do something with the rentals, e.g., display it on the page
                        console.log("Active Rentals:", rentals);
                        displayRentals(rentals);

                    } else {
                        console.log("All rentals have expired.");
                        // document.getElementById("rentalsError").textContent = "You have no active rentals!";
                    }

                    // Update the user's document with the active rentals
                    updateRentalsInFirestore(loggedInUserId, rentals);
                } else {
                    console.log("Rentals section is empty.");
                    // document.getElementById("rentalsError").textContent = "You have no active rentals!";
                }
            } else {
                // If the document doesn't exist, handle the case
                console.error("User document does not exist!");
                // document.getElementById("rentalsError").textContent = "User document does not exist!";
            }


        })
        .catch((error) => {
            console.error("Error fetching rentals: ", error);
            // document.getElementById("rentalsError").textContent = "Error fetching rentals!";
        });

}

// Function to remove expired rentals from the rentals array
function removeExpiredRentals(rentals) {
    const currentDate = new Date();

    // Filter out the expired rentals
    return rentals.filter(rental => {
        const expiryDate = new Date(rental.rentalExpiration); // Expiry date is stored in rentalExpiration
        return expiryDate > currentDate; // Keep only rentals that haven't expired
    });
}

// Function to update the rentals in Firestore
function updateRentalsInFirestore(userId, rentals) {
    const userDocRef = doc(db, "users", userId);

    // Update the rentals field in the Firestore document
    updateDoc(userDocRef, { rentals })
        .then(() => {
            console.log("Updated rentals in Firestore");
        })
        .catch((error) => {
            console.error("Error updating rentals in Firestore: ", error);
        });
}

// Function to display the rentals
function displayRentals(rentals) {
    const rentalsSection = document.getElementById("activeRentals");
    rentalsSection.innerHTML = "";  // Clear previous content

    // Loop through the rentals and fetch details for each movie
    rentals.forEach(async (rental) => {
        console.log(rental.title, "Fetching details...");

        // Fetch movie details based on title (asynchronously)
        const movieDetails = await getMovieDetailsByTitle(rental.title);

        if (movieDetails) {
            const rentalDiv = document.createElement('div');
            rentalDiv.className = 'movie';

            // Get the rental duration in days (24 hours = 1 day)
            let durationInDays = rental.duration;
            if (durationInDays === 24) {
                durationInDays = 1; // Treat 24 hours as 1 day
            }

            // Calculate the expiry date based on the rental duration in days
            const expiryDate = new Date(rental.rentalExpiration);

            // Get the countdown string (remaining rental period)
            const countdownString = getCountdown(expiryDate);

            rentalDiv.innerHTML = `
                <img src="${movieDetails.poster}" alt="${movieDetails.title}"><h2>${movieDetails.title}</h2><p>${movieDetails.year}</p><p><strong>Rental Period:</strong> ${countdownString}</p>
               
            <div class="popups flex-column" >
              <div class="p-0">
                  <img src="${movieDetails.thumbnails}" alt="${movieDetails.title}"></div>
                  <div class="p-3 d-flex flex-column gap-3">
                  <h2>${movieDetails.title}</h2>
                  <div class="d-flex justify-content-center">
                  <a href="../details/details.html?title=${encodeURIComponent(movieDetails.title)}">
                  <button id="watch" class="btn btn-success">Watch Now</button>
                  </a>
                  </div>
                  <p id="wishlistError" class="m-0 text- wishlist-error"></p>
                  <p id="wishlistSuccess" class="m-0 text-success wishlist-"></p>
                  <div class="d-flex justify-content-evenly">
                  <p class="m-0">${movieDetails.year}</p> <p class="m-0">•</p> <p class="m-0">${movieDetails.duration}</p> <p class="m-0">•</p> <p class="m-0 bg-success px-2 rounded-1"><strong>${movieDetails.rating}/5</strong></p>
                  </div>
            <p class="m-0">${movieDetails.description}</p>  
            </div>
          </div>
            `;

            // Append the movie rental info to the container
            rentalsSection.appendChild(rentalDiv);


        } else {
            console.log("Movie not found: " + rental.title);
        }

    });

}

// function displayRentalHistory(rentals) {
//     const rentalsSection = document.getElementById("rentalHistory");
//     rentalsSection.innerHTML = "";  // Clear previous content

//     // Loop through the rentals and fetch details for each movie
//     // Assuming rentals is the array containing your rental data
// rentals.reverse().forEach(async (rental) => {
//     console.log(rental.title, "Fetching details...");

//     // Fetch movie details based on title (asynchronously)
//     const movieDetails = await getMovieDetailsByTitle(rental.title);

//     if (movieDetails) {
//         const rentalDiv = document.createElement('div');
//         rentalDiv.classList.add("rentalHistoryCard");

//         // Function to format the rented/expired date
//         function formatDate(rentedDate) {
//             const rentalDate = new Date(rentedDate);

//             // Day of the month with ordinal suffix (e.g., 1st, 2nd, 3rd, 4th, ..., 31st)
//             const day = rentalDate.getDate();
//             const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
//                            (day % 10 === 2 && day !== 12) ? 'nd' :
//                            (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
//             const formattedDay = day + suffix;

//             // Month as full name (e.g., "December")
//             const month = rentalDate.toLocaleString('en-US', { month: 'long' });

//             // Year (e.g., "2024")
//             const year = rentalDate.getFullYear();

//             // Full weekday name (e.g., "Monday")
//             const weekday = rentalDate.toLocaleString('en-US', { weekday: 'long' });

//             // Time in 24-hour format (e.g., "16:31:41")
//             const hours = rentalDate.getHours().toString().padStart(2, '0');
//             const minutes = rentalDate.getMinutes().toString().padStart(2, '0');
//             const seconds = rentalDate.getSeconds().toString().padStart(2, '0');
//             const time = `${hours}:${minutes}:${seconds}`;

//             // Combine all parts into the desired format
//             const formattedDate = `${formattedDay} ${month} ${year} on ${weekday} at ${time}`;

//             return formattedDate;
//         }

//         // Render rental details
//         rentalDiv.innerHTML = `
//             <img src="${movieDetails.poster}" alt="${movieDetails.title}">
//             <div>
//                 <h2>${movieDetails.title}</h2>
//                 <p><strong>Rented on:</strong> ${formatDate(rental.rentedDate)}</p>
//                 <p><strong>Expired on:</strong> ${formatDate(rental.expiredDate)}</p>
//                 <p><strong>Rental Duration:</strong> ${rental.rentedDuration}</p>
//             </div>
//         `;

//         // Append the movie rental info to the container
//         rentalsSection.appendChild(rentalDiv);
//     } else {
//         console.log("Movie not found: " + rental.title);
//     }
// });

// }

async function displayRentalHistory(rentals) {
    // Reverse the array so that the most recent rental appears first
    rentals.reverse();

    // Loop through each rental asynchronously
    for (const rental of rentals) {
        console.log(rental.title, "Fetching details...");

        try {
            // Fetch movie details based on title (asynchronously)
            const movieDetails = await getMovieDetailsByTitle(rental.title);

            if (movieDetails) {
                const rentalDiv = document.createElement('div');
                rentalDiv.classList.add("rentalHistoryCard");

                // Function to format the rented/expired date


                // Render rental details
                rentalDiv.innerHTML = `
                    <img src="${movieDetails.poster}" alt="${movieDetails.title}">
                    <div>
                        <h2>${movieDetails.title}</h2>
                        <p><strong>Rented on:</strong> ${formatDate(rental.rentedDate)}</p>
                        <p><strong>${getExpiryText(rental.expiredDate)}</strong> ${formatDate(rental.expiredDate)}</p>
                        <p><strong>Rental Duration:</strong> ${rental.rentedDuration}</p>
                    </div>
                `;

                // Append the movie rental info to the container
                rentalsSection.appendChild(rentalDiv);
            } else {
                console.log("Movie not found: " + rental.title);
            }
        } catch (error) {
            console.error("Error fetching details for", rental.title, error);
        }
    }

    function formatDate(rentedDate) {
        const rentalDate = new Date(rentedDate);

        // Day of the month with ordinal suffix (e.g., 1st, 2nd, 3rd, 4th, ..., 31st)
        const day = rentalDate.getDate();
        const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
            (day % 10 === 2 && day !== 12) ? 'nd' :
                (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
        const formattedDay = day + suffix;

        // Month as full name (e.g., "December")
        const month = rentalDate.toLocaleString('en-US', { month: 'long' });

        // Year (e.g., "2024")
        const year = rentalDate.getFullYear();

        // Full weekday name (e.g., "Monday")
        const weekday = rentalDate.toLocaleString('en-US', { weekday: 'long' });

        // Time in 24-hour format (e.g., "16:31:41")
        const hours = rentalDate.getHours().toString().padStart(2, '0');
        const minutes = rentalDate.getMinutes().toString().padStart(2, '0');
        const seconds = rentalDate.getSeconds().toString().padStart(2, '0');
        const time = `${hours}:${minutes}:${seconds}`;

        // Combine all parts into the desired format
        const formattedDate = `${formattedDay} ${month} ${year} on ${weekday} at ${time}`;

        return formattedDate;
    }

    function getExpiryText(expiredDate) {
        const expiryDate = new Date(expiredDate);
        const currentDate = new Date();

        // Compare the current date with the expiry date
        if (expiryDate < currentDate) {
            return `Expired on: `;
        } else {
            return `Will expire on: `;
        }
    }
}


// Function to calculate the expiry date based on rental duration in days
// Function to calculate the expiry date based on rental duration in days




function getCountdown(expiryDate) {
    const currentDate = new Date();
    const remainingTime = expiryDate - currentDate; // Remaining time in milliseconds

    if (remainingTime <= 0) {
        return "Rental period expired!";  // If the time has passed, display the expiration message
    }

    // Calculate remaining days and hours
    const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24)); // Full days
    const remainingHours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Remaining hours
    const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes

    if (remainingDays > 0) {
        return `${remainingDays} days ${remainingHours} hours`; // Return in days and hours if days > 0
    } else if (remainingHours > 0) {
        return `${remainingHours} hours ${remainingMinutes} minutes`; // Return hours and minutes if days are 0
    } else {
        return `${remainingMinutes} minutes`; // Return minutes if both days and hours are 0
    }
}

// Example usage




// Call the function to fetch rentals for the logged-in user
fetchRentals(loggedInUserId);

const postersContainer1 = document.getElementById('activeRentals');


const observer1 = new MutationObserver(() => {
    const posters = document.querySelectorAll('.movie');
    posters.forEach(poster => {
        let timeout;

        // Mouse enter event
        poster.addEventListener('mouseenter', () => {
            console.log("Hover started on", poster.id);

            const popup = poster.querySelector('.popups');
            console.log("Popup found:", popup);

            // Hide all popups immediately when hovering starts
            document.querySelectorAll('.popups').forEach(popup => popup.style.opacity = 0);

            // Set a timeout to show the popup after 2 seconds
            timeout = setTimeout(() => {
                popup.style.display = 'flex';
                popup.classList.add("fade");
                popup.style.opacity = 1;
            }, 500);
        });

        // Mouse leave event
        poster.addEventListener('mouseleave', () => {
            console.log("Hover ended on", poster.id);
            clearTimeout(timeout);
            poster.querySelector('.popups').style.display = 'none';
        });
    });
});

// Start observing the posters container for child changes (new posters added)
observer1.observe(postersContainer1, { childList: true });

const floatingButton = document.getElementById('floating-btn');

// Show or hide the button when scrolling
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) { // Show button after scrolling 200px
        floatingButton.style.display = 'block';
    } else {
        floatingButton.style.display = 'none';
    }
});

// Optionally, you can make the button scroll the page to the top when clicked
floatingButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});



// const mediaQuery2 = window.matchMedia('(max-width: 767px)');

// Check if the media query matches
if (mediaQuery1.matches) {
    function hideAside() {
        // Get references to the aside and offcanvas-header
        var aside = document.getElementById('aside');
        var offcanvasHeader = document.querySelector('.offcanvas-header');

        // Move aside after offcanvas-header
        offcanvasHeader.parentNode.insertBefore(aside, offcanvasHeader.nextSibling);
    }
    hideAside()
    profileSec.setAttribute('data-bs-dismiss', 'offcanvas');
    profileSec.setAttribute('aria-label', 'Close');
    rented.setAttribute('data-bs-dismiss', 'offcanvas');
    rented.setAttribute('aria-label', 'Close');
    wishlist.setAttribute('data-bs-dismiss', 'offcanvas');
    wishlist.setAttribute('aria-label', 'Close');
    profileSec.classList.remove("border-end-0");
    wishlist.classList.remove("border-end-0");
    rented.classList.remove("border-end-0");

    // Code for small screens (mobile/tablet)

    document.getElementById("canvas").style.display = 'block';
    document.getElementById("proBorder").style.display = 'none';
    document.getElementById("content").style.right = '0';
} else {
    // Code for larger screens (desktop)
    console.log("Screen is wider than 768px");
}

// const mediaQuery2 = window.matchMedia('(max-width: 767px)');

// Check if the media query matches
if (mediaQuery.matches) {

    // Code for small screens (mobile/tablet)
    var container = document.getElementById('emailContainer');
    container.innerHTML = container.innerHTML.replace('<h4', '<p').replace('</h4>', '</p>');
    var container = document.getElementById('profileContainer');
    container.innerHTML = container.innerHTML.replace('<h4', '<p').replace('</h4>', '</p>');
    document.getElementById("profName").classList.remove("px-5")
    document.getElementById("profName").classList.add("px-3")
    document.getElementById("profEmail").classList.remove("px-5")
    document.getElementById("profEmail").classList.add("px-3")
} else {
    // Code for larger screens (desktop)
    console.log("Screen is wider than 768px");
}

let input = document.getElementById("input");
let icon = document.getElementById("icon");
console.log(input.value)

icon.addEventListener("click", () => {
    input.click();
    input.style.display = 'block';
})
input.addEventListener("input", () => {
    color1 = input.value
    document.getElementById("prof").style.backgroundColor = color1;
    document.getElementById("confirmColorContainer").style.display = "flex";

})
console.log(localStorage.getItem("color"))
document.getElementById("yes").addEventListener("click", setColor);

document.getElementById("no").addEventListener("click", () => {
    document.getElementById("prof").style.backgroundColor = localStorage.getItem("color");
    document.getElementById("confirmColorContainer").style.display = "none";

})

function setColor() {
    document.getElementById("loading").style.display = "flex";

    document.getElementById("user").style.backgroundColor = color1; // Example: setting random background color
    document.getElementById("prof").style.backgroundColor = color1;
    localStorage.removeItem("color");
    localStorage.setItem("color", color1);
    document.getElementById("confirmColorContainer").style.display = "none";


    const userDocRef = doc(db, "users", loggedInUserId); // Reference to the user's document

    // Get the user's document
    getDoc(userDocRef)
        .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                // Document exists, get the wishlist array
                updateDoc(userDocRef, {
                    color: color1 // Remove the movie title from the wishlist array
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
    document.getElementById("loading").style.display = "none";

}



let cropper;
let isImageValid = false;
let currentCroppedImage = null;

// Handle Image Upload
document.getElementById("uploadImage").addEventListener("change", function (event) {
    const file = event.target.files[0];

    // If a file is selected, validate it
    if (file && validateImage(file)) {
        document.getElementById("cropContainer").classList.remove('d-none')
        document.getElementById("btnContainer").classList.add('d-none')
        document.getElementById("colorIcon").classList.add('d-none')
        isImageValid = true;
        const reader = new FileReader();

        // Reset the preview and clear the previous cropper instance
        // document.getElementById("preview").src = currentCroppedImage || ""; // Retain previous preview until a new image is saved
        document.querySelector(".img-container").style.display = "block"; // Show the image container
        // document.querySelector(".img-container img").src = ""; // Clear any previous image

        reader.onload = function (e) {
            document.getElementById("image").src = e.target.result;

            // If a cropper instance exists, destroy it
            if (cropper) {
                cropper.destroy();
            }

            // Initialize cropper with the new image
            cropper = new Cropper(document.getElementById("image"), {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 0.8,
                crop(event) {
                    // You can access crop data here (e.g., get the crop box position)
                }
            });

            // Enable the save button after the image is loaded and cropped
            document.getElementById("saveImage").disabled = false;
            document.getElementById("error-message").style.display = "none"; // Hide error message
        };

        reader.readAsDataURL(file);

        // Reset the file input so the change event can trigger again if the user selects the same file
        document.getElementById("uploadImage").value = "";
    } else {
        isImageValid = false;
        document.getElementById("error-message").style.display = "block"; // Show error message
    }
});

// Image validation function (check file types)
function validateImage(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    return validTypes.includes(file.type);
}

// Save Cropped Image
document.getElementById("saveImage").addEventListener("click", function () {
    if (!isImageValid) return;
    document.getElementById("loading").style.display = 'flex';
    document.getElementById("removeIcon").classList.remove('d-none')
    document.getElementById("cropContainer").classList.add('d-none');
    document.getElementById("btnContainer").classList.remove('d-none')
    document.getElementById("profile").style.display = 'none'
    document.getElementById("preview").style.display = 'block'
    document.getElementById("profileName").style.display = 'none'
    document.getElementById("profileImage").style.display = 'block'
    const canvas = cropper.getCroppedCanvas();
    const croppedImage = canvas.toDataURL();

    // Save the current cropped image
    currentCroppedImage = croppedImage;

    // Display the cropped image preview

    // Hide the image container after cropping and saving
    document.querySelector(".img-container").style.display = "none";

    // You can now send the cropped image (croppedImage) to your server via AJAX or fetch
    console.log(croppedImage); // Example: send this to your backend
    fetch(croppedImage)
        .then(res => res.blob())
        .then(blob => {
            // Create a reference to Firebase Storage
            const storageRef = ref(storage, 'profile_images/' + loggedInUserId + Date.now() + '.png');

            // Upload the Blob to Firebase Storage
            uploadBytes(storageRef, blob).then(snapshot => {
                // Get the download URL of the uploaded image
                getDownloadURL(snapshot.ref).then(url => {
                    // Save the image URL to Firestore (use the user's UID or other identifier)
                    const userRef = doc(db, "users", loggedInUserId);
                    localStorage.setItem("profileImage", url);
                    document.getElementById("profileImage").src = url;
                    document.getElementById("preview").src = url;

                    // Retrieve the current data of the user
                    getDoc(userRef).then(docSnapshot => {
                        const userData = docSnapshot.data();
                        const previousImagePath = userData?.profileImagePath; // Assuming you store the image path here

                        // If there's a previous image, delete it from storage
                        if (previousImagePath) {
                            deletePreviousImage(previousImagePath);
                        }
                        // Update Firestore with the new image URL and image path
                        updateDoc(userRef, {
                            profileImage: url,          // Store the new URL
                            profileImagePath: snapshot.ref.fullPath  // Store the image path
                        })
                            .then(() => {
                                console.log("Image URL and path saved to Firestore");
                                document.getElementById("loading").style.display = 'none';

                            })
                            .catch(error => {
                                console.error("Error saving image URL: ", error);
                            });
                    });
                });
            });
        });

});

function deletePreviousImage(imagePath) {
    // Create a reference to the previous image in Firebase Storage
    const storageRef = ref(storage, imagePath);

    // Delete the file
    deleteObject(storageRef).then(() => {
        console.log("Previous image deleted successfully.");
    }).catch((error) => {
        console.error("Error deleting previous image: ", error);
    });
}

document.getElementById("closeImage").addEventListener('click', () => {
    document.getElementById("cropContainer").classList.add('d-none');
    document.getElementById("btnContainer").classList.remove('d-none')
    document.getElementById("colorIcon").classList.remove('d-none')
})

document.getElementById("yesRemove").addEventListener('click', () => {
    const userRef = doc(db, "users", loggedInUserId);
    document.getElementById("loading").style.display = 'flex';


    getDoc(userRef).then(docSnapshot => {
        const userData = docSnapshot.data();
        const previousImagePath = userData?.profileImagePath; // Assuming you store the image path here
        if (previousImagePath) {
            deletePreviousImage(previousImagePath);
        }
        updateDoc(userRef, {
            profileImage: deleteField()  // This will **delete** the field from Firestore
          })
          .then(() => {
            console.log("Field 'profileImagePath' deleted from Firestore.");
          })
    })
    localStorage.removeItem("profileImage");
    document.getElementById("profile").style.display = 'block'
    document.getElementById("preview").style.display = 'none'
    document.getElementById("profileName").style.display = 'block'
    document.getElementById("profileImage").style.display = 'none'
    profileNameCreator()
    document.getElementById("colorIcon").classList.remove('d-none')
    // document.getElementById("removeIcon").classList.add('d-none')
    document.getElementById("btnContainer").classList.remove('d-none')
    document.getElementById("confirmImageContainer").classList.add('d-none')
    document.getElementById("loading").style.display = 'none';
})

document.getElementById("removeIcon").addEventListener("click", () => {
    document.getElementById("removeIcon").classList.add('d-none')
    document.getElementById("confirmImageContainer").classList.remove('d-none')
    document.getElementById("btnContainer").classList.add('d-none')

})

document.getElementById("noRemove").addEventListener("click", () => {
    document.getElementById("confirmImageContainer").classList.add('d-none')
    document.getElementById("btnContainer").classList.remove('d-none')
    document.getElementById("removeIcon").classList.remove('d-none')
})