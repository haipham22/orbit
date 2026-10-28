#!/usr/bin/env python3
"""orbit theme.json — export / import / validate (round 3 tool).

Format contract: handoff/THEME-FORMAT.md. Token list stays CLOSED (PACKAGE-SPEC §2);
import refuses themes that break minimal AA pairs.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

SCHEMA = "orbit-theme-1"
AA_PAIRS = [("color.text", "color.bg"), ("color.text-muted", "color.surface"),
            ("color.on-primary", "color.primary"), ("color.danger", "color.bg"),
            ("color.accent-fg", "color.accent")]
ALIASES = [("color.accent", "color.primary"), ("color.accent-fg", "color.on-primary")]
HEX_RE = re.compile(r"^#[0-9a-fA-F]{6}$")


def flatten(tokens: dict) -> dict:
    flat: dict[str, str] = {}

    def walk(node, trail):
        if isinstance(node, dict):
            if "$value" in node and not isinstance(node["$value"], (dict, list)):
                flat[".".join(trail)] = str(node["$value"])
                return
            for key, value in node.items():
                if str(key).startswith(("$", "_")):
                    continue
                walk(value, trail + [str(key)])
        elif isinstance(node, str):
            flat[".".join(trail)] = node

    walk(tokens, [])
    return flat


def unflatten(base: dict, dot_keys: dict) -> dict:
    out = json.loads(json.dumps(base))  # deep copy
    for key, value in dot_keys.items():
        node = out
        parts = key.split(".")
        for part in parts[:-1]:
            node = node.setdefault(part, {})
        leaf = parts[-1]
        # preserve the {"$value": …} leaf shape of tokens.json
        if isinstance(node.get(leaf), dict) and "$value" in node[leaf]:
            node[leaf]["$value"] = value
        else:
            node[leaf] = value
    return out


def lum(hexcolor: str) -> float:
    h = hexcolor.lstrip("#")
    chan = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        chan.append(c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2]


def contrast(a: str, b: str) -> float:
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def load_theme(path: Path) -> dict:
    theme = json.loads(path.read_text(encoding="utf-8"))
    if theme.get("$schema") != SCHEMA:
        sys.exit(f"✗ {path}: $schema phải là {SCHEMA}")
    if not isinstance(theme.get("tokens"), dict) or not theme["tokens"]:
        sys.exit(f"✗ {path}: thiếu tokens (map key → giá trị)")
    return theme


def cmd_export(args) -> int:
    tokens = json.loads(Path(args.tokens).read_text(encoding="utf-8"))
    flat = flatten(tokens)
    theme = {
        "$schema": SCHEMA,
        "name": args.name or Path(args.tokens).parent.name,
        "basedOn": Path(args.tokens).parent.name,
        "tokens": {k: v for k, v in sorted(flat.items()) if not k.startswith("$")},
    }
    Path(args.out).write_text(json.dumps(theme, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"✓ export {len(theme['tokens'])} token → {args.out}")
    return 0


def cmd_validate(args) -> int:
    theme = load_theme(Path(args.theme))
    bad = [k for k, v in theme["tokens"].items()
           if k.startswith("color.") and not HEX_RE.match(str(v))]
    if bad:
        sys.exit(f"✗ màu không phải hex #rrggbb: {', '.join(bad)}")
    print(f"✓ {args.theme}: format hợp lệ ({len(theme['tokens'])} token)")
    return 0


def cmd_import(args) -> int:
    theme = load_theme(Path(args.theme))
    base_dir = Path(args.pkg)
    base = json.loads((base_dir / "tokens.json").read_text(encoding="utf-8"))
    flat = flatten(base)
    unknown = [k for k in theme["tokens"] if k not in flat]
    if unknown:
        sys.exit("✗ token không tồn tại trong gói nền (danh sách đóng): " + ", ".join(unknown))
    bad = [k for k, v in theme["tokens"].items()
           if k.startswith("color.") and not HEX_RE.match(str(v))]
    if bad:
        sys.exit("✗ màu không phải hex #rrggbb: " + ", ".join(bad))
    overrides = {k: str(v) for k, v in theme["tokens"].items()}
    merged_flat = dict(flat)
    merged_flat.update(overrides)
    # accent/on-primary là alias của primary/on-primary (PACKAGE-SPEC §2) — lệch giá
    # trị thì primary theo accent (accent là slot user chạm), thiếu bên kia thì đồng bộ.
    for alias, target in ALIASES:
        if alias in merged_flat and target in merged_flat and merged_flat[alias] != merged_flat[target]:
            merged_flat[target] = merged_flat[alias]
        elif alias in overrides and target not in overrides:
            merged_flat[target] = merged_flat[alias]
    fails = []
    for fg_key, bg_key in AA_PAIRS:
        if fg_key in merged_flat and bg_key in merged_flat:
            if contrast(merged_flat[fg_key], merged_flat[bg_key]) < 4.5:
                fails.append(f"{fg_key}/{bg_key}")
    if fails:
        sys.exit("✗ theme làm rớt AA (≥4.5): " + ", ".join(fails))
    merged = unflatten(base, merged_flat)
    meta = merged.get("$meta", {})
    meta["basedOn"] = theme.get("basedOn")
    meta["theme"] = {"name": theme.get("name"), "applied": True}
    merged["$meta"] = meta
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / "tokens.json").write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"✓ import {len(theme['tokens'])} token → {out / 'tokens.json'} (AA xanh)")
    return 0


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    sub = ap.add_subparsers(required=True)
    e = sub.add_parser("export")
    e.add_argument("tokens")
    e.add_argument("-o", "--out", dest="out", required=True)
    e.add_argument("--name")
    e.set_defaults(fn=cmd_export)
    v = sub.add_parser("validate")
    v.add_argument("theme")
    v.set_defaults(fn=cmd_validate)
    i = sub.add_parser("import")
    i.add_argument("theme")
    i.add_argument("pkg")
    i.add_argument("-o", "--out", dest="out", required=True)
    i.set_defaults(fn=cmd_import)
    args = ap.parse_args(argv)
    return args.fn(args)


if __name__ == "__main__":
    raise SystemExit(main())
