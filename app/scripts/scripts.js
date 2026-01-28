async function getData() {
    const url = "http://localhost:1312/api/acceuil";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
    }
}

async function LocalStarageInit() {
    let TmpLocalStorage = { "ownedCharacters": {}, "ownedArtefact": {} };
    localStorage.setItem("localdata", JSON.stringify(TmpLocalStorage));
}

async function createGalery(fetchData) {
    const container = document.getElementById("table_caracters");
    if (!container) return;

    Object.entries(fetchData).forEach(([name, data]) => {
        const card = document.createElement("figure");

        card.className = "card";
        let localData = JSON.parse(localStorage.getItem("localdata"));

        if (localData["ownedCharacters"][name] != undefined) {
            card.classList.add("actif_card");
        }

        card.classList.add(data["star"] == "5" ? "five_star" : "four_star");
        card.id = name

        const img = document.createElement("img");
        img.className = "face";

        img.src = `imgs/avatars/${name}_avatar.webp`;
        img.alt = name;

        card.appendChild(img);
        container.appendChild(card);
    });
}

async function addClickEvents(fetchData) {
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", function () {
            card.classList.toggle("actif_card");

            let name = card.getAttribute('id');
            let caracters = JSON.parse(localStorage.getItem("localdata"));

            if (caracters["ownedCharacters"][name] == undefined) { caracters["ownedCharacters"][name] = {} }
            else { delete caracters["ownedCharacters"][name]; }

            localStorage.setItem("localdata", JSON.stringify(caracters));
            teamBuilder(fetchData)
        });
    });
}


async function teamBuilder(fetchData) {
    let localData = JSON.parse(localStorage.getItem("localdata"))["ownedCharacters"];
    const container = document.getElementById("team_builder");
    container.innerHTML = "";
    Object.entries(localData).forEach(([name, data]) => {
        fetchData[name]["best_team"].forEach(([a, z, e, r]) => {
            if (localData[a] && localData[z] && localData[e] && localData[r]) {
                console.log(`${a} ${z} ${e} ${r}`)

                const div_cards = document.createElement("div");
                div_cards.className = "cards_team galerie ";

                div_cards.insertAdjacentHTML("beforeend", `
                    <figure class="card actif_card">
                        <img class="face " src="imgs/avatars/${a}_avatar.webp" alt="">
                    </figure>
                    <figure class="card actif_card">
                        <img class="face" src="imgs/avatars/${z}_avatar.webp" alt="">
                    </figure>
                    <figure class="card actif_card">
                        <img class="face inactive_card" src="imgs/avatars/${e}_avatar.webp" alt="">
                    </figure>
                    <figure class="card actif_card">
                        <img class="face" src="imgs/avatars/${r}_avatar.webp" alt="">
                    </figure>
                `);
                container.appendChild(div_cards);
            }
        })

    })
}

async function main() {
    const fetchData = await getData();
    if (localStorage.getItem("localdata") == null) {
        dataLocal = await LocalStarageInit(fetchData);
    }

    await createGalery(fetchData);
    addClickEvents(fetchData);
    teamBuilder(fetchData)
}

main();
