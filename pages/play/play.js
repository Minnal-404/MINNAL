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