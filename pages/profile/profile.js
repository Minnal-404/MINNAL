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

let check = false;

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
                    console.log("Error getting document");
                })
        } else {
            console.log("User Id not found in local storage")
        }
    });
    
    //   window.location.href = 'pages/home/home.html'; // Replace with your home page URL
}

function profileNameCreator() {
    document.getElementById("search").value = "";
    document.getElementById("user").classList.remove("bg-black"); // Example: setting random background color
    document.getElementById("user").classList.add("border");
    document.getElementById("user").classList.add("border-white");
    document.getElementById("user").classList.add("border-5");

    // rounded-circle border-white border border-5
    let profileName = localStorage.getItem("name");
    console.log(profileName)
    let color = localStorage.getItem("color");
    console.log(color)
    document.getElementById("userIcon").style.display = "none";
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
    document.getElementById("loading").style.display = "none";

}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {


    signOut(auth)
        .then(() => {
            localStorage.removeItem("loggedInUserId");
            localStorage.removeItem("name");
            localStorage.removeItem("color");
            window.history.replaceState(null, null, "../../index.html"); // Prevent going back
            window.location.replace("../../index.html");
        })
        .catch((error) => {
            console.error("Error Signing out", error);
        });

});

const rentedSection = document.getElementById("rentedSection");
const wishlistSection = document.getElementById("wishlistSection");
const profileSection = document.getElementById("profileSection");
const profileSec = document.getElementById("profileSec");
const rented = document.getElementById("rented");
const wishlist = document.getElementById("wishlist");

profileSec.addEventListener("click", () => {
    rentedSection.style.display = "none";
    wishlistSection.style.display = "none";

    profileSec.classList.add("text-white");
    profileSec.classList.remove("border-success");
    profileSec.classList.remove("border-top-0");
    profileSec.classList.remove("border-bottom-0");

    wishlist.classList.add("border-success");
    wishlist.classList.remove("text-white");
    wishlist.classList.add("border-top");

    rented.classList.add("border-bottom");
    rented.classList.remove("border-white");
    rented.classList.add("border-success");
    rented.classList.remove("text-white");
    rented.classList.add("border-top-0");



    profileSection.style.display = "block";
});
rented.addEventListener("click", () => {
    wishlistSection.style.display = "none";
    profileSection.style.display = "none";

    rented.classList.remove("border-success");
    rented.classList.remove("border-top-0");
    rented.classList.add("text-white");
    rented.classList.remove("border-bottom-0");


    profileSec.classList.remove("text-white");
    profileSec.classList.add("border-success");
    profileSec.classList.add("border-top-0");
    profileSec.classList.add("border-bottom-0");

    wishlist.classList.add("border-success");
    wishlist.classList.remove("text-white");
    wishlist.classList.add("border-top-0");

    rentedSection.style.display = "block";
});
wishlist.addEventListener("click", () => {
    rentedSection.style.display = "none";
    profileSection.style.display = "none";

    profileSec.classList.remove("text-white");
    profileSec.classList.add("border-success");
    profileSec.classList.add("border-top-0");
    // profileSec.classList.add("border-bottom-0");
    wishlist.classList.remove("border-success");
    wishlist.classList.remove("border-top-0");
    wishlist.classList.add("text-white");

    rented.classList.add("border-bottom-0");
    rented.classList.remove("border-white");
    rented.classList.add("border-success");
    rented.classList.remove("text-white");

    wishlistSection.style.display = "flex";
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
                    document.getElementById("wishlistError").textContent = "Your wishlist is empty!";
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
                  <a href="pages/details/details.html?title=${encodeURIComponent(movieDetails.title)}">
                  <button id="watch" class="btn btn-success">Watch Now</button>
                  </a>
                  <button id="add" class="add-to-wishlist btn btn-success" data-title="${movieDetails.title}"><i class="fa-solid fa-plus fa-xl"></i></button>
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
                buttonIcon.classList.remove('fa-plus');
                buttonIcon.classList.add('fa-minus');
            } else {
                buttonIcon.classList.remove('fa-minus');
                buttonIcon.classList.add('fa-plus');
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
                        buttonIcon.classList.remove('fa-minus');
                        buttonIcon.classList.add('fa-plus');

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
                        buttonIcon.classList.remove('fa-plus');
                        buttonIcon.classList.add('fa-minus');
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
                    buttonIcon.classList.remove('fa-plus');
                    buttonIcon.classList.add('fa-minus');
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
                const emptyMessage = document.createElement("p");
                emptyMessage.textContent = "Your wishlist is empty!";
                emptyMessage.classList.add("wishlist-error");

                // Append the message to the wishlist section (or wherever you prefer in the DOM)
                wishlistSection.appendChild(emptyMessage);
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
      document.querySelectorAll('.popups').forEach(popup => popup.style.display = 'none');

      // Set a timeout to show the popup after 2 seconds
      timeout = setTimeout(() => {
        popup.style.display = 'flex';
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