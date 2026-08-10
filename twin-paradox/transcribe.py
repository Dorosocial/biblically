import os
import whisper
import json

model = whisper.load_model("base.en")
result = model.transcribe("narration-source.mp3", word_timestamps=True, verbose=False)

out = {
    "text": result["text"],
    "segments": []
}
for seg in result["segments"]:
    out["segments"].append({
        "id": seg["id"],
        "start": seg["start"],
        "end": seg["end"],
        "text": seg["text"],
        "words": [{"word": w["word"], "start": w["start"], "end": w["end"]} for w in seg.get("words", [])]
    })

with open("transcript.json", "w") as f:
    json.dump(out, f, indent=2)

print("DONE")
print("Total segments:", len(out["segments"]))
