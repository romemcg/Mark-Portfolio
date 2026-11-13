"""Builds public/Mark-Gomez-One-Pager.pdf (landscape A4) from content/data.ts, after the Zero Gate one-page deck structure.
Usage: node --experimental-strip-types --no-warnings tools/export-onepager-data.mjs > /tmp/onepager-data.json
       python3 tools/build-onepager.py /tmp/onepager-data.json public/Mark-Gomez-One-Pager.pdf public/img/mark-card.webp
Requires: pip install reportlab pillow
"""
import json, sys, io
from PIL import Image
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Frame
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT

E = lambda t: t.replace("&", "&amp;")
d = json.load(open(sys.argv[1])); out = sys.argv[2]; photo = sys.argv[3]
r = d["recruiter"]; site = d["site"]
NAVY, BLUE, SKY, INK, SOFT, LINE = HexColor("#0A162E"), HexColor("#2563EB"), HexColor("#93C5FD"), HexColor("#0A162E"), HexColor("#5B6B82"), HexColor("#D5DCEA")
W, H = landscape(A4); M = 30
c = canvas.Canvas(out, pagesize=(W, H))
c.setTitle("Mark Jerome Gomez | Professional One-Pager"); c.setAuthor("Mark Jerome Gomez"); c.setSubject(r["headline"])
domain = site["url"].replace("https://", "")

def S(name, **k):
    base = dict(fontName="Helvetica", fontSize=9, leading=12, textColor=INK, alignment=TA_LEFT); base.update(k); return ParagraphStyle(name, **base)
body = S("b"); bul = S("bl", leftIndent=9, bulletIndent=0, spaceAfter=2.6)

# header band
bandH = 84
c.setFillColor(NAVY); c.rect(0, H - bandH, W, bandH, stroke=0, fill=1)
c.setFillColor(BLUE); c.rect(0, H - bandH - 2.5, W, 2.5, stroke=0, fill=1)
im = Image.open(photo).convert("RGB"); buf = io.BytesIO(); im.save(buf, "PNG"); buf.seek(0)
ps = 58; px, py = M, H - bandH + (bandH - ps) / 2
c.saveState(); p = c.beginPath(); p.circle(px + ps / 2, py + ps / 2, ps / 2); c.clipPath(p, stroke=0, fill=0)
c.drawImage(ImageReader(buf), px, py, ps, ps); c.restoreState()
c.setStrokeColor(SKY); c.setLineWidth(1.2); c.circle(px + ps / 2, py + ps / 2, ps / 2, stroke=1, fill=0)
tx = M + ps + 16
c.setFillColor(white); c.setFont("Helvetica-Bold", 22); c.drawString(tx, H - 36, r["name"])
c.setFillColor(SKY); c.setFont("Helvetica-Bold", 10.5); c.drawString(tx, H - 52, r["headline"])
c.setFillColor(white); c.setFont("Helvetica", 8); c.drawString(tx, H - 66, r["domains"].replace("·", "  ·  "))
x = W - M
for t, link in reversed([("mjerome.gomez@gmail.com", "mailto:mjerome.gomez@gmail.com"), ("linkedin.com/in/romemcg", "https://www.linkedin.com/in/romemcg"), (domain, site["url"])]):
    c.setFont("Helvetica", 8); w = c.stringWidth(t, "Helvetica", 8); c.drawRightString(x, H - 36 if t.startswith("mjerome") else (H - 50 if t.startswith("linkedin") else H - 64), t)
    c.linkURL(link, (x - w, (H - 38 if t.startswith("mjerome") else (H - 52 if t.startswith("linkedin") else H - 66)), x, (H - 30 if t.startswith("mjerome") else (H - 44 if t.startswith("linkedin") else H - 58))), relative=0)

top = H - bandH - 16
LW = 300; RX = M + LW + 22; RW = W - M - RX
c.setStrokeColor(LINE); c.setLineWidth(.8); c.line(M + LW + 11, top, M + LW + 11, 44)

def section(x, y, w, title, flow):
    c.setFillColor(BLUE); c.rect(x, y - 7, 5, 5, stroke=0, fill=1)
    c.setFont("Helvetica-Bold", 9.4); c.drawString(x + 11, y - 8, title)
    c.setStrokeColor(LINE); c.line(x, y - 12, x + w, y - 12)
    hh = sum(p.wrap(w, 900)[1] + p.style.spaceAfter for p in flow)
    Frame(x, y - 16 - hh, w, hh + 1, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0).addFromList(flow, c)
    return y - 16 - hh - 10

y = top
y = section(M, y, LW, "Profile summary", [Paragraph(f"<b>{E(p['who'])}:</b> {E(p['what'])}", bul, bulletText="•") for p in r["profile"]])
y = section(M, y, LW, "Education and certifications", [Paragraph(E(t), bul, bulletText="•") for t in r["keyCreds"]])
emp = [Paragraph(E(t), bul, bulletText="•") for t in r["employers"]] + [Paragraph(E(r["independent"]), S("ind", fontSize=8.3, leading=11, textColor=SOFT, leftIndent=9, spaceAfter=2.6), bulletText="•")]
y = section(M, y, LW, "Former employers and experience", emp)
y = section(M, y, LW, "Experience working in UAE and KSA", [Paragraph(E(t), bul, bulletText="•") for t in r["gulf"]])
print("left bottom", y)

y = top
c.setFillColor(BLUE); c.rect(RX, y - 7, 5, 5, stroke=0, fill=1); c.setFont("Helvetica-Bold", 9.4); c.drawString(RX + 11, y - 8, "Selected projects")
c.setStrokeColor(LINE); c.line(RX, y - 12, RX + RW, y - 12); y -= 22
for pr in r["projects"]:
    head = Paragraph(f"<b>{E(pr['name'])}</b> <font color='#2563EB' size='6.8'>&nbsp;{E(pr['org']).upper()} · {E(pr['status']).upper()}</font>", S("ph", fontSize=10, leading=12.6, spaceAfter=2))
    txt = Paragraph(E(pr["what"]), S("pt", fontSize=9, leading=12, textColor=SOFT))
    hh = head.wrap(RW - 10, 100)[1] + 1.5 + txt.wrap(RW - 10, 100)[1]
    c.setFillColor(BLUE); c.rect(RX, y - hh, 2.2, hh, stroke=0, fill=1)
    Frame(RX + 10, y - hh - 1, RW - 10, hh + 2, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0).addFromList([head, txt], c)
    y -= hh + 14
print("right bottom", y)
# impact strip
tiles = r["impact"]; tg = 8; tw = (W - 2 * M - tg * (len(tiles) - 1)) / len(tiles); th = 50; ty = 52
c.setFillColor(BLUE); c.setFont("Helvetica-Bold", 8); c.drawString(M, ty + th + 6, "SELECTED BUSINESS IMPACT")
c.setFillColor(SOFT); c.setFont("Helvetica", 6.6); c.drawRightString(W - M, ty + th + 6, "~ marks approximate estimates, delivered with cross functional teams and vendors")
for i, o in enumerate(tiles):
    x0 = M + i * (tw + tg)
    c.setFillColor(HexColor("#F2F5FB")); c.setStrokeColor(LINE); c.roundRect(x0, ty, tw, th, 4, stroke=1, fill=1)
    c.setFillColor(BLUE); c.rect(x0, ty + th - 2.5, tw, 2.5, stroke=0, fill=1)
    c.setFont("Helvetica-Bold", 15); c.drawString(x0 + 8, ty + th - 21, o["value"])
    pl = Paragraph(E(o["label"]), S("tl", fontSize=6.8, leading=8))
    w_, h_ = pl.wrap(tw - 16, 30); pl.drawOn(c, x0 + 8, ty + th - 24 - h_)
    c.setFillColor(SOFT); c.setFont("Helvetica-Bold", 5.8); c.drawString(x0 + 8, ty + 4, o["where"].upper())
print("tiles top", ty + th + 14)
c.setStrokeColor(LINE); c.line(M, 38, W - M, 38)
c.setFillColor(SOFT); c.setFont("Helvetica", 7); c.drawString(M, 26, f"Delivered, assessed, proposed and POC work is labelled as such. Full details in the CV and at {domain}")
c.drawRightString(W - M, 26, f"{r['name']}  ·  {r['headline']}")
c.save()
