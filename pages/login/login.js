import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
// import { getAuth, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";



  const firebaseConfig = {
    apiKey: "AIzaSyBGsxpj36xgkU9wCSILp7LZlyA6DRlbU5Q",
    authDomain: "login-9207d.firebaseapp.com",
    projectId: "login-9207d",
    storageBucket: "login-9207d.appspot.com",
    messagingSenderId: "269390570547",
    appId: "1:269390570547:web:49318f71d76faf656baf46"
  };

  const app = initializeApp(firebaseConfig);

  function showMessage(message, divId){
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    }, 5000);
  }

  function greenMessage(message, divId){
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.style.color="greenyellow";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    }, 5000);
  }

  const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", (event) => {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value; // Fixed typo here: "vlaue" to "value"
    
    // if (email==""){
    //   showMessage("Email can't be empty", "signInMessage");
      
    // }  else if (password==""){
    //   showMessage("Password can't be empty", "signInMessage");
      
    // }

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            greenMessage("Successfully Logged In", "signInMessage"); // Fixed typo: "Logined" to "Logged In"
            const user = userCredential.user;
            localStorage.setItem("loggedInUserId", user.uid);
            window.history.replaceState(null, null, "../home/home.html"); // Prevent going back

            // window.location.replace("../home/home.html");
            setTimeout(function() {
              // Change the location to the next page
              
              window.location.replace("../home/home.html");
            }, 3000);
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/invalid-email" ){
              showMessage("Incorrect Email", "signInMessage");
            } else if (errorCode === "auth/missing-password"){
              showMessage("Incorrect Password", "signInMessage");
            }
            else if (errorCode === "auth/invalid-credential" || errorCode === "auth/user-not-found") { // Added handling for user-not-found error
                showMessage("Incorrect Email or Password", "signInMessage");
            }
            //  else {
            //     showMessage("Incorrect", "signInMessage");
            // }
            console.log(error);
        });
});


  
  // const auth = getAuth(app);
  // auth.languageCode = 'en';
  // const provider = new GoogleAuthProvider();

// document.addEventListener("DOMContentLoaded", () => {

  // const GoogleLoginBtn = document.getElementById("GoogleLoginBtn");
  // GoogleLoginBtn.addEventListener("click", () => {
  //   signInWithPopup(auth, provider)
  // .then((result) => {

  //   const credential = GoogleAuthProvider.credentialFromResult(result);

  //   const user = result.user;
  //   console.log(user);
  //   window.history.replaceState(null, null, "../home/home.html"); // Prevent going back

  //   window.location.href = "../home/home.html";


  // }).catch((error) => {

    // const errorCode = error.code;
  //   const errorMessage = error.message;
  //   showMessage(errorMessage, "signInMessage")

  // });
  // });