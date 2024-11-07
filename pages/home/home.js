import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
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

  const auth = getAuth();
  const db = getFirestore();



  onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (loggedInUserId){
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()){
                const userData = docSnap.data();
                document.getElementById("userName").textContent += userData.name;
            }else{
                console.log("No document found matching id")
            }
        })
        .catch((error) => {
            console.log("Error getting document");
        })
    }else{
        console.log("User Id not found in local storage")
    }
  })



const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUserId");
    signOut(auth)
    .then(()=>{
        window.history.replaceState(null, null, "../../index.html"); // Prevent going back
        window.location.replace("../../index.html");
    })
    .catch((error)=>{
        console.error("Error Signing out", error);
    });
    
})


async function loadImages() {
    const imageUrls = [];
    
    const imageRefList = [
        '../../assets/images/$_57.jpg',
        '../../assets/images/10-enders-game-movie-poster-designs.jpg',
        '../../assets/images/$_57.jpg',
        '../../assets/images/10-enders-game-movie-poster-designs.jpg',
    ];
    
    for (const ref of imageRefList) {
    //     const url = await storage.ref(ref).getDownloadURL();
    //     imageUrls.push(url);
    }
    
    preloadImages(imageUrls); // Preload images
    renderCarousel(imageUrls);
}

function preloadImages(imageUrls) {
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url; // Preload image
    });
}

function renderCarousel(imageUrls) {
     // Clear existing items

    imageUrls.forEach((url, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.style.backgroundImage = `url('${url}')`; // Set background image
        carouselInner.appendChild(item);
    });
}

// Call the function to load images
loadImages();



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