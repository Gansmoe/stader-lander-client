let metPopulation = [];

const menuVisited = document.getElementById("menuVisited");
const main = document.getElementById("main");
const cityPopulation = document.getElementById("cityPopulation");

const getDataLand = async () => {
    const response = await fetch("data/land.json");
    const data = await response.json();
    return data;
};

const getDataStad = async () => {
    const response = await fetch("data/stad.json");
    const data = await response.json();
    return data;
};

function checkArray() {
    let temp = localStorage.getItem("population");

    if (temp) {
        metPopulation = JSON.parse(temp);
        printData();
    } else {
        printData();
    }
}

const printData = async () => {
    const menu = document.getElementById("menu");

    const dataLand = await getDataLand();
    const dataStad = await getDataStad();

    for (let i = 0; i < dataLand.length; i++) {
        const button = document.createElement("button");
        const li = document.createElement("li");
        button.innerText = dataLand[i].countryname;
        const landId = dataLand[i].id;
        const landName = dataLand[i].countryname;

        li.appendChild(button);
        menu.appendChild(li);

        button.addEventListener("click", function () {
            cityPopulation.innerHTML = "";
            main.innerHTML = "";
            for (let j = 0; j < dataStad.length; j++) {
                const btnCity = document.createElement("button");
                btnCity.id = "btnCity";
                btnCity.innerText = dataStad[j].stadname;

                const cityId = dataStad[j].countryid;
                const population = document.createElement("p");
                const logBtn = document.createElement("button");
                logBtn.id = "logBtn";
                logBtn.innerText = "Besökt";

                btnCity.addEventListener("click", function () {
                    cityPopulation.innerHTML = "";

                    if (dataStad[j].countryid === landId) {
                        population.innerText =
                            dataStad[j].stadname +
                            " är en stad i " +
                            landName +
                            " och har " +
                            dataStad[j].population +
                            " invånare.";
                        cityPopulation.appendChild(population);
                        cityPopulation.appendChild(logBtn);

                        logBtn.addEventListener("click", function () {

                            let check = metPopulation.some(
                                (obj) => obj.id === dataStad[j].id
                            );

                            if (check) {
                                logBtn.style.display = "none";
                            } else if (!check) {
                                console.log(metPopulation);
                                metPopulation.push(dataStad[j]);
                                const myJSONPop = JSON.stringify(metPopulation);
                                localStorage.setItem("population", myJSONPop);
                                logBtn.style.display = "none";
                            }

                        });
                    }
                });

                if (landId === cityId) {
                    btnCity.innerText = dataStad[j].stadname;
                    main.appendChild(btnCity);
                }
            }
        });
    }
};
menuVisited.addEventListener("click", function () {
    main.innerHTML = "";
    cityPopulation.innerHTML = "";

    const introText = document.createElement("h3");
    introText.innerText = "Du har varit i:";
    main.appendChild(introText);

    const introTextMet = document.createElement("h3");
    introTextMet.innerText = "Du kan potentiellt träffat:";
    cityPopulation.appendChild(introTextMet);

    let temp = localStorage.getItem("population");
    let obj = JSON.parse(temp);

    let list = document.createElement("ul");
    let metTotal = 0;

    for (let i = 0; i < obj.length; i++) {
        const listItem = document.createElement("li");
        listItem.innerText = obj[i].stadname;
        list.appendChild(listItem);
        main.appendChild(list);
        metTotal += obj[i].population;
    }
    let metText = document.createElement("h4");
    metText.innerText = metTotal + " människor.";
    cityPopulation.appendChild(metText);

    let resetBtn = document.createElement("button");
    resetBtn.innerText = "Återställ";
    resetBtn.id = "resetBtn";
    cityPopulation.appendChild(resetBtn);

    resetBtn.addEventListener("click", function () {
        localStorage.removeItem("population");
        location.reload();
    });
});

checkArray();
