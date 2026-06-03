# Manapool — Docker Setup Guide

This guide gets Manapool running on your PC using Docker Desktop.
Everything works: card search, deck generation, play guide, import/export, and community decks.

---

## What you need

- A Windows or Mac PC
- 10 minutes

---

## Step 1 — Install Docker Desktop

Go to https://www.docker.com/products/docker-desktop and download Docker Desktop for your OS.

Install it and start it. You will see a whale icon in your system tray when it is running.
You do not need to create a Docker account — just skip that step.

---

## Step 2 — Get an Anthropic API key

This powers the "Generate a New Deck" and "Play Guide" features.

1. Go to https://console.anthropic.com
2. Sign in (same email as your Claude Pro account)
3. Click **API Keys** in the left menu
4. Click **Create Key**, give it a name like "Manapool"
5. Copy the key — it starts with `sk-ant-...`

You get $5 free credit automatically. Each deck generation costs less than $0.01,
so this covers hundreds of uses before you spend anything.

---

## Step 3 — Set up your .env file

Inside the manapool-server folder, find the file called `.env.example`.

Copy it and rename the copy to `.env` (remove the `.example` part).

Open `.env` in any text editor (Notepad is fine) and replace the placeholder:

```
ANTHROPIC_API_KEY=sk-ant-...paste your key here...
```

Save the file.

> On Windows, `.env` files can be tricky to create. If you can't rename it,
> open Notepad, paste the line above with your key, then go to
> File → Save As → set "Save as type" to "All Files" → name it `.env`

---

## Step 4 — Open a terminal in the folder

**Windows:**
Open the manapool-server folder in File Explorer.
Click the address bar at the top, type `cmd` and press Enter.
A black terminal window opens in the right folder.

**Mac:**
Right-click the manapool-server folder → Services → New Terminal at Folder.
Or open Terminal and type `cd ` then drag the folder in.

---

## Step 5 — Run Manapool

In the terminal, type this and press Enter:

```
docker compose up --build
```

The first time this runs it will download some files (about 150MB, takes 1-3 minutes).
You will see a lot of text scrolling. When you see this, it is ready:

```
  🌊 Manapool is running!
  Open: http://localhost:3000
```

---

## Step 6 — Open the app

Open your browser and go to:

```
http://localhost:3000
```

Manapool is now fully running on your PC. All features work.

---

## Stopping and starting

**To stop:** press `Ctrl + C` in the terminal, or close the terminal window.

**To start again:** open the terminal in the folder and run:
```
docker compose up
```
(No `--build` needed after the first time unless you update the files.)

**To start in the background** (so you can close the terminal):
```
docker compose up -d
```
Then stop it later with:
```
docker compose down
```

---

## Sharing on your home network

If you want other devices (phone, tablet, another PC) to use Manapool:

1. Find your PC's local IP address:
   - Windows: open Command Prompt, type `ipconfig`, look for **IPv4 Address** (e.g. 192.168.1.42)
   - Mac: System Settings → Network → your connection → IP address

2. On the other device, open a browser and go to:
   ```
   http://192.168.1.42:3000
   ```
   (replace with your actual IP)

---

## Updating the app

When you get a new `index.html` from Claude:

1. Replace the file at `public/index.html` with the new one
2. Run `docker compose up --build` to rebuild

---

## Troubleshooting

**"Port 3000 is already in use"**
Something else is using port 3000. Open `docker-compose.yml` in a text editor,
change `"3000:3000"` to `"3001:3000"`, then open http://localhost:3001 instead.

**"Cannot find .env file"**
Make sure the file is named exactly `.env` (not `.env.txt` or `env`).
In Windows Explorer, make sure "Hide file extensions" is turned off in View settings.

**Docker Desktop is not running**
Look for the whale icon in your system tray. If it is not there, start Docker Desktop
from the Start menu and wait until the whale stops animating.

**Generate Deck says "API key not set"**
Open your `.env` file and make sure the key is correct with no extra spaces.
Then run `docker compose up --build` again.
