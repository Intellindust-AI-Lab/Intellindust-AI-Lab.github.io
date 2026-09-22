/* ============================================================
   GTR project page — interactions
   (scroll reveal, stat counters, tabs, Pareto chart, tables)
   All numbers follow the paper's unified RTX 4090 protocol:
   MEDIAN CUDA-event latency, FP16, batch 1, compiled forward
   pass (CUDA NMS included where required).
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- COCO val2017 object detection (from the paper) ----------------
     f: family — gtr | detr | yolo;  g: scale group
     dd: ‡ — no Objects365 detector pre-training
     alt: shown in the table but excluded from the chart (GTR ‡ variants) */
  var DATA = [
    // ---- S ----
    { m: "YOLOv9-S",         f: "yolo", dd: 1, g: "S", ep: "500",  p: 7,    gf: 26,    lat: 2.294, ap: 46.8, ap50: 61.8, ap75: 48.6, aps: 25.7, apm: 49.9, apl: 61.0 },
    { m: "YOLOv10-S",        f: "yolo", dd: 1, g: "S", ep: "500",  p: 7,    gf: 22,    lat: 0.933, ap: 46.3, ap50: 63.0, ap75: 50.4, aps: 26.8, apm: 51.0, apl: 63.8 },
    { m: "YOLO11-S",         f: "yolo", dd: 1, g: "S", ep: "500",  p: 9,    gf: 22,    lat: 1.490, ap: 46.6, ap50: 63.4, ap75: 50.3, aps: 28.7, apm: 51.3, apl: 64.1 },
    { m: "YOLOv12-S-Turbo",  f: "yolo", dd: 1, g: "S", ep: "600",  p: 9,    gf: 19,    lat: 1.772, ap: 47.6, ap50: 64.5, ap75: 51.5, aps: 28.3, apm: 52.7, apl: 65.9 },
    { m: "RT-DETRv2-S",      f: "detr", dd: 1, g: "S", ep: "120",  p: 20,   gf: 60,    lat: 1.291, ap: 48.1, ap50: 65.1, ap75: 52.1, aps: 30.2, apm: 51.5, apl: 63.9 },
    { m: "DEIM-S",           f: "detr", dd: 1, g: "S", ep: "132*", p: 10,   gf: 25,    lat: 1.180, ap: 49.0, ap50: 65.9, ap75: 53.1, aps: 30.4, apm: 52.6, apl: 65.7 },
    { m: "DEIMv2-S",         f: "detr", dd: 1, g: "S", ep: "132*", p: 10,   gf: 26,    lat: 1.687, ap: 50.9, ap50: 68.4, ap75: 55.1, aps: 31.3, apm: 55.3, apl: 70.2 },
    { m: "RT-DETRv4-S",      f: "detr", dd: 1, g: "S", ep: "132*", p: 10,   gf: 25,    lat: 1.174, ap: 49.7, ap50: 66.8, ap75: 54.1, aps: 30.2, apm: 53.6, apl: 66.9 },
    { m: "LW-DETR-S",        f: "detr",        g: "S", ep: "60",   p: 15,   gf: 17,    lat: 1.123, ap: 48.0, ap50: 66.9, ap75: 51.7, aps: 26.8, apm: 52.5, apl: 65.5 },
    { m: "D-FINE-S",         f: "detr",        g: "S", ep: "—",    p: 10,   gf: 25,    lat: 1.194, ap: 50.7, ap50: 67.6, ap75: 55.1, aps: 32.7, apm: 54.6, apl: 66.5 },
    { m: "RF-DETR-S",        f: "detr",        g: "S", ep: "—",    p: 32,   gf: 60,    lat: 1.299, ap: 52.9, ap50: 71.9, ap75: 57.0, aps: 32.0, apm: 58.3, apl: 73.0, lbl: [8, 12] },
    { m: "YOLO26-S",         f: "yolo",        g: "S", ep: "70",   p: 10,   gf: 21,    lat: 0.962, ap: 47.8, ap50: 64.6, ap75: 52.1, aps: 29.1, apm: 52.5, apl: 64.3 },
    { m: "ECDet-S",          f: "detr", dd: 1, g: "S", ep: "74",   p: 10,   gf: 26,    lat: 1.652, ap: 51.7, ap50: 69.4, ap75: 55.8, aps: 32.3, apm: 56.4, apl: 70.5 },
    { m: "GTR-S",            f: "gtr",  dd: 1, g: "S", ep: "30",   p: 12.1, gf: 33.8,  lat: 1.225, ap: 50.7, ap50: 68.5, ap75: 54.7, aps: 31.1, apm: 55.5, apl: 70.2, alt: 1 },
    { m: "GTR-S",            f: "gtr",         g: "S", ep: "30",   p: 12.1, gf: 33.8,  lat: 1.225, ap: 53.6, ap50: 71.1, ap75: 58.3, aps: 36.4, apm: 58.3, apl: 70.2, lbl: [-10, -12] },
    // ---- M ----
    { m: "YOLOv9-M",         f: "yolo", dd: 1, g: "M", ep: "500",  p: 20,   gf: 76,    lat: 2.675, ap: 51.4, ap50: 67.2, ap75: 54.6, aps: 32.0, apm: 55.7, apl: 66.4 },
    { m: "YOLOv10-M",        f: "yolo", dd: 1, g: "M", ep: "500",  p: 15,   gf: 59,    lat: 1.426, ap: 51.1, ap50: 68.1, ap75: 55.8, aps: 33.8, apm: 56.5, apl: 67.0 },
    { m: "YOLO11-M",         f: "yolo", dd: 1, g: "M", ep: "500",  p: 20,   gf: 68,    lat: 2.061, ap: 51.2, ap50: 67.9, ap75: 55.3, aps: 33.0, apm: 56.7, apl: 67.5 },
    { m: "YOLOv12-M-Turbo",  f: "yolo", dd: 1, g: "M", ep: "600",  p: 20,   gf: 60,    lat: 2.342, ap: 52.5, ap50: 69.9, ap75: 57.1, aps: 35.2, apm: 57.8, apl: 69.7 },
    { m: "RT-DETRv2-M",      f: "detr", dd: 1, g: "M", ep: "120",  p: 31,   gf: 92,    lat: 1.741, ap: 49.9, ap50: 67.5, ap75: 54.1, aps: 32.0, apm: 53.2, apl: 66.5 },
    { m: "DEIM-M",           f: "detr", dd: 1, g: "M", ep: "102*", p: 19,   gf: 57,    lat: 1.744, ap: 52.7, ap50: 70.0, ap75: 57.3, aps: 35.3, apm: 56.7, apl: 69.5 },
    { m: "DEIMv2-M",         f: "detr", dd: 1, g: "M", ep: "102*", p: 18,   gf: 52,    lat: 2.398, ap: 53.0, ap50: 70.2, ap75: 57.6, aps: 34.2, apm: 57.4, apl: 71.5 },
    { m: "RT-DETRv4-M",      f: "detr", dd: 1, g: "M", ep: "102*", p: 19,   gf: 57,    lat: 1.742, ap: 53.5, ap50: 71.1, ap75: 58.1, aps: 34.9, apm: 57.7, apl: 72.1 },
    { m: "LW-DETR-M",        f: "detr",        g: "M", ep: "60",   p: 28,   gf: 43,    lat: 1.449, ap: 52.6, ap50: 69.9, ap75: 56.7, aps: 32.6, apm: 57.7, apl: 70.7 },
    { m: "D-FINE-M",         f: "detr",        g: "M", ep: "—",    p: 19,   gf: 57,    lat: 1.740, ap: 55.1, ap50: 72.6, ap75: 59.7, aps: 37.9, apm: 59.4, apl: 71.7 },
    { m: "RF-DETR-M",        f: "detr",        g: "M", ep: "—",    p: 34,   gf: 79,    lat: 1.431, ap: 54.7, ap50: 73.5, ap75: 59.2, aps: 36.1, apm: 59.7, apl: 73.8, lbl: [8, 12] },
    { m: "YOLO26-M",         f: "yolo",        g: "M", ep: "80",   p: 20,   gf: 68,    lat: 1.473, ap: 52.5, ap50: 69.8, ap75: 57.2, aps: 36.2, apm: 56.9, apl: 68.5 },
    { m: "ECDet-M",          f: "detr", dd: 1, g: "M", ep: "62",   p: 18,   gf: 53,    lat: 2.095, ap: 54.3, ap50: 72.2, ap75: 58.7, aps: 35.9, apm: 59.1, apl: 72.7 },
    { m: "GTR-M",            f: "gtr",  dd: 1, g: "M", ep: "30",   p: 22.7, gf: 62.6,  lat: 1.462, ap: 54.0, ap50: 72.2, ap75: 58.5, aps: 35.3, apm: 59.1, apl: 73.1, alt: 1 },
    { m: "GTR-M",            f: "gtr",         g: "M", ep: "30",   p: 22.7, gf: 62.6,  lat: 1.462, ap: 57.3, ap50: 75.0, ap75: 62.4, aps: 41.1, apm: 62.0, apl: 74.1, lbl: [-10, -12] },
    // ---- L ----
    { m: "YOLOv9-C",         f: "yolo", dd: 1, g: "L", ep: "500",  p: 25,   gf: 102,   lat: 2.680, ap: 53.0, ap50: 70.2, ap75: 57.8, aps: 36.2, apm: 58.5, apl: 69.3 },
    { m: "YOLOv10-L",        f: "yolo", dd: 1, g: "L", ep: "500",  p: 24,   gf: 120,   lat: 2.056, ap: 53.2, ap50: 70.1, ap75: 58.1, aps: 35.8, apm: 58.5, apl: 69.4 },
    { m: "YOLO11-L",         f: "yolo", dd: 1, g: "L", ep: "500",  p: 25,   gf: 87,    lat: 2.617, ap: 53.4, ap50: 70.1, ap75: 58.2, aps: 35.6, apm: 59.1, apl: 69.2 },
    { m: "YOLOv12-L-Turbo",  f: "yolo", dd: 1, g: "L", ep: "600",  p: 27,   gf: 82,    lat: 3.305, ap: 53.8, ap50: 71.0, ap75: 58.6, aps: 36.9, apm: 59.4, apl: 71.0 },
    { m: "RT-DETRv2-L",      f: "detr", dd: 1, g: "L", ep: "72",   p: 42,   gf: 136,   lat: 2.332, ap: 53.4, ap50: 71.6, ap75: 57.4, aps: 36.1, apm: 57.9, apl: 70.8 },
    { m: "DEIM-L",           f: "detr", dd: 1, g: "L", ep: "58*",  p: 31,   gf: 91,    lat: 2.460, ap: 54.7, ap50: 72.4, ap75: 59.4, aps: 36.9, apm: 59.6, apl: 71.8 },
    { m: "DEIMv2-L",         f: "detr", dd: 1, g: "L", ep: "68*",  p: 32,   gf: 97,    lat: 2.776, ap: 56.0, ap50: 73.5, ap75: 61.1, aps: 37.6, apm: 60.9, apl: 74.9 },
    { m: "RT-DETRv4-L",      f: "detr", dd: 1, g: "L", ep: "58*",  p: 31,   gf: 91,    lat: 2.464, ap: 55.4, ap50: 73.0, ap75: 60.3, aps: 37.1, apm: 60.1, apl: 72.9 },
    { m: "LW-DETR-L",        f: "detr",        g: "L", ep: "60",   p: 47,   gf: 72,    lat: 2.174, ap: 56.1, ap50: 74.6, ap75: 60.9, aps: 37.2, apm: 60.4, apl: 73.0 },
    { m: "D-FINE-L",         f: "detr",        g: "L", ep: "—",    p: 31,   gf: 91,    lat: 2.462, ap: 57.1, ap50: 74.7, ap75: 62.0, aps: 40.0, apm: 61.5, apl: 74.2, lbl: [8, 12] },
    { m: "RF-DETR-L",        f: "detr",        g: "L", ep: "—",    p: 34,   gf: 126,   lat: 1.968, ap: 56.5, ap50: 75.1, ap75: 61.3, aps: 39.0, apm: 61.0, apl: 73.9 },
    { m: "YOLO26-L",         f: "yolo",        g: "L", ep: "60",   p: 25,   gf: 86,    lat: 1.967, ap: 54.3, ap50: 71.5, ap75: 59.4, aps: 37.8, apm: 58.6, apl: 70.3 },
    { m: "ECDet-L",          f: "detr", dd: 1, g: "L", ep: "50",   p: 31,   gf: 101,   lat: 2.730, ap: 57.0, ap50: 75.1, ap75: 61.7, aps: 38.7, apm: 62.5, apl: 75.0 },
    { m: "GTR-L",            f: "gtr",  dd: 1, g: "L", ep: "30",   p: 37.2, gf: 106,   lat: 1.908, ap: 55.5, ap50: 73.7, ap75: 60.3, aps: 36.8, apm: 61.1, apl: 74.8, alt: 1 },
    { m: "GTR-L",            f: "gtr",         g: "L", ep: "30",   p: 37.2, gf: 106,   lat: 1.908, ap: 58.9, ap50: 76.8, ap75: 64.3, aps: 42.4, apm: 64.0, apl: 76.0, lbl: [-10, -12] },
    // ---- X ----
    { m: "YOLOv9-E",         f: "yolo", dd: 1, g: "X", ep: "500",  p: 57,   gf: 189,   lat: 4.598, ap: 55.6, ap50: 72.8, ap75: 60.6, aps: 40.2, apm: 61.0, apl: 71.4 },
    { m: "YOLOv10-X",        f: "yolo", dd: 1, g: "X", ep: "500",  p: 30,   gf: 160,   lat: 2.482, ap: 54.4, ap50: 71.3, ap75: 59.3, aps: 37.0, apm: 59.8, apl: 70.9 },
    { m: "YOLO11-X",         f: "yolo", dd: 1, g: "X", ep: "500",  p: 57,   gf: 195,   lat: 3.747, ap: 54.7, ap50: 71.6, ap75: 59.5, aps: 37.7, apm: 59.7, apl: 70.2 },
    { m: "YOLOv12-X-Turbo",  f: "yolo", dd: 1, g: "X", ep: "600",  p: 59,   gf: 185,   lat: 4.769, ap: 55.4, ap50: 72.5, ap75: 60.3, aps: 38.9, apm: 60.8, apl: 70.9 },
    { m: "RT-DETRv2-X",      f: "detr", dd: 1, g: "X", ep: "72",   p: 76,   gf: 259,   lat: 3.259, ap: 54.3, ap50: 72.8, ap75: 58.8, aps: 35.8, apm: 58.8, apl: 72.1 },
    { m: "DEIM-X",           f: "detr", dd: 1, g: "X", ep: "58*",  p: 62,   gf: 202,   lat: 3.384, ap: 56.5, ap50: 74.0, ap75: 61.5, aps: 38.8, apm: 61.4, apl: 74.2 },
    { m: "DEIMv2-X",         f: "detr", dd: 1, g: "X", ep: "58*",  p: 50,   gf: 152,   lat: 3.276, ap: 57.8, ap50: 75.3, ap75: 63.2, aps: 39.1, apm: 62.9, apl: 75.9 },
    { m: "RT-DETRv4-X",      f: "detr", dd: 1, g: "X", ep: "58*",  p: 62,   gf: 202,   lat: 3.363, ap: 57.0, ap50: 74.6, ap75: 62.1, aps: 39.5, apm: 61.9, apl: 74.8 },
    { m: "LW-DETR-X",        f: "detr",        g: "X", ep: "60",   p: 118,  gf: 174,   lat: 3.686, ap: 58.3, ap50: 76.9, ap75: 63.3, aps: 40.9, apm: 63.3, apl: 74.8 },
    { m: "D-FINE-X",         f: "detr",        g: "X", ep: "—",    p: 62,   gf: 202,   lat: 3.385, ap: 59.3, ap50: 76.8, ap75: 64.6, aps: 42.3, apm: 64.2, apl: 76.4, lbl: [8, -12] },
    { m: "RF-DETR-X",        f: "detr",        g: "X", ep: "—",    p: 126,  gf: 300,   lat: 3.243, ap: 58.6, ap50: 77.4, ap75: 63.8, aps: 40.3, apm: 63.9, apl: 76.2, lbl: [8, 12] },
    { m: "YOLO26-X",         f: "yolo",        g: "X", ep: "40",   p: 55,   gf: 194,   lat: 3.087, ap: 56.9, ap50: 74.1, ap75: 62.1, aps: 41.3, apm: 61.2, apl: 72.7 },
    { m: "ECDet-X",          f: "detr", dd: 1, g: "X", ep: "50",   p: 49,   gf: 151,   lat: 3.021, ap: 57.9, ap50: 76.0, ap75: 62.9, aps: 38.7, apm: 63.4, apl: 76.1 },
    { m: "GTR-X",            f: "gtr",  dd: 1, g: "X", ep: "30",   p: 46.5, gf: 130.2, lat: 2.115, ap: 56.2, ap50: 74.5, ap75: 61.1, aps: 37.3, apm: 61.8, apl: 74.9, alt: 1 },
    { m: "GTR-X",            f: "gtr",         g: "X", ep: "30",   p: 46.5, gf: 130.2, lat: 2.115, ap: 59.4, ap50: 77.3, ap75: 64.7, aps: 42.1, apm: 64.6, apl: 76.4, lbl: [-10, -12] }
  ];

  /* ---------------- GTR-S resolution sweep on COCO val2017 (from the paper) ----------------
     Fine-tuned at each resolution from the complete Objects365 pre-trained detector weights. */
  var RES_DATA = [
    { m: "640×640",     g: "res", gf: 33.8,  mem: 0.096, lat: 1.225, rate: 816.3, ap: 53.6, ap50: 71.1, ap75: 58.3, aps: 36.4, apm: 58.3, apl: 70.2 },
    { m: "704×704",     g: "res", gf: 40.4,  mem: 0.121, lat: 1.317, rate: 759.3, ap: 54.3, ap50: 71.7, ap75: 59.1, aps: 37.5, apm: 59.0, apl: 70.2 },
    { m: "768×768",     g: "res", gf: 47.8,  mem: 0.138, lat: 1.421, rate: 703.7, ap: 55.1, ap50: 72.5, ap75: 60.2, aps: 38.7, apm: 59.6, apl: 70.7 },
    { m: "832×832",     g: "res", gf: 55.8,  mem: 0.142, lat: 1.550, rate: 645.2, ap: 55.5, ap50: 72.9, ap75: 60.6, aps: 39.8, apm: 60.0, apl: 70.8 },
    { m: "896×896",     g: "res", gf: 64.5,  mem: 0.156, lat: 1.714, rate: 583.4, ap: 56.0, ap50: 73.3, ap75: 61.2, aps: 41.4, apm: 60.0, apl: 70.5 },
    { m: "960×960",     g: "res", gf: 73.7,  mem: 0.172, lat: 1.784, rate: 560.5, ap: 56.2, ap50: 73.5, ap75: 61.6, aps: 40.7, apm: 60.4, apl: 70.0 },
    { m: "1024×1024",   g: "res", gf: 83.7,  mem: 0.171, lat: 1.844, rate: 542.3, ap: 56.6, ap50: 73.9, ap75: 61.9, aps: 42.1, apm: 60.8, apl: 70.4 },
    { m: "1152×1152",   g: "res", gf: 105.4, mem: 0.224, lat: 2.157, rate: 463.6, ap: 56.7, ap50: 74.0, ap75: 62.1, aps: 41.9, apm: 60.8, apl: 70.3 },
    { m: "1280×1280",   g: "res", gf: 129.8, mem: 0.249, lat: 2.529, rate: 395.4, ap: 57.0, ap50: 74.4, ap75: 62.5, aps: 42.4, apm: 61.0, apl: 70.0 }
  ];

  var COLORS = { gtr: "#1baf7a", detr: "#2a78d6", yolo: "#eb6834" };
  var FAMILY_NAME = { gtr: "GTR (ours)", detr: "DETR-style", yolo: "YOLO / CNN family" };

  /* ---------------- COCO instance segmentation, mask AP (from the paper) ----------------
     o365: † — Objects365 pre-training with SAM2-generated pseudo masks */
  var SEG_DATA = [
    // ---- S ----
    { m: "YOLO26-Seg-S",   f: "yolo", o365: 1, g: "S", p: 10.4, gf: 34.2,  lat: 1.163, ap: 40.0, ap50: 61.5, ap75: 43.0, aps: 21.0, apm: 44.5, apl: 57.3 },
    { m: "RF-DETR-Seg-S",  f: "detr", o365: 1, g: "S", p: 33.7, gf: 70.6,  lat: 1.445, ap: 43.1, ap50: 66.2, ap75: 45.9, aps: 21.9, apm: 48.5, apl: 64.1, lbl: [8, 12] },
    { m: "ECInsSeg-S",     f: "detr",          g: "S", p: 10.3, gf: 33.1,  lat: 1.755, ap: 43.0, ap50: 65.7, ap75: 46.0, aps: 20.8, apm: 46.3, apl: 65.9 },
    { m: "GTR-S",          f: "gtr",           g: "S", p: 12.6, gf: 46.8,  lat: 1.465, ap: 45.0, ap50: 67.9, ap75: 48.3, aps: 23.8, apm: 48.4, apl: 65.9, lbl: [-10, -12] },
    // ---- M ----
    { m: "YOLO26-Seg-M",   f: "yolo", o365: 1, g: "M", p: 23.6, gf: 121.5, lat: 2.004, ap: 44.1, ap50: 66.8, ap75: 47.7, aps: 25.6, apm: 48.9, apl: 60.2 },
    { m: "RF-DETR-Seg-M",  f: "detr", o365: 1, g: "M", p: 35.7, gf: 102.0, lat: 1.672, ap: 45.3, ap50: 68.4, ap75: 48.8, aps: 25.5, apm: 50.4, apl: 65.3 },
    { m: "ECInsSeg-M",     f: "detr",          g: "M", p: 20.1, gf: 64.2,  lat: 2.252, ap: 45.2, ap50: 68.2, ap75: 48.3, aps: 22.9, apm: 49.0, apl: 68.1 },
    { m: "GTR-M",          f: "gtr",           g: "M", p: 23.6, gf: 84.2,  lat: 1.807, ap: 47.7, ap50: 71.3, ap75: 51.6, aps: 27.7, apm: 51.3, apl: 69.3, lbl: [-10, -12] },
    // ---- L ----
    { m: "YOLO26-Seg-L",   f: "yolo", o365: 1, g: "L", p: 28.0, gf: 139.8, lat: 2.597, ap: 45.5, ap50: 68.7, ap75: 49.2, aps: 27.1, apm: 50.4, apl: 62.8 },
    { m: "RF-DETR-Seg-L",  f: "detr", o365: 1, g: "L", p: 36.2, gf: 151.1, lat: 2.055, ap: 47.1, ap50: 70.5, ap75: 50.9, aps: 28.4, apm: 52.1, apl: 65.6 },
    { m: "ECInsSeg-L",     f: "detr",          g: "L", p: 33.6, gf: 110.8, lat: 2.869, ap: 47.1, ap50: 70.9, ap75: 50.5, aps: 24.8, apm: 51.1, apl: 69.6 },
    { m: "GTR-L",          f: "gtr",           g: "L", p: 38.1, gf: 127.6, lat: 2.250, ap: 49.5, ap50: 73.5, ap75: 53.6, aps: 28.5, apm: 53.5, apl: 71.3, lbl: [-10, -12] },
    // ---- X ----
    { m: "YOLO26-Seg-X",   f: "yolo", o365: 1, g: "X", p: 62.8, gf: 313.5, lat: 4.139, ap: 47.0, ap50: 70.8, ap75: 51.1, aps: 29.7, apm: 51.8, apl: 63.1 },
    { m: "RF-DETR-Seg-X",  f: "detr", o365: 1, g: "X", p: 38.1, gf: 260.0, lat: 3.311, ap: 48.8, ap50: 72.2, ap75: 53.1, aps: 30.6, apm: 53.3, apl: 65.9, lbl: [8, 12] },
    { m: "ECInsSeg-X",     f: "detr",          g: "X", p: 49.9, gf: 168.1, lat: 3.140, ap: 48.4, ap50: 72.2, ap75: 52.0, aps: 26.3, apm: 52.7, apl: 71.1 },
    { m: "GTR-X",          f: "gtr",           g: "X", p: 47.4, gf: 151.6, lat: 2.472, ap: 49.8, ap50: 74.2, ap75: 53.8, aps: 28.5, apm: 53.7, apl: 71.4, lbl: [-10, -12] }
  ];

  /* ---------------- COCO human pose estimation, keypoint metrics (from the paper) ---------------- */
  var POSE_DATA = [
    // ---- S ----
    { m: "RTMO-S",         f: "yolo", g: "S", p: 9.9,  gf: 30.7,  lat: 0.646,  ap: 67.7, ap50: 87.8, ap75: 73.7, apm: null, apl: null, ar: 71.5, lbl: [8, 12] },
    { m: "YOLO11-Pose-S",  f: "yolo", g: "S", p: 9.9,  gf: 23.2,  lat: 0.703,  ap: 58.9, ap50: 86.3, ap75: 64.8, apm: 54.0, apl: 68.0, ar: 66.1 },
    { m: "YOLO26-Pose-S",  f: "yolo", g: "S", p: 10.4, gf: 23.9,  lat: 0.813,  ap: 63.1, ap50: 86.6, ap75: 68.8, apm: 56.5, apl: 73.7, ar: 69.0 },
    { m: "DETRPose-S",     f: "detr", o365: 1, g: "S", p: 11.5, gf: 33.1,  lat: 1.218,  ap: 67.0, ap50: 87.6, ap75: 72.8, apm: 60.2, apl: 77.4, ar: 73.5 },
    { m: "ECPose-S",       f: "detr", g: "S", p: 9.9,  gf: 30.4,  lat: 1.519,  ap: 68.9, ap50: 89.1, ap75: 75.2, apm: 60.7, apl: 81.1, ar: 74.6 },
    { m: "GTR-S",          f: "gtr",  g: "S", p: 11.9, gf: 37.0,  lat: 1.455,  ap: 70.1, ap50: 89.7, ap75: 76.8, apm: 62.6, apl: 81.1, ar: 76.1, lbl: [-10, -12] },
    // ---- M ----
    { m: "RTMO-M",         f: "yolo", g: "M", p: 22.6, gf: 69,    lat: 1.153,  ap: 70.9, ap50: 89.0, ap75: 77.8, apm: null, apl: null, ar: 74.7 },
    { m: "YOLO11-Pose-M",  f: "yolo", g: "M", p: 20.9, gf: 71.7,  lat: 1.227,  ap: 64.9, ap50: 89.4, ap75: 72.4, apm: 62.2, apl: 71.6, ar: 72.2 },
    { m: "YOLO26-Pose-M",  f: "yolo", g: "M", p: 21.5, gf: 73.1,  lat: 1.353,  ap: 68.8, ap50: 89.6, ap75: 75.5, apm: 64.0, apl: 77.2, ar: 74.6 },
    { m: "DETRPose-M",     f: "detr", o365: 1, g: "M", p: 20.8, gf: 67.3,  lat: 1.851,  ap: 69.4, ap50: 89.2, ap75: 75.4, apm: 63.2, apl: 79.0, ar: 75.5 },
    { m: "ECPose-M",       f: "detr", g: "M", p: 19.8, gf: 62.8,  lat: 2.109,  ap: 72.4, ap50: 90.9, ap75: 78.6, apm: 65.2, apl: 83.6, ar: 78.2 },
    { m: "GTR-M",          f: "gtr",  g: "M", p: 22.8, gf: 69.8,  lat: 1.860,  ap: 74.1, ap50: 91.5, ap75: 80.7, apm: 67.5, apl: 84.1, ar: 79.6, lbl: [-10, -12] },
    // ---- L ----
    { m: "RTMO-L",         f: "yolo", g: "L", p: 44.8, gf: 136.7, lat: 1.778,  ap: 72.4, ap50: 89.9, ap75: 78.8, apm: null, apl: null, ar: 76.8 },
    { m: "YOLO11-Pose-L",  f: "yolo", g: "L", p: 26.2, gf: 90.7,  lat: 1.705,  ap: 66.1, ap50: 89.9, ap75: 73.6, apm: 63.2, apl: 73.1, ar: 73.3 },
    { m: "YOLO26-Pose-L",  f: "yolo", g: "L", p: 25.9, gf: 91.3,  lat: 1.788,  ap: 70.4, ap50: 90.5, ap75: 77.4, apm: 65.7, apl: 78.4, ar: 75.9 },
    { m: "DETRPose-L",     f: "detr", o365: 1, g: "L", p: 32.8, gf: 107.1, lat: 2.650,  ap: 72.5, ap50: 90.6, ap75: 79.0, apm: 66.3, apl: 82.2, ar: 78.7 },
    { m: "ECPose-L",       f: "detr", g: "L", p: 34.3, gf: 111.7, lat: 2.783,  ap: 73.5, ap50: 91.7, ap75: 79.9, apm: 66.4, apl: 84.4, ar: 78.8 },
    { m: "GTR-L",          f: "gtr",  g: "L", p: 38.4, gf: 115.5, lat: 2.328,  ap: 74.7, ap50: 91.9, ap75: 81.6, apm: 68.3, apl: 84.5, ar: 79.9, lbl: [-10, -12] },
    // ---- X ----
    { m: "ED-Pose",        f: "detr", g: "X", p: 218,  gf: 422.6, lat: 10.292, ap: 74.3, ap50: 91.5, ap75: 81.7, apm: 68.5, apl: 82.7, ar: null, lbl: [-10, 12] },
    { m: "YOLO11-Pose-X",  f: "yolo", g: "X", p: 58.8, gf: 203.3, lat: 2.777,  ap: 69.5, ap50: 91.1, ap75: 77.4, apm: 66.6, apl: 76.0, ar: 76.3 },
    { m: "YOLO26-Pose-X",  f: "yolo", g: "X", p: 57.6, gf: 201.7, lat: 2.788,  ap: 71.6, ap50: 91.6, ap75: 78.9, apm: 67.4, apl: 79.5, ar: 77.2 },
    { m: "DETRPose-X",     f: "detr", o365: 1, g: "X", p: 73.3, gf: 239.5, lat: 4.145,  ap: 73.3, ap50: 90.5, ap75: 79.4, apm: 67.5, apl: 82.7, ar: 79.4 },
    { m: "ECPose-X",       f: "detr", g: "X", p: 50.6, gf: 172.2, lat: 3.281,  ap: 74.8, ap50: 92.2, ap75: 81.5, apm: 68.0, apl: 85.4, ar: 80.1, lbl: [8, 12] },
    { m: "GTR-X",          f: "gtr",  g: "X", p: 47.6, gf: 142.9, lat: 2.590,  ap: 75.5, ap50: 92.4, ap75: 81.8, apm: 69.1, apl: 85.3, ar: 80.7, lbl: [8, -18] }
  ];

  /* ---------------- DOTA-v1.0 oriented object detection (from the paper) ----------------
     o365 here renders the † mark — single-scale training and testing;
     unmarked methods use multi-scale training and testing.
     RiO-DETR rows have no public implementation to time (lat: null). */
  var OBB_DATA = [
    // ---- CNN-based ----
    { m: "RTMDet-R-m",    f: "yolo", g: "cnn",  bb: "CSPNeXt-m",  p: 24.7, gf: 100,   lat: 2.363,  ap50: 80.3 },
    { m: "RTMDet-R-l",    f: "yolo", g: "cnn",  bb: "CSPNeXt-l",  p: 52.3, gf: 205,   lat: 3.671,  ap50: 80.5 },
    { m: "YOLO26n-obb",   f: "yolo", g: "cnn",  bb: "YOLO26n",    p: 2.4,  gf: 14.8,  lat: 0.693,  ap50: 78.9, lbl: [8, -12] },
    { m: "YOLO26s-obb",   f: "yolo", g: "cnn",  bb: "YOLO26s",    p: 9.8,  gf: 56.7,  lat: 1.099,  ap50: 80.9 },
    { m: "YOLO26m-obb",   f: "yolo", g: "cnn",  bb: "YOLO26m",    p: 21.2, gf: 184.9, lat: 2.093,  ap50: 81.0 },
    { m: "YOLO26l-obb",   f: "yolo", g: "cnn",  bb: "YOLO26l",    p: 25.6, gf: 232.4, lat: 2.707,  ap50: 81.6 },
    { m: "YOLO26x-obb",   f: "yolo", g: "cnn",  bb: "YOLO26x",    p: 57.6, gf: 520.1, lat: 5.085,  ap50: 81.7, lbl: [8, 12] },
    // ---- DETR-based ----
    { m: "RHINO-DETR",    f: "detr", g: "detr", bb: "R-50",       p: 47.6, gf: 566,   lat: 9.314,  ap50: 78.7, o365: 1 },
    { m: "RHINO-DETR",    f: "detr", g: "detr", bb: "Swin-T",     p: 50.8, gf: 609,   lat: 10.365, ap50: 79.4, o365: 1 },
    { m: "Oriented-DETR", f: "detr", g: "detr", bb: "R-50",       p: 57.2, gf: 302,   lat: 14.927, ap50: 79.1, o365: 1 },
    { m: "Oriented-DETR", f: "detr", g: "detr", bb: "Swin-T",     p: 57.7, gf: 309,   lat: 15.492, ap50: 79.8, o365: 1, lbl: [-10, 12] },
    { m: "RiO-DETR-n",    f: "detr", g: "detr", bb: "HGNetv2-B0", p: 4.0,  gf: 17,    lat: null,   ap50: 78.4, o365: 1 },
    { m: "RiO-DETR-s",    f: "detr", g: "detr", bb: "HGNetv2-B0", p: 8.2,  gf: 53,    lat: null,   ap50: 80.3, o365: 1 },
    { m: "RiO-DETR-m",    f: "detr", g: "detr", bb: "HGNetv2-B2", p: 18.6, gf: 158,   lat: null,   ap50: 80.9, o365: 1 },
    { m: "RiO-DETR-l",    f: "detr", g: "detr", bb: "HGNetv2-B4", p: 27.5, gf: 230,   lat: null,   ap50: 81.7, o365: 1 },
    { m: "RiO-DETR-x",    f: "detr", g: "detr", bb: "HGNetv2-B5", p: 62.5, gf: 527,   lat: null,   ap50: 81.8, o365: 1 },
    { m: "RiO-DETR-m",    f: "detr", g: "detr", bb: "HGNetv2-B2", p: 18.6, gf: 158,   lat: null,   ap50: 81.5 },
    { m: "RiO-DETR-x",    f: "detr", g: "detr", bb: "HGNetv2-B5", p: 62.5, gf: 527,   lat: null,   ap50: 81.8 },
    { m: "GTR-S",         f: "gtr",  g: "detr", bb: "GLA",        p: 12.1, gf: 82.8,  lat: 1.946,  ap50: 80.1, lbl: [8, 14] },
    { m: "GTR-X",         f: "gtr",  g: "detr", bb: "GLA",        p: 46.3, gf: 324,   lat: 3.960,  ap50: 81.3, lbl: [-10, -12] }
  ];

  /* ---------------- Cityscapes semantic segmentation (from the paper) ---------------- */
  var SEMSEG_DATA = [
    { m: "YOLO26s-sem", f: "yolo", g: "S", p: 6.5,  gf: 88.8,  lat: 0.758, miou: 80.8 },
    { m: "GTR-S",       f: "gtr",  g: "S", p: 6.9,  gf: 82.8,  lat: 1.495, miou: 81.5, lbl: [-10, -12] },
    { m: "YOLO26m-sem", f: "yolo", g: "M", p: 14.3, gf: 304.5, lat: 1.617, miou: 82.0 },
    { m: "GTR-M",       f: "gtr",  g: "M", p: 12.9, gf: 153.0, lat: 1.970, miou: 83.0, lbl: [-10, -12] },
    { m: "YOLO26l-sem", f: "yolo", g: "L", p: 17.9, gf: 384.7, lat: 2.167, miou: 82.9, lbl: [8, 12] },
    { m: "GTR-L",       f: "gtr",  g: "L", p: 25.0, gf: 258.7, lat: 2.958, miou: 83.2, lbl: [-10, -12] },
    { m: "YOLO26x-sem", f: "yolo", g: "X", p: 40.2, gf: 861.7, lat: 4.325, miou: 83.6, lbl: [-10, 12] },
    { m: "GTR-X",       f: "gtr",  g: "X", p: 32.2, gf: 317.1, lat: 3.482, miou: 83.6, lbl: [-10, -12] }
  ];

  /* ---------------- NYU Depth V2 (Eigen split), ground-truth-aligned (from the paper) ---------------- */
  var DEPTH_DATA = [
    { m: "YOLO26s-depth", f: "yolo", g: "S", p: 13.2, gf: 67.9,  lat: 0.850, d1: 0.896, absrel: 0.104, rmse: 0.399 },
    { m: "GTR-S",         f: "gtr",  g: "S", p: 11.5, gf: 65.0,  lat: 1.296, d1: 0.946, absrel: 0.074, rmse: 0.336, lbl: [-10, -12] },
    { m: "YOLO26m-depth", f: "yolo", g: "M", p: 23.3, gf: 130.7, lat: 1.307, d1: 0.921, absrel: 0.089, rmse: 0.364 },
    { m: "GTR-M",         f: "gtr",  g: "M", p: 19.4, gf: 93.2,  lat: 1.508, d1: 0.952, absrel: 0.069, rmse: 0.319, lbl: [-10, -12] },
    { m: "YOLO26l-depth", f: "yolo", g: "L", p: 27.7, gf: 157.2, lat: 1.747, d1: 0.930, absrel: 0.083, rmse: 0.351 },
    { m: "GTR-L",         f: "gtr",  g: "L", p: 33.9, gf: 136.6, lat: 1.948, d1: 0.951, absrel: 0.069, rmse: 0.328, lbl: [8, 12] },
    { m: "YOLO26x-depth", f: "yolo", g: "X", p: 57.0, gf: 302.0, lat: 2.730, d1: 0.933, absrel: 0.080, rmse: 0.344, lbl: [-10, 12] },
    { m: "GTR-X",         f: "gtr",  g: "X", p: 41.1, gf: 159.4, lat: 2.158, d1: 0.954, absrel: 0.067, rmse: 0.317, lbl: [-10, -12] }
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

  /* ---------------- results tables ----------------
     One table per task, rows grouped by scale (or detector family for DOTA);
     best value per column within each group gets the green dot, GTR rows are
     highlighted. spec.minKeys lists columns where lower is better. */
  function buildTaskTable(hostId, spec) {
    var host = document.getElementById(hostId);
    if (!host) return;
    var minKeys = spec.minKeys || ["lat"];

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
        // best value per column within this group (min for minKeys, max otherwise)
        var best = {};
        spec.keys.forEach(function (k) {
          var vals = rows.map(function (r) { return r[k]; }).filter(function (v) { return v != null; });
          if (!vals.length) { best[k] = null; return; }
          best[k] = minKeys.indexOf(k) >= 0 ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
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
    var name = function (r) {
      return r.m + (r.f === "gtr" ? " (ours)" : "") + (r.o365 ? " †" : "") + (r.dd ? " ‡" : "");
    };
    var f1 = function (v) { return v == null ? "—" : v.toFixed(1); };
    var f3 = function (v) { return v == null ? "—" : v.toFixed(3); };
    var SCALES = [
      { key: "S", label: "Small" }, { key: "M", label: "Medium" },
      { key: "L", label: "Large" }, { key: "X", label: "X-Large" }
    ];
    buildTaskTable("gtr-det-table", {
      data: DATA,
      head: ["Model", "Epochs", "Params (M)", "GFLOPs", "Median (ms)", "AP", "AP50", "AP75", "APS", "APM", "APL"],
      keys: ["lat", "ap", "ap50", "ap75", "aps", "apm", "apl"],
      numStart: 4,
      groups: SCALES,
      switcher: true,
      cells: function (r) {
        return [name(r), r.ep, String(r.p), String(r.gf), f3(r.lat),
                f1(r.ap), f1(r.ap50), f1(r.ap75), f1(r.aps), f1(r.apm), f1(r.apl)];
      }
    });
    buildTaskTable("gtr-seg-table", {
      data: SEG_DATA,
      head: ["Model", "Params (M)", "GFLOPs", "Median (ms)", "Mask AP", "AP50", "AP75", "APS", "APM", "APL"],
      keys: ["lat", "ap", "ap50", "ap75", "aps", "apm", "apl"],
      numStart: 3,
      groups: SCALES,
      switcher: true,
      cells: function (r) {
        return [name(r), String(r.p), String(r.gf), f3(r.lat),
                f1(r.ap), f1(r.ap50), f1(r.ap75), f1(r.aps), f1(r.apm), f1(r.apl)];
      }
    });
    buildTaskTable("gtr-pose-table", {
      data: POSE_DATA,
      head: ["Model", "Params (M)", "GFLOPs", "Median (ms)", "AP", "AP50", "AP75", "APM", "APL", "AR"],
      keys: ["lat", "ap", "ap50", "ap75", "apm", "apl", "ar"],
      numStart: 3,
      groups: SCALES,
      switcher: true,
      cells: function (r) {
        return [name(r), String(r.p), String(r.gf), f3(r.lat),
                f1(r.ap), f1(r.ap50), f1(r.ap75), f1(r.apm), f1(r.apl), f1(r.ar)];
      }
    });
    buildTaskTable("gtr-obb-table", {
      data: OBB_DATA,
      head: ["Model", "Backbone", "Params (M)", "GFLOPs", "Median (ms)", "AP50"],
      keys: ["lat", "ap50"],
      numStart: 4,
      groups: [
        { key: "cnn", label: "CNN-based oriented detectors" },
        { key: "detr", label: "DETR-based oriented detectors" }
      ],
      cells: function (r) {
        return [name(r), r.bb, String(r.p), String(r.gf), f3(r.lat), f1(r.ap50)];
      }
    });
    buildTaskTable("gtr-semseg-table", {
      data: SEMSEG_DATA,
      head: ["Model", "Params (M)", "GFLOPs", "Median (ms)", "mIoU"],
      keys: ["lat", "miou"],
      numStart: 3,
      groups: SCALES,
      switcher: true,
      cells: function (r) {
        return [name(r), String(r.p), String(r.gf), f3(r.lat), f1(r.miou)];
      }
    });
    buildTaskTable("gtr-depth-table", {
      data: DEPTH_DATA,
      head: ["Model", "Params (M)", "GFLOPs", "Median (ms)", "δ1 ↑", "AbsRel ↓", "RMSE ↓"],
      keys: ["lat", "d1", "absrel", "rmse"],
      minKeys: ["lat", "absrel", "rmse"],
      numStart: 3,
      groups: SCALES,
      switcher: true,
      cells: function (r) {
        return [name(r), String(r.p), String(r.gf), f3(r.lat),
                r.d1.toFixed(3), r.absrel.toFixed(3), r.rmse.toFixed(3)];
      }
    });
    buildTaskTable("gtr-res-table", {
      data: RES_DATA,
      head: ["Input size", "GFLOPs", "Memory (GB)", "Median (ms)", "Images/s", "AP", "AP50", "AP75", "APS", "APM", "APL"],
      keys: ["ap", "ap50", "ap75", "aps", "apm", "apl"],
      numStart: 5,
      groups: [{ key: "res", label: null }],
      cells: function (r) {
        return [r.m, r.gf.toFixed(1), r.mem.toFixed(3), r.lat.toFixed(3), r.rate.toFixed(1),
                r.ap.toFixed(1), r.ap50.toFixed(1), r.ap75.toFixed(1),
                r.aps.toFixed(1), r.apm.toFixed(1), r.apl.toFixed(1)];
      }
    });
  }

  /* ---------------- Pareto chart (task-switchable) ----------------
     Each task has its own axis ranges; pose/obb use a log latency axis
     because their baselines span an order of magnitude. Rows with alt
     (GTR ‡ variants) or without latency (RiO-DETR) appear only in the
     tables, not in the chart. */
  var CHART_CFG = {
    det: {
      data: DATA, yKey: "ap", metric: "AP", scales: true, dec: 1,
      title: "COCO box AP vs. median latency",
      sub: "val2017 · 640×640 · lower-right is slower, higher is better",
      yTitle: "COCO box AP",
      x: { min: 0.8, max: 4.95, log: false, ticks: [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5], fmt: function (v) { return v.toFixed(1); } },
      y: { min: 45.5, max: 60.5, ticks: [46, 48, 50, 52, 54, 56, 58, 60], fmt: String }
    },
    seg: {
      data: SEG_DATA, yKey: "ap", metric: "mask AP", scales: true, dec: 1,
      title: "COCO mask AP vs. median latency",
      sub: "val2017 · 640×640 · instance segmentation",
      yTitle: "COCO mask AP",
      x: { min: 1.0, max: 4.35, log: false, ticks: [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0], fmt: function (v) { return v.toFixed(1); } },
      y: { min: 39.3, max: 50.5, ticks: [40, 42, 44, 46, 48, 50], fmt: String }
    },
    pose: {
      data: POSE_DATA, yKey: "ap", metric: "keypoint AP", scales: true, dec: 1,
      title: "COCO keypoint AP vs. median latency",
      sub: "val2017 · human pose · log-scale latency axis",
      yTitle: "COCO keypoint AP",
      x: { min: 0.55, max: 12.5, log: true, ticks: [0.6, 1, 2, 5, 10], fmt: String },
      y: { min: 57.5, max: 76.5, ticks: [58, 60, 62, 64, 66, 68, 70, 72, 74, 76], fmt: String }
    },
    obb: {
      data: OBB_DATA, yKey: "ap50", metric: "AP50", scales: false, dec: 1,
      title: "DOTA-v1.0 AP50 vs. median latency",
      sub: "test set · oriented boxes · log-scale latency axis",
      yTitle: "DOTA-v1.0 AP50",
      x: { min: 0.6, max: 18, log: true, ticks: [0.7, 1, 2, 5, 10, 15], fmt: String },
      y: { min: 78.3, max: 82.1, ticks: [78.5, 79, 79.5, 80, 80.5, 81, 81.5, 82], fmt: function (v) { return v.toFixed(1); } }
    },
    semseg: {
      data: SEMSEG_DATA, yKey: "miou", metric: "mIoU", scales: true, dec: 1,
      title: "Cityscapes mIoU vs. median latency",
      sub: "validation set · 1024×1024 crops · FCN head",
      yTitle: "Cityscapes mIoU",
      x: { min: 0.6, max: 4.6, log: false, ticks: [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5], fmt: function (v) { return v.toFixed(1); } },
      y: { min: 80.4, max: 84.0, ticks: [80.5, 81, 81.5, 82, 82.5, 83, 83.5, 84], fmt: function (v) { return v.toFixed(1); } }
    },
    depth: {
      data: DEPTH_DATA, yKey: "d1", metric: "δ1", scales: true, dec: 3,
      title: "NYU δ1 vs. median latency",
      sub: "Eigen split · zero-shot, ground-truth-aligned protocol",
      yTitle: "NYU Depth V2 δ1",
      x: { min: 0.7, max: 2.95, log: false, ticks: [0.8, 1.2, 1.6, 2.0, 2.4, 2.8], fmt: function (v) { return v.toFixed(1); } },
      y: { min: 0.888, max: 0.962, ticks: [0.89, 0.90, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96], fmt: function (v) { return v.toFixed(2); } }
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

    /* rows drawn as chart points: need a latency and must not be alt (‡) */
    function plottable(d) { return d.lat != null && !d.alt; }
    /* backbone disambiguates duplicate model names (OBB table) */
    function ptName(d) {
      var showBB = d.bb && d.f !== "gtr" && d.m.toLowerCase().indexOf(d.bb.toLowerCase()) !== 0;
      return d.m + (showBB ? " (" + d.bb + ")" : "") + (d.f === "gtr" ? " (ours)" : "");
    }
    function visible(d) {
      return !state.cfg.scales || state.scale === "All" || d.g === state.scale;
    }
    function showTip(p) {
      var d = p.d, cfg = state.cfg;
      tipVal.textContent = d[cfg.yKey].toFixed(cfg.dec) + " " + cfg.metric + " · " + d.lat.toFixed(3) + " ms";
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

      var pts = cfg.data.filter(plottable);

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
      xl.textContent = "Median latency (ms" + (xa.log ? ", log scale" : "") + ") · RTX 4090, FP16, batch = 1";
      var ylt = el("text", { x: M.l, y: M.t - 12, "text-anchor": "start", "font-size": 13, fill: "#52514e" });
      ylt.textContent = cfg.yTitle;
      /* "better" hint — top-left, where the frontier points */
      var hint = el("text", { x: M.l + 14, y: M.t + 20, "text-anchor": "start", "font-size": 12, fill: "#b0aea6", "font-style": "italic" });
      hint.textContent = "↖ faster & more accurate";

      /* GTR frontier line (drawn under the points) */
      var gtrPts = pts.filter(function (d) { return d.f === "gtr"; });
      if (gtrPts.length > 1) {
        var path = gtrPts.map(function (d, i) { return (i ? "L" : "M") + sx(d.lat) + " " + sy(d[cfg.yKey]); }).join(" ");
        state.frontier = el("path", {
          d: path, fill: "none", stroke: COLORS.gtr, "stroke-width": 2,
          "stroke-linecap": "round", "stroke-linejoin": "round", "class": "gtr-frontier"
        });
      }

      /* points: YOLO, then DETR, then GTR on top */
      var order = { yolo: 0, detr: 1, gtr: 2 };
      var sorted = pts.slice().sort(function (a, b) { return order[a.f] - order[b.f]; });
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
          "aria-label": ptName(d) + ": " + d[cfg.yKey].toFixed(cfg.dec) + " " + cfg.metric + " at " + d.lat.toFixed(3) + " milliseconds, " + d.p + " million parameters" }, g);
        svg.appendChild(g);
        state.ptEls.push({ d: d, g: g, cx: cx, cy: cy, hit: hit });
      });

      /* selective direct labels */
      pts.forEach(function (d) {
        if (!d.lbl) return;
        var anchor = d.lbl[0] < 0 ? "end" : "start";
        var t = el("text", {
          x: sx(d.lat) + d.lbl[0], y: sy(d[cfg.yKey]) + d.lbl[1] + 4,
          "text-anchor": anchor, "font-size": 12.5,
          "font-weight": d.f === "gtr" ? 600 : 400,
          fill: d.f === "gtr" ? "#1a1a19" : "#52514e", "class": "gtr-lbl", "data-g": d.g
        });
        t.textContent = (d.f === "gtr" ? d.m : ptName(d)) + " · " + d[cfg.yKey].toFixed(cfg.dec);
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
