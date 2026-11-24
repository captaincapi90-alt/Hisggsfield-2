# HIGGSFIELD 2.0 — first working foundation

This is a phone-friendly, installable web app prototype. It provides one chat interface, local conversation history, simple intent routing, prompt planning for image/video tasks, and user-controlled memory stored in the browser on that device.

## Important capability boundary

This build is a real working **local interface and cognitive-workflow prototype**, not a human-level AI model. It does not train itself, render images, or generate videos yet. Image/video replies are structured briefs and prompts. Actual media generation requires connecting a compatible model runtime or inference API. Large image/video diffusion models still need substantial compute, usually a GPU. No software trick can remove that requirement.

## Run on Android — easiest route using GitHub Pages

1. Download and extract `higgsfield-2.zip` on your phone (Files or ZArchiver).
2. Sign in to GitHub in Chrome and create a new public repository named `higgsfield-2`.
3. In the repository, choose **Add file → Upload files**.
4. Upload all files from the extracted folder (not the ZIP itself). Upload `index.html`, `style.css`, `app.js`, `manifest.webmanifest`, `sw.js`, and `README.md`.
5. Commit the upload to the `main` branch.
6. Open repository **Settings → Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**.
8. Select branch `main`, folder `/(root)`, then **Save**.
9. Wait for GitHub Pages to publish. Open the Pages URL shown in Settings → Pages.
10. In Chrome, open the site menu (⋮) and choose **Add to Home screen** or **Install app**.

## Alternative: run locally with Termux

1. Install Termux from its official F-Droid or GitHub distribution.
2. Open Termux and run:
   ```sh
   pkg update -y
   pkg install python -y
   ```
3. Put the extracted `higgsfield-2` folder in shared storage, then run:
   ```sh
   termux-setup-storage
   cd ~/storage/shared/Download/higgsfield-2
   python -m http.server 8080
   ```
   Adjust the folder path if you extracted it elsewhere.
4. Open Chrome and visit `http://127.0.0.1:8080`.

## Using it

- Type normally to chat.
- Choose Auto, Image, Video, or Chat in the selector.
- Say `Remember that Aria has long chestnut-brown hair` to save a fact locally.
- Ask `What do you remember?` to retrieve saved facts.
- Attach an image/video reference with the + button. This build previews the file locally; it does not yet run visual understanding.
- Ask for an image or video concept to receive a structured creation brief.

## Privacy and storage

Memory and chat history are stored in the browser's local storage on this device. Clearing browser site data may erase them. Do not use this prototype to store passwords or sensitive information.

## Next engineering stage

To add actual model intelligence, connect:
- a compact language model for general conversation and reasoning;
- a vision-language model for image/video understanding;
- an image generation runtime;
- a video generation runtime;
- a backend job queue for long-running generation.

The model adapters should be optional and replaceable. Keep the local memory and interface usable when no model endpoint is configured.
