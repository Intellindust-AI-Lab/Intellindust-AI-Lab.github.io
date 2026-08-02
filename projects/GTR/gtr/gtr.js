/* ============================================================
   GTR project page — interactions
   (scroll reveal, stat counters, tabs, Pareto chart, tables)
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- COCO val2017 main results (from the paper) ----------------
     f: family — gtr | detr | yolo;  g: scale group */
  var DATA = [
    // ---- S ----
    { m: "YOLOv9-S",         f: "yolo", g: "S", ep: "500",  p: 7,    gf: 26,     lat: 1.651, ap: 46.8, ap50: 61.8, ap75: 48.6, aps: 25.7, apm: 49.9, apl: 61.0 },
    { m: "YOLOv10-S",        f: "yolo", g: "S", ep: "500",  p: 7,    gf: 22,     lat: 0.870, ap: 46.3, ap50: 63.0, ap75: 50.4, aps: 26.8, apm: 51.0, apl: 63.8 },
    { m: "YOLO11-S",         f: "yolo", g: "S", ep: "500",  p: 9,    gf: 22,     lat: 1.078, ap: 46.6, ap50: 63.4, ap75: 50.3, aps: 28.7, apm: 51.3, apl: 64.1 },
    { m: "YOLOv12-S-Turbo",  f: "yolo", g: "S", ep: "600",  p: 9,    gf: 19,     lat: 1.339, ap: 47.6, ap50: 64.5, ap75: 51.5, aps: 28.3, apm: 52.7, apl: 65.9 },
    { m: "RT-DETRv2-S",      f: "detr", g: "S", ep: "120",  p: 20,   gf: 60,     lat: 1.184, ap: 48.1, ap50: 65.1, ap75: 52.1, aps: 30.2, apm: 51.5, apl: 63.9 },
    { m: "DEIM-S",           f: "detr", g: "S", ep: "132*", p: 10,   gf: 25,     lat: 1.090, ap: 49.0, ap50: 65.9, ap75: 53.1, aps: 30.4, apm: 52.6, apl: 65.7 },
    { m: "DEIMv2-S",         f: "detr", g: "S", ep: "132*", p: 10,   gf: 26,     lat: 1.550, ap: 50.9, ap50: 68.4, ap75: 55.1, aps: 31.3, apm: 55.3, apl: 70.2 },
    { m: "RT-DETRv4-S",      f: "detr", g: "S", ep: "132*", p: 10,   gf: 25,     lat: 1.079, ap: 49.7, ap50: 66.8, ap75: 54.1, aps: 30.2, apm: 53.6, apl: 66.9 },
    { m: "LW-DETR-S",        f: "detr", g: "S", ep: "60",   p: 15,   gf: 17,     lat: 1.035, ap: 48.0, ap50: 66.9, ap75: 51.7, aps: 26.8, apm: 52.5, apl: 65.5 },
    { m: "D-FINE-S",         f: "detr", g: "S", ep: "—",    p: 10,   gf: 25,     lat: 1.103, ap: 50.7, ap50: 67.6, ap75: 55.1, aps: 32.7, apm: 54.6, apl: 66.5 },
    { m: "RF-DETR-S",        f: "detr", g: "S", ep: "—",    p: 32,   gf: 60,     lat: 1.207, ap: 52.9, ap50: 71.9, ap75: 57.0, aps: 32.0, apm: 58.3, apl: 73.0, lbl: [8, -12] },
    { m: "YOLO26-S",         f: "yolo", g: "S", ep: "70",   p: 10,   gf: 21,     lat: 0.922, ap: 47.8, ap50: 64.6, ap75: 52.1, aps: 29.1, apm: 52.5, apl: 64.3 },
    { m: "ECDet-S",          f: "detr", g: "S", ep: "74",   p: 10,   gf: 26,     lat: 1.511, ap: 51.7, ap50: 69.4, ap75: 55.8, aps: 32.3, apm: 56.4, apl: 70.5 },
    { m: "GTR-S",            f: "gtr",  g: "S", ep: "30",   p: 12.1, gf: 33.87,  lat: 1.139, ap: 52.7, ap50: 70.5, ap75: 56.9, aps: 35.6, apm: 57.2, apl: 69.9, lbl: [-10, -12] },
    // ---- M ----
    { m: "YOLOv9-M",         f: "yolo", g: "M", ep: "500",  p: 20,   gf: 76,     lat: 2.023, ap: 51.4, ap50: 67.2, ap75: 54.6, aps: 32.0, apm: 55.7, apl: 66.4 },
    { m: "YOLOv10-M",        f: "yolo", g: "M", ep: "500",  p: 15,   gf: 59,     lat: 1.415, ap: 51.1, ap50: 68.1, ap75: 55.8, aps: 33.8, apm: 56.5, apl: 67.0 },
    { m: "YOLO11-M",         f: "yolo", g: "M", ep: "500",  p: 20,   gf: 68,     lat: 1.643, ap: 51.2, ap50: 67.9, ap75: 55.3, aps: 33.0, apm: 56.7, apl: 67.5 },
    { m: "YOLOv12-M-Turbo",  f: "yolo", g: "M", ep: "600",  p: 20,   gf: 60,     lat: 1.917, ap: 52.5, ap50: 69.9, ap75: 57.1, aps: 35.2, apm: 57.8, apl: 69.7 },
    { m: "RT-DETRv2-M",      f: "detr", g: "M", ep: "120",  p: 31,   gf: 92,     lat: 1.593, ap: 49.9, ap50: 67.5, ap75: 54.1, aps: 32.0, apm: 53.2, apl: 66.5 },
    { m: "DEIM-M",           f: "detr", g: "M", ep: "102*", p: 19,   gf: 57,     lat: 1.612, ap: 52.7, ap50: 70.0, ap75: 57.3, aps: 35.3, apm: 56.7, apl: 69.5 },
    { m: "DEIMv2-M",         f: "detr", g: "M", ep: "102*", p: 18,   gf: 52,     lat: 2.193, ap: 53.0, ap50: 70.2, ap75: 57.6, aps: 34.2, apm: 57.4, apl: 71.5 },
    { m: "RT-DETRv4-M",      f: "detr", g: "M", ep: "102*", p: 19,   gf: 57,     lat: 1.598, ap: 53.5, ap50: 71.1, ap75: 58.1, aps: 34.9, apm: 57.7, apl: 72.1 },
    { m: "LW-DETR-M",        f: "detr", g: "M", ep: "60",   p: 28,   gf: 43,     lat: 1.342, ap: 52.6, ap50: 69.9, ap75: 56.7, aps: 32.6, apm: 57.7, apl: 70.7 },
    { m: "D-FINE-M",         f: "detr", g: "M", ep: "—",    p: 19,   gf: 57,     lat: 1.603, ap: 55.1, ap50: 72.6, ap75: 59.7, aps: 37.9, apm: 59.4, apl: 71.7 },
    { m: "RF-DETR-M",        f: "detr", g: "M", ep: "—",    p: 34,   gf: 79,     lat: 1.326, ap: 54.7, ap50: 73.5, ap75: 59.2, aps: 36.1, apm: 59.7, apl: 73.8 },
    { m: "YOLO26-M",         f: "yolo", g: "M", ep: "80",   p: 20,   gf: 68,     lat: 1.459, ap: 52.5, ap50: 69.8, ap75: 57.2, aps: 36.2, apm: 56.9, apl: 68.5 },
    { m: "ECDet-M",          f: "detr", g: "M", ep: "62",   p: 18,   gf: 53,     lat: 1.901, ap: 54.3, ap50: 72.2, ap75: 58.7, aps: 35.9, apm: 59.1, apl: 72.7 },
    { m: "GTR-M",            f: "gtr",  g: "M", ep: "30",   p: 22.7, gf: 62.68,  lat: 1.350, ap: 55.6, ap50: 73.4, ap75: 60.2, aps: 38.2, apm: 60.4, apl: 72.8, lbl: [-10, -12] },
    // ---- L ----
    { m: "YOLOv9-C",         f: "yolo", g: "L", ep: "500",  p: 25,   gf: 102,    lat: 2.049, ap: 53.0, ap50: 70.2, ap75: 57.8, aps: 36.2, apm: 58.5, apl: 69.3 },
    { m: "YOLOv10-L",        f: "yolo", g: "L", ep: "500",  p: 24,   gf: 120,    lat: 2.042, ap: 53.2, ap50: 70.1, ap75: 58.1, aps: 35.8, apm: 58.5, apl: 69.4 },
    { m: "YOLO11-L",         f: "yolo", g: "L", ep: "500",  p: 25,   gf: 87,     lat: 2.195, ap: 53.4, ap50: 70.1, ap75: 58.2, aps: 35.6, apm: 59.1, apl: 69.2 },
    { m: "YOLOv12-L-Turbo",  f: "yolo", g: "L", ep: "600",  p: 27,   gf: 82,     lat: 2.879, ap: 53.8, ap50: 71.0, ap75: 58.6, aps: 36.9, apm: 59.4, apl: 71.0 },
    { m: "RT-DETRv2-L",      f: "detr", g: "L", ep: "72",   p: 42,   gf: 136,    lat: 2.127, ap: 53.4, ap50: 71.6, ap75: 57.4, aps: 36.1, apm: 57.9, apl: 70.8 },
    { m: "DEIM-L",           f: "detr", g: "L", ep: "58*",  p: 31,   gf: 91,     lat: 2.251, ap: 54.7, ap50: 72.4, ap75: 59.4, aps: 36.9, apm: 59.6, apl: 71.8 },
    { m: "DEIMv2-L",         f: "detr", g: "L", ep: "68*",  p: 32,   gf: 97,     lat: 2.560, ap: 56.0, ap50: 73.5, ap75: 61.1, aps: 37.6, apm: 60.9, apl: 74.9 },
    { m: "RT-DETRv4-L",      f: "detr", g: "L", ep: "58*",  p: 31,   gf: 91,     lat: 2.264, ap: 55.4, ap50: 73.0, ap75: 60.3, aps: 37.1, apm: 60.1, apl: 72.9 },
    { m: "LW-DETR-L",        f: "detr", g: "L", ep: "60",   p: 47,   gf: 72,     lat: 2.010, ap: 56.1, ap50: 74.6, ap75: 60.9, aps: 37.2, apm: 60.4, apl: 73.0 },
    { m: "D-FINE-L",         f: "detr", g: "L", ep: "—",    p: 31,   gf: 91,     lat: 2.253, ap: 57.1, ap50: 74.7, ap75: 62.0, aps: 40.0, apm: 61.5, apl: 74.2, lbl: [8, 12] },
    { m: "RF-DETR-L",        f: "detr", g: "L", ep: "—",    p: 34,   gf: 126,    lat: 1.805, ap: 56.5, ap50: 75.1, ap75: 61.3, aps: 39.0, apm: 61.0, apl: 73.9 },
    { m: "YOLO26-L",         f: "yolo", g: "L", ep: "60",   p: 25,   gf: 86,     lat: 1.953, ap: 54.3, ap50: 71.5, ap75: 59.4, aps: 37.8, apm: 58.6, apl: 70.3 },
    { m: "ECDet-L",          f: "detr", g: "L", ep: "50",   p: 31,   gf: 101,    lat: 2.493, ap: 57.0, ap50: 75.1, ap75: 61.7, aps: 38.7, apm: 62.5, apl: 75.0 },
    { m: "GTR-L",            f: "gtr",  g: "L", ep: "30",   p: 37.2, gf: 106.05, lat: 1.738, ap: 57.7, ap50: 75.6, ap75: 62.8, aps: 40.2, apm: 62.6, apl: 74.6, lbl: [-10, -12] },
    // ---- X ----
    { m: "YOLOv9-E",         f: "yolo", g: "X", ep: "500",  p: 57,   gf: 189,    lat: 3.960, ap: 55.6, ap50: 72.8, ap75: 60.6, aps: 40.2, apm: 61.0, apl: 71.4 },
    { m: "YOLOv10-X",        f: "yolo", g: "X", ep: "500",  p: 30,   gf: 160,    lat: 2.462, ap: 54.4, ap50: 71.3, ap75: 59.3, aps: 37.0, apm: 59.8, apl: 70.9 },
    { m: "YOLO11-X",         f: "yolo", g: "X", ep: "500",  p: 57,   gf: 195,    lat: 3.331, ap: 54.7, ap50: 71.6, ap75: 59.5, aps: 37.7, apm: 59.7, apl: 70.2 },
    { m: "YOLOv12-X-Turbo",  f: "yolo", g: "X", ep: "600",  p: 59,   gf: 185,    lat: 4.350, ap: 55.4, ap50: 72.5, ap75: 60.3, aps: 38.9, apm: 60.8, apl: 70.9 },
    { m: "RT-DETRv2-X",      f: "detr", g: "X", ep: "72",   p: 76,   gf: 259,    lat: 3.209, ap: 54.3, ap50: 72.8, ap75: 58.8, aps: 35.8, apm: 58.8, apl: 72.1 },
    { m: "DEIM-X",           f: "detr", g: "X", ep: "58*",  p: 62,   gf: 202,    lat: 3.336, ap: 56.5, ap50: 74.0, ap75: 61.5, aps: 38.8, apm: 61.4, apl: 74.2 },
    { m: "DEIMv2-X",         f: "detr", g: "X", ep: "58*",  p: 50,   gf: 152,    lat: 3.218, ap: 57.8, ap50: 75.3, ap75: 63.2, aps: 39.1, apm: 62.9, apl: 75.9 },
    { m: "RT-DETRv4-X",      f: "detr", g: "X", ep: "58*",  p: 62,   gf: 202,    lat: 3.332, ap: 57.0, ap50: 74.6, ap75: 62.1, aps: 39.5, apm: 61.9, apl: 74.8 },
    { m: "LW-DETR-X",        f: "detr", g: "X", ep: "60",   p: 118,  gf: 174,    lat: 3.643, ap: 58.3, ap50: 76.9, ap75: 63.3, aps: 40.9, apm: 63.3, apl: 74.8 },
    { m: "D-FINE-X",         f: "detr", g: "X", ep: "—",    p: 62,   gf: 202,    lat: 3.331, ap: 59.3, ap50: 76.8, ap75: 64.6, aps: 42.3, apm: 64.2, apl: 76.4, lbl: [8, -12] },
    { m: "RF-DETR-X",        f: "detr", g: "X", ep: "—",    p: 126,  gf: 300,    lat: 2.971, ap: 58.6, ap50: 77.4, ap75: 63.8, aps: 40.3, apm: 63.9, apl: 76.2, lbl: [8, 12] },
    { m: "YOLO26-X",         f: "yolo", g: "X", ep: "40",   p: 55,   gf: 194,    lat: 3.069, ap: 56.9, ap50: 74.1, ap75: 62.1, aps: 41.3, apm: 61.2, apl: 72.7 },
    { m: "ECDet-X",          f: "detr", g: "X", ep: "50",   p: 49,   gf: 151,    lat: 2.950, ap: 57.9, ap50: 76.0, ap75: 62.9, aps: 38.7, apm: 63.4, apl: 76.1 },
    { m: "GTR-X",            f: "gtr",  g: "X", ep: "50",   p: 46.4, gf: 129.97, lat: 1.931, ap: 58.4, ap50: 76.4, ap75: 63.3, aps: 41.0, apm: 63.3, apl: 75.8, lbl: [-10, -12] }
  ];

  /* ---------------- GTR-S resolution sweep on COCO val2017 (from the paper) ---------------- */
  var RES_DATA = [
    { m: "640 × 640",   g: "res", gf: 33.55, ap: 52.73, ap50: 70.37, ap75: 57.20, aps: 35.06, apm: 57.15, apl: 70.31, ar: 72.32 },
    { m: "704 × 704",   g: "res", gf: 40.23, ap: 53.15, ap50: 70.99, ap75: 57.62, aps: 35.82, apm: 56.93, apl: 70.46, ar: 72.75 },
    { m: "768 × 768",   g: "res", gf: 47.55, ap: 53.92, ap50: 71.56, ap75: 58.58, aps: 37.98, apm: 57.81, apl: 70.23, ar: 73.65 },
    { m: "832 × 832",   g: "res", gf: 55.51, ap: 54.34, ap50: 72.05, ap75: 59.21, aps: 38.28, apm: 58.34, apl: 70.51, ar: 73.95 },
    { m: "896 × 896",   g: "res", gf: 64.10, ap: 54.79, ap50: 72.39, ap75: 59.80, aps: 39.85, apm: 58.80, apl: 70.32, ar: 74.52 },
    { m: "960 × 960",   g: "res", gf: 73.33, ap: 55.06, ap50: 72.65, ap75: 59.99, aps: 39.12, apm: 58.86, apl: 70.55, ar: 74.79 },
    { m: "1024 × 1024", g: "res", gf: 83.19, ap: 55.26, ap50: 72.66, ap75: 60.31, aps: 40.61, apm: 58.73, apl: 70.72, ar: 74.78 }
  ];

  var COLORS = { gtr: "#1baf7a", detr: "#2a78d6", yolo: "#eb6834" };
  var FAMILY_NAME = { gtr: "GTR (ours)", detr: "DETR-style", yolo: "YOLO / CNN family" };

  /* ---------------- COCO instance segmentation, mask AP (from the paper) ----------------
     o365: 1 — pre-trained on Objects365 with SAM2 pseudo masks (†) */
  var SEG_DATA = [
    // ---- S ----
    { m: "YOLO26-Seg-S",   f: "yolo", o365: 1, g: "S", p: 10.4, gf: 34.2,  lat: 1.151, ap: 40.0, ap50: 61.5, ap75: 43.0, aps: 21.0, apm: 44.5, apl: 57.3 },
    { m: "RF-DETR-Seg-S",  f: "detr", o365: 1, g: "S", p: 33.7, gf: 70.6,  lat: 1.339, ap: 43.1, ap50: 66.2, ap75: 45.9, aps: 21.9, apm: 48.5, apl: 64.1, lbl: [8, 12] },
    { m: "ECInsSeg-S",     f: "detr",          g: "S", p: 10.3, gf: 33.1,  lat: 1.626, ap: 43.0, ap50: 65.7, ap75: 46.0, aps: 20.8, apm: 46.3, apl: 65.9 },
    { m: "GTR-S",   f: "gtr",          g: "S", p: 12.6, gf: 46.6,  lat: 1.368, ap: 44.4, ap50: 66.8, ap75: 47.6, aps: 23.1, apm: 47.7, apl: 66.3, lbl: [-10, -12] },
    // ---- M ----
    { m: "YOLO26-Seg-M",   f: "yolo", o365: 1, g: "M", p: 23.6, gf: 121.5, lat: 1.992, ap: 44.1, ap50: 66.8, ap75: 47.7, aps: 25.6, apm: 48.9, apl: 60.2 },
    { m: "RF-DETR-Seg-M",  f: "detr", o365: 1, g: "M", p: 35.7, gf: 102.0, lat: 1.548, ap: 45.3, ap50: 68.4, ap75: 48.8, aps: 25.5, apm: 50.4, apl: 65.3 },
    { m: "ECInsSeg-M",     f: "detr",          g: "M", p: 20.1, gf: 64.2,  lat: 2.077, ap: 45.2, ap50: 68.2, ap75: 48.3, aps: 22.9, apm: 49.0, apl: 68.1 },
    { m: "GTR-M",   f: "gtr",          g: "M", p: 23.7, gf: 83.9,  lat: 1.673, ap: 47.2, ap50: 70.5, ap75: 50.9, aps: 26.0, apm: 50.7, apl: 68.4, lbl: [-10, -12] },
    // ---- L ----
    { m: "YOLO26-Seg-L",   f: "yolo", o365: 1, g: "L", p: 28.0, gf: 139.8, lat: 2.574, ap: 45.5, ap50: 68.7, ap75: 49.2, aps: 27.1, apm: 50.4, apl: 62.8 },
    { m: "RF-DETR-Seg-L",  f: "detr", o365: 1, g: "L", p: 36.2, gf: 151.1, lat: 1.907, ap: 47.1, ap50: 70.5, ap75: 50.9, aps: 28.4, apm: 52.1, apl: 65.6 },
    { m: "ECInsSeg-L",     f: "detr",          g: "L", p: 33.6, gf: 110.8, lat: 2.661, ap: 47.1, ap50: 70.9, ap75: 50.5, aps: 24.8, apm: 51.1, apl: 69.6 },
    { m: "GTR-L",   f: "gtr",          g: "L", p: 38.2, gf: 127.3, lat: 2.057, ap: 49.0, ap50: 72.7, ap75: 53.2, aps: 27.8, apm: 52.9, apl: 70.4, lbl: [-10, -12] },
    // ---- X ----
    { m: "YOLO26-Seg-X",   f: "yolo", o365: 1, g: "X", p: 62.8, gf: 313.5, lat: 4.096, ap: 47.0, ap50: 70.8, ap75: 51.1, aps: 29.7, apm: 51.8, apl: 63.1 },
    { m: "RF-DETR-Seg-X",  f: "detr", o365: 1, g: "X", p: 38.1, gf: 260.0, lat: 3.064, ap: 48.8, ap50: 72.2, ap75: 53.1, aps: 30.6, apm: 53.3, apl: 65.9, lbl: [8, 12] },
    { m: "ECInsSeg-X",     f: "detr",          g: "X", p: 49.9, gf: 168.1, lat: 3.125, ap: 48.4, ap50: 72.2, ap75: 52.0, aps: 26.3, apm: 52.7, apl: 71.1 },
    { m: "GTR-X",   f: "gtr",          g: "X", p: 47.4, gf: 151.2, lat: 2.253, ap: 49.5, ap50: 73.2, ap75: 53.9, aps: 29.0, apm: 53.6, apl: 71.3, lbl: [-10, -12] }
  ];

  /* ---------------- COCO human pose estimation, keypoint metrics (from the paper) ---------------- */
  var POSE_DATA = [
    // ---- S ----
    { m: "RTMO-S",         f: "yolo", g: "S", p: 9.9,  gf: 30.7,  lat: 0.645,  ap: 67.7, ap50: 87.8, ap75: 73.7, apm: null, apl: null, ar: 71.5, lbl: [8, 12] },
    { m: "YOLO11-Pose-S",  f: "yolo", g: "S", p: 9.9,  gf: 23.2,  lat: 0.701,  ap: 58.9, ap50: 86.3, ap75: 64.8, apm: 54.0, apl: 68.0, ar: 66.1 },
    { m: "YOLO26-Pose-S",  f: "yolo", g: "S", p: 10.4, gf: 23.9,  lat: 0.811,  ap: 63.1, ap50: 86.6, ap75: 68.8, apm: 56.5, apl: 73.7, ar: 69.0 },
    { m: "DETRPose-S",     f: "detr", o365: 1,        g: "S", p: 11.5, gf: 33.1,  lat: 1.215,  ap: 67.0, ap50: 87.6, ap75: 72.8, apm: 60.2, apl: 77.4, ar: 73.5 },
    { m: "ECPose-S",       f: "detr", g: "S", p: 9.9,  gf: 30.4,  lat: 1.516,  ap: 68.9, ap50: 89.1, ap75: 75.2, apm: 60.7, apl: 81.1, ar: 74.6 },
    { m: "GTR-S",   f: "gtr", g: "S", p: 11.9, gf: 37.9,  lat: 1.374,  ap: 70.5, ap50: 89.5, ap75: 76.9, apm: 63.2, apl: 81.3, ar: 76.2, lbl: [-10, -12] },
    // ---- M ----
    { m: "RTMO-M",         f: "yolo", g: "M", p: 22.6, gf: 69,    lat: 1.147,  ap: 70.9, ap50: 89.0, ap75: 77.8, apm: null, apl: null, ar: 74.7 },
    { m: "YOLO11-Pose-M",  f: "yolo", g: "M", p: 20.9, gf: 71.7,  lat: 1.220,  ap: 64.9, ap50: 89.4, ap75: 72.4, apm: 62.2, apl: 71.6, ar: 72.2 },
    { m: "YOLO26-Pose-M",  f: "yolo", g: "M", p: 21.5, gf: 73.1,  lat: 1.350,  ap: 68.8, ap50: 89.6, ap75: 75.5, apm: 64.0, apl: 77.2, ar: 74.6 },
    { m: "DETRPose-M",     f: "detr", o365: 1,        g: "M", p: 20.8, gf: 67.3,  lat: 1.846,  ap: 69.4, ap50: 89.2, ap75: 75.4, apm: 63.2, apl: 79.0, ar: 75.5 },
    { m: "ECPose-M",       f: "detr", g: "M", p: 19.8, gf: 62.8,  lat: 2.099,  ap: 72.4, ap50: 90.9, ap75: 78.6, apm: 65.2, apl: 83.6, ar: 78.2 },
    { m: "GTR-M",   f: "gtr", g: "M", p: 22.7, gf: 71.9,  lat: 1.729,  ap: 73.8, ap50: 91.4, ap75: 80.4, apm: 67.4, apl: 83.7, ar: 79.4, lbl: [-10, -12] },
    // ---- L ----
    { m: "RTMO-L",         f: "yolo", g: "L", p: 44.8, gf: 136.7, lat: 1.769,  ap: 72.4, ap50: 89.9, ap75: 78.8, apm: null, apl: null, ar: 76.8 },
    { m: "YOLO11-Pose-L",  f: "yolo", g: "L", p: 26.2, gf: 90.7,  lat: 1.701,  ap: 66.1, ap50: 89.9, ap75: 73.6, apm: 63.2, apl: 73.1, ar: 73.3 },
    { m: "YOLO26-Pose-L",  f: "yolo", g: "L", p: 25.9, gf: 91.3,  lat: 1.780,  ap: 70.4, ap50: 90.5, ap75: 77.4, apm: 65.7, apl: 78.4, ar: 75.9 },
    { m: "DETRPose-L",     f: "detr", o365: 1,        g: "L", p: 32.8, gf: 107.1, lat: 2.639,  ap: 72.5, ap50: 90.6, ap75: 79.0, apm: 66.3, apl: 82.2, ar: 78.7 },
    { m: "ECPose-L",       f: "detr", g: "L", p: 34.3, gf: 111.7, lat: 2.768,  ap: 73.5, ap50: 91.7, ap75: 79.9, apm: 66.4, apl: 84.4, ar: 78.8 },
    { m: "GTR-L",   f: "gtr", g: "L", p: 38.3, gf: 117.6, lat: 2.170,  ap: 74.6, ap50: 91.8, ap75: 81.4, apm: 68.3, apl: 84.1, ar: 80.0, lbl: [-10, -12] },
    // ---- X ----
    { m: "ED-Pose",        f: "detr", g: "X", p: 218,  gf: 422.6, lat: 10.266, ap: 74.3, ap50: 91.5, ap75: 81.7, apm: 68.5, apl: 82.7, ar: null, lbl: [-10, 12] },
    { m: "YOLO11-Pose-X",  f: "yolo", g: "X", p: 58.8, gf: 203.3, lat: 2.765,  ap: 69.5, ap50: 91.1, ap75: 77.4, apm: 66.6, apl: 76.0, ar: 76.3 },
    { m: "YOLO26-Pose-X",  f: "yolo", g: "X", p: 57.6, gf: 201.7, lat: 2.774,  ap: 71.6, ap50: 91.6, ap75: 78.9, apm: 67.4, apl: 79.5, ar: 77.2 },
    { m: "DETRPose-X",     f: "detr", o365: 1,        g: "X", p: 73.3, gf: 239.5, lat: 4.129,  ap: 73.3, ap50: 90.5, ap75: 79.4, apm: 67.5, apl: 82.7, ar: 79.4 },
    { m: "ECPose-X",       f: "detr", g: "X", p: 50.6, gf: 172.2, lat: 3.275,  ap: 74.8, ap50: 92.2, ap75: 81.5, apm: 68.0, apl: 85.4, ar: 80.1, lbl: [8, 12] },
    { m: "GTR-X",   f: "gtr", g: "X", p: 47.5, gf: 144.8, lat: 2.412,  ap: 74.8, ap50: 92.0, ap75: 81.6, apm: 68.1, apl: 84.9, ar: 80.2, lbl: [8, -18] }
  ];

  /* ---------------- DOTA-v1.0 oriented object detection (from the paper) ---------------- */
  var OBB_DATA = [
    // ---- CNN-based ----
    { m: "RTMDet-R-m",    f: "yolo", g: "cnn",  bb: "CSPNext-m", p: 24.7, gf: 100, lat: 2.356,  ap50: 78.2 },
    { m: "RTMDet-R-l",    f: "yolo", g: "cnn",  bb: "CSPNext-l", p: 52.3, gf: 205, lat: 3.663,  ap50: 78.8 },
    { m: "YOLO26n-obb",   f: "yolo", g: "cnn",  bb: "YOLO26n",   p: 2.5,  gf: 14,  lat: 0.691,  ap50: 77.7, lbl: [8, -12] },
    { m: "YOLO26s-obb",   f: "yolo", g: "cnn",  bb: "YOLO26s",   p: 9.8,  gf: 55,  lat: 1.092,  ap50: 79.7 },
    { m: "YOLO26m-obb",   f: "yolo", g: "cnn",  bb: "YOLO26m",   p: 21.2, gf: 183, lat: 2.082,  ap50: 80.0 },
    { m: "YOLO26l-obb",   f: "yolo", g: "cnn",  bb: "YOLO26l",   p: 25.6, gf: 230, lat: 2.700,  ap50: 80.2 },
    { m: "YOLO26x-obb",   f: "yolo", g: "cnn",  bb: "YOLO26x",   p: 57.6, gf: 517, lat: 5.073,  ap50: 80.4, lbl: [8, 12] },
    // ---- DETR-based ----
    { m: "RHINO-DETR",    f: "detr", g: "detr", bb: "R-50",      p: 47.6, gf: 566, lat: 9.287,  ap50: 78.7 },
    { m: "RHINO-DETR",    f: "detr", g: "detr", bb: "Swin-T",    p: 50.8, gf: 609, lat: 10.345, ap50: 79.4 },
    { m: "Oriented-DETR", f: "detr", g: "detr", bb: "R-50",      p: 57.2, gf: 302, lat: 14.904, ap50: 79.1 },
    { m: "Oriented-DETR", f: "detr", g: "detr", bb: "Swin-T",    p: 57.7, gf: 309, lat: 15.462, ap50: 79.8, lbl: [-10, 12] },
    { m: "GTR-X",  f: "gtr", g: "detr", bb: "GLA",       p: 46.3, gf: 324, lat: 3.763,  ap50: 80.9, lbl: [-10, -12] }
  ];

  /* ---------------- scroll reveal ---------------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- animated counters ---------------- */
  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
      if (reduced) { el.textContent = target.toFixed(decimals); return; }
      var dur = 1400, t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var k = Math.min((ts - t0) / dur, 1);
        k = 1 - Math.pow(1 - k, 3); // ease-out cubic
        el.textContent = (target * k).toFixed(decimals);
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window)) {
      els.forEach(run);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- generic tabs ---------------- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (root) {
      var group = root.getAttribute("data-tabs");
      var tabs = root.querySelectorAll(".gtr-tab");
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          tabs.forEach(function (t) {
            t.classList.toggle("active", t === tab);
            t.setAttribute("aria-selected", t === tab ? "true" : "false");
          });
          // query panels at click time — some panels are built after init
          document.querySelectorAll('.gtr-panel[data-group="' + group + '"]').forEach(function (p) {
            p.classList.toggle("active", p.getAttribute("data-panel") === tab.getAttribute("data-tab"));
          });
        });
      });
    });
  }

  /* ---------------- results tables (det / seg / pose / obb) ----------------
     One table per task, rows grouped by scale (or detector family for DOTA);
     best value per column within each group gets the green dot, GTR rows are
     highlighted. */
  function buildTaskTable(hostId, spec) {
    var host = document.getElementById(hostId);
    if (!host) return;

    /* render one table holding the given groups; label=null omits the group row */
    function makeWrap(groups) {
      var wrap = document.createElement("div");
      wrap.className = "table-wrapper";
      var table = document.createElement("table");
      var thead = document.createElement("thead");
      thead.className = "center";
      var hrow = document.createElement("tr");
      spec.head.forEach(function (h) {
        var th = document.createElement("th");
        th.textContent = h;
        hrow.appendChild(th);
      });
      thead.appendChild(hrow);
      table.appendChild(thead);
      var tbody = document.createElement("tbody");
      tbody.className = "center";
      groups.forEach(function (grp) {
        var rows = spec.data.filter(function (d) { return d.g === grp.key; });
        if (grp.label) {
          var gtrRow = document.createElement("tr");
          gtrRow.className = "gtr-group-row";
          var gtd = document.createElement("td");
          gtd.colSpan = spec.head.length;
          gtd.textContent = grp.label;
          gtrRow.appendChild(gtd);
          tbody.appendChild(gtrRow);
        }
        // best value per column within this group (min for latency, max otherwise)
        var best = {};
        spec.keys.forEach(function (k) {
          var vals = rows.map(function (r) { return r[k]; }).filter(function (v) { return v != null; });
          best[k] = k === "lat" ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
        });
        rows.forEach(function (r) {
          var tr = document.createElement("tr");
          if (r.f === "gtr") tr.className = "gtr-ours";
          spec.cells(r).forEach(function (v, i) {
            var td = document.createElement("td");
            td.textContent = v;
            if (i === 0) td.style.textAlign = "left";
            if (i >= spec.numStart) {
              var k = spec.keys[i - spec.numStart];
              if (k && r[k] != null && r[k] === best[k]) td.className = "best";
            }
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
      });
      table.appendChild(tbody);
      wrap.appendChild(table);
      return wrap;
    }

    if (spec.switcher) {
      /* one scale group visible at a time, chip row on top */
      var chipRow = document.createElement("div");
      chipRow.className = "gtr-chip-row";
      var lbl = document.createElement("span");
      lbl.className = "chip-label";
      lbl.textContent = "Scale";
      chipRow.appendChild(lbl);
      host.appendChild(chipRow);
      var wraps = {};
      spec.groups.forEach(function (grp, i) {
        var w = makeWrap([{ key: grp.key, label: null }]);
        if (i !== 0) w.style.display = "none";
        wraps[grp.key] = w;
        var chip = document.createElement("button");
        chip.className = "gtr-chip" + (i === 0 ? " active" : "");
        chip.setAttribute("aria-pressed", i === 0 ? "true" : "false");
        chip.textContent = grp.label;
        chip.addEventListener("click", function () {
          chipRow.querySelectorAll(".gtr-chip").forEach(function (c) {
            c.classList.toggle("active", c === chip);
            c.setAttribute("aria-pressed", c === chip ? "true" : "false");
          });
          spec.groups.forEach(function (g) {
            wraps[g.key].style.display = g.key === grp.key ? "" : "none";
          });
        });
        chipRow.appendChild(chip);
      });
      spec.groups.forEach(function (grp) { host.appendChild(wraps[grp.key]); });
    } else {
      host.appendChild(makeWrap(spec.groups));
    }
  }

  function buildTaskTables() {
    var name = function (r) { return r.m + (r.f === "gtr" ? " (ours)" : "") + (r.o365 ? " †" : ""); };
    var f1 = function (v) { return v == null ? "—" : v.toFixed(1); };
    var SCALES = [
      { key: "S", label: "Small" }, { key: "M", label: "Medium" },
      { key: "L", label: "Large" }, { key: "X", label: "X-Large" }
    ];
    buildTaskTable("gtr-det-table", {
      data: DATA,
      head: ["Model", "Epochs", "Params (M)", "GFLOPs", "Lat. min (ms)", "AP", "AP50", "AP75", "APS", "APM", "APL"],
      keys: ["lat", "ap", "ap50", "ap75", "aps", "apm", "apl"],
      numStart: 4,
      groups: SCALES,
      switcher: true,
      cells: function (r) {
        return [name(r), r.ep, String(r.p), String(r.gf), r.lat.toFixed(3),
                f1(r.ap), f1(r.ap50), f1(r.ap75), f1(r.aps), f1(r.apm), f1(r.apl)];
      }
    });
    buildTaskTable("gtr-seg-table", {
      data: SEG_DATA,
      head: ["Model", "Params (M)", "GFLOPs", "Lat. min (ms)", "Mask AP", "AP50", "AP75", "APS", "APM", "APL"],
      keys: ["lat", "ap", "ap50", "ap75", "aps", "apm", "apl"],
      numStart: 3,
      groups: SCALES,
      switcher: true,
      cells: function (r) {
        return [name(r), String(r.p), String(r.gf), r.lat.toFixed(3),
                f1(r.ap), f1(r.ap50), f1(r.ap75), f1(r.aps), f1(r.apm), f1(r.apl)];
      }
    });
    buildTaskTable("gtr-pose-table", {
      data: POSE_DATA,
      head: ["Model", "Params (M)", "GFLOPs", "Lat. min (ms)", "AP", "AP50", "AP75", "APM", "APL", "AR"],
      keys: ["lat", "ap", "ap50", "ap75", "apm", "apl", "ar"],
      numStart: 3,
      groups: SCALES,
      switcher: true,
      cells: function (r) {
        return [name(r), String(r.p), String(r.gf), r.lat.toFixed(3),
                f1(r.ap), f1(r.ap50), f1(r.ap75), f1(r.apm), f1(r.apl), f1(r.ar)];
      }
    });
    buildTaskTable("gtr-obb-table", {
      data: OBB_DATA,
      head: ["Model", "Backbone", "Params (M)", "GFLOPs", "Lat. min (ms)", "AP50"],
      keys: ["lat", "ap50"],
      numStart: 4,
      groups: [
        { key: "cnn", label: "CNN-based oriented detectors" },
        { key: "detr", label: "DETR-based oriented detectors" }
      ],
      cells: function (r) {
        return [name(r), r.bb, String(r.p), String(r.gf), r.lat.toFixed(3), f1(r.ap50)];
      }
    });
    buildTaskTable("gtr-res-table", {
      data: RES_DATA,
      head: ["Input size", "GFLOPs", "AP", "AP50", "AP75", "APS", "APM", "APL", "AR100"],
      keys: ["ap", "ap50", "ap75", "aps", "apm", "apl", "ar"],
      numStart: 2,
      groups: [{ key: "res", label: null }],
      cells: function (r) {
        return [r.m, r.gf.toFixed(2), r.ap.toFixed(2), r.ap50.toFixed(2), r.ap75.toFixed(2),
                r.aps.toFixed(2), r.apm.toFixed(2), r.apl.toFixed(2), r.ar.toFixed(2)];
      }
    });
  }

  /* ---------------- Pareto chart (task-switchable) ----------------
     Each task has its own axis ranges; pose/obb use a log latency axis
     because their baselines span an order of magnitude. */
  var CHART_CFG = {
    det: {
      data: DATA, yKey: "ap", metric: "AP", scales: true,
      title: "COCO box AP vs. minimum latency",
      sub: "val2017 · 640×640 · lower-right is slower, higher is better",
      yTitle: "COCO box AP",
      x: { min: 0.75, max: 4.55, log: false, ticks: [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5], fmt: function (v) { return v.toFixed(1); } },
      y: { min: 45.5, max: 60, ticks: [46, 48, 50, 52, 54, 56, 58, 60], fmt: String },
      note: "The green line connects GTR-S/M/L/X. Mean and median latencies stay within 0.016&nbsp;ms of the minimum for every GTR variant — the compiled path is stable, not a timing outlier."
    },
    seg: {
      data: SEG_DATA, yKey: "ap", metric: "mask AP", scales: true,
      title: "COCO mask AP vs. minimum latency",
      sub: "val2017 · 640×640 · instance segmentation",
      yTitle: "COCO mask AP",
      x: { min: 0.95, max: 4.45, log: false, ticks: [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0], fmt: function (v) { return v.toFixed(1); } },
      y: { min: 39.3, max: 50.3, ticks: [40, 42, 44, 46, 48, 50], fmt: String },
      note: "The green line connects GTR-S/M/L/X with the mask head. GTR is first in mask AP in all four scale groups — without SAM2 pseudo-mask pre-training."
    },
    pose: {
      data: POSE_DATA, yKey: "ap", metric: "keypoint AP", scales: true,
      title: "COCO keypoint AP vs. minimum latency",
      sub: "val2017 · human pose · log-scale latency axis",
      yTitle: "COCO keypoint AP",
      x: { min: 0.55, max: 12.5, log: true, ticks: [0.6, 1, 2, 5, 10], fmt: String },
      y: { min: 57.5, max: 76.5, ticks: [58, 60, 62, 64, 66, 68, 70, 72, 74, 76], fmt: String },
      note: "The green line connects GTR-S/M/L/X with the pose head — note the log-scale latency axis: ED-Pose needs 10.3&nbsp;ms for the keypoint AP that GTR-X reaches at 2.4&nbsp;ms."
    },
    obb: {
      data: OBB_DATA, yKey: "ap50", metric: "AP50", scales: false,
      title: "DOTA-v1.0 AP50 vs. minimum latency",
      sub: "test set · oriented boxes · log-scale latency axis",
      yTitle: "DOTA-v1.0 AP50",
      x: { min: 0.6, max: 18, log: true, ticks: [0.7, 1, 2, 5, 10, 15], fmt: String },
      y: { min: 77.3, max: 80.7, ticks: [77.5, 78, 78.5, 79, 79.5, 80, 80.5], fmt: function (v) { return v.toFixed(1); } },
      note: "GTR-X reaches 80.9 AP<sub>50</sub> at 3.763&nbsp;ms — DETR-family accuracy at a fraction of DETR-family latency (the other DETR-based models need 9.3–15.5&nbsp;ms)."
    }
  };

  function buildChart() {
    var wrap = document.getElementById("gtr-chart");
    if (!wrap) return;
    var NS = "http://www.w3.org/2000/svg";
    var W = 960, H = 540;
    var M = { l: 62, r: 26, t: 30, b: 58 };

    var titleEl = document.getElementById("gtr-chart-title");
    var subEl = document.getElementById("gtr-chart-sub");
    var noteEl = document.getElementById("gtr-chart-note-text");
    var scaleRow = document.getElementById("gtr-chart-chips");
    var taskRow = document.getElementById("gtr-chart-tasks");

    /* tooltip — one node, reattached on every redraw */
    var tip = document.createElement("div");
    tip.className = "gtr-tip";
    var tipVal = document.createElement("div");
    tipVal.className = "tip-val";
    var tipName = document.createElement("div");
    tipName.className = "tip-name";
    var tipKey = document.createElement("span");
    tipKey.className = "tip-key";
    var tipTxt = document.createElement("span");
    tipName.appendChild(tipKey);
    tipName.appendChild(tipTxt);
    tip.appendChild(tipVal);
    tip.appendChild(tipName);

    var state = { cfg: CHART_CFG.det, scale: "All", ptEls: [], lblEls: [], frontier: null };

    /* backbone disambiguates duplicate model names (OBB table) */
    function ptName(d) {
      return d.m + (d.bb && d.f !== "gtr" ? " (" + d.bb + ")" : "") + (d.f === "gtr" ? " (ours)" : "");
    }
    function visible(d) {
      return !state.cfg.scales || state.scale === "All" || d.g === state.scale;
    }
    function showTip(p) {
      var d = p.d, cfg = state.cfg;
      tipVal.textContent = d[cfg.yKey].toFixed(1) + " " + cfg.metric + " · " + d.lat.toFixed(3) + " ms";
      tipTxt.textContent = ptName(d) + " · " + d.p + "M params · " + FAMILY_NAME[d.f];
      tipKey.style.background = COLORS[d.f];
      var rect = wrap.getBoundingClientRect();
      var px = p.cx / W * rect.width, py = p.cy / H * rect.height;
      tip.classList.add("show");
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var lx = px + 16, ly = py - th - 12;
      if (lx + tw > rect.width - 4) lx = px - tw - 16;
      if (ly < 2) ly = py + 16;
      tip.style.left = lx + "px";
      tip.style.top = ly + "px";
    }
    function hideTip() { tip.classList.remove("show"); }

    function draw(taskKey) {
      var cfg = CHART_CFG[taskKey];
      state.cfg = cfg;
      state.scale = "All";
      state.ptEls = [];
      state.lblEls = [];
      state.frontier = null;

      /* reset the scale chips; hide the row for tasks without scale groups */
      if (scaleRow) {
        scaleRow.style.display = cfg.scales ? "" : "none";
        scaleRow.querySelectorAll(".gtr-chip").forEach(function (c) {
          var isAll = c.getAttribute("data-scale") === "All";
          c.classList.toggle("active", isAll);
          c.setAttribute("aria-pressed", isAll ? "true" : "false");
        });
      }
      if (titleEl) titleEl.textContent = cfg.title;
      if (subEl) subEl.textContent = cfg.sub;
      if (noteEl) noteEl.innerHTML = cfg.note;

      var xa = cfg.x, ya = cfg.y;
      function sx(v) {
        var t = xa.log
          ? (Math.log(v) - Math.log(xa.min)) / (Math.log(xa.max) - Math.log(xa.min))
          : (v - xa.min) / (xa.max - xa.min);
        return M.l + t * (W - M.l - M.r);
      }
      function sy(v) { return H - M.b - (v - ya.min) / (ya.max - ya.min) * (H - M.t - M.b); }

      wrap.innerHTML = "";
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "Scatter plot: " + cfg.title + " for GTR and baselines. GTR variants sit on the upper-left Pareto frontier. The same numbers are available in the results tables.");

      function el(tag, attrs, parent) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) e.setAttribute(k, attrs[k]);
        (parent || svg).appendChild(e);
        return e;
      }

      /* gridlines + ticks */
      xa.ticks.forEach(function (xt) {
        el("line", { x1: sx(xt), y1: M.t, x2: sx(xt), y2: H - M.b, stroke: "#e7e6e1", "stroke-width": 1 });
        var tx = el("text", { x: sx(xt), y: H - M.b + 22, "text-anchor": "middle", "font-size": 12, fill: "#898781" });
        tx.textContent = xa.fmt(xt);
      });
      ya.ticks.forEach(function (yt) {
        el("line", { x1: M.l, y1: sy(yt), x2: W - M.r, y2: sy(yt), stroke: "#e7e6e1", "stroke-width": 1 });
        var ty = el("text", { x: M.l - 10, y: sy(yt) + 4, "text-anchor": "end", "font-size": 12, fill: "#898781" });
        ty.textContent = ya.fmt(yt);
      });
      /* axis lines */
      el("line", { x1: M.l, y1: H - M.b, x2: W - M.r, y2: H - M.b, stroke: "#c3c2b7", "stroke-width": 1 });
      el("line", { x1: M.l, y1: M.t, x2: M.l, y2: H - M.b, stroke: "#c3c2b7", "stroke-width": 1 });
      /* axis titles */
      var xl = el("text", { x: (M.l + W - M.r) / 2, y: H - 14, "text-anchor": "middle", "font-size": 13, fill: "#52514e" });
      xl.textContent = "Min. latency (ms" + (xa.log ? ", log scale" : "") + ") · RTX 4090, FP16, batch = 1";
      var ylt = el("text", { x: M.l, y: M.t - 12, "text-anchor": "start", "font-size": 13, fill: "#52514e" });
      ylt.textContent = cfg.yTitle;
      /* "better" hint — top-left, where the frontier points */
      var hint = el("text", { x: M.l + 14, y: M.t + 20, "text-anchor": "start", "font-size": 12, fill: "#b0aea6", "font-style": "italic" });
      hint.textContent = "↖ faster & more accurate";

      /* GTR frontier line (drawn under the points) */
      var gtrPts = cfg.data.filter(function (d) { return d.f === "gtr"; });
      if (gtrPts.length > 1) {
        var path = gtrPts.map(function (d, i) { return (i ? "L" : "M") + sx(d.lat) + " " + sy(d[cfg.yKey]); }).join(" ");
        state.frontier = el("path", {
          d: path, fill: "none", stroke: COLORS.gtr, "stroke-width": 2,
          "stroke-linecap": "round", "stroke-linejoin": "round", "class": "gtr-frontier"
        });
      }

      /* points: YOLO, then DETR, then GTR on top */
      var order = { yolo: 0, detr: 1, gtr: 2 };
      var sorted = cfg.data.slice().sort(function (a, b) { return order[a.f] - order[b.f]; });
      sorted.forEach(function (d) {
        var cx = sx(d.lat), cy = sy(d[cfg.yKey]);
        var g = el("g", { "class": "gtr-pt", "data-g": d.g });
        var mark = document.createElementNS(NS, "g");
        mark.setAttribute("class", "gtr-pt-mark");
        if (d.f === "gtr") {
          var s = 13;
          el("rect", { x: cx - s / 2, y: cy - s / 2, width: s, height: s, rx: 2.5, fill: COLORS.gtr, stroke: "#ffffff", "stroke-width": 2 }, mark);
        } else if (d.f === "detr") {
          el("circle", { cx: cx, cy: cy, r: 5.6, fill: COLORS.detr, stroke: "#ffffff", "stroke-width": 2 }, mark);
        } else {
          var r = 6.6;
          var tri = "M" + cx + " " + (cy - r) + " L" + (cx + r * 0.9) + " " + (cy + r * 0.7) + " L" + (cx - r * 0.9) + " " + (cy + r * 0.7) + " Z";
          el("path", { d: tri, fill: COLORS.yolo, stroke: "#ffffff", "stroke-width": 2 }, mark);
        }
        g.appendChild(mark);
        /* generous transparent hit target (~28px) with keyboard focus */
        var hit = el("circle", { cx: cx, cy: cy, r: 14, "class": "gtr-pt-hit", tabindex: 0, role: "img",
          "aria-label": ptName(d) + ": " + d[cfg.yKey].toFixed(1) + " " + cfg.metric + " at " + d.lat.toFixed(3) + " milliseconds, " + d.p + " million parameters" }, g);
        svg.appendChild(g);
        state.ptEls.push({ d: d, g: g, cx: cx, cy: cy, hit: hit });
      });

      /* selective direct labels */
      cfg.data.forEach(function (d) {
        if (!d.lbl) return;
        var anchor = d.lbl[0] < 0 ? "end" : "start";
        var t = el("text", {
          x: sx(d.lat) + d.lbl[0], y: sy(d[cfg.yKey]) + d.lbl[1] + 4,
          "text-anchor": anchor, "font-size": 12.5,
          "font-weight": d.f === "gtr" ? 600 : 400,
          fill: d.f === "gtr" ? "#1a1a19" : "#52514e", "class": "gtr-lbl", "data-g": d.g
        });
        t.textContent = (d.f === "gtr" ? d.m : ptName(d)) + " · " + d[cfg.yKey].toFixed(1);
        state.lblEls.push(t);
      });

      wrap.appendChild(svg);
      wrap.appendChild(tip);
      hideTip();

      /* nearest-point hover across the whole svg */
      svg.addEventListener("pointermove", function (ev) {
        var rect = wrap.getBoundingClientRect();
        var mx = (ev.clientX - rect.left) / rect.width * W;
        var my = (ev.clientY - rect.top) / rect.height * H;
        var bestP = null, bestD = 1e9;
        state.ptEls.forEach(function (p) {
          if (!visible(p.d)) return;
          var dx = p.cx - mx, dy = p.cy - my;
          var dist = dx * dx + dy * dy;
          if (dist < bestD) { bestD = dist; bestP = p; }
        });
        if (bestP && bestD < 42 * 42) showTip(bestP);
        else hideTip();
      });
      svg.addEventListener("pointerleave", hideTip);
      state.ptEls.forEach(function (p) {
        p.hit.addEventListener("focus", function () { showTip(p); });
        p.hit.addEventListener("blur", hideTip);
      });
    }

    /* scale-group filter chips (bound once, act on current task) */
    if (scaleRow) {
      scaleRow.querySelectorAll(".gtr-chip").forEach(function (chip) {
        chip.addEventListener("click", function () {
          scaleRow.querySelectorAll(".gtr-chip").forEach(function (c) {
            c.classList.toggle("active", c === chip);
            c.setAttribute("aria-pressed", c === chip ? "true" : "false");
          });
          state.scale = chip.getAttribute("data-scale");
          state.ptEls.forEach(function (p) { p.g.classList.toggle("dim", !visible(p.d)); });
          state.lblEls.forEach(function (t) {
            t.classList.toggle("dim", !(state.scale === "All" || t.getAttribute("data-g") === state.scale));
          });
          if (state.frontier) state.frontier.classList.toggle("dim", state.scale !== "All");
          hideTip();
        });
      });
    }

    /* task switcher chips */
    if (taskRow) {
      taskRow.querySelectorAll(".gtr-chip").forEach(function (chip) {
        chip.addEventListener("click", function () {
          taskRow.querySelectorAll(".gtr-chip").forEach(function (c) {
            c.classList.toggle("active", c === chip);
            c.setAttribute("aria-pressed", c === chip ? "true" : "false");
          });
          draw(chip.getAttribute("data-task"));
        });
      });
    }

    draw("det");
  }

  /* ---------------- magnifier lens (AnyUp-style) ----------------
     One shared fixed-position circular lens; attach with class="gtr-zoom".
     The inner image mirrors the target's rendered size, so the transform
     chain translate(r,r) · scale(zoom) · translate(-x,-y) brings the pixel
     under the cursor to the lens centre using compositor-only transforms. */
  function initMagnifier() {
    var imgs = document.querySelectorAll("img.gtr-zoom");
    if (!imgs.length) return;
    var ZOOM = 2.5;
    var lens = document.createElement("div");
    lens.id = "gtr-lens";
    var lensImg = document.createElement("img");
    lensImg.alt = "";
    lensImg.setAttribute("aria-hidden", "true");
    lens.appendChild(lensImg);
    document.body.appendChild(lens);

    var target = null, rect = null, last = null, raf = 0, radius = 105;

    function sync() {
      if (!target) return;
      rect = target.getBoundingClientRect();
      lensImg.style.width = rect.width + "px";
      lensImg.style.height = rect.height + "px";
      var src = target.currentSrc || target.src;
      if (lensImg.getAttribute("src") !== src) lensImg.src = src;
      radius = lens.offsetWidth / 2 || 105;
    }
    function tick() {
      raf = 0;
      if (!last || !rect || !target) return;
      var cx = last.clientX, cy = last.clientY;
      var x = cx - rect.left, y = cy - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        lens.classList.remove("show");
        return;
      }
      lens.classList.add("show");
      lens.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      lensImg.style.transform =
        "translate3d(" + radius + "px," + radius + "px,0) " +
        "scale(" + ZOOM + ") " +
        "translate3d(" + (-x) + "px," + (-y) + "px,0)";
    }
    function onMove(e) {
      last = e;
      if (!raf) raf = requestAnimationFrame(tick);
    }
    imgs.forEach(function (img) {
      img.addEventListener("pointerenter", function (e) { target = img; sync(); onMove(e); });
      img.addEventListener("pointermove", onMove, { passive: true });
      img.addEventListener("pointerdown", onMove, { passive: true });
      img.addEventListener("pointerleave", function () {
        target = null;
        last = null;
        lens.classList.remove("show");
      });
    });
    function refresh() {
      if (!target) return;
      sync();
      if (!raf) raf = requestAnimationFrame(tick);
    }
    window.addEventListener("scroll", refresh, { passive: true });
    window.addEventListener("resize", refresh, { passive: true });
  }

  /* ---------------- BibTeX copy ---------------- */
  function initCopy() {
    var btn = document.getElementById("gtr-copy-bib");
    var src = document.getElementById("gtr-bibtex");
    if (!btn || !src) return;
    btn.addEventListener("click", function () {
      var text = src.textContent;
      function done() {
        btn.classList.add("copied");
        btn.textContent = "Copied ✓";
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.textContent = "Copy";
        }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        done();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initCounters();
    initTabs();
    buildTaskTables();
    buildChart();
    initMagnifier();
    initCopy();
  });
})();
