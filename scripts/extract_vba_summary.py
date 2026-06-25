from __future__ import annotations

import re
import sys
import zipfile
from pathlib import Path

from analyze_excel import CompoundFile, TEXT_RE, decode_vba_text, decompress_vba, parse_vba_dir


IMPORTANT_RE = re.compile(
    r"\b(Sub|Function|End Sub|Shell|Range|Cells|MsgBox|Workbooks|Worksheets|Sheets|"
    r"Copy|Paste|SaveAs|Print|Kill|CreateObject|InputBox|For |If |Open |Close |FileCopy)\b",
    re.I,
)


def redact(line: str) -> str:
    line = TEXT_RE.sub('"TEXT"', line)
    line = re.sub(r"\b\d{2,}\b", "N", line)
    return line[:220]


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    workbook = Path("COMMANDE_MATIERE.xlsm")
    binary = zipfile.ZipFile(workbook).read("xl/vbaProject.bin")
    cfb = CompoundFile(binary)
    paths = cfb.list_paths()
    modules = parse_vba_dir(decompress_vba(cfb.stream(paths["VBA/dir"])))
    for module in modules:
        stream_name = module.get("stream")
        if not stream_name or f"VBA/{stream_name}" not in paths:
            continue
        entry = paths[f"VBA/{stream_name}"]
        raw = cfb.stream(entry)
        text = decode_vba_text(decompress_vba(raw[int(module.get("offset") or 0) :]))
        if not IMPORTANT_RE.search(text):
            continue
        print(f"\n### VBA/{stream_name} ({module.get('module_type')})")
        picked = []
        for i, line in enumerate(text.splitlines(), 1):
            if IMPORTANT_RE.search(line):
                picked.append(f"{i:04d}: {redact(line)}")
        print("\n".join(picked[:260]))


if __name__ == "__main__":
    main()
