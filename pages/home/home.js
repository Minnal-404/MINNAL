document.getElementById("loading").style.display = "flex";
document.getElementById("loadMessage").textContent = "Please Wait...";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, getDocs, setDoc, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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


async function checkAndPushMovies() {

    try {

        // Reference to the "movies" collection
        const moviesCollectionRef = collection(db, "movies");

        // Get the documents from the collection
        const querySnapshot = await getDocs(moviesCollectionRef);

        // Check if the collection is empty
        if (querySnapshot.empty) {
            console.log("The 'movies' collection is empty. Pushing data...");
            const response = await fetch('../admin/movies.json'); // URL to your local JSON file
            if (!response.ok) {
                throw new Error("Failed to fetch JSON data");
            }

            const movieData = await response.json();
            // Push all the movies to Firestore
            for (let movie of movieData.movies) {
                const docRef = doc(db, "movies", movie.title);  // Use movie.title as the document ID

                // Push the movie data
                await setDoc(docRef, movie);
                console.log(`Movie titled "${movie.title}" pushed successfully.`);

            }
            window.location.reload();

        } else {
            console.log("The 'movies' collection already contains data. No need to push.");
        }
    } catch (error) {
        console.error("Error checking the movies collection:", error);
    }
}
checkAndPushMovies();


// Function to generate a random RGB color
function getRandomRgbColor() {
    const r = Math.floor(Math.random() * 256); // Random red value
    const g = Math.floor(Math.random() * 256); // Random green value
    const b = Math.floor(Math.random() * 256); // Random blue value
    return `rgb(${r}, ${g}, ${b})`;
};

// Apply the random color to an element
document.body.style.backgroundColor = getRandomRgbColor(); // Example: setting random background color


onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (loggedInUserId) {
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    localStorage.setItem("name", userData.name);
                    document.getElementById("userName").textContent += greetUser() + userData.name + " !!!";
                    document.getElementById("profName").textContent = userData.name;
                    document.getElementById("profEmail").textContent = userData.email;

                    profileNameCreator();
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

function greetUser() {

    const hour = new Date().getHours();
    let greeting;
  
    if (hour >= 5 && hour < 12) {
        greeting = "Good morning  ";
      }  else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon  ";
      } else if (hour >= 17 && hour < 21) {
        greeting = "Good evening  ";
      } else {
        greeting = "Good night  ";
      }
  
    return greeting;
  }


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

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("name");
    signOut(auth)
        .then(() => {
            window.history.replaceState(null, null, "../../index.html"); // Prevent going back
            window.location.replace("../../index.html");
        })
        .catch((error) => {
            console.error("Error Signing out", error);
        });

})


async function loadImagesFromFirestore() {
    const imageUrls = [];
    const data = [];
    try {
        // Reference to the "movies" collection in Firestore
        const moviesCollectionRef = collection(db, "movies");

        // Get the documents from the collection
        const querySnapshot = await getDocs(moviesCollectionRef);

        // Loop through each document and get the 'thumbnails' URL
        querySnapshot.forEach((doc) => {
            const movieData = doc.data();
            const thumbnailUrl = movieData.thumbnails;  // Assuming 'thumbnails' contains the image URL

            if (thumbnailUrl) {
                imageUrls.push(thumbnailUrl);  // Add the thumbnail URL to the imageUrls array
            }
            if (movieData) {
                data.push(movieData);  // Add the thumbnail URL to the imageUrls array
            }
        });

        // Once all image URLs are fetched, preload and render the carousel
        preloadImages(imageUrls, data);
        // datas(data);
        // console.log(data)
        // renderCarousel(imageUrls);
        // console.log(data)
        // return data;
    } catch (error) {
        console.error("Error fetching movie thumbnails from Firestore:", error);
    }
}



function preloadImages(imageUrls, data){
    console.log(data);
    console.log(imageUrls);
    let div = document.getElementById("carousel-inner");

    while (true){
        
    div.innerHTML += `<a href="../details/details.html?title=${encodeURIComponent(data[0].title)}"><div class="carousel-item active one">
    <div class="carousel-caption">
          <h1>${data[0].title}</h1>
                    <h4 class="description">${data[0].description}</h4>

        </div>
    <img src="${imageUrls[0]}" class="d-block w-100 carousel-inners" alt="Slide 1" <h1></h1>>
      </div><div id="under"></div> </a>       `;
      break;
    }
    for (let i = 1; i < imageUrls.length; i++){
    div.innerHTML += `<a href="../details/details.html?title=${encodeURIComponent(data[0].title)}"><div  class="carousel-item  one">
    <div class="carousel-caption">
          <h1>${data[i].title}</h1>
          <h4 class="description">${data[i].description}</h4>
        </div>
    <img src="${imageUrls[i]}" class="d-block w-100 carousel-inners" alt="Slide 1" >
      </div> <div id="under"></div> </a>      `;
    }
    
    
    // document.getElementById("two").innerHTML += `        <img src="${imageUrls[1]}" class="d-block w-100 carousel-inners" alt="Slide 1">`;
    // document.getElementById("three").innerHTML += `        <img src="${imageUrls[2]}" class="d-block w-100 carousel-inners" alt="Slide 1">`;
    // document.getElementById("four").innerHTML += `        <img src="${imageUrls[3]}" class="d-block w-100 carousel-inners" alt="Slide 1">`;
    // document.getElementById("five").innerHTML += `        <img src="${imageUrls[4]}" class="d-block w-100 carousel-inners" alt="Slide 1">`;

}
loadImagesFromFirestore()



// async function fetchMovies(container, head, text) {
//     // const loaderDiv = document.getElementById("loader")
//         // loaderDiv.style.display = 'block'; // Show the loader

//     const movieContainer = document.getElementById(container);

//     try {
//         const querySnapshot = await getDocs(collection(db, 'movies'));
//         querySnapshot.forEach(doc => {
//             const movie = doc.data();
//              const atag = document.createElement("a");
//              atag.classList.add("a");
//              atag.href = "../play/play.html"
//             const heading = document.getElementById(head);
//             heading.innerHTML = text;
//             const movieDiv = document.createElement('div');

//             movieDiv.className = 'movie';
//             movieDiv.innerHTML = `<img src=${movie.poster}><h2>${movie.title}</h2><p>${movie.year}</p>`;
//             atag.appendChild(movieDiv);
//             movieContainer.appendChild(atag);
//         });
//     } catch (error) {

//         console.error("Error fetching movies: ", error);
//     }
//     // loaderDiv.style.display = 'none';
// }

// // fetchMovies("trendingDiv", "trendingH1", "Trending Now");
// fetchMovies("recommendedDiv", "recommendedH1", "Recommended for You");
// fetchMovies("recentlyDiv", "recentlyH1", "Recently Added");
// fetchMovies("continueDiv", "continueH1", "Continue Watching");

// function scrollTrending() {
//     const scrollWidth = trendingDiv.scrollWidth;
//     const scrollLeft = trendingDiv.scrollLeft;
//     const clientWidth = trendingDiv.clientWidth;

//     if (scrollLeft + clientWidth >= scrollWidth - 100) {
//         fetchMovies("trendingDiv", "trendingH1", "Trending Now");
//     }
// }




async function fetchMovies(container, head, text) {
    const movieContainer = document.getElementById(container);
    const heading = document.getElementById(head);
    heading.innerHTML = text;

    try {
        const querySnapshot = await getDocs(collection(db, 'movies'));

        querySnapshot.forEach(doc => {
            const movie = doc.data();
            // Create a div to hold the movie poster and title
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
        });
    } catch (error) {
        console.error("Error fetching movies: ", error);
    }
    document.getElementById("loading").style.display = "none";

}

fetchMovies("recommendedDiv", "recommendedH1", "Recommended for You");
fetchMovies("recentlyDiv", "recentlyH1", "Recently Added");

function scrollRecommended() {
    const scrollWidth = recommendedDiv.scrollWidth;
    const scrollLeft = recommendedDiv.scrollLeft;
    const clientWidth = recommendedDiv.clientWidth;

    if (scrollLeft + clientWidth >= scrollWidth - 100) {
        fetchMovies("recommendedDiv", "recommendedH1", "Recommended for You");
    }
}

function scrollRecently() {
    const scrollWidth = recentlyDiv.scrollWidth;
    const scrollLeft = recentlyDiv.scrollLeft;
    const clientWidth = recentlyDiv.clientWidth;

    if (scrollLeft + clientWidth >= scrollWidth - 100) {
        fetchMovies("recentlyDiv", "recentlyH1", "Recently Added");
    }
}

// function scrollContinue() {
//     const scrollWidth = continueDiv.scrollWidth;
//     const scrollLeft = continueDiv.scrollLeft;
//     const clientWidth = continueDiv.clientWidth;

//     if (scrollLeft + clientWidth >= scrollWidth - 100) {
//         fetchMovies("continueDiv", "continueH1", "Continue Watching");
//     }
// }

// const trendingDiv = document.getElementById('trendingDiv');
// trendingDiv.addEventListener('scroll', scrollTrending);

const recommendedDiv = document.getElementById('recommendedDiv');
recommendedDiv.addEventListener('scroll', scrollRecommended);

const recentlyDiv = document.getElementById('recentlyDiv');
recentlyDiv.addEventListener('scroll', scrollRecently);

// const continueDiv = document.getElementById('continueDiv');
// continueDiv.addEventListener('scroll', scrollContinue);

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

