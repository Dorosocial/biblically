import { Config } from "@remotion/cli/config";
import path from "path";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setPublicDir(
  path.join(
    process.cwd(),
    "src/long-form/worst-eras/segment-1-cold-open",
  ),
);
