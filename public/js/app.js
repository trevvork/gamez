
var firebaseConfig = {
  apiKey: "AIzaSyBABLGPycL7g4gjKE3AwPb7fBKkdkq7JpA",
  authDomain: "gamez-98765.firebaseapp.com",
  databaseURL: "https://gamez-98765.firebaseio.com",
  projectId: "gamez-98765",
  storageBucket: "gamez-98765.appspot.com",
  messagingSenderId: "943968616256",
  appId: "1:943968616256:web:15a394e3357e3f5f5404a5",
  measurementId: "G-12KLQ8BKWK"
};
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

const docRef = firestore.doc("interestEmails/testDoc");

const inputTextField = document.querySelector("#inputEmail");
const submitButton = document.querySelector("#save");
const total = document.querySelector("#number");

submitButton.addEventListener("click", function () {
    const emailToSave = inputTextField.value;
    console.log("I am going to save " + emailToSave + " to Firestore");
    docRef.update({
        test: firebase.firestore.FieldValue.arrayUnion(emailToSave)
    }).then(function() {
        console.log("Email saved!");
    }).catch( function(err) {
        console.log(err);
    })
});




