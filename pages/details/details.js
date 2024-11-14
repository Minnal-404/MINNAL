document.getElementById("loading").style.display = "flex";
document.getElementById("loadMessage").textContent = "Please Wait...";


import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
// import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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

// Get the movie ID from the URL
// Using Firestore

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
    const posterDiv = document.getElementById("posterDiv");
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
        const movieHTML = `<button id="playButton" class="btn btn-success">Play</button>`;

        movieDetailContainer.innerHTML += movieHTML;  // Inject HTML into the page
        let genres = '';
        for (let i = 0; i<movie.genre.length; i++){
            genres += `<p class="col p-2">${movie.genre[i]}</p>`;
        }
        document.getElementById("genre").innerHTML = 
        `<div class="col-4 text-end pe-5 p-0"><h2 >Genre:</h2> 
        </div><div class="col""><div class="row gap-5">${genres}</div>
        </div>`;
        
        document.getElementById("description").innerHTML = `<div class="col-4 pe-5 p-0 text-end"><h2>Description:</h2> </div><p class="col p-2 lh-lg"">${movie.description}</p>`;
        document.getElementById("rating").innerHTML = `<div class="col-4 pe-5 text-end"><h2>Rating:</h2></div><p class="col-2 p-2"> ${movie.rating}</p>`;
        document.getElementById("duration").innerHTML = `<div class="col-4 pe-5 text-end"><h2>Duration:</h2></div><p class="col-2 p-2">${movie.duration}</p>`;
        document.getElementById("year").innerHTML = `<div class="col-4 pe-5 text-end"><h2>Year:</h2> </div><p class="col-2 p-2">${movie.year}</p>`;
        
        const poster = `<img src="${movie.poster}" alt="${movie.title}" style="width: 300px; height: auto;">`;
        posterDiv.innerHTML = poster;
        const playButton = document.getElementById("playButton");
        playButton.addEventListener("click", () => {
            // Navigate to the play page and pass the title or ID of the movie
            window.location.href = `../play/play.html?title=${encodeURIComponent(movie.title)}`;
        });
        document.getElementById("loading").style.display = "none";

    }

    // Call the function to fetch movie details based on the title
    fetchMovieDetail(movieTitle);
}


// let profileName = localStorage.getItem("name");
// console.log(profileName)
// if (/^[a-zA-Z]/.test(profileName[0])) {
//     document.getElementById("profileName").textContent = profileName[0].toUpperCase();
    
// } else {
//     document.getElementById("profileName").textContent = "#";
// }
function profileNameCreator() {
    document.getElementById("search").value = "";

    let profileName = localStorage.getItem("name");
    console.log(profileName)
    if (/^[a-zA-Z]/.test(profileName[0])) {
        document.getElementById("profileName").textContent = profileName[0].toUpperCase();
        document.getElementById("profile").textContent = profileName[0].toUpperCase();
        let color = getRandomRgbColor();
        document.getElementById("user").style.backgroundColor = color; // Example: setting random background color
        document.getElementById("prof").style.backgroundColor = color; // Example: setting random background color

    } else {
        document.getElementById("profileName").textContent = "#";
        document.getElementById("user").style.backgroundColor = getRandomRgbColor(); // Example: setting random background color
    }
}

onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (loggedInUserId) {
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    localStorage.setItem("name", userData.name);
                    // document.getElementById("userName").textContent += greetUser() + userData.name + " !!!";
                    document.getElementById("profName").textContent = userData.name;
                    document.getElementById("profEmail").textContent = userData.email;

                    profileNameCreator();
                } else {
                    console.log("No document found matching id")
                }
            })
            .catch((error) => {
                console.log("Error getting document"+error);
            })
    } else {
        console.log("User Id not found in local storage")
    }
});

function getRandomRgbColor() {
    const r = Math.floor(Math.random() * 256); // Random red value
    const g = Math.floor(Math.random() * 256); // Random green value
    const b = Math.floor(Math.random() * 256); // Random blue value
    return `rgb(${r}, ${g}, ${b})`;
}

document.getElementById("user").addEventListener("click", () => {
    let loading = document.getElementById("loading");
    loading.style.display = "block";
    loading.textContent = "";
    document.body.classList.add('no-scroll');  // Disable scrolling
    document.getElementById("profileSection").style.display = "block";
});

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
        searchResultsContainer.innerHTML = '<h1 class="text-white">No results found</h1>';
        return;
    }
    const movieContainer = document.getElementById("searchResults");

    results.forEach(movie => {
        const movieDiv = document.createElement('div');
            movieDiv.className = 'movie';

            // Create a link for each movie poster (ensure the query parameter is 'title')
            const movieLink = document.createElement('a');
            movieLink.href = `../details/details.html?title=${encodeURIComponent(movie.title)}`;  // Correctly passing 'title'

            // Insert the movie poster and title inside the link
            movieLink.innerHTML = `<img src="${movie.poster}" alt="${movie.title}"><h2>${movie.title}</h2><p>${movie.year}</p>`;

            // Append the movie link div to the container
            movieDiv.appendChild(movieLink);
            movieContainer.appendChild(movieDiv);
            document.getElementById("searchResults").style.display = "flex"
    });
}

// Function to handle search input
async function handleSearch(event) {
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
    console.log(data)
    const query = event.target.value.trim().toLowerCase();

    if (query.length === 0) {
        searchResultsContainer.innerHTML = ''; // Clear if empty query
        document.getElementById("searchResults").style.display = "none"

        return;
    }
    
    // Filter the dataset by title (this could be a call to an API in a real app)
    const filteredResults = data.filter(item => item.title.toLowerCase().includes(query));

    // Display the results
    displayResults(filteredResults);
}

// Event listener for input changes
searchBar.addEventListener('input', handleSearch);
