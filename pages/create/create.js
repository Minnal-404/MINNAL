
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
// import { getAuth, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";



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
// const createBtn = document.getElementById("createBtn");
// createBtn.addEventListener("click", (event) => {
//   event.preventDefault();
//   const name = document.getElementById("name").value;
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   const auth = getAuth();
//   const db = getFirestore();

//   createUserWithEmailAndPassword(auth, email,password)
//   .then((userCredential)=>{
//     const user = userCredential.user;
//     const userData = {
//       name: name,
//       password: password,
//       email: email
//     };
//     showMessage("Account Created Successfully", "signUpMessage");
//     const docRef = doc(db, "users", user.uid);
//     setDoc(docRef, userData)
//     .then(()=>{
//       window.history.replaceState(null, null, "../login/login.html"); // Prevent going back

//       window.location.href = "../login/login.html";
//     })
//     .catch((error)=>{
//       console.error("error writing document", error);
//     });
//   })
//   .catch((error)=>{
//     const errorCode = error.code;
//     if(errorCode=="auth/email-already-in-use"){
//       showMessage("Email Address Already Exists !!!", "signUpMessage");
//       window.location.href = "../login/login.html";

//     }
//     else{
//       showMessage("unable to create User", "signUpMessage");
//     }
//   })
// });

const createBtn = document.getElementById("createBtn");

createBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (name == "") {
    showMessage("Name cannot be empty", "signUpMessage")

  }else if ( name.length < 3){
    showMessage("Name must contain atleast 3 characters", "signUpMessage")

  }
  else if (email == "" ){
    showMessage("Email cannot be empty", "signUpMessage")

  }
  else if (!email.includes("@") || !email.includes(".com")) {
    showMessage("Please enter a valid Email", "signUpMessage")
  }
  else if (password == "" ){
    showMessage("Password cannot be empty", "signUpMessage")

  } else if (password.length<8 ) {
    showMessage("Password must contains atleast 8 characters", "signUpMessage")

  }else if (password.length>=8){
    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          name: name,
          password: password,
          email: email
        };

        showMessage("Account Created Successfully", "signUpMessage");
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            // Directly redirect without replaceState if not necessary
            window.location.href = "../login/login.html";
          })
          .catch((error) => {
            console.error("Error writing document", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          showMessage("Email Address Already Exists !!!", "signUpMessage");
          window.location.href = "../login/login.html";
        } 
        else {
          showMessage("Invalid Email", "signUpMessage");
        }
      });
    }
  });

  
//   const auth = getAuth(app);
//   auth.languageCode = 'en';
//   const provider = new GoogleAuthProvider();

// // document.addEventListener("DOMContentLoaded", () => {

//   const loginBtn = document.getElementById("loginBtn");
//   loginBtn.addEventListener("click", () => {
//     signInWithPopup(auth, provider)
//   .then((result) => {

//     const credential = GoogleAuthProvider.credentialFromResult(result);

//     const user = result.user;
//     console.log(user);
//     window.history.replaceState(null, null, "../home/home.html"); // Prevent going back

//     window.location.href = "../home/home.html";


//   }).catch((error) => {

//     const errorCode = error.code;
//     const errorMessage = error.message;

//   });
//   });



// });