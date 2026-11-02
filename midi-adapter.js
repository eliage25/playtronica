const MIDI_MAPPING = {
    notes: {
        41: 60,
        42: 61,
        38: 62
    },
    controlChanges: {
        1: 1
    }
};

const connectButton = document.getElementById("midi-connect");
const midiStatus = document.getElementById("midi-status");
const midiDeviceList = document.getElementById("midi-devices");
let midiAccess = null;

function renderMidiInputs() {
    midiDeviceList.replaceChildren();
    const inputs = midiAccess ? Array.from(midiAccess.inputs.values()) : [];

    for (const input of inputs) {
        const item = document.createElement("li");
        item.textContent = `${input.name || "Unnamed input"} (${input.state})`;
        midiDeviceList.appendChild(item);
    }

    if (midiAccess && inputs.length === 0) {
        midiStatus.textContent = "MIDI is available, but no input devices were found.";
        console.info("MIDI access granted; no MIDI input devices are currently connected.");
    } else if (midiAccess) {
        midiStatus.textContent = `${inputs.length} MIDI input${inputs.length === 1 ? "" : "s"} available.`;
    }
}

function handleMidiMessage(event) {
    const [status, data1, data2 = 0] = event.data;
    const command = status & 0xf0;
    const channel = (status & 0x0f) + 1;
    console.log("MIDI message:", {
        status,
        channel,
        data1,
        data2,
        bytes: Array.from(event.data)
    });

    if (command === 0x90 && data2 > 0) {
        console.log(`Note On: note ${data1}, velocity ${data2}, channel ${channel}`);
        const mappedNote = MIDI_MAPPING.notes[data1];
        const effect = INPUT_MAPPING.noteEffects[mappedNote];
        if (mappedNote !== undefined) noteOn(mappedNote, data2);
        window.dispatchEvent(new CustomEvent("conductive:midi-note", {
            detail: { action: "Note On", note: data1, effect, velocity: data2 }
        }));
    } else if (command === 0x80 || (command === 0x90 && data2 === 0)) {
        console.log(`Note Off: note ${data1}, channel ${channel}`);
        const mappedNote = MIDI_MAPPING.notes[data1];
        const effect = INPUT_MAPPING.noteEffects[mappedNote];
        if (mappedNote !== undefined) noteOff(mappedNote);
        window.dispatchEvent(new CustomEvent("conductive:midi-note", {
            detail: { action: "Note Off", note: data1, effect }
        }));
    } else if (command === 0xb0) {
        console.log(`Control Change: controller ${data1}, value ${data2}, channel ${channel}`);
        if (Object.hasOwn(MIDI_MAPPING.controlChanges, data1)) {
            controlChange(MIDI_MAPPING.controlChanges[data1], data2);
        }
    }
}

function attachMidiInputs() {
    const inputs = Array.from(midiAccess.inputs.values());

    for (const input of inputs) {
        input.onmidimessage = handleMidiMessage;
    }

    renderMidiInputs();
    if (inputs.length > 0) {
        console.info("MIDI inputs ready:", inputs.map((input) => input.name || "Unnamed input"));
    }
}

async function connectMidi() {
    connectButton.disabled = true;
    midiStatus.textContent = "Requesting MIDI access…";

    if (!navigator.requestMIDIAccess) {
        midiStatus.textContent = "Web MIDI is unavailable. Try Chrome or Edge over HTTPS or localhost.";
        console.error("Web MIDI API is not available in this browser or page context.");
        connectButton.disabled = false;
        return;
    }

    try {
        midiAccess = await navigator.requestMIDIAccess();
        midiAccess.onstatechange = attachMidiInputs;
        attachMidiInputs();
        if (midiAccess.inputs.size > 0) {
            midiStatus.textContent = "Connected. MIDI messages will appear in the browser console.";
        }
    } catch (error) {
        midiStatus.textContent = error.name === "NotAllowedError"
            ? "MIDI permission was denied. Allow access in browser settings and try again."
            : `Could not connect to MIDI: ${error.message}`;
        console.error("Could not access MIDI devices:", error);
    } finally {
        connectButton.disabled = false;
    }
}

connectButton.addEventListener("click", connectMidi);
