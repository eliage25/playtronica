const DEFAULT_SIMULATOR_VELOCITY = 100;
const objectContainer = document.getElementById("simulator-objects");
const lastEventDisplay = document.getElementById("last-event");

function displayInputEvent(action, contact, velocity) {
    const detail = action === "Note On" ? `, velocity ${velocity}` : "";
    lastEventDisplay.textContent = `Last event: ${action} — ${contact.name} (note ${contact.note}${detail})`;
}

function createTouchArea(contact) {
    const button = document.createElement("button");
    button.className = "simulator__object";
    button.type = "button";
    button.innerHTML = `<span class="simulator__object-name">${contact.name}</span>
        <span class="simulator__object-note">${contact.effectName}</span>
        <span class="simulator__midi-note" data-flower-note="${contact.note}">MIDI note: —</span>`;
    button.setAttribute("aria-label", `${contact.name}, ${contact.effectName}`);

    let held = false;

    function press() {
        if (held) return;
        held = true;
        button.classList.add("is-active");
        noteOn(contact.note, DEFAULT_SIMULATOR_VELOCITY);
        displayInputEvent("Note On", contact, DEFAULT_SIMULATOR_VELOCITY);
    }

    function release() {
        if (!held) return;
        held = false;
        button.classList.remove("is-active");
        noteOff(contact.note);
        displayInputEvent("Note Off", contact);
    }

    button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        press();
    });
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            press();
        }
    });
    button.addEventListener("keyup", (event) => {
        if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            release();
        }
    });
    button.addEventListener("blur", release);

    return button;
}

for (const contact of INPUT_MAPPING.contacts) {
    objectContainer.appendChild(createTouchArea(contact));
}

const keyboardContacts = new Map(
    Object.entries(INPUT_MAPPING.keyboardNotes).map(([key, note]) => [
        key,
        INPUT_MAPPING.contacts.find((contact) => contact.note === note)
    ])
);

const heldKeyboardKeys = new Set();

window.addEventListener("keydown", (event) => {
    const contact = keyboardContacts.get(event.key);
    if (!contact || event.repeat || heldKeyboardKeys.has(event.key)) return;
    heldKeyboardKeys.add(event.key);
    noteOn(contact.note, DEFAULT_SIMULATOR_VELOCITY);
    displayInputEvent("Note On", contact, DEFAULT_SIMULATOR_VELOCITY);
});

window.addEventListener("keyup", (event) => {
    const contact = keyboardContacts.get(event.key);
    if (!contact || !heldKeyboardKeys.has(event.key)) return;
    heldKeyboardKeys.delete(event.key);
    noteOff(contact.note);
    displayInputEvent("Note Off", contact);
});

window.addEventListener("conductive:midi-note", (event) => {
    const { note, effect, action, velocity } = event.detail;
    const contact = INPUT_MAPPING.contacts.find(
        (item) => INPUT_MAPPING.noteEffects[item.note] === effect
    );
    const velocityText = action === "Note On" ? `, velocity ${velocity}` : "";

    if (contact) {
        const noteDisplay = document.querySelector(`[data-flower-note="${contact.note}"]`);
        noteDisplay.textContent = `MIDI note: ${note}`;
        lastEventDisplay.textContent =
            `Last MIDI: ${action} — ${contact.name}, note ${note}${velocityText}`;
    } else {
        lastEventDisplay.textContent =
            `Last MIDI: ${action} — unmapped note ${note}${velocityText}`;
    }
});
