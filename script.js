document.getElementById("loading").style.display = "flex";
document.getElementById("loadMessage").textContent = "Please Wait...";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, getDocs, setDoc, getDoc, doc, updateDoc, arrayRemove, arrayUnion } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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
let subscribed = false;

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
            if (userData.color) {
              localStorage.setItem("color", userData.color);
            }
            if (userData.profileImage) {
              localStorage.setItem("profileImage", userData.profileImage);
            }
            document.getElementById("profName").textContent = userData.name;
            document.getElementById("profEmail").textContent = userData.email;
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
                subscribed = true
                // document.getElementById("subscribeBtn").setAttribute('disabled', 'true');
                document.getElementById("subscribeBtn").classList.remove("ball");
                document.getElementById("subscribeBtn").textContent = "Subscribed";
                document.getElementById("subDetail").innerHTML = `
              <div class="bg-black">
              <div class="d-flex justify-content-end ">
          <button class="close-btn " id="subClose">
            <i class="fa-solid fa-x "></i>
          </button>
        </div>
              <div id="subContent" class=" p-5 d-flex flex-column gap-5">
              <h1 class="text-center">Subscription Status</h1>
              
              <h3>Subscribed On: ${formatDate(userData.subscription.subscribedOn)}</h3>
              <h3>Will Expire On: ${formatDate(userData.subscription.expiration)}</h3>
              
              </div>
              </div>`

              }

              document.getElementById("subClose").addEventListener("click", () => {
                document.getElementById("subDetail").style.display = "none";

              })
            }
            catch (srror) {

            } finally {
              document.getElementById("logBtn").style.display = "none";
              document.getElementById("signUpBtn").style.display = "none";
              document.getElementById("subscribeBtn").addEventListener("click", () => {
                console.log("Button clicked");
                console.log(subscribed);
                if (!subscribed) {
                  window.location.href = 'pages/order/order.html';
                }
                else {
                  document.getElementById("subDetail").style.display = "flex";

                }
              });
            }

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
else {
  document.getElementById("subscribeBtn").style.display = "none";
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


document.getElementById("user").addEventListener("click", () => {
  if (check) {
    window.location.href = "pages/profile/profile.html";
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
  document.body.classList.add('no-scroll');  // Enable scrolling

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
  document.body.classList.add('no-scroll');  // Enable scrolling

  const popup = document.getElementById('createMain');
  // Check if the popup is already visible
  if (popup.style.display !== 'flex') {
    const overlay = document.getElementById("overlay");

    overlay.style.display = "block";

    popup.style.display = 'flex';
  }
});

document.getElementById("close-Btn").addEventListener("click", () => {
  document.getElementById("loading").style.display = "none";
  document.body.classList.remove('no-scroll');  // Enable scrolling
  document.getElementById("profileSection").style.display = "none";

});


function greetUser() {

  const hour = new Date().getHours();
  let greeting;

  if (hour >= 5 && hour < 12) {
    greeting = "Good morning  ";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon  ";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good evening  ";
  } else {
    greeting = "Good night  ";
  }

  return greeting;
}
document.getElementById("userName").textContent += greetUser() + " !!";

function getRandomRgbColor() {
  const r = Math.floor(Math.random() * 256); // Random red value
  const g = Math.floor(Math.random() * 256); // Random green value
  const b = Math.floor(Math.random() * 256); // Random blue value
  localStorage.setItem("color", `rgb(${r}, ${g}, ${b})`);
};

function profileNameCreator() {
  let profileImage = localStorage.getItem("profileImage");

  if (profileImage) {
    document.getElementById("preview").style.display = "block";

    document.getElementById("user").classList.add("border");
    document.getElementById("user").classList.add("border-white");
    document.getElementById("user").classList.add("border-4");
    document.getElementById("user").classList.add("rounded-circle");
    document.getElementById("user").style.width = "3rem";
    // document.getElementById("user").classList.add("justify-content-center");
    document.getElementById("preview").src = profileImage;
  } else {
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



function preloadImages(imageUrls, data) {
  document.getElementById("search").value = "";

  let div = document.getElementById("carousel-inner");

  while (true) {

    div.innerHTML += `<a href="pages/details/details.html?title=${encodeURIComponent(data[0].title)}"><div class="carousel-item active one">
    <div class="carousel-caption">
          <h1>${data[0].title}</h1>
                    <h4 class="description">${data[0].description}</h4>

        </div>
    <img src="${imageUrls[0]}" class="d-block w-100 carousel-inners" alt="Slide 1" <h1></h1>>
      </div><div id="under"></div> </a>       `;
    break;
  }
  for (let i = 1; i < imageUrls.length; i++) {
    div.innerHTML += `<a href="pages/details/details.html?title=${encodeURIComponent(data[i].title)}"><div  class="carousel-item  one">
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
// fetchMovies("recommendedDiv", "recommendedH1", "Top rated");
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

    // Store all movie data in an array
    let movies = [];
    querySnapshot.forEach(doc => {
      const movie = doc.data();
      movies.push(movie);  // Add each movie to the array
    });

    // Shuffle the movies array randomly
    movies = shuffleArray(movies);

    // Optionally, limit the number of movies displayed (e.g., show 5 random movies)
    const randomMovies = movies.slice(0, 5);  // Get the first 5 shuffled movies

    // Loop through the random movies and create elements for them
    randomMovies.forEach(movie => {
      // Create a div to hold the movie poster and title
      const movieDiv = document.createElement('div');
      movieDiv.className = 'movie';

      // Create a link for each movie poster (ensure the query parameter is 'title')
      // const movieLink = document.createElement('a');
      // movieLink.href = `pages/details/details.html?title=${encodeURIComponent(movie.title)}`;  // Correctly passing 'title'

      // Insert the movie poster and title inside the link
      movieDiv.innerHTML = `<img src="${movie.poster}" alt="${movie.title}"><h2>${movie.title}</h2><p>${movie.year}</p>
      <div class="popups flex-column" >
      <div class="p-0">
          <img src="${movie.thumbnails}" alt="${movie.title}"></div>
          <div class="p-3 d-flex flex-column gap-3">
          <h2>${movie.title}</h2>
          <div class="d-flex gap-4 justify-content-between">
          <a href="pages/details/details.html?title=${encodeURIComponent(movie.title)}">
          <button id="watch" class="btn btn-success">More details</button>
          </a>
          <button id="add" class="add-to-wishlist p-0 btn " data-title="${movie.title}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Wishlist"><i class="fa-regular fa-heart fa-2xl"></i></button>
          </div>
          <p id="wishlistError" class="m-0 text- wishlist-error"></p>
          <div class="d-flex justify-content-evenly">
          <p class="m-0">${movie.year}</p> <p class="m-0">•</p> <p class="m-0">${movie.duration}</p> <p class="m-0">•</p> <p class="m-0 bg-success px-2 rounded-1"><strong>${movie.rating}/5</strong></p>
          </div>
    <p class="m-0">${movie.description}</p>  
    </div>
  </div>`;

      // Append the movie link div to the container
      // movieDiv.appendChild(movieLink);
      movieContainer.appendChild(movieDiv);

      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
      const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


    });
    
  } catch (error) {
    console.error("Error fetching movies: ", error);
  }

  // Hide the loading indicator
  document.getElementById("loading").style.display = "none";
}



function handleWishlistClick( movieTitle) {
  // const movieTitle = event.target.getAttribute('data-title');

  // Find all add buttons and update the clicked one
  let allAddButtons = []
  allAddButtons = document.querySelectorAll(`.add-to-wishlist[data-title="${movieTitle}"]`);
  console.log(allAddButtons);

  allAddButtons.forEach(button => {
    const title = button.getAttribute('data-title');

    // If the movie title matches, update the icon and color
    if (title === movieTitle) {
      const icon = button.querySelector('i');

      // Check if the icon already has the 'fa-regular' class
      if (icon.classList.contains('fa-regular')) {
        // If it has the 'fa-regular' class, update it to 'fa-solid' and change color
        icon.classList.remove('fa-regular'); // Remove "empty" heart
        icon.classList.add('fa-solid'); // Add "filled" heart
        icon.style.color = 'red';
      } else {
        icon.classList.remove('fa-solid'); // Remove "empty" heart
        icon.classList.add('fa-regular'); // Add "filled" heart
        icon.style.color = '';
      }
    }
  });
}




function showMessage1(message, messageElement, color) {
  document.getElementById("loading").style.display = "none";
  messageElement.textContent = message;  // Set the message text
  messageElement.style.color = color;    // Set color (red for errors, green for success)

  // Hide the message after 5 seconds
  setTimeout(() => {
    messageElement.textContent = "";
  }, 5000);
}

// Function to check the wishlist status for each movie


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
            showMessage1(`${movieTitle} removed from your wishlist.`, errorMessageElement, "red");

            // Change the button icon to plus after removal
            buttonIcon.classList.remove('fa-solid');
            buttonIcon.style.color = 'white';
            buttonIcon.classList.add('fa-regular');
          })
          .catch((error) => {
            console.error("Error removing from wishlist: ", error);
            showMessage1(`Error removing from wishlist: ${error.message}`, errorMessageElement, "red");
          });
      } else {
        // If movie is not in the wishlist, add it using arrayUnion
        updateDoc(userDocRef, {
          wishlist: arrayUnion(movieTitle)
        })
          .then(() => {
            console.log(`${movieTitle} added to wishlist in Firestore!`);
            showMessage1(`${movieTitle} added to your wishlist!`, errorMessageElement, "green");

            // Change the button icon to minus after adding
            buttonIcon.classList.remove('fa-regular');
            buttonIcon.style.color = 'red';
            buttonIcon.classList.add('fa-solid');
          })
          .catch((error) => {
            console.error("Error adding to wishlist: ", error);
            showMessage1(`Error adding to wishlist: ${error.message}`, errorMessageElement, "red");
          });
      }
    } else {
      // If the user document doesn't exist, create a new one with the wishlist field
      console.error("User document does not exist. Creating a new document...");
      showMessage1("User document does not exist. Creating a new document...", errorMessageElement, "red");

      // Create a new document with the wishlist containing the movie title
      setDoc(userDocRef, { wishlist: [movieTitle] })
        .then(() => {
          console.log("New user document created with wishlist!");
          showMessage1("New user document created with wishlist!", errorMessageElement, "green");

          // Change the button icon to minus after adding
          buttonIcon.classList.remove('fa-regular');
          buttonIcon.style.color = 'red';
          buttonIcon.classList.add('fa-solid');
        })
        .catch((error) => {
          console.error("Error creating new user document: ", error);
          showMessage1(`Error creating new user document: ${error.message}`, errorMessageElement, "red");
        });
    }
  }).catch((error) => {
    console.error("Error fetching user document: ", error);
    showMessage1(`Error fetching user document: ${error.message}`, errorMessageElement, "red");
  });
}

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


// Helper function to shuffle an array randomly
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  }
  return arr;
}


async function loadMoviesAndButtons() {
  try {
      // Wait for both fetchMovies calls to complete
      await Promise.all([
          fetchMovies("recommendedDiv", "recommendedH1", "Top rated"),
          fetchMovies("recentlyDiv", "recentlyH1", "Recently Added")
      ]);

      // Now that fetchMovies is complete, select all add-to-wishlist buttons
      const buttons = document.querySelectorAll('.add-to-wishlist');
      console.log(buttons); // Log all buttons with the .add-to-wishlist class
      
// const buttons = document.querySelectorAll('.add-to-wishlist');
// console.log(buttons)
// Adding event listeners to each button
buttons.forEach(button => {
  const movieTitle = button.getAttribute('data-title');
  const buttonIcon = button.querySelector('i');  // Get the icon (plus or minus) inside the button
  const errorMessageElement = button.closest('.movie').querySelector('.wishlist-error');

  // Check if loggedInUserId is available
  if (loggedInUserId) {
    // Check the wishlist on page load and set the button icon accordingly
    checkWishlistStatus(loggedInUserId, movieTitle, buttonIcon);

    // Adding click event listener to toggle the movie in the wishlist
    button.addEventListener('click', function (event) {
      document.getElementById("loading").style.display = "flex";
      handleWishlistClick( movieTitle);
      toggleWishlist(loggedInUserId, movieTitle, errorMessageElement, buttonIcon);

    });
  } else {
    // Handle case when loggedInUserId is not defined
    button.addEventListener('click', function () {
      showMessage(`Please log in to add movies to the wishlist.`, errorMessageElement, "red");

    });

    console.error("User not logged in. Please log in to add movies to the wishlist.");
    // errorMessageElement.textContent = "Please log in to add movies to the wishlist.";
    // errorMessageElement.style.color = "red";
  }
});
  } catch (error) {
      console.error("Error fetching movies:", error);
  }
}

// Call the function to load movies and then fetch the buttons
loadMoviesAndButtons();

    
function scrollRecommended() {
  const scrollWidth = recommendedDiv.scrollWidth;
  const scrollLeft = recommendedDiv.scrollLeft;
  const clientWidth = recommendedDiv.clientWidth;

  if (scrollLeft + clientWidth >= scrollWidth - 100) {
    fetchMovies("recommendedDiv", "recommendedH1", "Top rated");
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



// document.getElementById("closeBtn").addEventListener("click", () => {
//     document.getElementById("loading").style.display = "none";
//     document.body.classList.remove('no-scroll');  // Enable scrolling
//     document.getElementById("profileSection").style.display = "none";

// });

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

    // Create a link for each movie poster (ensure the query parameter is 'title')
    // const movieLink = document.createElement('a');
    // movieLink.href = `pages/details/details.html?title=${encodeURIComponent(movie.title)}`;  // Correctly passing 'title'

    // Insert the movie poster and title inside the link
    movieDiv.innerHTML = `<img src="${movie.poster}" alt="${movie.title}"><h2>${movie.title}</h2><p>${movie.year}</p>
    <div class="popups flex-column" >
      <div class="p-0">
          <img src="${movie.thumbnails}" alt="${movie.title}"></div>
          <div class="p-3 d-flex flex-column gap-3">
          <h2>${movie.title}</h2>
          <div class="d-flex gap-4 justify-content-between">
          <a href="pages/details/details.html?title=${encodeURIComponent(movie.title)}">
          <button id="watch" class="btn btn-success">More details</button>
          </a>
          <button id="add" class="add-to-wishlist p-0 btn" data-title="${movie.title}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Wishlist"><i class="fa-regular fa-heart fa-2xl"></i></button>
          </div>
          <p id="wishlistError" class="m-0 text- wishlist-error"></p>
          <p id="wishlistSuccess" class="m-0 text-success wishlist-"></p>
          <div class="d-flex justify-content-evenly">
          <p class="m-0">${movie.year}</p> <p class="m-0">•</p> <p class="m-0">${movie.duration}</p> <p class="m-0">•</p> <p class="m-0 bg-success px-2 rounded-1"><strong>${movie.rating}/5</strong></p>
          </div>
    <p class="m-0">${movie.description}</p>  
    </div>
  </div>`;
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    // Append the movie link div to the container
    // movieDiv.appendChild(movieLink);
    movieContainer.appendChild(movieDiv);

    const buttons = document.querySelectorAll('.add-to-wishlist');

    // Adding event listeners to each button
    buttons.forEach(button => {
      const movieTitle = button.getAttribute('data-title');
      const buttonIcon = button.querySelector('i');  // Get the icon (plus or minus) inside the button
      const errorMessageElement = button.closest('.movie').querySelector('.wishlist-error');

      // Check if loggedInUserId is available
      if (loggedInUserId) {
        // Check the wishlist on page load and set the button icon accordingly
        checkWishlistStatus(loggedInUserId, movieTitle, buttonIcon);

        // Adding click event listener to toggle the movie in the wishlist
        button.addEventListener('click', function () {
          document.getElementById("loading").style.display = "flex";
          handleWishlistClick( movieTitle);

          toggleWishlist(loggedInUserId, movieTitle, errorMessageElement, buttonIcon);
        });
      } else {
        // Handle case when loggedInUserId is not defined
        button.addEventListener('click', function () {
          showMessage(`Please log in to add movies to the wishlist.`, errorMessageElement, "red");

        });

        console.error("User not logged in. Please log in to add movies to the wishlist.");
        // errorMessageElement.textContent = "Please log in to add movies to the wishlist.";
        // errorMessageElement.style.color = "red";
      }
    });

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

  });
  document.getElementById("searchResultsContainer").style.display = "block"
  document.getElementById("loading").style.display = "none";

}

// Function to handle search input
async function handleSearch(event) {
  document.body.classList.add('no-scroll');  // Enable scrolling

  document.getElementById("loading").style.display = "flex";

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



//=================================================================================

function showMessage(message, divId) {
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
  document.body.classList.remove('no-scroll');  // Enable scrolling

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
  document.body.classList.remove('no-scroll');  // Enable scrolling

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
        getRandomRgbColor();
        let color = localStorage.getItem("color");

        const userData = {
          name: name,
          password: password,
          email: email,
          color: color
        };

        greenMessage("Account Created Successfully", "signUpMessage");
        localStorage.setItem("loggedInUserId", email);

        const docRef = doc(db, "users", email);
        setDoc(docRef, userData)
          .then(() => {
            document.getElementById('createMain').style.display = 'none';
            document.getElementById('loginMain').style.display = 'none';

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


// document.querySelectorAll(".movie").addEventListener("mouseover", () => {
//   document.querySelector(".popups").style.dis
// })

// document.querySelectorAll('.movie').forEach(poster => {
//   poster.addEventListener('mouseover', function() {
//      this.querySelector('.popups').style.display = 'block';
//   });
//   poster.addEventListener('mouseout', function() {
//      this.querySelector('.popups').style.display = 'none';
//   });
// });

// document.querySelectorAll('.movie').forEach(poster => {
//   poster.addEventListener('mouseover', function() {
//      const info = this.querySelector('.popups');
//      setTimeout(() => {
//         info.style.opacity = 1;
//      }, 1000); // Wait 1 second before showing the details
//   });
//   poster.addEventListener('mouseout', function() {
//      this.querySelector('.popups').style.opacity = 0;
//   });
// });

// const postersContainer = document.getElementById('recommendedDiv');


// const observer = new MutationObserver(() => {
//   const posters = document.querySelectorAll('.movie');
//   posters.forEach(poster => {
//     let timeout;

//     // Mouse enter event
//     poster.addEventListener('mouseenter', () => {
//       console.log("Hover started on", poster.id);

//       const popup = poster.querySelector('.popups');
//       console.log("Popup found:", popup);

//       // Hide all popups immediately when hovering starts
//       document.querySelectorAll('.popups').forEach(popup => popup.style.opacity = 0);

//       // Set a timeout to show the popup after 2 seconds
//       timeout = setTimeout(() => {
//         popup.style.display = 'flex';
//         popup.classList.add("fade");
//         popup.style.opacity = 1;
//       }, 500);
//     });

//     // Mouse leave event
//     poster.addEventListener('mouseleave', () => {
//       console.log("Hover ended on", poster.id);
//       clearTimeout(timeout);
//       poster.querySelector('.popups').style.display = 'none';
//     });
//   });
// });

// // Start observing the posters container for child changes (new posters added)
// observer.observe(postersContainer, { childList: true });

// const postersContainer1 = document.getElementById('recentlyDiv');


// const observer1 = new MutationObserver(() => {
//   const posters = document.querySelectorAll('.movie');
//   posters.forEach(poster => {
//     let timeout;

//     // Mouse enter event
//     poster.addEventListener('mouseenter', () => {
//       console.log("Hover started on", poster.id);

//       const popup = poster.querySelector('.popups');
//       console.log("Popup found:", popup);

//       // Hide all popups immediately when hovering starts
//       document.querySelectorAll('.popups').forEach(popup => popup.style.opacity = 0);

//       // Set a timeout to show the popup after 2 seconds
//       timeout = setTimeout(() => {
//         popup.style.display = 'flex';
//         popup.classList.add("fade");
//         popup.style.opacity = 1;
//       }, 500);
//     });

//     // Mouse leave event
//     poster.addEventListener('mouseleave', () => {
//       console.log("Hover ended on", poster.id);
//       clearTimeout(timeout);
//       poster.querySelector('.popups').style.display = 'none';
//     });
//   });
// });

// // Start observing the posters container for child changes (new posters added)
// observer1.observe(postersContainer1, { childList: true });

// const postersContainer2 = document.getElementById('searchResults');
// const observer2 = new MutationObserver(() => {
//   const posters = document.querySelectorAll('.movie');
//   posters.forEach(poster => {
//     let timeout;

//     // Mouse enter event
//     poster.addEventListener('mouseenter', () => {
//       console.log("Hover started on", poster.id);

//       const popup = poster.querySelector('.popups');
//       console.log("Popup found:", popup);

//       // Hide all popups immediately when hovering starts
//       document.querySelectorAll('.popups').forEach(popup => popup.style.opacity = 0);

//       // Set a timeout to show the popup after 2 seconds
//       timeout = setTimeout(() => {
//         popup.style.display = 'flex';
//         popup.classList.add("fade");
//         popup.style.opacity = 1;
//       }, 500);
//     });

//     // Mouse leave event
//     poster.addEventListener('mouseleave', () => {
//       console.log("Hover ended on", poster.id);
//       clearTimeout(timeout);
//       poster.querySelector('.popups').style.display = 'none';
//     });
//   });
// });

// // Start observing the posters container for child changes (new posters added)
// observer2.observe(postersContainer2, { childList: true });


// Function to add hover events to movie posters inside a given container
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
addHoverEventsToPosters('recentlyDiv'); // Another container with different posters
addHoverEventsToPosters('recommendedDiv'); // Yet another container with posters
addHoverEventsToPosters('filterResult'); // Yet another container with posters



const mediaQuery1 = window.matchMedia('(max-width: 1023px)');
// const mediaQuery2 = window.matchMedia('(max-width: 767px)');

// Check if the media query matches
if (mediaQuery1.matches) {
  // Code for small screens (mobile/tablet)
  console.log("Screen is less than 768px wide");
  const searchDiv = document.getElementById('searchDiv');
  const searchInput = document.getElementById('search');
  const searchIcon = document.getElementById("searchIcon");

  document.getElementById("userDiv").classList.remove("gap-4")
  document.getElementById("userDiv").classList.remove("justify-content-end")

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
if (mediaQuery.matches) {

  document.getElementById("userDiv").classList.add("justify-content-end")
}


async function filterComedyGenresFromFirestore(genre) {

  document.body.classList.add('no-scroll');  // Enable scrolling

  // Replace 'yourCollection' with the actual collection name
  document.getElementById("filterResult").innerHTML = ``

  const querySnapshot = await getDocs(collection(db, 'movies'));


  querySnapshot.forEach((doc) => {
    const data = doc.data();

    // Check if the genre array contains 'comedy'
    if (data.genre && data.genre.includes(`${genre}`)) {
      // comedyMovies.push(data);  // Push matching data to the result array

      const movieDiv = document.createElement('div');
      movieDiv.className = 'movie';

      // Create a link for each movie poster (ensure the query parameter is 'title')
      // const movieLink = document.createElement('a');
      // movieLink.href = `pages/details/details.html?title=${encodeURIComponent(movie.title)}`;  // Correctly passing 'title'

      // Insert the movie poster and title inside the link
      movieDiv.innerHTML = `<img src="${data.poster}" alt="${data.title}"><h2>${data.title}</h2><p>${data.year}</p>
      <div class="popups flex-column" >
      <div class="p-0">
          <img src="${data.thumbnails}" alt="${data.title}"></div>
          <div class="p-3 d-flex flex-column gap-3">
          <h2>${data.title}</h2>
          <div class="d-flex gap-4 justify-content-between">
          <a href="pages/details/details.html?title=${encodeURIComponent(data.title)}">
          <button id="watch" class="btn btn-success">More details</button>
          </a>
          <button id="add" class="add-to-wishlist p-0 btn " data-title="${data.title}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Wishlist"><i class="fa-regular fa-heart fa-2xl"></i></button>
          </div>
          <p id="wishlistError" class="m-0 text- wishlist-error"></p>
          <div class="d-flex justify-content-evenly">
          <p class="m-0">${data.year}</p> <p class="m-0">•</p> <p class="m-0">${data.duration}</p> <p class="m-0">•</p> <p class="m-0 bg-success px-2 rounded-1"><strong>${data.rating}/5</strong></p>
          </div>
    <p class="m-0">${data.description}</p>  
    </div>
  </div>`;



      // Append the movie link div to the container
      // movieDiv.appendChild(movieLink);
      document.getElementById("filterResult").appendChild(movieDiv);
      document.getElementById("genreTitle").textContent = `${genre}`;
      document.getElementById("loading").style.display = "none";

    }
  });
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


  const buttons = document.querySelectorAll('.add-to-wishlist');

  // Adding event listeners to each button
  buttons.forEach(button => {
    const movieTitle = button.getAttribute('data-title');
    const buttonIcon = button.querySelector('i');  // Get the icon (plus or minus) inside the button
    const errorMessageElement = button.closest('.movie').querySelector('.wishlist-error');

    // Check if loggedInUserId is available
    if (loggedInUserId) {
      // Check the wishlist on page load and set the button icon accordingly
      checkWishlistStatus(loggedInUserId, movieTitle, buttonIcon);

      // Adding click event listener to toggle the movie in the wishlist
      button.addEventListener('click', function () {
        document.getElementById("loading").style.display = "flex";
        handleWishlistClick( movieTitle);
        toggleWishlist(loggedInUserId, movieTitle, errorMessageElement, buttonIcon);
      });
    } else {
      // Handle case when loggedInUserId is not defined
      button.addEventListener('click', function () {
        showMessage(`Please log in to add movies to the wishlist.`, errorMessageElement, "red");

      });

      console.error("User not logged in. Please log in to add movies to the wishlist.");
      // errorMessageElement.textContent = "Please log in to add movies to the wishlist.";
      // errorMessageElement.style.color = "red";
    }
  });

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
}

// Example usage:
// filterComedyGenresFromFirestore().then(comedyMovies => {
//   console.log(comedyMovies); // The filtered movies
// }).catch(error => {
//   console.error("Error fetching documents: ", error);
// });

// document.getElementById("action").addEventListener("click", filterComedyGenresFromFirestore('Action'))

const divs = document.querySelectorAll('.nav-link');

// Variable to keep track of the previously clicked div
let selectedDiv = null;

// Add click event listeners to each div
divs.forEach(div => {
  div.addEventListener('click', function () {
    // If the clicked div is the same as the previously selected div
    if (selectedDiv === div) {
      // Toggle the 'bg-success' class (add if not present, remove if present)
      if (div.classList.contains('bg-success')) {
        div.classList.remove('bg-success');
        document.getElementById("genreResult").style.display = 'none'
        document.body.classList.remove('no-scroll');  // Enable scrolling

      }
      // If it doesn't have the 'bg-success' class, add it
      else {
        document.getElementById("loading").style.display = "flex";
        filterComedyGenresFromFirestore(div.textContent);
        document.getElementById("genreResult").style.display = 'block'
        div.classList.add('bg-success');
      }
    } else {
      // If there is a previously selected div, remove the 'bg-success' class
      if (selectedDiv) {
        selectedDiv.classList.remove('bg-success');
        document.getElementById("genreResult").style.display = 'none'
        document.body.classList.remove('no-scroll');  // Enable scrolling

      }

      // Add the 'bg-success' class to the clicked div
      document.getElementById("loading").style.display = "flex";
      filterComedyGenresFromFirestore(div.textContent);
      div.classList.add('bg-success');
      document.getElementById("genreResult").style.display = 'block'

    }

    // Update the selectedDiv to the current div
    selectedDiv = div;
  });
});
