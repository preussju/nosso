import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { db, auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";


let currentUser = null;
const form = document.getElementById("watchlistForm");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.replace("index.html");
        return;
    }

    currentUser = user;

    console.log("Logged in:", user.email);

    await loadWatchlist();
});


form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!currentUser) {
        alert("User not loaded yet");
        return;
    }

    const title = document.getElementById("title").value;
    const type = document.getElementById("type").value;

    try {

        await addDoc(
            collection(db, "watchlist"),
            {
                title,
                type,
                addedBy: currentUser.email,
                watched: false,
                createdAt: new Date()
            }
        );

        form.reset();

        await loadWatchlist();

    } catch(error) {

        console.error(error);

    }

});

async function loadWatchlist() {

    const container =
        document.getElementById(
            "watchlistContainer"
        );

    container.innerHTML = "";

    const snapshot =
        await getDocs(
            collection(db, "watchlist")
        );

    snapshot.forEach(doc => {

        const item = doc.data();

        container.innerHTML += `
        <div class="movie-card ${item.type}">

    <div class="poster">
        <img src="https://via.placeholder.com/300x450?text=${encodeURIComponent(item.title)}" />
    </div>

        <div class="overlay">

            <h3>${item.title}</h3>

            <span class="tag">${item.type}</span>

            <p class="added-by">
                Added by ${item.addedBy}
            </p>

            <button class="watch-btn">
                Mark as watched
            </button>

        </div>

    </div>
    `;

    });

    
    snapshot.forEach((doc) => {

        const item = doc.data();
        const id = doc.id;

        container.innerHTML += `
            <div class="card">



                <button class="delete-btn" data-id="${id}">
                    Delete
                </button>

            </div>
        `;
    });


}


async function deleteItem(id) {

    try {

        await deleteDoc(doc(db, "watchlist", id));

        await loadWatchlist();

    } catch (error) {

        console.error(error);

    }

}

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("delete-btn")) {

        const id = e.target.dataset.id;

        deleteItem(id);
    }

});