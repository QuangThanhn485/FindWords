"use strict";
const outputResuln = document.querySelector("#output");
const inputTextToSearch = document.querySelector("#input");
const btnSubmit = document.querySelector("#push");
const infoResuln = document.querySelector("#info");
const inputAddingColor = document.querySelector("#myColor");
const inputAddingWords = document.querySelector("#add");
const btnHideOrShowControl = document.querySelector("#hiden");
const control = document.querySelector("#control");
const displayResuln = document.querySelector("#resuln");

let keyWorldSearch = {
    search: [],
};
let resulnSearch = {
    keySearch: "",
    countResuln: "",
    Color: "",
};
let customItemKeyWords;
let statusControl = false;

function createlocalStorage() {
    localStorage.getItem("keywords") ||
        localStorage.setItem(
            "keywords",
            JSON.stringify({
                search: [
                    {
                        keyWorld: null,
                        color: null,
                    },
                ],
            })
        );
}
createlocalStorage();

function getKeyWordsFromLocalStorage() {
    let searchitem = localStorage.getItem("keywords") || [];
    return JSON.parse(searchitem).search;
}

function searchAll() {
    createlocalStorage();
    let contenInput = inputTextToSearch.value;
    let allItemKeyWords = getKeyWordsFromLocalStorage();
    searching.call(resulnSearch, allItemKeyWords, contenInput);
}

async function searchCustom(customItemKeyWords) {
    let contenInput = inputTextToSearch.value;
    searching.call(resulnSearch, customItemKeyWords, contenInput);
}

async function searching(itemKeyWords, contenInput) {
    let logResulns = [];
    if (itemKeyWords != null) {
        await itemKeyWords.map((x) => {
            contenInput = contenInput.replaceAll(
                RegExp(x.keyWorld, "gi"),
                "<mark style = 'background : " +
                    x.color +
                    "'>" +
                    x.keyWorld +
                    "</mark>"
            );
            this.keySearch = x.keyWorld;
            this.Color = x.color;
            this.countResuln = (
                contenInput.match(RegExp(x.keyWorld, "gi")) || []
            ).length;
            logResulns = logResulns.concat(JSON.stringify(this));
        });
    } else {
        outputResuln.innerHTML = inputTextToSearch.innerHTML;
    }
    outputResuln.innerHTML = contenInput;
    addingInfoResuln(logResulns);
}

async function addingInfoResuln(logResulns) {
    const card = document.createElement("dev");
    card.id = "para";
    let resulnString = "";
    let indexItems = 0;
    await logResulns.map((x) => {
        let itemObj = JSON.parse(x);
        if (itemObj.countResuln != 0) {
            resulnString += `
            <div id="card_${indexItems}" style ="position: relative;">
                <hr class='new1'>
                <ul style="flex-direction: column;">
                    <li>
                    <strong>keyword :  </strong></nbsp>${itemObj.keySearch}
                    </li>
                    <li>
                    <strong>count total : </strong> ${itemObj.countResuln}
                    </li>
                </ul>

                <div style=" background: ${itemObj.Color};
                right: 70px;
                top:0px;
                height: 60px;
                width: 35px;
                border-bottom-left-radius: 50px;
                border-bottom-right-radius: 50px;
                position: absolute;">

                <div" class="prevent-select" style="
                top:5px;
                right:-60px;
                height: 60px;
                width: 35px;
                cursor: pointer;
                position: absolute" onclick="removeResulnItem(${indexItems},'${itemObj.keySearch}')">
                    <span class="close">+</span>
                </div>
            </div>`;
            indexItems++;
        }
    });
    infoResuln.innerHTML = null;
    card.innerHTML = resulnString;
    infoResuln.appendChild(card);
}

function removeResulnItem(indexItem, keyWorld) {
    let itemResuln = document.getElementById("card_" + indexItem);
    let listSearch = customItemKeyWords || getKeyWordsFromLocalStorage();
    itemResuln.remove();
    customItemKeyWords = listSearch.filter((x) => x.keyWorld != keyWorld);
    if (para.childElementCount === 0) {
        customItemKeyWords = null;
    }
    searchCustom(customItemKeyWords);
}

function addingItemKeyWord() {
    createlocalStorage()
    keyWorldSearch.search =  getKeyWordsFromLocalStorage();
    let world = inputAddingWords.value;
    if (checkBeforeAddKeyWord(world)) {
        keyWorldSearch.search = keyWorldSearch.search.concat({
            keyWorld: world,
            color: inputAddingColor.value,
        });
        localStorage.removeItem("keywords");
        localStorage.setItem("keywords", JSON.stringify(keyWorldSearch));
        searchAll();
    }
}

function checkBeforeAddKeyWord(world) {
    let listSearch = getKeyWordsFromLocalStorage();
    let resuln = true;
    let keyWorld = listSearch.filter((x) => x.keyWorld === world);
    if (world === "") {
        resuln = false;
        alert("this value key word can't empty !");
    }
    if (containsSpecialChars(world)) {
        resuln = false;
        alert("key word don't allow Special Characters !");
    }
    if (keyWorld.length != 0) {
        resuln = false;
        alert("this key world realy exist !");
    }
    return resuln;
}
function containsSpecialChars(str) {
    const specialChars = `\`!@#$%^&*() _+\-=\[\]{};':"\\|,.<>\/?~`;

    const result = specialChars.split("").some((specialChar) => {
        if (str.includes(specialChar)) {
            return true;
        }
        return false;
    });

    return result;
}

function hidenOrshowControl() {
    statusControl = !statusControl;
    if (statusControl) {
        hidenInfo();
    } else showInfo();
}

function hidenInfo() {
    btnHideOrShowControl.innerHTML = ">>>";
    control.style.display = "none";
    displayResuln.className = "g-col-12";
}
function showInfo() {
    btnHideOrShowControl.innerHTML = "<<<";
    control.style.display = "";
    displayResuln.className = "g-col-10";
}
btnSubmit.addEventListener("onclick", () => {
    searchAll();
});

this.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchAll();
    }
});
