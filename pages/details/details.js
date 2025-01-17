document.getElementById("loading").style.display = "flex";
document.getElementById("loadMessage").textContent = "Please Wait...";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

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
const db = getFirestore(); // Firestore instead of Realtime Database
const loggedInUserId = localStorage.getItem("loggedInUserId");
let subCheck = false;
let userCheck = false;
let suggestions = [];
let suggested = [];

if (loggedInUserId) {
    const docRef = doc(db, "users", loggedInUserId);
    userCheck = true;
    getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                try {
                    if (userData.subscription.status) {
                        let present = new Date();
                        let expiration = new Date(userData.subscription.expiration);
                        if (present > expiration) {
                            let subscription = {};
                            updateDoc(docRef, { subscription });
                        }
                        console.log(expiration)
                    }
                    if (userData.subscription.status) {
                        // document.getElementById("subscribeBtn").setAttribute('disabled', 'true');
                        // document.getElementById("subscribeBtn").classList.remove("ball");
                        // document.getElementById("subscribeBtn").textContent = "Subscribed";
                        subCheck = true;
                    }
                } catch (arror) {

                } finally {
                    document.getElementById("logBtn").style.display = "none";
                    document.getElementById("signUpBtn").style.display = "none";
                }



            } else {
                console.log("No document found matching id")
            }
        })
        .catch((error) => {
            console.log("Error getting document", error);
        })
}

document.getElementById("user").addEventListener("click", () => {
    if (check) {
        window.location.href = "../profile/profile.html";
    }
});

document.getElementById("logBtn").addEventListener("click", () => {
    // if (check) {
    //   window.location.href = "pages/profile/profile.html";

    //   // let loading = document.getElementById("loading");
    //   // loading.style.display = "block";
    //   // loading.textContent = "";
    //   // document.body.classList.add('no-scroll');  // Disable scrolling
    //   // document.getElementById("profileSection").style.display = "block";
    // } else {
    const popup = document.getElementById('loginMain');
    // Check if the popup is already visible
    if (popup.style.display !== 'flex') {
        const overlay = document.getElementById("overlay");

        overlay.style.display = "block";

        popup.style.display = 'flex';
    }
    // }

});

document.getElementById("signUpBtn").addEventListener("click", () => {

    const popup = document.getElementById('createMain');
    // Check if the popup is already visible
    if (popup.style.display !== 'flex') {
        const overlay = document.getElementById("overlay");

        overlay.style.display = "block";

        popup.style.display = 'flex';
    }
});


// let playCheck = false;
// if (playCheck) {
//     window.location.href = `../play/play.html?title=${encodeURIComponent(movie.title)}`;
// }

// Get the movie title from the URL (as the document ID)
const urlParams = new URLSearchParams(window.location.search);
const movieTitle = urlParams.get('title');  // Get the 'title' parameter from the URL

console.log("Movie Title from URL:", movieTitle);  // Log the movie title for debugging

if (!movieTitle) {
    console.error("No 'title' parameter found in the URL!");
    document.getElementById('movie-detail-container').innerHTML = `<p>Error: No movie title found in the URL.</p>`;
} else {
    // Get the container where movie details will be displayed
    const movieDetailContainer = document.getElementById('movie-detail-container');
    // Fetch movie details from Firestore by the movie title (as the document ID)
    async function fetchMovieDetail(title) {
        try {
            const docRef = doc(db, "movies", title);  // Fetch the movie document by title
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const movie = docSnapshot.data();  // Get movie data from Firestore
                displayMovieDetails(movie);         // Display the details
            } else {
                console.error(`Movie with title "${title}" not found.`);
                movieDetailContainer.innerHTML = `<p>Movie not found: ${title}</p>`;
            }
        } catch (error) {
            console.error("Error fetching movie details: ", error);
            movieDetailContainer.innerHTML = `<p>Failed to load movie details. Please try again.</p>`;
        }
    }

    // Function to display movie details in the HTML
    function displayMovieDetails(movie) {
        document.getElementById("title").textContent = `${movie.title} (${movie.year})`;
        const movieHTML = `          <div class="d-flex flex-wrap gap-4">
    <button id="playButton" class="btn btn-success" data-title="${movie.title}">Watch Now</button>
    <button id="trailerPlay" class="play-button btn btn-success text-white">Watch Trailer</button>
                  <button id="add" class="add-to-wishlist btn  border-black" data-title="${movie.title}" title='Wishlist'><i class="fa-regular fa-heart fa-2xl"></i></button>
                  </div>
                  <p id="wishlistError" class="m-0 wishlist-error"></p>`;

        movieDetailContainer.innerHTML += movieHTML;  // Inject HTML into the page
        // document.getElementById("backgroundOverlay").style.background = `url(${movie.thumbnails})`;
        let bg = document.getElementById("backgroundOverlay");
        // const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        // const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
        // Create a new image element
        let img = document.createElement("img");

        // Set the source of the image
        img.src = `${movie.thumbnails}`;  // Replace with the actual image path

        // Optionally set attributes like alt text or class
        img.alt = "Background Image";  // Replace with a descriptive alt text
        // Optional: add a class for styling

        // Append the image element to the "backgroundOverlay" element
        bg.appendChild(img);
        let genres = '';

        for (let i = 0; i < movie.genre.length; i++) {
            genres += `<h5 class="mx-4 ms-0 m-0">${movie.genre[i]}</h5><h5 class="mx-4 ms-0 m-0 h5-0">•</h5>`;
            suggestions.push(movie.genre[i])
        }
        console.log(suggestions)
        genres = genres.slice(0, -24);
        document.getElementById("genre").innerHTML =
            `<h5 class="mb-5">${genres}</h5>`;

        document.getElementById("description").innerHTML = `<h5 class="h5-0 m-0 lh-lg"">${movie.description}</h5>`;
        document.getElementById("rating").innerHTML = `<h5 class="ms-0  m-0 text-success"> ${movie.duration}</h5><h5 class="ms-0  m-0 text-success">${movie.year}</h5><h5 class="ms-0  m-0 bg-success px-2 rounded-1">${movie.rating}/5</h5><h5 id="rentedTag" class="px-2 rounded-1 bg-warning m-0 " style="display: none;">Rented</h5>`;
        let languages = "";
        for (let i of movie.languages) {
            languages += `<h5>${i},&nbsp</h5>`
        }
        languages = languages.replace(/,(?=[^,]*$)/, ''); let casts = "";
        for (let i of movie.details.cast) {
            casts += `<h5>${i},</h5>`
        }
        casts = casts.replace(/,(?=[^,]*$)/, '');
        let producers = "";
        for (let i of movie.details.producer) {
            producers += `<h5>${i},</h5>`
        }
        producers = producers.replace(/,(?=[^,]*$)/, '');
        let music = "";
        for (let i of movie.details.music) {
            music += `<h5>${i},</h5>`
        }
        music = music.replace(/,(?=[^,]*$)/, '');
        let directors = "";
        for (let i of movie.details.director) {
            directors += `<h5>${i},</h5>`
        }
        directors = directors.replace(/,(?=[^,]*$)/, '');
        document.getElementById("moreDetails").innerHTML = `<h1>More Info  <i class="fa-solid fa-sm fa-arrow-down fa-bounce"></i> </h1>
        <h2 class="text-start text-success">Languages</h2>
        <div class="d-flex flex-wrap">${languages}</div>
        <h2 class="text-start text-success">Directors</h2>
        <div class="d-flex flex-wrap gap-2">${directors}</div>
        <h2 class="text-start text-success">Producers</h2>
        <div class="d-flex flex-wrap gap-2">${producers}</div>
        <h2 class="text-start text-success">Cast</h2>
        <div class="d-flex flex-wrap gap-2">${casts}</div>
        <h2 class="text-start text-success">Music</h2>
        <div class="d-flex flex-wrap gap-2">${music}</div>
        <h1 class=" text-white" id="suggestionH1">More Like This</h1>

    <div id="suggestionDiv" class="d-flex content"></div>
        
`
        // document.getElementById("duration").innerHTML = `<p class="col-2 p-2">${movie.duration}</p>`;
        // document.getElementById("year").innerHTML = `<p class="col-2 p-2">${movie.year}</p>`;
        for (let suggestion of suggestions) {
            filterComedyGenresFromFirestore(suggestion)
        }
        addHoverEventsToPosters('suggestionDiv');

        // const poster = `<img src="${movie.poster}" alt="${movie.title}" style="width: 300px; height: auto;">`;
        // posterDiv.innerHTML = poster;
        const mediaQuery1 = window.matchMedia('(max-width: 1023px)');
        // const mediaQuery2 = window.matchMedia('(max-width: 767px)');

        // Check if the media query matches
        if (mediaQuery.matches) {
            // Code for small screens (mobile/tablet)
            console.log("Screen is less than 768px wide");

            document.getElementById("trailerPlay").addEventListener("click", () => {
                // document.getElementById("trailer").classList.add("pb-5")

                const trailerId = `${movie.trailer}`; // Replace with the correct YouTube video ID

                // Get the iframe and change its src to the YouTube video
                const iframe = document.getElementById('trailer');
                iframe.src = `${trailerId}`;

                // Show the iframe
                if (iframe.style.display == 'block') {
                    document.getElementById("posterDiv").style.height = '0rem';
                    try {
                        // Check if the video is paused
                        if (videojs('my-video').paused()) {
                            // Set the height of posterDiv if the video is paused
                            document.getElementById("posterDiv").style.height = '15rem';
                        }

                    }
                    catch (error) {
                    } finally {
                        // document.getElementById("playButton").setAttribute('disabled', 'true');
                    }

                    iframe.style.display = 'none';
                    document.getElementById("trailerPlay").textContent = "Watch Trailer";
                    document.getElementById("trailerPlay").style.backgroundImage = 'linear-gradient(to bottom right, green, black)';
                    // document.getElementById("playButton").setAttribute('disabled', 'false');
                    // document.getElementById("playButton").disabled = false;

                } else {
                    iframe.style.display = 'block';
                    document.getElementById("posterDiv").style.height = '30rem';

                    // Initialize the video player

                    // Check if the video is currently playing, and pause it if it is
                    try {
                        videojs('my-video').pause();

                    }
                    catch (error) {
                    } finally {


                        // document.getElementById("playButton").setAttribute('disabled', 'true');
                        document.getElementById("trailerPlay").textContent = "Close Trailer";
                        document.getElementById("trailerPlay").style.backgroundImage = 'linear-gradient(to bottom right, red, black)';
                    }
                }
            })
        } else if (mediaQuery1.matches) {
            // Code for small screens (mobile/tablet)
            console.log("Screen is less than 768px wide");

            document.getElementById("trailerPlay").addEventListener("click", () => {
                // document.getElementById("trailer").classList.add("pb-5")

                const trailerId = `${movie.trailer}`; // Replace with the correct YouTube video ID

                // Get the iframe and change its src to the YouTube video
                const iframe = document.getElementById('trailer');
                iframe.src = `${trailerId}`;

                // Show the iframe
                if (iframe.style.display == 'block') {
                    document.getElementById("posterDiv").style.height = '0rem';
                    try {
                        // Check if the video is paused
                        if (videojs('my-video').paused()) {
                            // Set the height of posterDiv if the video is paused
                            document.getElementById("posterDiv").style.height = '30rem';
                        }

                    }
                    catch (error) {
                    } finally {
                        // document.getElementById("playButton").setAttribute('disabled', 'true');
                    }

                    iframe.style.display = 'none';
                    document.getElementById("trailerPlay").textContent = "Watch Trailer";
                    document.getElementById("trailerPlay").style.backgroundImage = 'linear-gradient(to bottom right, green, black)';
                    // document.getElementById("playButton").setAttribute('disabled', 'false');
                    // document.getElementById("playButton").disabled = false;

                } else {
                    iframe.style.display = 'block';
                    document.getElementById("posterDiv").style.height = '30rem';

                    // Initialize the video player

                    // Check if the video is currently playing, and pause it if it is
                    try {
                        videojs('my-video').pause();

                    }
                    catch (error) {
                    } finally {


                        // document.getElementById("playButton").setAttribute('disabled', 'true');
                        document.getElementById("trailerPlay").textContent = "Close Trailer";
                        document.getElementById("trailerPlay").style.backgroundImage = 'linear-gradient(to bottom right, red, black)';
                    }
                }
            })
        } else {
            document.getElementById("trailerPlay").addEventListener("click", () => {
                // The YouTube video ID of the trailer (replace with the actual trailer ID)
                const trailerId = `${movie.trailer}`; // Replace with the correct YouTube video ID

                // Get the iframe and change its src to the YouTube video
                const iframe = document.getElementById('trailer');
                iframe.src = `${trailerId}`;

                // Show the iframe
                if (iframe.style.display == 'block') {
                    document.getElementById("row").style.height = '90%';
                    document.getElementById("backgroundOverlay").style.display = 'block';
                    iframe.style.display = 'none';
                    document.getElementById("trailerPlay").textContent = "Watch Trailer";
                    document.getElementById("trailerPlay").style.backgroundImage = 'linear-gradient(to bottom right, green, black)';
                    // document.getElementById("playButton").setAttribute('disabled', 'false');
                    // document.getElementById("playButton").disabled = false;

                } else {
                    iframe.style.display = 'block';
                    // Initialize the video player
                    document.getElementById("row").style.height = '60%';
                    document.getElementById("backgroundOverlay").style.display = 'none';
                    // Check if the video is currently playing, and pause it if it is
                    try {
                        videojs('my-video').pause();
                    }
                    catch (error) {
                    } finally {


                        // document.getElementById("playButton").setAttribute('disabled', 'true');
                        document.getElementById("trailerPlay").textContent = "Close Trailer";
                        document.getElementById("trailerPlay").style.backgroundImage = 'linear-gradient(to bottom right, red, black)';
                    }
                }

                // Hide the poster and play button
                // document.getElementById('poster').style.backgroundImage = 'none';
                // document.querySelector('.play-button').style.display = 'none';
            })
        }

        function checkUserExists() {
            // This could be a check for a cookie, local storage, or API request
            return localStorage.getItem('loggedInUserId') !== null; // Example using local storage
        }

        // Redirect to home page if user exists
        const buttons = document.querySelectorAll('.add-to-wishlist');

        buttons.forEach(button => {
            // Get the movie title from the data-title attribute
            const movieTitle = button.getAttribute('data-title');
            const buttonIcon = button.querySelector('i'); // Get the icon inside the button

            // Directly target the error message element based on the button's parent or an appropriate ID
            const errorMessageElement = document.getElementById("wishlistError");

            // Ensure loggedInUserId is available
            if (!loggedInUserId) {
                console.error("User not logged in. Please log in to manage your wishlist.");
                // if (errorMessageElement) {
                //     // errorMessageElement.textContent = "Please log in to add movies to the wishlist.";
                //     // errorMessageElement.style.color = "red";

                // }
                button.addEventListener('click', function () {
                    showMessage("Please log in to manage your wishlist.", errorMessageElement, "red");

                });
                // document.getElementById("loading").style.display = "none";

                return; // Exit early if no logged-in user
            }

            // Ensure movieTitle is valid
            if (!movieTitle) {
                console.error("Movie title is missing. Cannot proceed.");
                if (errorMessageElement) {
                    errorMessageElement.textContent = "Movie title is missing.";
                    errorMessageElement.style.color = "red";
                }
                return; // Exit early if movieTitle is missing
            }

            // Check the movie state (whether it's in the wishlist or not) when the page loads
            checkMovieInWishlist(loggedInUserId, movieTitle, buttonIcon);

            // Add click event listener to toggle the button icon
            button.addEventListener('click', function () {

                // Add or remove the movie from the wishlist
                toggleWishlist(loggedInUserId, movieTitle, button, buttonIcon, errorMessageElement);
                // document.getElementById("loading").style.display = "flex"; // Show loading spinner
            });
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
                } else {
                    // If the document doesn't exist, create a new one with the wishlist field
                    console.error("User document does not exist. Creating a new document...");
                    setDoc(userDocRef, { wishlist: [movieTitle] }) // Create new user document with the movie title in the wishlist
                        .then(() => {
                            console.log("New user document created with wishlist!");
                            showMessage("New user document created with wishlist!", errorMessageElement, "green");
                            // Change the button icon to "Remove" (fa-minus)
                            buttonIcon.classList.remove('fa-regular');
                            buttonIcon.style.color = 'red';
                            buttonIcon.classList.add('fa-solid');
                        })
                        .catch((error) => {
                            console.error("Error creating new user document: ", error);
                            if (errorMessageElement) showMessage(`Error creating new user document: ${error.message}`, errorMessageElement, "red");
                        });
                }
            }).catch((error) => {
                console.error("Error fetching user document: ", error);
                if (errorMessageElement) showMessage(`Error fetching user document: ${error.message}`, errorMessageElement, "red");
            });
        }

        // Function to toggle the movie in the wishlist
        function toggleWishlist(loggedInUserId, movieTitle, button, buttonIcon, errorMessageElement) {
            const userDocRef = doc(db, "users", loggedInUserId); // Reference to the user's document in Firestore

            // Get the current wishlist array from Firestore
            getDoc(userDocRef).then(docSnapshot => {
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();

                    const currentWishlist = userData.wishlist || [];

                    console.log("Current Wishlist: ", currentWishlist);

                    // Check if the movie title is already in the wishlist
                    if (currentWishlist.includes(movieTitle)) {
                        // If the movie title is already in the wishlist, remove it
                        updateDoc(userDocRef, {
                            wishlist: arrayRemove(movieTitle) // Remove the movie title from the wishlist array
                        })
                            .then(() => {
                                console.log(`${movieTitle} removed from wishlist!`);
                                showMessage(`${movieTitle} removed from your wishlist.`, errorMessageElement, "red");
                                // Change the button icon to "Add" (fa-plus)
                                buttonIcon.classList.remove('fa-solid');
                                buttonIcon.style.color = 'white';
                                buttonIcon.classList.add('fa-regular');
                            })
                            .catch((error) => {
                                console.error("Error removing from wishlist: ", error);
                                if (errorMessageElement) showMessage(`Error removing from wishlist: ${error.message}`, errorMessageElement, "red");
                            });
                    } else {
                        // If the movie is not in the wishlist, add it using arrayUnion
                        updateDoc(userDocRef, {
                            wishlist: arrayUnion(movieTitle) // Add the movie title to the wishlist array
                        })
                            .then(() => {
                                console.log(`${movieTitle} added to wishlist!`);
                                showMessage(`${movieTitle} added to your wishlist!`, errorMessageElement, "green");
                                // Change the button icon to "Remove" (fa-minus)
                                buttonIcon.classList.remove('fa-regular');
                                buttonIcon.style.color = 'red';
                                buttonIcon.classList.add('fa-solid');
                            })
                            .catch((error) => {
                                console.error("Error adding to wishlist: ", error);
                                if (errorMessageElement) showMessage(`Error adding to wishlist: ${error.message}`, errorMessageElement, "red");
                            });
                    }
                } else {
                    // If the document doesn't exist, create a new one with the wishlist field
                    console.error("User document does not exist. Creating a new document...");
                    setDoc(userDocRef, { wishlist: [movieTitle] }) // Create new user document with the movie title in the wishlist
                        .then(() => {
                            console.log("New user document created with wishlist!");
                            showMessage("New user document created with wishlist!", errorMessageElement, "green");
                            // Change the button icon to "Remove" (fa-minus)
                            buttonIcon.classList.remove('fa-regular');
                            buttonIcon.style.color = 'red';
                            buttonIcon.classList.add('fa-solid');
                        })
                        .catch((error) => {
                            console.error("Error creating new user document: ", error);
                            if (errorMessageElement) showMessage(`Error creating new user document: ${error.message}`, errorMessageElement, "red");
                        });
                }
            }).catch((error) => {
                console.error("Error fetching user document: ", error);
                if (errorMessageElement) showMessage(`Error fetching user document: ${error.message}`, errorMessageElement, "red");
            });
            document.getElementById("loading").style.display = 'none';
        }

        // Helper function to display messages in the wishlistError p tag (specific for each poster)
        function showMessage(message, messageElement, color) {
            document.getElementById("loading").style.display = "none"; // Hide the loading spinner

            if (messageElement) {
                messageElement.textContent = message;  // Set the message text
                messageElement.style.color = color;    // Set color (red for errors, green for success)

                // Hide the message after 5 seconds
                setTimeout(function () {
                    messageElement.textContent = "";
                }, 5000);
            }
        }



        // Function to check if a movie is rented
        async function isMovieRented(loggedInUserId, movieTitle) {
            const userDocRef = doc(db, "users", loggedInUserId); // Reference to the user's document
            removeExpiredRentals(loggedInUserId);

            try {
                const docSnapshot = await getDoc(userDocRef);
                if (docSnapshot.exists()) {
                    const rentals = docSnapshot.data().rentals;

                    // Check if the movie is in the rentals array
                    return rentals.some(rental => rental.title === movieTitle);
                } else {
                    console.error("User document does not exist!");
                    return false;  // If the user document doesn't exist, return false
                }
            } catch (error) {
                console.error("Error fetching rentals: ", error);
                return false;  // Return false if there is an error fetching the rentals
            }
        }





        async function removeExpiredRentals(userId) {
            try {
                const userRef = doc(db, "users", userId);  // Reference to user's document in Firestore
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    let rentals = userData.rentals || [];

                    // Get the current date
                    const currentDate = new Date();

                    // Filter out expired rentals
                    rentals = rentals.filter(rental => {
                        const rentalExpiration = new Date(rental.rentalExpiration);
                        return rentalExpiration > currentDate;  // Keep rentals that haven't expired
                    });

                    // Update the rentals list in Firestore
                    await updateDoc(userRef, { rentals });

                    console.log('Expired rentals removed');
                } else {
                    throw new Error("User document not found.");
                }
            } catch (error) {
                console.error("Error removing expired rentals:", error);
            }
        }

        // Example: Call this function to remove expired rentals when the page loads

        let rented = false;

        if (subCheck) {
            console.log("hi")
            // document.getElementById("loading").style.display = "none";

        } else {
            if (loggedInUserId) {
                isMovieRented(loggedInUserId, movieTitle)
                    .then(isRented => {
                        if (isRented) {
                            console.log("The movie is rented.");
                            document.getElementById("rentedTag").style.display = "block";
                            rented = true;
                        } else {
                            console.log("The movie is not rented.");
                            document.getElementById("playButton").textContent = "Rent Now";

                        }
                        document.getElementById("loading").style.display = "none";

                    });
            }

        }

        // const mediaQuery2 = window.matchMedia('(max-width: 767px)');

        // Check if the media query matches

        const playButton = document.getElementById("playButton");

        playButton.addEventListener("click", () => {
            if (mediaQuery.matches) {
                // Code for small screens (mobile/tablet)
                console.log("Screen is less than 768px wide");

                document.getElementById("video-container").classList.add("pb-5")

                if (checkUserExists()) {
                    if (rented || subCheck) {
                        document.getElementById("playButton").setAttribute('disabled', 'true');
                        document.getElementById('trailer').style.display = 'none';
                        document.getElementById("trailerPlay").textContent = "Watch Trailer";
                        document.getElementById("trailerPlay").style.backgroundImage = 'linear-gradient(to bottom right, green, black)';
                        document.getElementById('trailer').src = "";
                        document.getElementById("posterDiv").style.height = '15rem';
                        renderVideoPlayer(movie);
                        changeVideoSource(movie);
                        const closeBtn = document.getElementById("clsBtn");

                        closeBtn.style.display = "block";

                        // Trigger fullscreen once the video is ready
                        function renderVideoPlayer(movie) {
                            // Create the video element dynamically
                            const videoHTML = `
              <video id="my-video" class="video-js vjs-default-skin" controls loop="loop" autoplay preload="auto" width="600" height="310" data-setup="{}" poster="${movie.thumbnails}">
                <source src="${movie.video}" type="video/mp4">
                <p class="vjs-no-js">
                  To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video.
                </p>
              </video>        <button id="clsBtn" style="display: ;">                    <i class="fa-solid fa-x "></i>
        </button>
        
            `;

                            // Inject the video HTML into a container in the DOM
                            document.getElementById('video-container').innerHTML += videoHTML;

                            // Initialize the video player with custom functionality
                            initializeVideoPlayer(movie);
                        }

                        function initializeVideoPlayer(movie) {
                            // Initialize the Video.js player
                            const player = videojs('my-video');

                            player.ready(function () {
                                console.log('Video.js player is ready!');

                                // Update the live display or any other player UI elements (optional)
                                const liveDisplayElement = document.querySelector('.vjs-live-display');
                                if (liveDisplayElement) {
                                    liveDisplayElement.innerHTML = `<span class="vjs-control-text">Stream Type&nbsp;</span>${movie.title}`;
                                }

                                // Trigger fullscreen when the player is ready
                                const video = document.getElementById('my-video');
                                enterFullScreen(video);

                            });
                        }

                        function enterFullScreen(videoElement) {
                            // Trigger fullscreen on the video element
                            if (videoElement.requestFullscreen) {
                                videoElement.requestFullscreen();
                            } else if (videoElement.mozRequestFullScreen) { // Firefox
                                videoElement.mozRequestFullScreen();
                            } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
                                videoElement.webkitRequestFullscreen();
                            } else if (videoElement.msRequestFullscreen) { // IE/Edge
                                videoElement.msRequestFullscreen();
                            }
                            const closeBtn = document.getElementById("clsBtn");

                            closeBtn.addEventListener("click", () => {
                                // Exit fullscreen if the video is in fullscreen
                                if (document.fullscreenElement ||
                                    document.webkitFullscreenElement ||
                                    document.mozFullScreenElement ||
                                    document.msFullscreenElement) {
                                    if (document.exitFullscreen) {
                                        document.exitFullscreen();
                                    } else if (document.webkitExitFullscreen) {
                                        document.webkitExitFullscreen();
                                    } else if (document.mozCancelFullScreen) {
                                        document.mozCancelFullScreen();
                                    } else if (document.msExitFullscreen) {
                                        document.msExitFullscreen();
                                    }
                                }

                                // Stop the video and hide the player


                                // Hide the video player and close button
                                document.getElementById("my-video").innerHTML = '';
                                closeBtn.style.display = "none"; // Hide the close button
                                window.location.reload();
                            });
                        }
                    }
                    else {
                        const movieTitle = document.getElementById("playButton").getAttribute("data-title");

                        window.location.href = `../order/order.html?title=${encodeURIComponent(movieTitle)}`;

                    }
                } else {
                    const popup = document.getElementById('loginMain');
                    document.getElementById("posterDiv").style.height = '0rem';

                    // Check if the popup is already visible
                    if (popup.style.display !== 'flex') {
                        const overlay = document.getElementById("overlay");

                        overlay.style.display = "block";


                        popup.style.display = 'flex';
                        document.getElementById("loading").style.display = "none";

                    }
                }
                document.getElementById("loading").style.display = "none";

            } else if (mediaQuery1.matches) {
                // Code for small screens (mobile/tablet)
                console.log("Screen is less than 768px wide");

                document.getElementById("video-container").classList.add("pb-5")

                if (checkUserExists()) {
                    if (rented || subCheck) {
                        document.getElementById("playButton").setAttribute('disabled', 'true');
                        document.getElementById('trailer').style.display = 'none';
                        document.getElementById("trailerPlay").textContent = "Watch Trailer";
                        document.getElementById("trailerPlay").style.backgroundImage = 'linear-gradient(to bottom right, green, black)';
                        document.getElementById('trailer').src = "";
                        document.getElementById("posterDiv").style.height = '30rem';
                        renderVideoPlayer(movie);
                        changeVideoSource(movie);
                        const closeBtn = document.getElementById("clsBtn");

                        closeBtn.style.display = "block";

                        // Trigger fullscreen once the video is ready
                        function renderVideoPlayer(movie) {
                            // Create the video element dynamically
                            const videoHTML = `
              <video id="my-video" class="video-js vjs-default-skin" controls loop="loop" autoplay preload="auto" width="600" height="310" data-setup="{}" poster="${movie.thumbnails}">
                <source src="${movie.video}" type="video/mp4">
                <p class="vjs-no-js">
                  To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video.
                </p>
              </video>        <button id="clsBtn" style="display: ;">                    <i class="fa-solid fa-x "></i>
        </button>
        
            `;

                            // Inject the video HTML into a container in the DOM
                            document.getElementById('video-container').innerHTML += videoHTML;

                            // Initialize the video player with custom functionality
                            initializeVideoPlayer(movie);
                        }

                        function initializeVideoPlayer(movie) {
                            // Initialize the Video.js player
                            const player = videojs('my-video');

                            player.ready(function () {
                                console.log('Video.js player is ready!');

                                // Update the live display or any other player UI elements (optional)
                                const liveDisplayElement = document.querySelector('.vjs-live-display');
                                if (liveDisplayElement) {
                                    liveDisplayElement.innerHTML = `<span class="vjs-control-text">Stream Type&nbsp;</span>${movie.title}`;
                                }

                                // Trigger fullscreen when the player is ready
                                const video = document.getElementById('my-video');
                                enterFullScreen(video);

                            });
                        }

                        function enterFullScreen(videoElement) {
                            // Trigger fullscreen on the video element
                            if (videoElement.requestFullscreen) {
                                videoElement.requestFullscreen();
                            } else if (videoElement.mozRequestFullScreen) { // Firefox
                                videoElement.mozRequestFullScreen();
                            } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
                                videoElement.webkitRequestFullscreen();
                            } else if (videoElement.msRequestFullscreen) { // IE/Edge
                                videoElement.msRequestFullscreen();
                            }
                            const closeBtn = document.getElementById("clsBtn");

                            closeBtn.addEventListener("click", () => {
                                // Exit fullscreen if the video is in fullscreen
                                if (document.fullscreenElement ||
                                    document.webkitFullscreenElement ||
                                    document.mozFullScreenElement ||
                                    document.msFullscreenElement) {
                                    if (document.exitFullscreen) {
                                        document.exitFullscreen();
                                    } else if (document.webkitExitFullscreen) {
                                        document.webkitExitFullscreen();
                                    } else if (document.mozCancelFullScreen) {
                                        document.mozCancelFullScreen();
                                    } else if (document.msExitFullscreen) {
                                        document.msExitFullscreen();
                                    }
                                }

                                // Stop the video and hide the player


                                // Hide the video player and close button
                                document.getElementById("my-video").innerHTML = '';
                                closeBtn.style.display = "none"; // Hide the close button
                                window.location.reload();
                            });
                        }
                    }
                    else {
                        const movieTitle = document.getElementById("playButton").getAttribute("data-title");

                        window.location.href = `../order/order.html?title=${encodeURIComponent(movieTitle)}`;

                    }
                } else {
                    const popup = document.getElementById('loginMain');
                    document.getElementById("posterDiv").style.height = '0rem';

                    // Check if the popup is already visible
                    if (popup.style.display !== 'flex') {
                        const overlay = document.getElementById("overlay");

                        overlay.style.display = "block";


                        popup.style.display = 'flex';
                        document.getElementById("loading").style.display = "none";

                    }
                }
                document.getElementById("loading").style.display = "none";

            } else {
                if (checkUserExists()) {
                    if (rented || subCheck) {
                        document.getElementById("playButton").setAttribute('disabled', 'true');
                        document.getElementById('trailer').style.display = 'none';
                        document.getElementById("trailerPlay").textContent = "Watch Trailer";
                        document.getElementById("trailerPlay").style.backgroundImage = 'linear-gradient(to bottom right, green, black)';
                        document.getElementById('trailer').src = "";
                        document.getElementById("row").style.height = '60%';
                        document.getElementById("backgroundOverlay").style.display = 'none';
    
                        renderVideoPlayer(movie);
                        changeVideoSource(movie);
                        const closeBtn = document.getElementById("clsBtn");

                        closeBtn.style.display = "block";

                        // Trigger fullscreen once the video is ready
                        function renderVideoPlayer(movie) {
                            // Create the video element dynamically
                            const videoHTML = `
         <video id="my-video" class="video-js vjs-default-skin" controls loop autoplay preload="auto"
  data-setup='{
    "techOrder": ["html5"],
    "playbackRates": [0.5, 1, 1.5, 2],
    "muted": false,
    "poster": "${movie.thumbnails}"
  }' poster="${movie.thumbnails}">
    <source src="${movie.video}" type="video/mp4">
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video.
    </p>
</video>        <button id="clsBtn" style="display: ;">                    <i class="fa-solid fa-x "></i>
    </button>
    
        `;

                            // Inject the video HTML into a container in the DOM
                            document.getElementById('video-container').innerHTML += videoHTML;

                            // Initialize the video player with custom functionality
                            initializeVideoPlayer(movie);
                        }

                        function initializeVideoPlayer(movie) {
                            // Initialize the Video.js player
                            const player = videojs('my-video');

                            player.ready(function () {
                                console.log('Video.js player is ready!');

                                // Update the live display or any other player UI elements (optional)
                                const liveDisplayElement = document.querySelector('.vjs-live-display');
                                if (liveDisplayElement) {
                                    liveDisplayElement.innerHTML = `<span class="vjs-control-text">Stream Type&nbsp;</span>${movie.title}`;
                                }

                                // Trigger fullscreen when the player is ready
                                const video = document.getElementById('my-video');
                                enterFullScreen(video);

                            });
                        }

                        function enterFullScreen(videoElement) {
                            // Trigger fullscreen on the video element
                            if (videoElement.requestFullscreen) {
                                videoElement.requestFullscreen();
                            } else if (videoElement.mozRequestFullScreen) { // Firefox
                                videoElement.mozRequestFullScreen();
                            } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
                                videoElement.webkitRequestFullscreen();
                            } else if (videoElement.msRequestFullscreen) { // IE/Edge
                                videoElement.msRequestFullscreen();
                            }
                            const closeBtn = document.getElementById("clsBtn");

                            closeBtn.addEventListener("click", () => {
                                // Exit fullscreen if the video is in fullscreen
                                if (document.fullscreenElement ||
                                    document.webkitFullscreenElement ||
                                    document.mozFullScreenElement ||
                                    document.msFullscreenElement) {
                                    if (document.exitFullscreen) {
                                        document.exitFullscreen();
                                    } else if (document.webkitExitFullscreen) {
                                        document.webkitExitFullscreen();
                                    } else if (document.mozCancelFullScreen) {
                                        document.mozCancelFullScreen();
                                    } else if (document.msExitFullscreen) {
                                        document.msExitFullscreen();
                                    }
                                }

                                // Stop the video and hide the player


                                // Hide the video player and close button
                                document.getElementById("my-video").innerHTML = '';
                                closeBtn.style.display = "none"; // Hide the close button
                                window.location.reload();
                            });
                        }
                    }
                    else {
                        const movieTitle = document.getElementById("playButton").getAttribute("data-title");

                        window.location.href = `../order/order.html?title=${encodeURIComponent(movieTitle)}`;

                    }
                } else {
                    const popup = document.getElementById('loginMain');
                    // Check if the popup is already visible
                    if (popup.style.display !== 'flex') {
                        const overlay = document.getElementById("overlay");

                        overlay.style.display = "block";


                        popup.style.display = 'flex';
                        document.getElementById("loading").style.display = "none";

                    }
                }
                document.getElementById("loading").style.display = "none";

            }
        });



    }

    // Call the function to fetch movie details based on the title
    fetchMovieDetail(movieTitle);
}




function changeVideoSource(movie) {
    // const player = videojs('my-video');
    var player = videojs('my-video');

    // Set the new video source using the Video.js API
    console.log(movie.video)
    player.src({
        type: "application/x-mpegURL",  // HLS format
        src: movie.video
        // New video URL (m3u8)
    });
    player.poster(movie.thumbnails);

    // Optionally, you can also directly modify the background-image of the poster div
    // The new image path

    // Change the poster attribute (this will set the poster for the video)
    player.poster(movie.thumbnails);
    var posterElement = document.querySelector('.vjs-poster');
    if (posterElement) {
        posterElement.style.backgroundImage = 'url(' + movie.thumbnails + ')';
        posterElement.style.backgroundSize = 'cover'; // Ensure the image covers the area
    }

    // Optionally, load the new source and start playing
    // player.load();  // This is handled by Video.js internally
    // player.play();  // Play the new video immediately
    document.getElementById("loading").style.display = "none";
}
// let profileName = localStorage.getItem("name");
// console.log(profileName)
// if (/^[a-zA-Z]/.test(profileName[0])) {
//     document.getElementById("profileName").textContent = profileName[0].toUpperCase();

// } else {
//     document.getElementById("profileName").textContent = "#";
// }





document.getElementById("closeBtn").addEventListener("click", () => {
    document.getElementById("loading").style.display = "none";
    document.body.classList.remove('no-scroll');  // Enable scrolling
    document.getElementById("profileSection").style.display = "none";

});

const searchBar = document.getElementById('search');
const searchResultsContainer = document.getElementById('searchResults');

// Example: A sample dataset of movie titles (could be fetched from an API)



// Function to display search results


function displayResults(results) {
    searchResultsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        document.getElementById("searchResultsContainer").style.display = "block"

        document.getElementById("searchTitle").textContent = 'No results found';

        document.getElementById("loading").style.display = "none";
        return;
    }
    document.getElementById("searchTitle").textContent = 'Search Results';

    const movieContainer = document.getElementById("searchResults");

    results.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie';

        movieDiv.innerHTML = `<img src="${movie.poster}" alt="${movie.title}">
        <h2 class='text-black'>${movie.title}</h2>
        <p class='text-black'>${movie.year}</p>
        <div class="popups flex-column">
          <div class="p-0">
            <img src="${movie.thumbnails}" alt="${movie.title}">
          </div>
          <div class="p-3 d-flex flex-column gap-3">
            <h2>${movie.title}</h2>
            <div class="d-flex gap-4 justify-content-between">
              <a href="pages/details/details.html?title=${encodeURIComponent(movie.title)}">
                <button id="watch" class="btn btn-success">More details</button>
              </a>
              <button id="add" class="add-to-wishlist btn" data-title="${movie.title}" title='Wishlist'>
                <i class="fa-regular fa-heart fa-2xl"></i>
              </button>
            </div>
            <p id="wishlistError" class="m-0 text- wishlist-error"></p>
            <p id="wishlistSuccess" class="m-0 text-success wishlist-"></p>
            <div class="d-flex justify-content-evenly">
              <p class="m-0">${movie.year}</p>
              <p class="m-0">•</p>
              <p class="m-0">${movie.duration}</p>
              <p class="m-0">•</p>
              <p class="m-0 bg-success px-2 rounded-1"><strong>${movie.rating}/5</strong></p>
            </div>
            <p class="m-0">${movie.description}</p>
          </div>
        </div>`;

        // Append movie div to container
        movieContainer.appendChild(movieDiv);

        // Log the buttons to ensure they're there

        const buttons = movieDiv.querySelectorAll('.add-to-wishlist');
        console.log('Buttons:', buttons);  // Log the buttons array
        buttons.forEach(button => {
            const buttonIcon = button.querySelector('i');  // Get the icon (plus or minus) inside the button
            console.log('Button icon:', buttonIcon);  // Log the button icon to check if it exists

            // Safeguard if the icon is missing
            if (!buttonIcon) {
                console.error('Button does not contain <i> icon:', button);
                return; // Skip this button if the icon is not present
            }

            const movieTitle = button.getAttribute('data-title');
            const errorMessageElement = button.closest('.movie').querySelector('.wishlist-error');

            // Check if loggedInUserId is available
            if (loggedInUserId) {
                checkWishlistStatus(loggedInUserId, movieTitle, buttonIcon);
                button.addEventListener('click', function () {
                    document.getElementById("loading").style.display = "flex";
                    toggleWishlist(loggedInUserId, movieTitle, errorMessageElement, buttonIcon);
                });
            } else {
                button.addEventListener('click', function () {
                    showMessage('Please log in to add movies to the wishlist.', errorMessageElement, 'red');
                });
                console.error('User not logged in. Please log in to add movies to the wishlist.');
            }
        });

    });

    // const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    // const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))



    // Function to check the wishlist status for each movie
    function checkWishlistStatus(loggedInUserId, movieTitle, buttonIcon) {
        const userDocRef = doc(db, "users", loggedInUserId); // Reference to the user's document in Firestore

        // Get the current wishlist array from Firestore
        getDoc(userDocRef).then(docSnapshot => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const currentWishlist = userData.wishlist || [];

                // If the movie is in the wishlist, set the button to 'minus' (remove)
                if (currentWishlist.includes(movieTitle)) {
                    buttonIcon.classList.remove('fa-regular');
                    buttonIcon.style.color = 'red';
                    buttonIcon.classList.add('fa-solid');
                } else {
                    // If the movie is not in the wishlist, set the button to 'plus' (add)
                    buttonIcon.classList.remove('fa-solid');
                    buttonIcon.style.color = 'white';
                    buttonIcon.classList.add('fa-regular');
                }
            } else {
                // If the user document doesn't exist, initialize with 'plus' icon
                console.error("User document does not exist. Creating a new document...");
                buttonIcon.classList.remove('fa-solid');
                buttonIcon.style.color = 'white';
                buttonIcon.classList.add('fa-regular');
            }
        }).catch((error) => {
            console.error("Error fetching user document: ", error);
        });
    }

    // Function to add or remove the movie title to/from the Firestore wishlist array
    function toggleWishlist(loggedInUserId, movieTitle, errorMessageElement, buttonIcon) {
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

    // Helper function to display messages in the error container (specific for each poster)
    function showMessage(message, messageElement, color) {
        document.getElementById("loading").style.display = "none";
        messageElement.textContent = message;  // Set the message text
        messageElement.style.color = color;    // Set color (red for errors, green for success)

        // Hide the message after 5 seconds
        setTimeout(() => {
            messageElement.textContent = "";
        }, 5000);
    }

    document.getElementById("searchResultsContainer").style.display = "block"
    document.getElementById("loading").style.display = "none";

};


// Function to handle search input
async function handleSearch(event) {
    document.body.classList.add('no-scroll');  // Enable scrolling

    const data = [];

    try {
        // Reference to the "movies" collection in Firestore
        const moviesCollectionRef = collection(db, "movies");

        // Get the documents from the collection
        const querySnapshot = await getDocs(moviesCollectionRef);

        // Loop through each document and get the 'thumbnails' URL
        querySnapshot.forEach((doc) => {
            const movieData = doc.data();
            data.push(movieData);
            // const filteredResults = data.filter(item => item.title.toLowerCase().includes(query));

            // return movieData;

        });


    } catch (error) {
        console.error("Error fetching movie thumbnails from Firestore:", error);
    }
    const query = event.target.value.trim().toLowerCase();

    if (query.length === 0) {
        searchResultsContainer.innerHTML = ''; // Clear if empty query
        document.getElementById("searchResultsContainer").style.display = "none"
        document.getElementById("loading").style.display = "none";
        document.body.classList.remove('no-scroll');  // Enable scrolling

        return;
    }

    // Filter the dataset by title (this could be a call to an API in a real app)
    const filteredResults = data.filter(item => item.title.toLowerCase().includes(query));
    // Display the results
    displayResults(filteredResults);
}

// Event listener for input changes
searchBar.addEventListener('input', handleSearch);

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    signOut(auth)
        .then(() => {
            localStorage.removeItem("loggedInUserId");
            localStorage.removeItem("name");
            localStorage.removeItem("color");
            // window.history.replaceState(null, null, "../../index.html"); // Prevent going back
            // window.location.replace("../../index.html");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error Signing out", error);
        });

});

let check = false;


function checkUserExists() {
    // This could be a check for a cookie, local storage, or API request
    return localStorage.getItem('loggedInUserId') !== null; // Example using local storage
}

// Redirect to home page if user exists

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
                        if (userData.color) {
                            localStorage.setItem("color", userData.color);
                        }

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


// document.getElementById("user").addEventListener("click", () => {
//     if (check) {
//         window.location.href = "../profile/profile.html";
//         // let loading = document.getElementById("loading");
//         // loading.style.display = "block";
//         // loading.textContent = "";
//         // document.body.classList.add('no-scroll');  // Disable scrolling
//         // document.getElementById("profileSection").style.display = "block";
//     } else {
//         const popup = document.getElementById('loginMain');
//         // Check if the popup is already visible
//         if (popup.style.display !== 'flex') {
//             const overlay = document.getElementById("overlay");

//             overlay.style.display = "block";

//             popup.style.display = 'flex';
//         }
//     }

// });



//  else {
//     const popup = document.getElementById('loginMain');
//     // Check if the popup is already visible
//     if (popup.style.display !== 'flex') {
//         playCheck = true;
//         const overlay = document.getElementById("overlay");
//         overlay.style.display = "block";

//         popup.style.display = 'flex';
//     }
// }



document.getElementById("close-Btn").addEventListener("click", () => {
    document.getElementById("loading").style.display = "none";
    document.body.classList.remove('no-scroll');  // Enable scrolling
    document.getElementById("profileSection").style.display = "none";

});

function getRandomRgbColor() {
    const r = Math.floor(Math.random() * 256); // Random red value
    const g = Math.floor(Math.random() * 256); // Random green value
    const b = Math.floor(Math.random() * 256); // Random blue value
    localStorage.setItem("color", `rgb(${r}, ${g}, ${b})`);
};

function profileNameCreator() {
    document.getElementById("search").value = "";
    document.getElementById("user").classList.remove("bg-black"); // Example: setting random background color
    document.getElementById("user").classList.add("border");
    document.getElementById("user").classList.add("border-white");
    document.getElementById("user").classList.add("border-4");
    document.getElementById("user").classList.add("rounded-circle");
    document.getElementById("user").style.width = "3rem";
    document.getElementById("user").classList.add("justify-content-center");

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

function showMessage(message, divId) {
    console.log("hi")
    var messageDiv = document.getElementById(divId);
    const loading = document.getElementById("loading");
    loading.style.display = "none";
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

function greenMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    const loading = document.getElementById("loading");
    loading.style.display = "none";
    messageDiv.style.display = "block";
    messageDiv.style.color = "greenyellow";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;

}

const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("loading").style.display = "flex";
    document.getElementById("loadMessage").textContent = "Please Wait...";
    // loading.innerHTML = "Please Wait...";
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value; // Fixed typo here: "vlaue" to "value"



    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            greenMessage("Successfully Logged In", "signInMessage"); // Fixed typo: "Logined" to "Logged In"
            localStorage.setItem("loggedInUserId", email);
            // getRandomRgbColor();
            // window.history.replaceState(null, null, "pages/home/home.html"); // Prevent going back

            // window.location.replace("../home/home.html");
            // Change the location to the next page

            // window.location.replace("pages/home/home.html");
            // getRandomRgbColor();
            window.location.reload();

            document.getElementById('name').value = '';
            document.getElementById('newEmail').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        })
        .catch((error) => {
            const errorCode = error.code;
            // if (email==""){
            //     showMessage("Email cannot be empty", "signInMessage");

            // }
            // // else if (password==""){
            //     showMessage("Password cannot be empty", "signInMessage");

            // }

            if (email == "") {
                showMessage("Email cannot be empty", "signInEmailMessage")

            } else if (errorCode === "auth/invalid-email") {
                showMessage("Please enter a valid Email", "signInEmailMessage");
            }
            if (errorCode === "auth/missing-password") {
                showMessage("Password cannot be empty", "signInPasswordMessage");
            }
            else if (password.length < 8) {
                showMessage("Password must be greater than 8 characters", "signInPasswordMessage");
            }
            else if (errorCode === "auth/invalid-credential") { // Added handling for user-not-found error
                showMessage("Invalid Email or Password", "signInMessage");
            } else if (errorCode === "auth/user-not-found") {
                showMessage("Account doesn't exists", "signInMessage");
            }
            //  else {
            //     showMessage("Incorrect", "signInMessage");
            // }
            console.log(error);
        });
}
);

document.getElementById("createNavigator").addEventListener("click", () => {
    document.getElementById('loginMain').style.display = 'none';
    document.getElementById('createMain').style.display = 'flex';

});

document.getElementById('createCloseBtn').addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent triggering the body click event
    document.getElementById('name').value = '';
    document.getElementById('newEmail').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginMain').style.display = 'none';
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    document.getElementById('createMain').style.display = 'none';
});

document.getElementById("loginNavigator").addEventListener("click", () => {
    document.getElementById('createMain').style.display = 'none';
    document.getElementById('loginMain').style.display = 'flex';
});

function togglePassword(password, icon) {
    const passwordField = document.getElementById(password);
    const passwordToggle = document.getElementById(icon);

    // Toggle between the eye and eye-slash icons and input type
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passwordToggle.classList.remove('fa-eye');
        passwordToggle.classList.add('fa-eye-slash'); // Change to "hide" icon
    } else {
        passwordField.type = 'password';
        passwordToggle.classList.remove('fa-eye-slash');
        passwordToggle.classList.add('fa-eye'); // Change to "show" icon
    }
}
document.getElementById("eye").addEventListener("click", () => {
    togglePassword("password", "eye");
});
document.getElementById("newEye").addEventListener("click", () => {
    togglePassword("newPassword", "newEye");
});
document.getElementById('closeBtn').addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent triggering the body click event
    document.getElementById('name').value = '';
    document.getElementById('newEmail').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginMain').style.display = 'none';
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
});

//===================================Create code======================================================


createBtn.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("loading").style.display = "flex";
    document.getElementById("loadMessage").textContent = "Please Wait...";
    const name = document.getElementById("name").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;

    let namePattern = /^[A-Za-z\s]+$/; // Allow alphabets and spaces
    let nonSpacePattern = /[A-Za-z]/;
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    let ok = true;

    if (name == "") {
        showMessage("Name cannot be empty", "signUpNameMessage");
        ok = false;
    } else if (name.length < 3) {
        showMessage("Name must contain atleast 3 characters", "signUpNameMessage");
        ok = false;
    }
    else if (!nonSpacePattern.test(name)) {
        showMessage("Name cannot be only spaces", "signUpNameMessage");
        ok = false;
    } else if (name.length > 20) {
        showMessage("Name must not contain more than 20 characters.", "signUpNameMessage");
        ok = false;
    } else if (!namePattern.test(name)) {
        showMessage("Name should only contain alphabets", "signUpNameMessage");
        ok = false;
    }

    if (email == "") {
        showMessage("Email cannot be empty", "signUpEmailMessage");
        ok = false;
    } else if (!emailPattern.test(email)) {
        showMessage("Please enter a valid Email", "signUpEmailMessage");
        ok = false;
    }

    if (password == "") {
        showMessage("Password cannot be empty", "signUpPasswordMessage");
        ok = false;
    } else if (password.length < 8) {
        showMessage("Password must contain at least 8 characters", "signUpPasswordMessage");
        ok = false;
    }

    function isStrongPassword(password) {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    if (password.length >= 8 && !isStrongPassword(password)) {
        showMessage("Password must contain an uppercase letter, a lowercase letter, a number, and a special character.", "signUpPasswordMessage");
        ok = false;
    }

    if (ok) {
        const auth = getAuth();
        const db = getFirestore();

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                const userData = {
                    name: name,
                    password: password,
                    email: email
                };

                greenMessage("Account Created Successfully", "signUpMessage");
                localStorage.setItem("loggedInUserId", email);

                const docRef = doc(db, "users", email);
                setDoc(docRef, userData)
                    .then(() => {
                        document.getElementById('createMain').style.display = 'none';
                        document.getElementById('loginMain').style.display = 'none';
                        getRandomRgbColor();
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Error writing document", error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                console.log(error);
                if (errorCode === "auth/email-already-in-use") {
                    showMessage("Email Address Already Exists !!!", "signUpEmailMessage");
                } else {
                    showMessage("Invalid Email", "signUpEmailMessage");
                }
            });
    }
});


// const postersContainer = document.getElementById('searchResults');
// const observer = new MutationObserver(() => {
//     const posters = document.querySelectorAll('.movie');
//     posters.forEach(poster => {
//         let timeout;

//         // Mouse enter event
//         poster.addEventListener('mouseenter', () => {
//             console.log("Hover started on", poster.id);

//             const popup = poster.querySelector('.popups');
//             console.log("Popup found:", popup);

//             // Hide all popups immediately when hovering starts
//             document.querySelectorAll('.popups').forEach(popup => popup.style.opacity = 0);

//             // Set a timeout to show the popup after 2 seconds
//             timeout = setTimeout(() => {
//                 popup.style.display = 'flex';
//                 popup.classList.add("fade");
//                 popup.style.opacity = 1;
//             }, 500);
//         });

//         // Mouse leave event
//         poster.addEventListener('mouseleave', () => {
//             console.log("Hover ended on", poster.id);
//             clearTimeout(timeout);
//             poster.querySelector('.popups').style.display = 'none';
//         });
//     });
// });

// // Start observing the posters container for child changes (new posters added)
// observer.observe(postersContainer, { childList: true });

function addHoverEventsToPosters(containerId) {
    const postersContainer = document.getElementById(containerId);

    // Create a MutationObserver to watch for added poster divs
    const observer = new MutationObserver(() => {
        const posters = postersContainer.querySelectorAll('.movie');

        posters.forEach(poster => {
            // Ensure we're not adding event listeners multiple times (check if already added)
            if (!poster.hasAttribute('data-hover-events-attached')) {
                let timeout;

                // Mouse enter event
                poster.addEventListener('mouseenter', () => {
                    console.log("Hover started on", poster.id);

                    // Find the popup element within the poster
                    const popup = poster.querySelector('.popups');
                    console.log("Popup found:", popup);

                    // Hide all other popups immediately when hovering starts
                    document.querySelectorAll('.popups').forEach(p => p.style.opacity = 0);

                    // Set a timeout to show the popup after 500ms
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
                    // Hide the popup when the mouse leaves the poster
                    const popup = poster.querySelector('.popups');
                    if (popup) popup.style.display = 'none';
                });

                // Mark this poster as having events attached to prevent re-adding event listeners
                poster.setAttribute('data-hover-events-attached', 'true');
            }
        });
    });

    // Start observing the posters container for new children
    observer.observe(postersContainer, { childList: true });
}

// Call the function for different containers
addHoverEventsToPosters('searchResults');

const mediaQuery1 = window.matchMedia('(max-width: 1023px)');
// const mediaQuery2 = window.matchMedia('(max-width: 767px)');

// Check if the media query matches
if (mediaQuery1.matches) {
    // Code for small screens (mobile/tablet)
    console.log("Screen is less than 768px wide");
    const searchDiv = document.getElementById('searchDiv');
    const searchInput = document.getElementById('search');

    // document.getElementById("trailer").classList.remove("videoStyle");
    // document.getElementById("video-container").classList.remove("videoStyle");
    function movePosterDiv() {
        const posterDiv = document.getElementById("posterDiv");  // Select the posterDiv
        const moreDetails = document.getElementById("moreDetails");  // Select the moreDetails div

        if (posterDiv && moreDetails) {
            moreDetails.parentNode.insertBefore(posterDiv, moreDetails);  // Insert posterDiv above moreDetails
        }
    }

    // Call the function to move the divs
    movePosterDiv();
    const searchIcon = document.getElementById("searchIcon");
    document.getElementById("posterDiv").classList.remove("col");
    searchIcon.addEventListener('click', function () {
        // If the input field is hidden, show it and change the icon
        if (searchInput.style.display === 'none' || searchInput.style.display === '') {
            searchInput.style.display = 'inline-block';  // Show the input field
            searchDiv.style.position = 'absolute';
            searchDiv.style.left = "20%";
            searchDiv.style.right = "20%";
            searchIcon.classList.remove("fa-magnifying-glass");
            searchIcon.classList.add("fa-arrow-left");

            searchInput.focus();  // Focus on the input field
        }
        // If the input field is visible, hide it and change the icon back to the search icon
        else {
            searchInput.style.display = 'none';  // Hide the input field
            searchIcon.classList.remove("fa-arrow-left");
            searchIcon.classList.add("fa-magnifying-glass");
            searchDiv.style.right = "";
            searchDiv.style.left = "";

            // Reset the search bar position
            searchDiv.style.position = '';
            searchInput.value = ''; // Clear the input field
        }
    });
} else {
    // Code for larger screens (desktop)
    console.log("Screen is wider than 768px");
}


const mediaQuery = window.matchMedia('(max-width: 767px)');
// const mediaQuery2 = window.matchMedia('(max-width: 767px)');

// Check if the media query matches
if (mediaQuery.matches) {
    // Code for small screens (mobile/tablet)

    document.getElementById("rating").classList.remove("gap-5");
    document.getElementById("rating").classList.add("justify-content-between");

} else {
    // Code for larger screens (desktop)
    console.log("Screen is wider than 768px");
}

async function filterComedyGenresFromFirestore(genre) {
    const querySnapshot = await getDocs(collection(db, 'movies'));

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Check if the movie's genre includes the specified genre, 
        // the movie title isn't already suggested, and it isn't the current movie title
        if (data.genre && data.genre.includes(`${genre}`) && !suggested.includes(`${data.title}`) && data.title !== movieTitle) {
            suggested.push(data.title);
            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie';

            // Ensure the movie Div is properly populated with the correct content
            movieDiv.innerHTML = `
                <img src="${data.poster}" alt="${data.title}">
                <h2 class="text-black">${data.title}</h2>
                <p class="text-black">${data.year}</p>
                <div class="popups flex-column">
                    <div class="p-0">
                        <img src="${data.thumbnails}" alt="${data.title}">
                    </div>
                    <div class="p-3 d-flex flex-column gap-3">
                        <h2>${data.title}</h2>
                        <div class="d-flex gap-4 justify-content-between">
                            <a href="details.html?title=${encodeURIComponent(data.title)}">
                                <button id="watch" class="btn btn-success">More details</button>
                            </a>
                            <button id="add" class="add-to-wishlist btn btn-black text-white" data-title="${data.title}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Wishlist">
                                <i class="fa-regular fa-heart fa-2xl"></i>
                            </button>
                        </div>
                        <p class="m-0 text- wishlist-error"></p>
                        <div class="d-flex justify-content-evenly">
                            <p class="m-0">${data.year}</p>
                            <p class="m-0">•</p>
                            <p class="m-0">${data.duration}</p>
                            <p class="m-0">•</p>
                            <p class="m-0 bg-success px-2 rounded-1"><strong>${data.rating}/5</strong></p>
                        </div>
                        <p class="m-0">${data.description}</p>
                    </div>
                </div>`;

            // Append the movieDiv to the suggestions container
            document.getElementById("suggestionDiv").appendChild(movieDiv);

            // Hide loading spinner once the movieDiv is appended
            document.getElementById("loading").style.display = "none";
        }
    });

    // Add event listeners for all wishlist buttons after they are appended
    const buttons = document.querySelectorAll('.add-to-wishlist');

    buttons.forEach(button => {
        const movieTitle = button.getAttribute('data-title');
        const buttonIcon = button.querySelector('i');
        const errorMessageElement = button.closest('.movie')?.querySelector('.wishlist-error'); // Safe query

        if (loggedInUserId) {
            checkWishlistStatus(loggedInUserId, movieTitle, buttonIcon);

            button.addEventListener('click', function () {
                document.getElementById("loading").style.display = "flex";
                toggleWishlist(loggedInUserId, movieTitle, errorMessageElement, buttonIcon);
            });
        } else {
            button.addEventListener('click', function () {
                if (errorMessageElement) {
                    showMessage(`Please log in to add movies to the wishlist.`, errorMessageElement, "red");
                }
            });

            console.error("User not logged in. Please log in to add movies to the wishlist.");
        }
    });

    function checkWishlistStatus(loggedInUserId, movieTitle, buttonIcon) {
        const userDocRef = doc(db, "users", loggedInUserId);

        getDoc(userDocRef).then(docSnapshot => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const currentWishlist = userData.wishlist || [];

                if (currentWishlist.includes(movieTitle)) {
                    buttonIcon.classList.remove('fa-regular');
                    buttonIcon.style.color = 'red';
                    buttonIcon.classList.add('fa-solid');
                } else {
                    buttonIcon.classList.remove('fa-solid');
                    buttonIcon.style.color = 'white';
                    buttonIcon.classList.add('fa-regular');
                }
            } else {
                console.error("User document does not exist. Creating a new document...");
                buttonIcon.classList.remove('fa-solid');
                buttonIcon.style.color = 'white';
                buttonIcon.classList.add('fa-regular');
            }
        }).catch((error) => {
            console.error("Error fetching user document: ", error);
        });
    }

    function toggleWishlist(loggedInUserId, movieTitle, errorMessageElement, buttonIcon) {
        const userDocRef = doc(db, "users", loggedInUserId);

        // Clear previous error message
        if (errorMessageElement) errorMessageElement.textContent = "";

        getDoc(userDocRef).then(docSnapshot => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const currentWishlist = userData.wishlist || [];

                if (currentWishlist.includes(movieTitle)) {
                    updateDoc(userDocRef, {
                        wishlist: arrayRemove(movieTitle)
                    })
                    .then(() => {
                        console.log(`${movieTitle} removed from wishlist in Firestore!`);
                        showMessage(`${movieTitle} removed from your wishlist.`, errorMessageElement, "red");

                        buttonIcon.classList.remove('fa-solid');
                        buttonIcon.style.color = 'white';
                        buttonIcon.classList.add('fa-regular');
                    })
                    .catch((error) => {
                        console.error("Error removing from wishlist: ", error);
                        showMessage(`Error removing from wishlist: ${error.message}`, errorMessageElement, "red");
                    });
                } else {
                    updateDoc(userDocRef, {
                        wishlist: arrayUnion(movieTitle)
                    })
                    .then(() => {
                        console.log(`${movieTitle} added to wishlist in Firestore!`);
                        showMessage(`${movieTitle} added to your wishlist!`, errorMessageElement, "green");

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
                console.error("User document does not exist. Creating a new document...");
                showMessage("User document does not exist. Creating a new document...", errorMessageElement, "red");

                setDoc(userDocRef, { wishlist: [movieTitle] })
                    .then(() => {
                        console.log("New user document created with wishlist!");
                        showMessage("New user document created with wishlist!", errorMessageElement, "green");

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

    function showMessage(message, messageElement, color) {
        document.getElementById("loading").style.display = "none";
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.color = color;

            setTimeout(() => {
                messageElement.textContent = "";
            }, 5000);
        }
    }
}

