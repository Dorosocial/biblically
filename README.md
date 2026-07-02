# biblically

Remotion project for a channel producing vertical (9:16, 1080x1920) videos in two formats:

- **Shorts** — short-form videos, typically a few minutes or under
- **Long-form** — extended videos, commonly 20-30+ minutes

## Structure

```
src/
  shorts/
    <short-slug>/        # e.g. eden-rivers — scene files for that Short
      assets/             # images for that Short
  long-form/
    <video-slug>/         # one folder per long-form video (add as needed)
  shared/
    constants.ts          # VIDEO_WIDTH / VIDEO_HEIGHT / FPS shared by all compositions
  Root.tsx                 # registers every Composition
  index.ts                 # Remotion entry point
```

Each video (Short or long-form) gets its own folder so the project stays organized as the
channel grows. Reusable logic (e.g. image processing helpers) belongs in `src/shared/`.

## Commands

- `npm run dev` — open Remotion Studio
- `npm run render -- <composition-id> out/<file>.mp4` — render a composition
- `npm run lint` — type-check the project
