import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { db, auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

let currentFilter = "all";
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
        alert("Usuario não autenticado. Por favor, faça login.");
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

    const toWatchContainer =
        document.getElementById(
            "toWatchContainer"
        );

    const watchedContainer =
        document.getElementById(
            "watchedContainer"
        );

    toWatchContainer.innerHTML = "";
    watchedContainer.innerHTML = "";

    const snapshot =
        await getDocs(
            collection(db, "watchlist")
        );

    snapshot.forEach(doc => {

        const item = doc.data();
        const id = doc.id;

            if (
                currentFilter !== "all" &&
                item.type !== currentFilter
            ) {
                return;
            }


        const card = `
        <div class="movie-card ${item.type} ${item.watched ? "watched" : ""}">

            <div class="poster">
                <h3>${item.title}</h3>

                <span class="tag">${item.type}</span>

                <p class="added-by">
                    por: ${item.addedBy.split("@")[0]}
                </p>

            </div>

            <div class="overlay">

                <button
                    class="watch-btn"
                    data-id="${id}"
                    data-watched="${item.watched}">
                    ${item.watched ? "✅ Assistido" : "👀 Quero assistir"}
                </button>

                <button
                    class="delete-btn"
                    data-id="${id}">
                    Remover
                </button>

            </div>

        </div>
    `;
        
    if (item.watched) {

        watchedContainer.innerHTML += card;

    } else {

        toWatchContainer.innerHTML += card;

    }

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


async function toggleWatched(id, currentState) {

    try {

        await updateDoc(
            doc(db, "watchlist", id),
            {
                watched: !currentState,
                watchedAt: !currentState
                    ? new Date()
                    : null
            }
        );

        await loadWatchlist();

    } catch (error) {

        console.error(error);

    }

}


document.addEventListener("click", (e) => {

    if (e.target.classList.contains("delete-btn")) {

        deleteItem(e.target.dataset.id);
    }

    if (e.target.classList.contains("watch-btn")) {

        const id = e.target.dataset.id;

        const watched =
            e.target.dataset.watched === "true";

        toggleWatched(id, watched);
    }

});

document
    .querySelectorAll(
        "[data-filter]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                currentFilter =
                    button.dataset.filter;

                await loadWatchlist();

            }
        );

    });