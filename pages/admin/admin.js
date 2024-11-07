// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
// import { getAuth, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
// import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
// import { getFirestore, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";




const firebaseConfig = {
    apiKey: "AIzaSyBGsxpj36xgkU9wCSILp7LZlyA6DRlbU5Q",
    authDomain: "login-9207d.firebaseapp.com",
    projectId: "login-9207d",
    storageBucket: "login-9207d.appspot.com",
    messagingSenderId: "269390570547",
    appId: "1:269390570547:web:49318f71d76faf656baf46"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkAndPushMovies() {
    try {

        // Reference to the "movies" collection
        const moviesCollectionRef = collection(db, "movies");

        // Get the documents from the collection
        const querySnapshot = await getDocs(moviesCollectionRef);

        // Check if the collection is empty
        if (querySnapshot.empty) {
            console.log("The 'movies' collection is empty. Pushing data...");
            const response = await fetch('pages/admin/movies.json'); // URL to your local JSON file
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

async function fetchMovies(container, head, text) {
    // const loaderDiv = document.getElementById("loader")
        // loaderDiv.style.display = 'block'; // Show the loader

    const movieContainer = document.getElementById(container);

    try {
        const querySnapshot = await getDocs(collection(db, 'movies'));
        querySnapshot.forEach(doc => {
            const movie = doc.data();
            //  const atag = document.createElement("a");
            //  atag.href = "../play/play.html"
            const heading = document.getElementById(head);
            heading.innerHTML = text;
            const movieDiv = document.createElement('div');

            movieDiv.className = 'movie';
            movieDiv.innerHTML = `<img src=${movie.poster}><h2>${movie.title}</h2><p>${movie.year}</p>`;
            // atag.appendChild(movieDiv);
            movieContainer.appendChild(movieDiv);
        });
    } catch (error) {
        console.error("Error fetching movies: ", error);
    }
    // loaderDiv.style.display = 'none';
}

// fetchMovies("trendingDiv", "trendingH1", "Trending Now");
fetchMovies("recommendedDiv", "recommendedH1", "Recommended for You");
fetchMovies("recentlyDiv", "recentlyH1", "Recently Added");
