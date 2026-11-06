#!/usr/bin/env python3
"""p0_v3_env_docs_check.py — jeLajaH P0 environment inventory + repository documentation QA.

Produces JSON evidence with:
  1. Sandbox environment inventory (OS, Node, adb/Android SDK presence, Playwright cache).
  2. Documentation QA over the jeLajaH repo: relative-link integrity, placeholder scan.
Run with --phase pre  (before doc updates)  or  --phase post (after doc updates).
"""
import datetime
import json
import os
import platform
import re
import subprocess
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../.."))
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

PHASE = sys.argv[1] if len(sys.argv) > 1 else "pre"

def sh(cmd):
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        return r.stdout.strip() if r.returncode == 0 else None
    except Exception:
        return None

def env_inventory():
    pw_cache = os.path.expanduser("~/.cache/ms-playwright")
    return {
        "timestamp": datetime.datetime.now().isoformat(timespec="seconds"),
        "platform": platform.platform(),
        "kernel": sh(["uname", "-r"]),
        "os": sh(["cat", "/etc/os-release"]).split("\n")[0] if sh(["cat", "/etc/os-release"]) else None,
        "python": platform.python_version(),
        "node": sh(["node", "--version"]),
        "npm": sh(["npm", "--version"]),
        "adb_on_path": sh(["which", "adb"]),
        "ANDROID_HOME": os.environ.get("ANDROID_HOME") or None,
        "ANDROID_SDK_ROOT": os.environ.get("ANDROID_SDK_ROOT") or None,
        "android_device_or_emulator": "none (no adb, no SDK, no emulator)",
        "playwright_browser_cache": sorted(os.listdir(pw_cache)) if os.path.isdir(pw_cache) else None,
    }

PLACEHOLDER_PATTERNS = ["to be filled", "TODO", "TBD", "XXX", "lorem ipsum", "待补充"]
LINK_RE = re.compile(r"\[[^\]]*\]\(([^)]+)\)")

def docs_qa():
    md_files = []
    for root, dirs, files in os.walk(REPO):
        dirs[:] = [d for d in dirs if d not in (".git", "node_modules")]
        for f in files:
            if f.endswith(".md"):
                md_files.append(os.path.join(root, f))
    md_files.sort()

    broken_links = []
    external_links = []
    placeholders = []
    checked_links = 0

    for path in md_files:
        rel = os.path.relpath(path, REPO)
        with open(path, encoding="utf-8") as fh:
            text = fh.read()
        low = text.lower()
        for pat in PLACEHOLDER_PATTERNS:
            n = low.count(pat.lower())
            if n:
                placeholders.append({"file": rel, "pattern": pat, "count": n})
        for m in LINK_RE.finditer(text):
            target = m.group(1).strip()
            if target.startswith(("http://", "https://", "mailto:")):
                external_links.append({"file": rel, "target": target})
                continue
            path_part = target.split("#")[0]
            if not path_part:
                continue
            resolved = os.path.normpath(os.path.join(os.path.dirname(path), path_part))
            checked_links += 1
            if not os.path.exists(resolved):
                broken_links.append({"file": rel, "target": target})

    return {
        "markdown_files": [os.path.relpath(p, REPO) for p in md_files],
        "relative_links_checked": checked_links,
        "broken_relative_links": broken_links,
        "external_links_count": len(external_links),
        "external_links": external_links,
        "placeholders_found": placeholders,
    }

def main():
    result = {
        "phase": PHASE,
        "experiment": "jeLajaH sandbox environment inventory + documentation QA",
        "environment": env_inventory(),
        "docs_qa": docs_qa(),
    }
    out_path = os.path.join(OUT, f"p0_v3_result_{PHASE}.json")
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(result, fh, indent=2, ensure_ascii=False)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    # Exit code signals doc QA failure (broken links or placeholders)
    bad = result["docs_qa"]["broken_relative_links"] or result["docs_qa"]["placeholders_found"]
    sys.exit(1 if bad and PHASE == "post" else 0)

if __name__ == "__main__":
    main()
