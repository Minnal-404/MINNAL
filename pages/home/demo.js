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

function preloadImages(imageUrls){
    console.log(imageUrls);
    document.getElementById("one").innerHTML += `        <img src="${imageUrls[0]}" class="d-block w-100 carousel-inners" alt="Slide 1">`;
    document.getElementById("two").innerHTML += `        <img src="${imageUrls[1]}" class="d-block w-100 carousel-inners" alt="Slide 1">`;
    document.getElementById("three").innerHTML += `        <img src="${imageUrls[2]}" class="d-block w-100 carousel-inners" alt="Slide 1">`;

}
loadImagesFromFirestore()