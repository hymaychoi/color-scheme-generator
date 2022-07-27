import { colorPickerModes } from "./data";

const colorPickerForm = document.getElementById("colorPick-form");
const colorPickerInput = document.getElementById("colorPicker");
const colorPickerModeDropDown = document.getElementById("colorPick-mode");

const resultColorDiv = document.getElementById("result-color-div");
const resultColorCodeDiv = document.getElementById("result-code-div");

let colorPicked = "";
let modePicked = "";
let resultColorDivHtml = "";
let resultCodeDivHtml = "";
let colorSchemeSetStrings = [];
let resultColorSchemeSet = [];

fetchToRender();
renderDropDownList();

//listen onchange event when user change the color input and save the data in a variable
colorPickerInput.addEventListener(
  "change",
  (event) => {
    //to remove # from the hex code we got from the user
    colorPicked = event.target.value.slice(1, 7);
  },
  false
);

//listen when user change the scheme mode dropdownlist value and save that data in global variable
colorPickerModeDropDown.addEventListener("change", () => {
  modePicked =
    colorPickerModeDropDown.options[colorPickerModeDropDown.selectedIndex].text;
});

//when user clicks submit btn, get data from user's input
colorPickerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // to get options in dropdown list
  modePicked =
    colorPickerModeDropDown.options[colorPickerModeDropDown.selectedIndex].text;
  fetchToRender();
});

//when first load, and when user request a new set of color scheme
function fetchToRender() {
  if (!colorPicked) {
    //initialize the color and mode value if user is not selected anything
    colorPicked = colorPickerInput.value.slice(1, 7);
    modePicked = colorPickerModes[0];
  }

  fetch(
    `https://www.thecolorapi.com/scheme?hex=${colorPicked}&mode=${modePicked}`
  )
    .then((res) => res.json())
    .then((data) => {
      let colorSchemeSetArray = data.colors;

      for (let i = 0; i < 5; i++) {
        colorSchemeSetStrings.push(colorSchemeSetArray[i]);
      }

      // to store each object's hex value
      for (let i = 0; i < colorSchemeSetStrings.length; i++) {
        resultColorSchemeSet.push(colorSchemeSetStrings[i].hex.value);
      }

      renderColor();
      colorSchemeSetStrings = [];
      resultColorSchemeSet = [];
    });
}

function renderColor() {
  //to store result of color scheme set object
  resultColorDivHtml = resultColorSchemeSet
    .map((resultColorItem) => {
      return `<div class="result-color" style="background-color: ${resultColorItem};"></div>`;
    })
    .join("");

  resultCodeDivHtml = resultColorSchemeSet
    .map((resultColor) => {
      return `
                    <label for='${resultColor}' class='copy-label'>Click to copy!</label>
                    <input class='result-code' id='${resultColor}' type="text" value='${resultColor}'/>`;
    })
    .join("");

  resultColorDiv.innerHTML = resultColorDivHtml;
  resultColorCodeDiv.innerHTML = resultCodeDivHtml;

  // the reason why I should put an event listener for labels and input element in resultCodeDivHtml
  // I gotta render the page to select that dynamically created elements.
  // so be careful with the order you put. these code usually comes after the html page loads

  // add event listener to the labels
  const resultColorCodeInputs = document.getElementsByClassName("result-code");
  Object.entries(resultColorCodeInputs).forEach(([key, resultColorCodeInput]) => {
    resultColorCodeInput.addEventListener("click", function(event) {
      let copiedColorText = event.target.value
      navigator.clipboard.writeText(copiedColorText).then(() => {
        alert(`Copied Color: ${copiedColorText}`)
    });
    }
    );
  });
}

function renderDropDownList() {
  const colorPickerModeOptionsHtml = colorPickerModes
    .map((colorPickerMode) => {
      return `<option class='colorSchemeOptions' value="#">${colorPickerMode}</option>`;
    })
    .join("");

  colorPickerModeDropDown.innerHTML = colorPickerModeOptionsHtml;
}
