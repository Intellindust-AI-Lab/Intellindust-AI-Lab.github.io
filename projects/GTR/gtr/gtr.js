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
    { m: "GTR-X",            f: "gtr",  g: "X", ep: "30",   p: 46.4, gf: 129.97, lat: 1.931, ap: 58.1, ap50: 76.0, ap75: 63.2, aps: 40.9, apm: 63.2, apl: 75.6, lbl: [-10, -12] }
  ];

  var COLORS = { gtr: "#1baf7a", detr: "#2a78d6", yolo: "#eb6834" };
  var FAMILY_NAME = { gtr: "GTR (ours)", detr: "DETR-style", yolo: "YOLO family" };

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

  /* ---------------- results tables (built from DATA) ---------------- */
  function buildTables() {
    var host = document.getElementById("gtr-table-host");
    if (!host) return;
    var cols = ["lat", "ap", "ap50", "ap75", "aps", "apm", "apl"];
    ["S", "M", "L", "X"].forEach(function (g) {
      var rows = DATA.filter(function (d) { return d.g === g; });
      // best value per column (min for latency, max for AP metrics)
      var best = {};
      cols.forEach(function (c) {
        var vals = rows.map(function (r) { return r[c]; });
        best[c] = c === "lat" ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
      });
      var panel = document.createElement("div");
      panel.className = "gtr-panel" + (g === "S" ? " active" : "");
      panel.setAttribute("data-group", "table");
      panel.setAttribute("data-panel", g);
      var wrap = document.createElement("div");
      wrap.className = "table-wrapper";
      var table = document.createElement("table");
      var thead = document.createElement("thead");
      thead.className = "center";
      var hrow = document.createElement("tr");
      ["Model", "Epochs", "Params (M)", "GFLOPs", "Lat. min (ms)", "AP", "AP50", "AP75", "APS", "APM", "APL"].forEach(function (h) {
        var th = document.createElement("th");
        th.textContent = h;
        hrow.appendChild(th);
      });
      thead.appendChild(hrow);
      table.appendChild(thead);
      var tbody = document.createElement("tbody");
      tbody.className = "center";
      rows.forEach(function (r) {
        var tr = document.createElement("tr");
        if (r.f === "gtr") tr.className = "gtr-ours";
        var cells = [
          r.f === "gtr" ? r.m + " (ours)" : r.m,
          r.ep, String(r.p), String(r.gf),
          r.lat.toFixed(3), r.ap.toFixed(1), r.ap50.toFixed(1), r.ap75.toFixed(1),
          r.aps.toFixed(1), r.apm.toFixed(1), r.apl.toFixed(1)
        ];
        cells.forEach(function (v, i) {
          var td = document.createElement("td");
          td.textContent = v;
          if (i === 0) td.style.textAlign = "left";
          if (i >= 4) {
            var key = cols[i - 4];
            if (r[key] === best[key]) td.className = "best";
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrap.appendChild(table);
      panel.appendChild(wrap);
      host.appendChild(panel);
    });
  }

  /* ---------------- Pareto chart ---------------- */
  function buildChart() {
    var wrap = document.getElementById("gtr-chart");
    if (!wrap) return;
    var NS = "http://www.w3.org/2000/svg";
    var W = 960, H = 540;
    var M = { l: 62, r: 26, t: 30, b: 58 };
    var X0 = 0.75, X1 = 4.55, Y0 = 45.5, Y1 = 60;
    function sx(v) { return M.l + (v - X0) / (X1 - X0) * (W - M.l - M.r); }
    function sy(v) { return H - M.b - (v - Y0) / (Y1 - Y0) * (H - M.t - M.b); }

    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Scatter plot of COCO box AP versus minimum latency for GTR and real-time detector baselines. GTR variants sit on the upper-left Pareto frontier. The same numbers are available in the results table below.");

    function el(tag, attrs, parent) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      (parent || svg).appendChild(e);
      return e;
    }

    /* gridlines + ticks */
    var xt, yt;
    for (xt = 1.0; xt <= 4.51; xt += 0.5) {
      el("line", { x1: sx(xt), y1: M.t, x2: sx(xt), y2: H - M.b, stroke: "#e7e6e1", "stroke-width": 1 });
      var tx = el("text", { x: sx(xt), y: H - M.b + 22, "text-anchor": "middle", "font-size": 12, fill: "#898781" });
      tx.textContent = xt.toFixed(1);
    }
    for (yt = 46; yt <= 60; yt += 2) {
      el("line", { x1: M.l, y1: sy(yt), x2: W - M.r, y2: sy(yt), stroke: "#e7e6e1", "stroke-width": 1 });
      var ty = el("text", { x: M.l - 10, y: sy(yt) + 4, "text-anchor": "end", "font-size": 12, fill: "#898781" });
      ty.textContent = String(yt);
    }
    /* axis lines */
    el("line", { x1: M.l, y1: H - M.b, x2: W - M.r, y2: H - M.b, stroke: "#c3c2b7", "stroke-width": 1 });
    el("line", { x1: M.l, y1: M.t, x2: M.l, y2: H - M.b, stroke: "#c3c2b7", "stroke-width": 1 });
    /* axis titles */
    var xl = el("text", { x: (M.l + W - M.r) / 2, y: H - 14, "text-anchor": "middle", "font-size": 13, fill: "#52514e" });
    xl.textContent = "Min. latency (ms) · RTX 4090, FP16, batch = 1";
    var ylt = el("text", { x: M.l, y: M.t - 12, "text-anchor": "start", "font-size": 13, fill: "#52514e" });
    ylt.textContent = "COCO box AP";
    /* "better" hint — top-left, where the frontier points */
    var hint = el("text", { x: M.l + 14, y: M.t + 20, "text-anchor": "start", "font-size": 12, fill: "#b0aea6", "font-style": "italic" });
    hint.textContent = "↖ faster & more accurate";

    /* GTR frontier line (drawn under the points) */
    var gtrPts = DATA.filter(function (d) { return d.f === "gtr"; });
    var path = gtrPts.map(function (d, i) { return (i ? "L" : "M") + sx(d.lat) + " " + sy(d.ap); }).join(" ");
    var frontier = el("path", {
      d: path, fill: "none", stroke: COLORS.gtr, "stroke-width": 2,
      "stroke-linecap": "round", "stroke-linejoin": "round", "class": "gtr-frontier"
    });

    /* points: YOLO, then DETR, then GTR on top */
    var order = { yolo: 0, detr: 1, gtr: 2 };
    var sorted = DATA.slice().sort(function (a, b) { return order[a.f] - order[b.f]; });
    var ptEls = [];
    sorted.forEach(function (d) {
      var cx = sx(d.lat), cy = sy(d.ap);
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
        "aria-label": d.m + (d.f === "gtr" ? " (ours)" : "") + ": " + d.ap.toFixed(1) + " AP at " + d.lat.toFixed(3) + " milliseconds, " + d.p + " million parameters" }, g);
      svg.appendChild(g);
      ptEls.push({ d: d, g: g, cx: cx, cy: cy, hit: hit });
    });

    /* selective direct labels */
    var lblEls = [];
    DATA.forEach(function (d) {
      if (!d.lbl) return;
      var anchor = d.lbl[0] < 0 ? "end" : "start";
      var t = el("text", {
        x: sx(d.lat) + d.lbl[0], y: sy(d.ap) + d.lbl[1] + 4,
        "text-anchor": anchor, "font-size": 12.5,
        "font-weight": d.f === "gtr" ? 600 : 400,
        fill: d.f === "gtr" ? "#1a1a19" : "#52514e", "class": "gtr-lbl", "data-g": d.g
      });
      t.textContent = (d.f === "gtr" ? d.m : d.m) + " · " + d.ap.toFixed(1);
      lblEls.push(t);
    });

    wrap.appendChild(svg);

    /* tooltip */
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
    wrap.appendChild(tip);

    var activeScale = "All";
    function visible(d) { return activeScale === "All" || d.g === activeScale; }

    function showTip(p) {
      tipVal.textContent = p.d.ap.toFixed(1) + " AP · " + p.d.lat.toFixed(3) + " ms";
      tipTxt.textContent = p.d.m + (p.d.f === "gtr" ? " (ours)" : "") + " · " + p.d.p + "M params · " + FAMILY_NAME[p.d.f];
      tipKey.style.background = COLORS[p.d.f];
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

    /* nearest-point hover across the whole svg */
    svg.addEventListener("pointermove", function (ev) {
      var rect = wrap.getBoundingClientRect();
      var mx = (ev.clientX - rect.left) / rect.width * W;
      var my = (ev.clientY - rect.top) / rect.height * H;
      var bestP = null, bestD = 1e9;
      ptEls.forEach(function (p) {
        if (!visible(p.d)) return;
        var dx = p.cx - mx, dy = p.cy - my;
        var dist = dx * dx + dy * dy;
        if (dist < bestD) { bestD = dist; bestP = p; }
      });
      if (bestP && bestD < 42 * 42) showTip(bestP);
      else hideTip();
    });
    svg.addEventListener("pointerleave", hideTip);
    ptEls.forEach(function (p) {
      p.hit.addEventListener("focus", function () { showTip(p); });
      p.hit.addEventListener("blur", hideTip);
    });

    /* scale-group filter chips */
    var chipRow = document.getElementById("gtr-chart-chips");
    if (chipRow) {
      chipRow.querySelectorAll(".gtr-chip").forEach(function (chip) {
        chip.addEventListener("click", function () {
          chipRow.querySelectorAll(".gtr-chip").forEach(function (c) {
            c.classList.toggle("active", c === chip);
            c.setAttribute("aria-pressed", c === chip ? "true" : "false");
          });
          activeScale = chip.getAttribute("data-scale");
          ptEls.forEach(function (p) { p.g.classList.toggle("dim", !visible(p.d)); });
          lblEls.forEach(function (t) {
            t.classList.toggle("dim", !(activeScale === "All" || t.getAttribute("data-g") === activeScale));
          });
          frontier.classList.toggle("dim", activeScale !== "All");
          hideTip();
        });
      });
    }
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
    buildTables();
    buildChart();
    initMagnifier();
    initCopy();
  });
})();
