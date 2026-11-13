"""Builds public/Mark-Gomez-One-Pager.pdf from content/data.ts (single source of truth).
Usage: node --experimental-strip-types --no-warnings tools/export-onepager-data.mjs > /tmp/onepager-data.json
       python3 tools/build-onepager.py /tmp/onepager-data.json public/Mark-Gomez-One-Pager.pdf
Requires: pip install reportlab
"""
import json, sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Frame, Spacer, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT

E = lambda t: t.replace("&", "&amp;")
d = json.load(open(sys.argv[1])); out = sys.argv[2]
r = d["recruiter"]; site = d["site"]
NAVY, BLUE, SKY, INK, SOFT, TINT = HexColor("#0A162E"), HexColor("#2563EB"), HexColor("#93C5FD"), HexColor("#0A162E"), HexColor("#5B6B82"), HexColor("#F2F5FB")
W, H = A4; M = 34
c = canvas.Canvas(out, pagesize=A4)
c.setTitle("Mark Jerome Gomez | Professional One-Pager"); c.setAuthor("Mark Jerome Gomez"); c.setSubject(r["headline"])
domain = site["url"].replace("https://", "")

def S(name, **k):
    base = dict(fontName="Helvetica", fontSize=8, leading=10.6, textColor=INK, alignment=TA_LEFT)
    base.update(k); return ParagraphStyle(name, **base)
body, small = S("b"), S("s", fontSize=7.2, leading=9.4, textColor=SOFT)
h2 = S("h2", fontName="Helvetica-Bold", fontSize=7.6, leading=10, textColor=BLUE, spaceBefore=0, spaceAfter=2)
h3 = S("h3", fontName="Helvetica-Bold", fontSize=8, leading=10.4)
bul = S("bl", fontSize=7.6, leading=9.8, leftIndent=8, bulletIndent=0)

# header band
bandH = 92
c.setFillColor(NAVY); c.rect(0, H - bandH, W, bandH, stroke=0, fill=1)
c.setFillColor(BLUE); c.rect(0, H - bandH - 2.5, W, 2.5, stroke=0, fill=1)
c.setFillColor(white); c.setFont("Helvetica-Bold", 23); c.drawString(M, H - 34, r["name"])
c.setFillColor(SKY); c.setFont("Helvetica-Bold", 10.5); c.drawString(M, H - 50, r["headline"])
c.setFillColor(white); c.setFont("Helvetica", 8.2); c.drawString(M, H - 63, r["domains"].replace("·", "  ·  "))
items = [("mjerome.gomez@gmail.com", "mailto:mjerome.gomez@gmail.com"), ("linkedin.com/in/romemcg", "https://www.linkedin.com/in/romemcg"), (domain, site["url"]), ("Dubai, UAE", None)]
x = M
for t, link in items:
    c.setFont("Helvetica", 7.8); c.drawString(x, H - 82, t); w = c.stringWidth(t, "Helvetica", 7.8)
    if link: c.linkURL(link, (x, H - 85, x + w, H - 76), relative=0)
    x += w + 16

top = H - bandH - 14
LW = 330; gap = 20; RX = M + LW + gap; RW = W - M - RX
def frame(x, y, w, h, flow):
    f = Frame(x, y, w, h, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0, showBoundary=0)
    f.addFromList(flow, c)
    if flow: print("WARNING: overflow", flow[0].getPlainText()[:40] if hasattr(flow[0], "getPlainText") else "")

positioning = ("Product owner and engineer who turns operator and business needs into shippable connected platforms. Combines product ownership, "
               "electronics engineering and enterprise technology across AI, IoT, smart city and digital twin solutions, delivered with multiple vendors in the UAE and the Philippines.")
# left column: positioning
flow = [Paragraph("POSITIONING", h2), Paragraph(positioning, body)]
frame(M, top - 56, LW, 56, flow)

# impact tiles 3x2
ty = top - 70; tw = (LW - 12) / 3; th = 46
c.setFillColor(BLUE); c.setFont("Helvetica-Bold", 7.6); c.drawString(M, top - 64, "SELECTED BUSINESS IMPACT")
for i, o in enumerate(r["impact"]):
    col, row = i % 3, i // 3
    x0 = M + col * (tw + 6); y0 = top - 74 - th - row * (th + 6)
    c.setFillColor(TINT); c.setStrokeColor(HexColor("#D5DCEA")); c.roundRect(x0, y0, tw, th, 4, stroke=1, fill=1)
    c.setFillColor(BLUE); c.setFont("Helvetica-Bold", 14.5); c.drawString(x0 + 7, y0 + th - 18, o["value"])
    st = S("t", fontSize=6.6, leading=7.8)
    p = Paragraph(o["label"], st); w_, h_ = p.wrap(tw - 14, 20); p.drawOn(c, x0 + 7, y0 + th - 20 - h_)
    c.setFillColor(SOFT); c.setFont("Helvetica-Bold", 5.6); c.drawString(x0 + 7, y0 + 4, o["where"].upper())
ny = top - 74 - 2 * th - 6 - 12
frame(M, ny - 14, LW, 20, [Paragraph(r["impactNote"], small)])

# experience
ey = ny - 26
c.setFillColor(BLUE); c.setFont("Helvetica-Bold", 7.6); c.drawString(M, ey, "EXPERIENCE")
c.setStrokeColor(HexColor("#D5DCEA")); c.line(M, ey - 3, M + LW, ey - 3)
y = ey - 14
short = {"terminus": 0, "aldar": 0, "disruptx": 0, "samsung": None}
for ro in d["roles"]:
    key = ro["id"]; bl = r["experience"].get(key, [])
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 8.6); c.drawString(M, y, ro["company"].replace(" PJSC", "").replace(" (Philippines)", ""))
    c.setFillColor(BLUE); c.setFont("Helvetica-Bold", 7); c.drawRightString(M + LW, y, ro["dates"].replace(" to ", " to "))
    c.setFillColor(SOFT); c.setFont("Helvetica-Oblique", 7.6); c.drawString(M, y - 10, ro["title"])
    fl = [Paragraph(E(t), S("e", fontSize=7.6, leading=9.8, spaceAfter=1.5)) for t in bl]
    hh = sum(p.wrap(LW, 500)[1] + 1.5 for p in fl)
    frame(M, y - 14 - hh, LW, hh + 1, fl)
    y = y - 14 - hh - 10

# right column
ry = top
fl = [Paragraph("CORE CAPABILITIES", h2)]
for g in r["strengths"]:
    fl += [Paragraph(g["group"], h3), Paragraph(E(" · ".join(g["items"])), S("g", fontSize=7.4, leading=9.4, textColor=SOFT, spaceAfter=3))]
hh = sum(p.wrap(RW, 800)[1] + p.style.spaceAfter + p.style.spaceBefore for p in fl)
frame(RX, ry - hh - 2, RW, hh + 2, fl)
ry = ry - hh - 12
fl = [Paragraph("LICENCES AND CERTIFICATIONS", h2)]
for g in r["credentials"]:
    fl.append(Paragraph(g["group"], h3))
    fl += [Paragraph(E(t), bul, bulletText="•") for t in g["items"]]
    fl.append(Spacer(1, 2))
hh = sum(p.wrap(RW, 900)[1] + (p.style.spaceAfter if hasattr(p, "style") else 0) for p in fl)
frame(RX, ry - hh - 2, RW, hh + 2, fl)
ry = ry - hh - 12
fl = [Paragraph("EDUCATION", h2)] + [Paragraph(f"<b>{E(e['what'])}</b><br/><font color='#5B6B82'>{e['school']}, {e['dates']}</font>", S("ed", fontSize=7.6, leading=9.8, spaceAfter=3)) for e in d["education"]]
hh = sum(p.wrap(RW, 400)[1] + 3 for p in fl)
frame(RX, ry - hh - 2, RW, hh + 2, fl)
print("right column bottom y:", ry - hh, "left bottom y:", y)

c.setStrokeColor(HexColor("#D5DCEA")); c.line(M, 40, W - M, 40)
c.setFillColor(SOFT); c.setFont("Helvetica", 7); c.drawString(M, 29, f"Full details in the ATS friendly CV and at {domain}")
c.drawRightString(W - M, 29, f"{r['name']}  ·  {r['headline']}")
c.save()
