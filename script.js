document.getElementById("loading").style.display = "flex";
document.getElementById("loadMessage").textContent = "Please Wait...";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
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



let check = false;


function checkUserExists() {
  // This could be a check for a cookie, local storage, or API request
  return localStorage.getItem('loggedInUserId') !== null; // Example using local storage
}

// Redirect to home page if user exists

if (checkUserExists()) {
  check = true;
  onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
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


document.getElementById("user").addEventListener("click", () => {
  if (check) {
    let loading = document.getElementById("loading");
    loading.style.display = "block";
    loading.textContent = "";
    document.body.classList.add('no-scroll');  // Disable scrolling
    document.getElementById("profileSection").style.display = "block";
  } else {
    const popup = document.getElementById('loginMain');
    // Check if the popup is already visible
    if (popup.style.display !== 'flex') {
      const overlay = document.getElementById("overlay");

      overlay.style.display = "block";

      popup.style.display = 'flex';
    }
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
    div.innerHTML += `<a href="pages/details/details.html?title=${encodeURIComponent(data[0].title)}"><div  class="carousel-item  one">
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

    querySnapshot.forEach(doc => {
      const movie = doc.data();
      // Create a div to hold the movie poster and title
      const movieDiv = document.createElement('div');
      movieDiv.className = 'movie';

      // Create a link for each movie poster (ensure the query parameter is 'title')
      const movieLink = document.createElement('a');
      movieLink.href = `pages/details/details.html?title=${encodeURIComponent(movie.title)}`;  // Correctly passing 'title'

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

fetchMovies("recommendedDiv", "recommendedH1", "Top rated");
fetchMovies("recentlyDiv", "recentlyH1", "Recently Added");

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
    document.getElementById("searchResults").style.display = "flex"
    searchResultsContainer.innerHTML = '<h1 class="text-white">No results found</h1>';
    return;
  }
  const movieContainer = document.getElementById("searchResults");

  results.forEach(movie => {
    const movieDiv = document.createElement('div');
    movieDiv.className = 'movie';

    // Create a link for each movie poster (ensure the query parameter is 'title')
    const movieLink = document.createElement('a');
    movieLink.href = `pages/details/details.html?title=${encodeURIComponent(movie.title)}`;  // Correctly passing 'title'

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
        getRandomRgbColor();
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


const createBtn = document.getElementById("createBtn");

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


  if (name == "") {
    showMessage("Name cannot be empty", "signUpNameMessage")

  } else if (name.length < 3) {
    showMessage("Name must contain atleast 3 characters", "signUpNameMessage")

  }else if (name.length > 20) {
    showMessage("Name must not contain more than 20 characters.", "signUpNameMessage")

  }else if (!namePattern.test(name)) {
    showMessage("Name should only contain alphabets", "signUpNameMessage")
} else if (!nonSpacePattern.test(name)) {
  showMessage("Name cannot be only spaces", "signUpNameMessage")
}
   if (email == "") {
    showMessage("Email cannot be empty", "signUpEmailMessage")

  }else if (!emailPattern.test(email)) {
    showMessage("Please enter a valid Email", "signUpEmailMessage")
}
  else if (!email.includes("@") || !email.includes(".com")) {
    showMessage("Please enter a valid Email", "signUpEmailMessage")
  }
   if (password == "") {
    showMessage("Password cannot be empty", "signUpPasswordMessage")

  } else if (password.length < 8) {
    showMessage("Password must contains atleast 8 characters", "signUpPasswordMessage")

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
      showMessage(`Password must contains an upper case,<br> an lower csase, a special character and a number`, "signUpPasswordMessage");


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
            getRandomRgbColor();
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
          showMessage("Email Address Already Exists !!!", "signUpEmailMessage");
          //   window.location.href = "../login/login.html";
        }
        else {
          showMessage("Invalid Email", "signUpEmailMessage");
        }
      });
  }
});

