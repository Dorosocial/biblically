# Audio assets

Preserved from the working session's scratchpad (which is ephemeral and
had already survived one unplanned container restart) before they could
be lost. These came from earlier in this conversation; the specific
shot-by-shot audio cues they were picked for are not recorded anywhere
in this repo (see `../README.md`) - filenames and durations below are
what's actually verifiable, everything else is a guess and marked as such.

| File | Duration | Format | Likely purpose (guess from filename) |
|---|---|---|---|
| `8f8241d5-aballrotating.mp3` | 57.3s | mono, 128kbps, 44.1kHz | **Flagged for attention**: longer than the 36s video and the only mono/lower-bitrate file here, unlike every SFX below (stereo, 48kHz) - the naming and format both suggest this may be narration/voiceover rather than a sound effect, but that's unconfirmed. If this is VO, its pacing likely determines the real shot timing and should be checked before building any shot content. |
| `26725b75-whoosh_fast_11786274753897.mp3` | 3.0s | stereo, 192kbps, 48kHz | Fast whoosh transition |
| `b30f252b-Whooshfast.mp3` | 3.0s | stereo, 192kbps, 48kHz | **Byte-identical to the file above** (same MD5) - duplicate, not a second distinct sound |
| `76620494-whoosh_transition_sw_11786275978826.mp3` | 1.0s | stereo, 192kbps, 48kHz | Whoosh transition (short) |
| `c3471221-soft_whoosh_reset_11786276050789.mp3` | 1.0s | stereo, 192kbps, 48kHz | Soft whoosh, "reset" - maybe cueing a shot/loop restart |
| `3aeefebf-snaprelease.mp3` | 1.0s | stereo, 192kbps, 48kHz | A "snap" release sound - maybe the rod letting go / straightening out |
| `776c8a82-Risertension.mp3` | 1.0s | stereo, 192kbps, 48kHz | Rising tension sting, likely a build-up cue |
| `b64f616d-scifi_blip_21786275317993.mp3` | 2.0s | stereo, 192kbps, 48kHz | Sci-fi blip - maybe a graphic/label appearing |
| `d69e90c2-deep_thud_impact_11786275889683.mp3` | 2.0s | stereo, 192kbps, 48kHz | Deep impact thud |
| `f064bc3b-soft_pop_21786275752781.mp3` | 2.0s | stereo, 192kbps, 48kHz | Soft pop |
| `c974b909-camera_shutter_click.mp3` | 1.5s | stereo, 192kbps, 48kHz | Camera shutter click - maybe a freeze-frame/snapshot cue |

None of these are wired into the Blender timeline or any edit yet - they're
just preserved here, uncommitted-to-a-purpose, until the real shot list is
available to place them correctly.
