# playtronica

## Getting Started

Open `index.html` in your web browser and start editing `sketch.js`.

## Running Locally

For projects with media files, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using VS Code Live Server extension
# Right-click index.html -> "Open with Live Server"
```

## Virtual Playtron Simulator

The browser simulator in the upper-right corner has three touch areas: Flower 1
for Pulse Rings, Flower 2 for Moving Grid, and Flower 3 for Particle Burst. Press
or click a flower to send Note On at a fixed velocity of 100; release it to send
Note Off. The keyboard shortcuts `1`, `2`, and `3` remain available for the same
effects. MIDI access is not requested until you click **Connect MIDI**.

Edit `INPUT_MAPPING` in `shared-functions.js` to change the simulator notes or
effect assignments.

## Connecting a MIDI Controller

Click **Connect MIDI** in the input panel and allow access in the browser prompt.
Web MIDI requires a supported browser (such as Chrome or Edge) and a secure
context, usually HTTPS or `localhost`. Available MIDI inputs are listed in the
panel and incoming messages are logged in the browser console.

Touch each Playtron contact and check the console and Last MIDI display for its
actual note number. Add entries to `MIDI_MAPPING.notes` in `midi-adapter.js`:
each key is the actual note sent by the Playtron, and its value is the virtual
flower note (60 for Flower 1, 61 for Flower 2, or 62 for Flower 3). The mapping
starts empty so it does not assume the Playtron's note numbers. Control Change
numbers are configured in `MIDI_MAPPING.controlChanges`. The virtual flowers
and keyboard remain available whether or not MIDI is connected.

## Resources

- [p5.js 2.0](https://beta.p5js.org/)
- [p5.js Reference](https://p5js.org/reference/)
