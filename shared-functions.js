const INPUT_MAPPING = {
    keyboardNotes: {
        "1": 60,
        "2": 61,
        "3": 62
    },
    contacts: [
        { name: "Flower 1", note: 60, effectName: "Pulse Rings" },
        { name: "Flower 2", note: 61, effectName: "Moving Grid" },
        { name: "Flower 3", note: 62, effectName: "Particle Burst" }
    ],
    noteEffects: {
        60: 1,
        61: 2,
        62: 3
    }
};

function noteOn(note, velocity = 100) {
    const effect = INPUT_MAPPING.noteEffects[note];
    if (effect) triggerEffect(effect);
}

function noteOff(note) {
    const effect = INPUT_MAPPING.noteEffects[note];
    if (effect === 2) gridActive = false;
}

function controlChange(controller, value) {
    window.dispatchEvent(new CustomEvent("conductive:control-change", {
        detail: { controller, value }
    }));
}
