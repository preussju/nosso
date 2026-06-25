import { db } from "./firebase.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const form =
  document.getElementById("loginForm");

form.addEventListener("submit", async e => {

  e.preventDefault();

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Login funcionou
    window.location.href = "home.html";

  } catch (error) {

    alert("Email ou senha incorretos");

  }

});



async function salvarCapsula() {
  await addDoc(collection(db, "capsules"), {
    title: "Teste",
    message: "Oi amor 💛",
    openDate: "2027-06-15"
  });

  console.log("Capsula salva!");
}

