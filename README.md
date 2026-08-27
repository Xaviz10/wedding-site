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
- Simulates parallel file-upload progress, processing polling, and automatic publication.
- Keeps files selected in one submission together as one grouped tile; opening it shows a swipeable full-screen viewer with one shared guest name and message.
- Keeps uploaded files only in browser memory; refreshing resets them.
- Does not call API Gateway, S3, DynamoDB, Lambda, or MediaConvert.
- Is guarded by both Vite development mode and `VITE_GALLERY_DEMO_MODE=true`, so it cannot activate in a normal production build.

The committed `.env.gallery-demo` contains only non-secret local settings. Never add an invite secret to a `VITE_` variable because Vite exposes those values to browser code.
