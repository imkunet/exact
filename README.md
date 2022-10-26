# Exact

Exact is a small clock written in SolidJS that you can use in the browser
to see if your computer's time is accurate or not!

live: [https://exact.kunet.dev/](https://exact.kunet.dev/)

NOTE: This project relies on a Cloudflare worker located at `https://time.kunet.workers.dev/`, 
all I ask is that you please don't make hosting this a billing nightmare, thanks 💞!

NOTE: There is a CSS import leading to `fonts.google.com` located in `src/index.css` 
with reference to it in `tailwind.config.js`. If you wish to not use Google's font CDN, feel free to remove them!
