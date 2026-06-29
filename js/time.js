await addDoc(
    collection(db, "capsules"),
    {
        title,
        message,
        openDate,
        createdBy: currentUser.email,
        createdAt: new Date()
    }
);

const today = new Date();
const unlockDate = new Date(item.openDate);

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

        container.innerHTML += `
        
            <div class="capsule-card">

                <h3>
                    ${item.title}
                </h3>

                ${
                    unlocked
                    ?
                    `
                    <button
                        class="open-btn"
                        data-message="${item.message}">
                        🔓 Open
                    </button>
                    `
                    :
                    `
                    <p>
                        🔒 Opens on
                        ${item.openDate}
                    </p>
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

            alert(
                e.target.dataset.message
            );

        }

    }
);