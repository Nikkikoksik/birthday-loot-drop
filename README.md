# 🎁 Birthday Loot Drop

A one-shot gift reveal page on a Miami dusk beach: he clicks the box → the box
refuses and sprints off into the sunset → awkward empty beach → it skids back,
gives up, and pops open into a legendary pull — your face on a golden pedestal
and the Steam key.

## Make it yours (2 minutes)

1. Open **`config.js`** — paste the real Steam key, set the name, tweak jokes.
2. Save your pic (ChatGPT etc.) as **`assets/face.png`**.
   Transparent background PNG is ideal; a plain white background also works —
   the page auto-removes it on load.

## Deploy (free, ~30 seconds)

1. Go to **https://app.netlify.com/drop**
2. Drag this whole folder onto the page.
3. Copy the link it gives you and send it to him. Done.

(Any static host works: Vercel, GitHub Pages, Cloudflare Pages.)

## Notes

- All sound is synthesized in the browser — no audio files, and it only starts
  after his click, so browsers won't block it. Mute button top-right.
- The key is visible in the page source, so only share the link with him.
- Works on phones.
