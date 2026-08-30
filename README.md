# Wedding invitation frontend

## Regular local development

```sh
npm install
npm run dev
```

Open `http://localhost:5173/wedding-site/`. The gallery route is `http://localhost:5173/wedding-site/#/gallery`, but real authentication and media operations require the deployed API configured through `VITE_WEDDING_API_URL`.

## Full gallery demo without AWS

Run the dedicated development mode:

```sh
npm install
npm run dev:gallery
```

Then open:

```text
http://localhost:5173/wedding-site/#/gallery
```

This mode:

- Opens the authenticated gallery without a QR secret.
- Shows representative local sample media.
- Uses a phone-gallery layout with an edge-to-edge media grid, a full-screen viewer, and an upload bottom sheet. At eight or more upload groups, the grid becomes a subtle non-overlapping collage where most tiles remain small.
- Supports multi-select, square previews, mobile removal controls, and desktop drag-and-drop.
- Converts iPhone HEIC/HEIF photos to JPEG locally before previewing or uploading them. Conversion runs one photo at a time to limit phone memory usage.
- Simulates parallel file-upload progress, processing polling, and automatic publication.
- Keeps files selected in one submission together as one grouped tile; opening it shows a swipeable full-screen viewer with one shared guest name and message.
- Keeps uploaded files only in browser memory; refreshing resets them.
- Does not call API Gateway, S3, DynamoDB, Lambda, or MediaConvert.
- Is guarded by both Vite development mode and `VITE_GALLERY_DEMO_MODE=true`, so it cannot activate in a normal production build.

The committed `.env.gallery-demo` contains only non-secret local settings. Never add an invite secret to a `VITE_` variable because Vite exposes those values to browser code.

## Test the gallery from a phone on the local network

Connect the computer and phone to the same Wi-Fi network. Generate a QR code for the computer's current private IPv4 address:

```sh
npm run qr:gallery:network
```

The command creates `gallery-phone-qr.png` in this repository and prints the encoded URL. Start the gallery demo on all local network interfaces:

```sh
npm run dev:gallery:network
```

Keep that terminal open, display `gallery-phone-qr.png` on the computer, and scan it with the phone camera. If macOS asks whether Node or the terminal may accept incoming connections, choose **Allow**.

The phone test remains entirely local and does not use AWS. Uploads exist only in the browser memory of the device that uploaded them, so demo uploads made on the computer and phone are not shared with each other.

On an iPhone, test at least one photo taken with **Settings → Camera → Formats → High Efficiency**. The upload sheet should briefly show “Preparando fotos del iPhone…”, then display a `.jpg` preview ready to share.

If automatic address detection chooses the wrong adapter, override it without changing tracked files:

```sh
GALLERY_PHONE_HOST=192.168.0.17 npm run qr:gallery:network
```

If the page does not open, verify that both devices use the same Wi-Fi, temporarily disconnect VPN software, and check that the Wi-Fi network does not isolate connected devices.
