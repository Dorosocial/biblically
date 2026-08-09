"""
fix_hdri_rotation.py
Inserts a Mapping node between Texture Coordinate and the Environment
Texture in the World shader, so the HDRI can be rotated. Needed because the
RotatingCamera sweeps through all azimuth angles as the rig rotates (that's
the point of a rotating reference frame), so it will eventually face
whatever direction has the least favorable HDRI content - confirmed by
comparing renders at frame 1 (clean) vs frame 736 (a dark patch enters
frame from a rotation-swept direction). Rotating the whole environment
around Z moves that dark region to an azimuth none of these floor-level
shots ever look toward.

Run headless:
  blender --background rotating_rod/scene.blend --python rotating_rod/fix_hdri_rotation.py -- \
      --output rotating_rod/scene.blend --z-rotation-deg 120
"""

import bpy
import sys
import math


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    args = {"output": None, "z_rotation_deg": "0"}
    i = 0
    while i < len(argv):
        key = argv[i].lstrip("-").replace("-", "_")
        if key in args and i + 1 < len(argv):
            args[key] = argv[i + 1]
            i += 2
        else:
            i += 1
    return args


ARGS = parse_args()


def main():
    world = bpy.context.scene.world
    nodes = world.node_tree.nodes
    links = world.node_tree.links

    env_tex = nodes.get("Environment Texture")
    if env_tex is None:
        raise SystemExit("ERROR: no 'Environment Texture' node found in the World shader")

    mapping = nodes.get("HDRI_Mapping")
    if mapping is None:
        mapping = nodes.new("ShaderNodeMapping")
        mapping.name = "HDRI_Mapping"
        mapping.location = (env_tex.location.x - 300, env_tex.location.y)
        tex_coord = nodes.get("Texture Coordinate")
        if tex_coord is None:
            tex_coord = nodes.new("ShaderNodeTexCoord")
            tex_coord.location = (mapping.location.x - 300, mapping.location.y)
        links.new(tex_coord.outputs["Generated"], mapping.inputs["Vector"])
        links.new(mapping.outputs["Vector"], env_tex.inputs["Vector"])

    mapping.inputs["Rotation"].default_value[2] = math.radians(float(ARGS["z_rotation_deg"]))

    print(f"HDRI Z rotation set to {ARGS['z_rotation_deg']} degrees")

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()
