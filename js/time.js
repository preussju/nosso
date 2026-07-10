import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.replace(
            "index.html"
        );

        return;
    }

    currentUser = user;

    await loadCapsules();

});


const form =
    document.getElementById(
        "capsuleForm"
    );

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const title =
            document.getElementById(
                "title"
            ).value;

        const message =
            document.getElementById(
                "message"
            ).value;

        const openDate =
            document.getElementById(
                "openDate"
            ).value;
    

        await addDoc(
            collection(
                db,
                "capsules"
            ),
            {
                title,
                message,
                openDate,
                createdBy:
                    currentUser.email,
                createdAt:
                    new Date()
            }
        );

        form.reset();

        loadCapsules();

    }
);

async function loadCapsules() {

    const container =
        document.getElementById(
            "capsulesContainer"
        );

    container.innerHTML = "";

    const snapshot =
        await getDocs(
            collection(
                db,
                "capsules"
            )
        );

    snapshot.forEach(doc => {

        const item =
            doc.data();

        const today =
            new Date();

        const unlockDate =
            new Date(item.openDate);

        const unlocked =
            today >= unlockDate;
        
        const daysLeft =
            Math.ceil((unlockDate - today) / (1000 * 60 * 60 * 24));

        container.innerHTML += `
        
            <div class="capsule-card">

                <h3>
                    ${item.title}
                </h3>
                
                <p class="author">
                    ✍️ ${item.createdBy.split("@")[0]}
                </p>

                ${
                    unlocked
                    ?
                    `
                        <button
                            class="open-btn"
                            data-title="${item.title}"
                            data-message="${item.message}"
                            data-author="${item.createdBy.split("@")[0]}"
                            data-created="${item.createdAt.toDate().toISOString()}">
                            🔓 Aberto
                        </button>
                    `
                    :
                    `
                    <p>
                        🔒 Abre em ${daysLeft} dia(s)!
                    </p>
                    <small>
                        📅 ${item.openDate}
                    </small>
                    `
                }

            </div>

        `;

    });

}

document.addEventListener(
    "click",
    (e) => {

        if (
            e.target.classList.contains(
                "open-btn"
            )
        ) {

                const modal =
                    document.getElementById(
                        "capsuleModal"
                    );

                document.getElementById(
                    "modalTitle"
                ).textContent =
                    e.target.dataset.title;

                document.getElementById(
                    "modalMessage"
                ).textContent =
                    e.target.dataset.message;

                const createdDate =
                        new Date(
                            e.target.dataset.created
                        );

                const formattedDate =
                        createdDate.toLocaleDateString(
                            "en-US",
                            {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            }
                        );

                document.getElementById(
                        "modalAuthor"
                    ).textContent =
                        `Escrito por ${e.target.dataset.author} em ${formattedDate} ❤️`;
            
                modal.classList.remove(
                    "hidden"
                );

        }

    }
);

document
    .getElementById("closeModal1")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "capsuleModal"
                )
                .classList.add(
                    "hidden"
                );

        }
);
    
