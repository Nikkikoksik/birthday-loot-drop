# Plan for tomorrow (written 2026-07-02 end of session)

## Where things stand
Working birthday reveal page: Miami dusk beach, 3D gift box, click → box grows
legs (gold sneakers) → sprints off into the horizon → "…bro. it just dipped." →
sprints back → gives up, pops open → legendary pull: golden-aura kid pic on a
pedestal, confetti, gold flood. All committed to git (local repo on the desktop
PC, `C:\Users\Nick\Desktop\project-art`).

Run it: `npx serve -l 4173` in the folder → http://localhost:4173.
Press **R** after the reveal to replay.

## Blocked on Nick (do FIRST if not done)
- [x] GitHub repo created and pushed: https://github.com/Nikkikoksik/birthday-loot-drop
- [ ] Enable Pages: repo → Settings → Pages → Deploy from a branch → main / (root)
      → site will be at https://nikkikoksik.github.io/birthday-loot-drop/

## New ideas from 2026-07-02 evening (feasibility-checked)
- [ ] "Hide the code from him": can't be done fully — any web page's code is
      viewable via view-source, and free GitHub Pages requires a public repo.
      Realistic options: (a) accept it — he won't look before clicking;
      (b) make repo private + host free on Netlify instead of Pages;
      (c) minify/obfuscate the JS to deter casual snooping. DECIDE TOMORROW.
- [ ] "Auto-send the game when he opens the box": Steam has NO API for sending
      gifts — automating the actual gift delivery is not possible. What IS
      possible: a notification to Nick (email/Discord webhook) the moment the
      box is opened, so Nick manually fires the Steam gift right then. Needs a
      tiny free endpoint (Formspree / Discord webhook / Cloudflare Worker).
- [ ] "Track where in Miami it was opened": browser geolocation would show him
      a permission popup (spoils the vibe). IP-based lookup gives city-level
      only ("Miami") without any popup — can ride along in the open-notification
      ping. Good enough to confirm HE opened it, not a street address.

## The gift itself (decision made 2026-07-02)
Steam doesn't sell keys to individuals — going with **"Buy as Gift"** on the
Subnautica 2 Steam store page (sent to his account directly), or a Steam
digital gift card as fallback.

- [ ] Rework the reveal card: instead of key + COPY CODE button, show a message
      like "YOUR GIFT IS WAITING IN YOUR STEAM INBOX. GO." The URL-hash
      mechanism in js/main.js (`#...` overrides `CONFIG.steamKey`) can carry a
      custom message instead — repurpose or simplify.
- [ ] Actually buy the gift on Steam and coordinate delivery timing with the
      page send.

## Polish list
- [ ] Verify the flee animation feels smooth on the other computer (was laggy,
      then GPU-layered + slowed to 2s — needs a real-eyes check).
- [ ] Tune jokes/wording in config.js (fleeLine, footerLine, etc.).
- [ ] Decide on the cotton-candy childhood photo of both of them: optional
      tilted polaroid under the reveal card ("the OGs"). Claude offered to
      build the slot — just ask.
- [ ] Test on a phone (the whole thing should work mobile, untested).
- [ ] Final deploy check: send the GitHub Pages link WITH the hash message,
      e.g. https://nikkikoksik.github.io/birthday-loot-drop/#CHECK-YOUR-STEAM-INBOX
- [ ] Note: face.png (childhood photo) is in the public repo — Nick said fine
      so far; revisit if second thoughts.
