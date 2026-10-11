#!/usr/bin/env python3
# Sharea universal QR generator — `npm run qr -- --url https://your-domain/`
#
# Produces four print-ready files in assets/qr/:
#   qr-plain.svg / qr-plain.png   — black on white, maximum reliability
#   qr-styled.svg / qr-styled.png — brand flat style: navy modules on warm
#                                   off-white, rounded modules, navy finder
#                                   patterns (never gold — scanners need the
#                                   contrast), generous quiet zone
#
# Every PNG is decode-verified with OpenCV before this script exits, so a
# styled variant that scans badly can never ship.
#
# The QR encodes the ONE canonical page URL — one reusable QR for every
# approved location, exactly as the Sharea stand design intends.

import argparse
import os
import sys

import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.colormasks import SolidFillColorMask
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer

NAVY = (0x0F, 0x2A, 0x4A)
OFFWHITE = (0xF7, 0xF2, 0xE7)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)


def make_qr(url: str, box: int, border: int):
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, box_size=box, border=border)
    qr.add_data(url)
    qr.make(fit=True)
    return qr


def plain_png(qr, path: str):
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(path)


def styled_png(qr, path: str):
    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=SolidFillColorMask(back_color=OFFWHITE, front_color=NAVY),
    )
    img.save(path)


def matrix_svg(matrix, dark, light, rounded: bool, path: str):
    """Hand-rolled SVG: exact control over quiet zone, rounded modules."""
    n = len(matrix)
    border = 4
    size = n + border * 2
    r = 0.5 if rounded else 0.0

    def finders():
        # finder pattern tops (for rounded style keep these square-ish but
        # still draw them as normal modules — SolidFillColorMask-free path)
        return [(0, 0), (n - 7, 0), (0, n - 7)]

    def in_finder(x, y):
        for fx, fy in finders():
            if fx - 1 <= x <= fx + 7 and fy - 1 <= y <= fy + 7:
                return True
        return False

    parts = []
    for y in range(n):
        for x in range(n):
            if not matrix[y][x]:
                continue
            px, py = x + border, y + border
            if rounded and not in_finder(x, y):
                parts.append(
                    f'<rect x="{px}" y="{py}" width="1" height="1" rx="{r * 0.62}" ry="{r * 0.62}"/>'
                )
            else:
                parts.append(f'<rect x="{px}" y="{py}" width="1" height="1"/>')

    finder_parts = []
    for fx, fy in finders():
        finder_parts.append(f'<rect x="{fx + border}" y="{fy + border}" width="7" height="7"/>')
        finder_parts.append(
            f'<rect x="{fx + border + 2}" y="{fy + border + 2}" width="3" height="3" fill="{light}"/>'
        )

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" shape-rendering="crispEdges">
  <rect width="{size}" height="{size}" fill="{light}"/>
  <g fill="{dark}">
    {''.join(parts)}
    {''.join(finder_parts)}
  </g>
</svg>
'''
    with open(path, "w") as f:
        f.write(svg)


def decode_check(path: str) -> str:
    import cv2

    img = cv2.imread(path)
    detector = cv2.QRCodeDetector()
    data, _, _ = detector.detectAndDecode(img)
    return data


def main():
    ap = argparse.ArgumentParser(description="Generate the Sharea universal QR code set")
    ap.add_argument("--url", required=True, help="the canonical page URL to encode")
    ap.add_argument("--out", default=None, help="output dir (default: assets/qr)")
    args = ap.parse_args()

    url = args.url.strip()
    if not url.startswith("http"):
        sys.exit("--url must start with http(s)://")

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out = args.out or os.path.join(root, "assets", "qr")
    os.makedirs(out, exist_ok=True)

    qr = make_qr(url, box=16, border=4)

    plain_png(qr, os.path.join(out, "qr-plain.png"))
    styled_png(qr, os.path.join(out, "qr-styled.png"))
    matrix_svg(qr.modules, "#000000", "#FFFFFF", rounded=False, path=os.path.join(out, "qr-plain.svg"))
    matrix_svg(qr.modules, "#0F2A4A", "#F7F2E7", rounded=True, path=os.path.join(out, "qr-styled.svg"))

    print(f"QR set for: {url}")
    for name in ["qr-plain.png", "qr-styled.png", "qr-plain.svg", "qr-styled.svg"]:
        print("  wrote", os.path.join(out, name))

    ok = True
    for name in ["qr-plain.png", "qr-styled.png"]:
        data = decode_check(os.path.join(out, name))
        status = "OK" if data == url else f"MISMATCH (decoded: {data!r})"
        if data != url:
            ok = False
        print(f"  decode {name}: {status}")
    if not ok:
        sys.exit("decode verification failed")


if __name__ == "__main__":
    main()
