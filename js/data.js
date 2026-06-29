const relationshipDate = new Date("2025-11-20");

function updateTogetherCounter() {

    const now = new Date();

    let years =
        now.getFullYear() -
        relationshipDate.getFullYear();

    let months =
        now.getMonth() -
        relationshipDate.getMonth();

    let days =
        now.getDate() -
        relationshipDate.getDate();

    if (days < 0) {

        months--;

        const lastMonth =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                0
            );

        days += lastMonth.getDate();
    }

    if (months < 0) {

        years--;

        months += 12;
    }

    document.getElementById(
        "togetherCounter"
    ).innerHTML = `
        <span>${years}</span> anos
        <span>${months}</span> meses
        <span>${days}</span> dias
    `;
}

updateTogetherCounter();
setInterval(updateTogetherCounter, 1000);


function updateAnniversaryCounter() {

    const now = new Date();

    let anniversary =
        new Date(
            now.getFullYear(),
            0,
            15
        );

    if (anniversary < now) {

        anniversary =
            new Date(
                now.getFullYear() + 1,
                0,
                15
            );

    }

    const diff =
        anniversary - now;

    const days =
        Math.floor(
            diff / (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (diff / (1000 * 60 * 60)) % 24
        );

    const minutes =
        Math.floor(
            (diff / (1000 * 60)) % 60
        );

    document.getElementById(
        "anniversaryCounter"
    ).textContent =
        `${days}d ${hours}h ${minutes}m`;

}

updateAnniversaryCounter();
setInterval(updateAnniversaryCounter, 1000);