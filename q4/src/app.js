// CYSE 411 Exam Application
// WARNING: This code contains security vulnerabilities.
// Students must repair the implementation.

const loadBtn = document.getElementById("loadBtn");
const saveBtn = document.getElementById("saveSession");
const loadSessionBtn = document.getElementById("loadSession");

loadBtn.addEventListener("click", loadProfile);
saveBtn.addEventListener("click", saveSession);
loadSessionBtn.addEventListener("click", loadSession);

let currentProfile = null;


/* -------------------------
   Load Profile
-------------------------- */

function loadProfile() {

    const text = document.getElementById("profileInput").value;

    // FIX 1: Wrap JSON.parse in try/catch to handle malformed input safely
    let profile;
    try {
        profile = JSON.parse(text);
    } catch (e) {
        alert("Invalid JSON input.");
        return;
    }

    // FIX 2: Validate that expected fields exist and are the correct type
    if (typeof profile.username !== "string" || !Array.isArray(profile.notifications)) {
        alert("Invalid profile structure.");
        return;
    }

    currentProfile = profile;
    renderProfile(profile);
}


/* -------------------------
   Render Profile
-------------------------- */

function renderProfile(profile) {

    // FIX 3: Use textContent instead of innerHTML to prevent XSS
    document.getElementById("username").textContent = profile.username;

    const list = document.getElementById("notifications");
    list.innerHTML = "";

    for (let n of profile.notifications) {

        const li = document.createElement("li");

        // FIX 3 (continued): Use textContent instead of innerHTML to prevent XSS
        li.textContent = n;

        list.appendChild(li);
    }
}


/* -------------------------
   Browser Storage
-------------------------- */

function saveSession() {
    // FIX 4: Use sessionStorage instead of localStorage — session data should
    // not persist beyond the current browser session
    sessionStorage.setItem("profile", JSON.stringify(currentProfile));

    alert("Session saved");
}


function loadSession() {

    // FIX 4 (continued): Read from sessionStorage to match saveSession
    const stored = sessionStorage.getItem("profile");

    if (stored) {

        // FIX 5: Wrap in try/catch — stored data is attacker-controlled
        // and cannot be trusted
        let profile;
        try {
            profile = JSON.parse(stored);
        } catch (e) {
            alert("Corrupted session data.");
            return;
        }

        // FIX 5 (continued): Re-validate structure after loading from storage
        if (typeof profile.username !== "string" || !Array.isArray(profile.notifications)) {
            alert("Invalid session data.");
            return;
        }

        currentProfile = profile;
        renderProfile(profile);
    }
}
