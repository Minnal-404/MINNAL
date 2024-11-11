import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
// import { getAuth, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// import { getAuth, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// import { onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
// import { collection,getDocs, getDoc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBGsxpj36xgkU9wCSILp7LZlyA6DRlbU5Q",
  authDomain: "login-9207d.firebaseapp.com",
  projectId: "login-9207d",
  storageBucket: "login-9207d.appspot.com",
  messagingSenderId: "269390570547",
  appId: "1:269390570547:web:49318f71d76faf656baf46"
};

const app = initializeApp(firebaseConfig);

// const auth = getAuth();
const db = getFirestore();

async function loadImagesFromFirestore() {
  const imageUrls = [];
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
    });

    // Once all image URLs are fetched, preload and render the carousel
    preloadImages(imageUrls);
    renderCarousel(imageUrls);

  } catch (error) {
    console.error("Error fetching movie thumbnails from Firestore:", error);
  }
}

function preloadImages(imageUrls) {
  // Preload each image to ensure they're ready to be displayed without delay
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

function renderCarousel(imageUrls) {
  const carouselInner = document.querySelector('#carousel-inner');
  const carouselIndicators = document.querySelector('#carousel-indicators');

  carouselInner.innerHTML = ''; // Clear any existing items
  carouselIndicators.innerHTML = ''; // Clear existing indicators

  // Loop through the image URLs and create carousel items and indicators
  imageUrls.forEach((url, index) => {
    console.log(`Adding image ${index + 1}: ${url}`);

    // Create the carousel item
    const item = document.createElement('div');
    item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
    item.style.backgroundImage = `url('${url}')`; // Set the background image to the thumbnail
    carouselInner.appendChild(item);

    // Create the carousel indicator
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', '#carouselExampleIndicators');
    indicator.setAttribute('data-slide-to', index);
    if (index === 0) {
      indicator.classList.add('active');
    }
    carouselIndicators.appendChild(indicator);
  });

  // Log the inner HTML to ensure the items are being added
  console.log('Carousel inner HTML:', carouselInner.innerHTML);
}


  // Trigger the carousel sliding effect after the images are rendered
  setTimeout(() => {
    const items = document.querySelectorAll('.carousel-item');
    
    if (items.length > 1) {  // Ensure there are at least two items
      // Slide out the first image and slide in the second image
      items[1].classList.add('active');
      items[0].classList.remove('active');
      items[0].classList.add('prev'); // Move the first image to the left

      // After transition is complete, clear the carousel content
      setTimeout(() => {
        carouselInner.innerHTML = '';  // Clear the carousel after the second image is fully visible
      }, 500);  // Adjust this timing if needed
    }
  }, 100); // Small delay to allow images to render properly


// Call the function to load images from Firestore
loadImagesFromFirestore();




// async function fetchMovies(container, head, text) {
//     // const loaderDiv = document.getElementById("loader")
//         // loaderDiv.style.display = 'block'; // Show the loader

//     const movieContainer = document.getElementById(container);

//     try {
//         const querySnapshot = await getDocs(collection(db, 'movies'));
//         querySnapshot.forEach(doc => {
//             const movie = doc.data();
//             //  const atag = document.createElement("a");
//             //  atag.href = "../play/play.html"
//             const heading = document.getElementById(head);
//             heading.innerHTML = text;
//             const movieDiv = document.createElement('div');

//             movieDiv.className = 'movie';
//             movieDiv.innerHTML = `<img src=${movie.poster}><h2>${movie.title}</h2><p>${movie.year}</p>`;
//             // atag.appendChild(movieDiv);
//             movieContainer.appendChild(movieDiv);
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

// Show the popup when the body is clicked
document.body.onclick = function (event) {
  const popup = document.getElementById('loginMain');
  // Check if the popup is already visible
  if (popup.style.display !== 'flex') {
    const overlay = document.getElementById("overlay");

    overlay.style.display = "block";

    popup.style.display = 'flex';
  }
}

// Close the popup when the close button is clicked
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

// Close the popup if the user clicks outside of it
// window.onclick = function(event) {
//     const popup = document.getElementById('loginMain');
//     if (event.target === popup) {
//         popup.style.display = 'none';
//     }
// }



function checkUserExists() {
  // This could be a check for a cookie, local storage, or API request
  return localStorage.getItem('loggedInUserId') !== null; // Example using local storage
}

// Redirect to home page if user exists
if (checkUserExists()) {
  window.location.href = 'pages/home/home.html'; // Replace with your home page URL
}


//===================================Login code======================================================




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
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
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
      // window.history.replaceState(null, null, "pages/home/home.html"); // Prevent going back

      // window.location.replace("../home/home.html");
      setTimeout(function () {
        // Change the location to the next page
        
        window.location.replace("pages/home/home.html");
      }, 3000);
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

      if (errorCode === "auth/invalid-email") {
        showMessage("Please enter a valid Email", "signInMessage");
      }
      else if (errorCode === "auth/missing-password") {
        showMessage("Password cannot be empty", "signInMessage");
      }
      else if (password.length < 8) {
        showMessage("Password must be greater than 8 characters", "signInMessage");
      }
      else if (errorCode === "auth/invalid-credential" || errorCode === "auth/user-not-found") { // Added handling for user-not-found error
        showMessage("Account doesn't exists", "signInMessage");
      }
      //  else {
      //     showMessage("Incorrect", "signInMessage");
      // }
      console.log(error);
    });
    
});

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


//===================================Create code======================================================


const createBtn = document.getElementById("createBtn");

createBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;

  if (name == "") {
    showMessage("Name cannot be empty", "signUpMessage")

  } else if (name.length < 3) {
    showMessage("Name must contain atleast 3 characters", "signUpMessage")

  }
  else if (email == "") {
    showMessage("Email cannot be empty", "signUpMessage")

  }
  else if (!email.includes("@") || !email.includes(".com")) {
    showMessage("Please enter a valid Email", "signUpMessage")
  }
  else if (password == "") {
    showMessage("Password cannot be empty", "signUpMessage")

  } else if (password.length < 8) {
    showMessage("Password must contains atleast 8 characters", "signUpMessage")

  }
  
  else if (password.length >= 8) {
    function isStrongPassword(password) {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
    }
    // Check if the password meets the strong criteria
    if (!isStrongPassword(password)) {
      
        // title: 'Password is too weak! It should contain at least 8 characters, with a mix of letters, numbers, and special characters.',
        // icon: 'warning';
        showMessage("Password must contains an upper case, an lower csase, a special character and a number", "signUpMessage");
      
      
      return;  // Stop execution if the password is not strong enough
    }
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
            // Directly redirect without replaceState if not necessary
            // window.location.replace("pages/home/home.html");
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
        console.log(error)
        if (errorCode === "auth/email-already-in-use") {
          showMessage("Email Address Already Exists !!!", "signUpMessage");
          //   window.location.href = "../login/login.html";
        }
        else {
          showMessage("Invalid Email", "signUpMessage");
        }
      });
  }
});

