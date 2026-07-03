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
- [ ] Create the GitHub repo: https://github.com/new → name `birthday-loot-drop`,
      **Public**, no README → then have Claude push and walk through enabling
      Pages (Settings → Pages → Deploy from branch → main / root).
      Until this is pushed, the project only exists on the desktop PC.

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
