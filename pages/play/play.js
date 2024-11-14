import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
// import { getAuth, GoogleAuthProvider, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection,getDocs, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBGsxpj36xgkU9wCSILp7LZlyA6DRlbU5Q",
    authDomain: "login-9207d.firebaseapp.com",
    projectId: "login-9207d",
    storageBucket: "login-9207d.appspot.com",
    messagingSenderId: "269390570547",
    appId: "1:269390570547:web:49318f71d76faf656baf46"
  };

  const app = initializeApp(firebaseConfig);
  // const auth = getAuth(app);
  // console.log(auth)
  // auth.languageCode = 'en';
  // const provider = new GoogleAuthProvider();

  // const user = auth.currentUser;
  // console.log(user)
  

//   function updateUserProfile(user){
//     const userName = user.displayName;
//     const userEmail = user.email;
//     const userProfile = user.photoURL;

//     document.getElementById("userName").textContent = userName;
//   }
//   updateUserProfile();

//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//         updateUserProfile(user);
//         const uid = user.uid;
//         return uid;
//     }else {
//         alert("Create an account or login");
//         window.location.href = "../login/login.html"
//     }
//   });

// if (!localStorage.getItem("loggedInUserId")) {
//   window.location.href = "login.html"; // Redirect to login if not logged in
// }

const db = getFirestore();

// async function fetchMovies() {
//   // const loaderDiv = document.getElementById("loader")
//       // loaderDiv.style.display = 'block'; // Show the loader

//   const movieContainer = document.getElementById("info");

//   try {
//       const querySnapshot = await getDocs(collection(db, 'movies'));
//       querySnapshot.forEach(doc => {
//           const title = document.createElement("h1").textContent = movies.title;
//           const image = document.createElement("img").src = movies.poster;
//           movieContainer.appendChild(title);
//       });
//   } catch (error) {
//       console.error("Error fetching movies: ", error);
//   }
//   // loaderDiv.style.display = 'none';
// }

// fetchMovies();

function renderVideoPlayer(movie) {
  // Create the video element dynamically
  document.getElementById("title").textContent = `${movie.title} (${movie.year})`;

  const videoHTML = `
    <video id="my-video" class="video-js vjs-default-skin" controls autoplay preload="auto" width="640" height="360" data-setup="{}" poster="${movie.thumbnails}">
        <source src="${movie.video}" type="video/mp4">
        <p class="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a
            web browser that supports HTML5 video.
        </p>
    </video>
`;

  // Inject the video HTML into a container in the DOM
  document.getElementById('video-container').innerHTML = videoHTML;

  // After the video is rendered, initialize Video.js
  initializeVideoPlayer();
}

function initializeVideoPlayer() {
  // Initialize the Video.js player
  const player = videojs('my-video');
  player.ready(function() {
      console.log('Video.js player is ready!');
      // Any additional player settings can go here
  });
}

// Example of dynamically setting the video source
// const videoSource = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Or any other dynamic video URL



const urlParams = new URLSearchParams(window.location.search);
const movieTitle = urlParams.get('title');  // Get the 'title' parameter from the URL

console.log("Movie Title from URL:", movieTitle);  // Log the movie title for debugging

if (!movieTitle) {
    console.error("No 'title' parameter found in the URL!");
    document.getElementById('play-container').innerHTML = `<p>Error: No movie title found in the URL.</p>`;
} else {
    // Get the container where movie play details will be displayed
    const playContainer = document.getElementById('play-container');

    // Fetch the movie details from Firestore
    async function fetchMovieForPlay(title) {
        try {
            const docRef = doc(db, "movies", title);  // Fetch the movie document by title
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const movie = docSnapshot.data();  // Get movie data from Firestore
                // displayMovieForPlay(movie);         // Display the movie in the player
                renderVideoPlayer(movie);

                changeVideoSource(movie);
            } else {
                console.error(`Movie with title "${title}" not found.`);
                playContainer.innerHTML = `<p>Movie not found: ${title}</p>`;
            }
        } catch (error) {
            console.error("Error fetching movie details for play: ", error);
            playContainer.innerHTML = `<p>Failed to load movie. Please try again.</p>`;
        }
    }

    // Function to display the movie in the player
    // function displayMovieForPlay(movie) {
      
    //     const movieHTML = `
    //         <h1>Now Playing: ${movie.title}</h1>
    //         <video controls width="80%" autoplay>
    //             <source src="${movie.video}" type="video/mp4">
    //             Your browser does not support the video tag.
    //         </video>
    //         <p><strong>Genre:</strong> ${movie.genre.join(", ")}</p>
    //         <p><strong>Description:</strong> ${movie.description}</p>
    //         <p><strong>Rating:</strong> ${movie.rating}</p>
    //         <p><strong>Duration:</strong> ${movie.duration}</p>
    //     `;
        
    //     playContainer.innerHTML = movieHTML;  // Display the movie in the container
    // }

    // Call the function to fetch movie details based on the title
    fetchMovieForPlay(movieTitle);
}


// Function to dynamically change the video source
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
            player.play();  // Play the new video immediately
        }