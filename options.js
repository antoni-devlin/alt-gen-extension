const apiKeyContainer = document.getElementById("api-key");
const settingsForm = document.getElementById("settings-form");
const saveStatus = document.getElementById("status");

settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveOptions();
});

document.addEventListener("DOMContentLoaded", loadSettings());

function saveOptions() {
  const key = apiKeyContainer.value;
  chrome.storage.sync.set({ openAIKey: key });
  saveStatus.innerText = "Options saved.";
  setTimeout(() => {
    saveStatus.textContent = "";
  }, 750);
}

function loadSettings() {
  chrome.storage.sync.get({ openAIKey }, (items) => {
    apiKeyContainer.value = items.openAIKey;
  });
}

// // Restores select box and checkbox state using the preferences
// // stored in chrome.storage.
// const restoreOptions = () => {
//   chrome.storage.sync.get(
//     { favoriteColor: "red", likesColor: true },
//     (items) => {
//       document.getElementById("color").value = items.favoriteColor;
//       document.getElementById("like").checked = items.likesColor;
//     }
//   );
// };

// document.addEventListener("DOMContentLoaded", restoreOptions);
// document.getElementById("save").addEventListener("click", saveOptions);
