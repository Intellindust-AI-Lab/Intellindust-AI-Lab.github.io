(function () {
  'use strict';

  const payload = window.EDGECRAFTER_RESULTS;
  if (!payload || !payload.benchmarks) return;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const SCALE_ORDER = { S: 0, M: 1, L: 2, X: 3 };

  const tasks = {
    detection: {
      title: 'Object Detection',
      metric: 'Box AP',
      axisTitle: 'COCO box AP',
      modelName: 'ECDet',
      note: 'YOLO latency includes NMS. Detection latency follows the T4 FP16 TensorRT protocol reported in the paper.',
      series: [
        series('ecdet-coco', 'ECDet', 'ECDet-', 'COCO only', true, 'var(--chart-edge)'),
        series('ecdet-o365', 'ECDet +O365', 'ECDet-', 'O365', true, 'var(--chart-o365)', true),
        series('rtdetrv4', 'RT-DETRv4', 'RT-DETRv4-', 'COCO only', false, 'var(--chart-baseline-1)'),
        series('yolo26-det', 'YOLO26 +O365', 'YOLO26-', 'O365', false, 'var(--chart-baseline-2)', true),
        series('rfdetr-det', 'RF-DETR +O365', 'RF-DETR-', 'O365', false, 'var(--chart-baseline-3)')
      ]
    },
    pose: {
      title: 'Human Pose Estimation',
      metric: 'Keypoint AP',
      axisTitle: 'COCO keypoint AP',
      modelName: 'ECPose',
      note: 'Extra supervision denotes Objects365 detection pretraining; COCO-only ECPose is the primary setting.',
      series: [
        series('ecpose-coco', 'ECPose', 'ECPose-', 'COCO only', true, 'var(--chart-edge)'),
        series('ecpose-o365', 'ECPose +O365', 'ECPose-', 'O365', true, 'var(--chart-o365)', true),
        series('rtmo', 'RTMO', 'RTMO-', 'COCO only', false, 'var(--chart-baseline-1)'),
        series('yolo26-pose', 'YOLO26-Pose', 'YOLO26-Pose-', 'COCO only', false, 'var(--chart-baseline-2)'),
        series('detrpose', 'DETRPose +O365', 'DETRPose-', 'O365', false, 'var(--chart-baseline-3)', true)
      ]
    },
    segmentation: {
      title: 'Instance Segmentation',
      metric: 'Mask AP',
      axisTitle: 'COCO mask AP',
      modelName: 'ECInsSeg',
      note: 'O365+SAM2 baselines use Objects365 and pseudo-instance masks; ECInsSeg O365 uses no pseudo masks.',
      series: [
        series('ecinsseg-coco', 'ECInsSeg', 'ECInsSeg-', 'COCO only', true, 'var(--chart-edge)'),
        series('ecinsseg-o365', 'ECInsSeg +O365', 'ECInsSeg-', 'O365', true, 'var(--chart-o365)', true),
        series('yolo26-seg', 'YOLO26-Seg +O365+SAM2', 'YOLO26-Seg-', 'O365+SAM2', false, 'var(--chart-baseline-2)', true),
        series('rfdetr-seg', 'RF-DETR-Seg +O365+SAM2', 'RF-DETR-Seg-', 'O365+SAM2', false, 'var(--chart-baseline-3)')
      ]
    }
  };

  const frontierState = {
    axis: 'params',
    scale: 'all',
    competitors: true,
    hiddenSeries: new Set()
  };

  const benchmarkState = {
    task: 'detection',
    scale: 'S',
    supervision: 'all',
    sortKey: 'ap',
    sortDirection: 'desc'
  };

  function series(id, label, modelPrefix, extra, featured, color, dashed) {
    return { id, label, modelPrefix, extra, featured, color, dashed: Boolean(dashed) };
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createSvgElement(tag, attributes) {
    const element = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes || {}).forEach(([name, value]) => {
      element.setAttribute(name, String(value));
    });
    return element;
  }

  function formatNumber(value, digits) {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';
    const precision = digits === undefined ? (Number.isInteger(value) ? 0 : 1) : digits;
    return Number(value).toFixed(precision);
  }

  function rowsForSeries(taskKey, definition) {
    return payload.benchmarks[taskKey]
      .filter((row) => row.model.startsWith(definition.modelPrefix) && row.extra === definition.extra)
      .sort((a, b) => SCALE_ORDER[a.scale] - SCALE_ORDER[b.scale]);
  }

  function setPressedState(root, selector, value, attribute) {
    root.querySelectorAll(selector).forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset[attribute] === value));
    });
  }

  function initFrontier() {
    const root = document.getElementById('frontierExplorer');
    if (!root) return;

    root.querySelectorAll('[data-frontier-axis]').forEach((button) => {
      button.addEventListener('click', () => {
        frontierState.axis = button.dataset.frontierAxis;
        setPressedState(root, '[data-frontier-axis]', frontierState.axis, 'frontierAxis');
        renderFrontier(root);
      });
    });

    root.querySelectorAll('[data-frontier-scale]').forEach((button) => {
      button.addEventListener('click', () => {
        frontierState.scale = button.dataset.frontierScale;
        setPressedState(root, '[data-frontier-scale]', frontierState.scale, 'frontierScale');
        renderFrontier(root);
      });
    });

    const competitorToggle = root.querySelector('[data-frontier-competitors]');
    competitorToggle.addEventListener('click', () => {
      frontierState.competitors = !frontierState.competitors;
      competitorToggle.setAttribute('aria-pressed', String(frontierState.competitors));
      competitorToggle.querySelector('span').textContent = frontierState.competitors ? 'Competitors on' : 'Competitors off';
      renderFrontier(root);
    });

    root.querySelector('[data-frontier-fallback]').hidden = true;
    root.classList.add('is-enhanced');
    renderFrontier(root);
  }

  function renderFrontier(root) {
    const charts = root.querySelector('[data-frontier-charts]');
    charts.replaceChildren();

    Object.entries(tasks).forEach(([taskKey, config]) => {
      charts.appendChild(renderFrontierCard(root, taskKey, config));
    });

    renderFrontierInsight(root);
  }

  function renderFrontierCard(root, taskKey, config) {
    const card = createElement('article', 'frontier-card');
    card.dataset.task = taskKey;

    const header = createElement('div', 'frontier-card-header');
    header.appendChild(createElement('h3', 'frontier-card-title', config.title));
    header.appendChild(createElement('span', 'frontier-card-metric', config.metric));
    card.appendChild(header);

    const chart = createElement('div', 'frontier-chart');
    const tooltip = createElement('div', 'frontier-tooltip');
    tooltip.setAttribute('role', 'tooltip');
    card.appendChild(chart);
    card.appendChild(tooltip);

    const availableSeries = config.series
      .filter((definition) => frontierState.competitors || definition.featured)
      .map((definition) => ({ definition, rows: rowsForSeries(taskKey, definition) }))
      .filter((item) => item.rows.length > 0);
    const visibleSeries = availableSeries.filter((item) => !frontierState.hiddenSeries.has(item.definition.id));

    drawChart(card, chart, tooltip, taskKey, config, visibleSeries);
    card.appendChild(renderLegend(root, taskKey, availableSeries, visibleSeries));
    return card;
  }

  function drawChart(card, container, tooltip, taskKey, config, visibleSeries) {
    const width = 360;
    const height = 278;
    const margin = { top: 14, right: 13, bottom: 43, left: 49 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const xKey = frontierState.axis;
    const allRows = visibleSeries.flatMap((item) => item.rows);

    if (allRows.length === 0) {
      container.appendChild(createElement('p', 'frontier-description', 'Select at least one series to display the chart.'));
      return;
    }

    const maxX = Math.max(...allRows.map((row) => row[xKey]));
    const minYValue = Math.min(...allRows.map((row) => row.ap));
    const maxYValue = Math.max(...allRows.map((row) => row.ap));
    const yScale = niceScale(minYValue - 1, maxYValue + 1, 5);
    const yMin = yScale.min;
    const yMax = yScale.max;
    const xMax = niceMaximum(maxX * 1.05);

    const x = (value) => margin.left + (value / xMax) * plotWidth;
    const y = (value) => margin.top + ((yMax - value) / (yMax - yMin)) * plotHeight;
    const svg = createSvgElement('svg', {
      viewBox: `0 0 ${width} ${height}`,
      role: 'img',
      'aria-labelledby': `${taskKey}-chart-title ${taskKey}-chart-description`
    });
    const title = createSvgElement('title', { id: `${taskKey}-chart-title` });
    title.textContent = `${config.title} accuracy-efficiency comparison`;
    const description = createSvgElement('desc', { id: `${taskKey}-chart-description` });
    description.textContent = `${config.metric} plotted against ${frontierState.axis === 'params' ? 'parameters' : 'GFLOPs'} for EdgeCrafter and selected baselines.`;
    svg.append(title, description);

    svg.appendChild(createSvgElement('rect', {
      class: 'chart-frame',
      x: margin.left,
      y: margin.top,
      width: plotWidth,
      height: plotHeight,
      rx: 4
    }));

    yScale.ticks.forEach((tick) => {
      const tickY = y(tick);
      svg.appendChild(createSvgElement('line', {
        class: 'chart-grid-line',
        x1: margin.left,
        y1: tickY,
        x2: width - margin.right,
        y2: tickY
      }));
      const label = createSvgElement('text', {
        class: 'chart-tick',
        x: margin.left - 7,
        y: tickY + 3.5,
        'text-anchor': 'end'
      });
      label.textContent = formatNumber(tick);
      svg.appendChild(label);
    });

    linearTicks(0, xMax, 4).forEach((tick) => {
      const tickX = x(tick);
      svg.appendChild(createSvgElement('line', {
        class: 'chart-grid-line',
        x1: tickX,
        y1: margin.top,
        x2: tickX,
        y2: height - margin.bottom
      }));
      const label = createSvgElement('text', {
        class: 'chart-tick',
        x: tickX,
        y: height - margin.bottom + 17,
        'text-anchor': tick === 0 ? 'start' : tick === xMax ? 'end' : 'middle'
      });
      label.textContent = formatNumber(tick);
      svg.appendChild(label);
    });

    const xTitle = createSvgElement('text', {
      class: 'chart-axis-title',
      x: margin.left + plotWidth / 2,
      y: height - 7,
      'text-anchor': 'middle'
    });
    xTitle.textContent = frontierState.axis === 'params' ? 'Parameters (M)' : 'GFLOPs (G)';
    svg.appendChild(xTitle);

    const yTitle = createSvgElement('text', {
      class: 'chart-axis-title',
      x: 12,
      y: margin.top + plotHeight / 2,
      transform: `rotate(-90 12 ${margin.top + plotHeight / 2})`,
      'text-anchor': 'middle'
    });
    yTitle.textContent = config.axisTitle;
    svg.appendChild(yTitle);

    visibleSeries.forEach((item, seriesIndex) => {
      const { definition, rows } = item;
      const path = createSvgElement('path', {
        class: 'frontier-series-line',
        d: rows.map((row, index) => `${index === 0 ? 'M' : 'L'} ${x(row[xKey]).toFixed(2)} ${y(row.ap).toFixed(2)}`).join(' '),
        stroke: definition.color,
        'data-featured': definition.featured
      });
      if (definition.dashed) path.setAttribute('stroke-dasharray', '5 5');
      svg.appendChild(path);

      rows.forEach((row, pointIndex) => {
        const point = createSvgElement('circle', {
          class: 'frontier-point',
          cx: x(row[xKey]),
          cy: y(row.ap),
          r: definition.featured ? 4.6 : 3.45,
          fill: definition.color,
          tabindex: 0,
          role: 'button',
          'aria-label': chartPointLabel(row, config, frontierState.axis)
        });
        point.dataset.scale = row.scale;
        point.style.animationDelay = `${seriesIndex * 45 + pointIndex * 65}ms`;
        if (frontierState.scale !== 'all' && frontierState.scale !== row.scale) point.classList.add('is-muted');
        bindPointInteraction(card, point, tooltip, row, definition, config);
        svg.appendChild(point);

        if (definition.featured) {
          const label = createSvgElement('text', {
            class: 'chart-point-label',
            x: x(row[xKey]),
            y: y(row.ap) + (definition.dashed ? -9 : 14),
            fill: definition.color,
            'text-anchor': 'middle'
          });
          label.textContent = row.scale;
          if (frontierState.scale !== 'all' && frontierState.scale !== row.scale) label.classList.add('is-muted');
          svg.appendChild(label);
        }
      });
    });

    container.appendChild(svg);
  }

  function niceMaximum(value) {
    if (value <= 60) return Math.ceil(value / 10) * 10;
    if (value <= 180) return Math.ceil(value / 20) * 20;
    return Math.ceil(value / 50) * 50;
  }

  function niceScale(min, max, targetIntervals) {
    const step = Math.max(1, Math.ceil((max - min) / targetIntervals));
    const niceMin = Math.floor(min / step) * step;
    const niceMax = Math.ceil(max / step) * step;
    const ticks = [];
    for (let value = niceMin; value <= niceMax; value += step) ticks.push(value);
    return { min: niceMin, max: niceMax, ticks };
  }

  function linearTicks(min, max, count) {
    if (max === min) return [min];
    const step = (max - min) / count;
    return Array.from({ length: count + 1 }, (_, index) => min + step * index);
  }

  function chartPointLabel(row, config, axis) {
    const efficiency = axis === 'params' ? `${formatNumber(row.params)} million parameters` : `${formatNumber(row.gflops)} GFLOPs`;
    return `${row.model}, ${row.extra}, ${formatNumber(row.ap, 1)} ${config.metric}, ${efficiency}`;
  }

  function bindPointInteraction(card, point, tooltip, row, definition, config) {
    const show = () => {
      tooltip.replaceChildren();
      tooltip.appendChild(createElement('strong', '', row.model));
      tooltip.appendChild(document.createTextNode(`${row.extra} | ${formatNumber(row.ap, 1)} ${config.metric}`));
      tooltip.appendChild(document.createElement('br'));
      tooltip.appendChild(document.createTextNode(`${formatNumber(row.params)}M params | ${formatNumber(row.gflops)} GFLOPs`));
      tooltip.appendChild(document.createElement('br'));
      tooltip.appendChild(document.createTextNode(`Latency: ${formatNumber(row.latency, 2)} ms`));
      const cardRect = card.getBoundingClientRect();
      const pointRect = point.getBoundingClientRect();
      const centerX = pointRect.left - cardRect.left + pointRect.width / 2;
      const centerY = pointRect.top - cardRect.top;
      tooltip.style.left = `${Math.max(90, Math.min(cardRect.width - 90, centerX))}px`;
      tooltip.style.top = `${Math.max(78, centerY)}px`;
      tooltip.style.borderColor = definition.color;
      tooltip.classList.add('is-visible');
    };
    const hide = () => tooltip.classList.remove('is-visible');
    const selectScale = () => {
      frontierState.scale = row.scale;
      const root = document.getElementById('frontierExplorer');
      setPressedState(root, '[data-frontier-scale]', frontierState.scale, 'frontierScale');
      renderFrontier(root);
    };

    point.addEventListener('pointerenter', show);
    point.addEventListener('pointerleave', hide);
    point.addEventListener('focus', show);
    point.addEventListener('blur', hide);
    point.addEventListener('click', selectScale);
    point.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectScale();
      }
    });
  }

  function renderLegend(root, taskKey, availableSeries, visibleSeries) {
    const visibleIds = new Set(visibleSeries.map((item) => item.definition.id));
    const legend = createElement('div', 'frontier-legend');
    legend.setAttribute('aria-label', `${tasks[taskKey].title} chart series`);

    availableSeries.forEach((item) => {
      const definition = item.definition;
      const button = createElement('button', 'frontier-legend-button', definition.label);
      button.type = 'button';
      button.dataset.dashed = String(definition.dashed);
      button.style.setProperty('--series-color', definition.color);
      button.setAttribute('aria-pressed', String(visibleIds.has(definition.id)));
      button.addEventListener('click', () => {
        if (frontierState.hiddenSeries.has(definition.id)) {
          frontierState.hiddenSeries.delete(definition.id);
        } else if (visibleSeries.length > 1) {
          frontierState.hiddenSeries.add(definition.id);
        }
        renderFrontier(root);
      });
      legend.appendChild(button);
    });
    return legend;
  }

  function edgePair(taskKey, scale) {
    const rows = payload.benchmarks[taskKey].filter((row) => row.edgecrafter && row.scale === scale);
    return {
      primary: rows.find((row) => row.extra === 'COCO only'),
      o365: rows.find((row) => row.extra === 'O365')
    };
  }

  function renderFrontierInsight(root) {
    const insight = root.querySelector('[data-frontier-insight]');
    if (frontierState.scale === 'all') {
      const ranges = Object.keys(tasks).map((taskKey) => {
        const gains = ['S', 'M', 'L', 'X'].map((scale) => {
          const pair = edgePair(taskKey, scale);
          return pair.o365.ap - pair.primary.ap;
        });
        return `${tasks[taskKey].metric}: +${formatNumber(Math.min(...gains), 1)} to +${formatNumber(Math.max(...gains), 1)}`;
      });
      setInsightText(insight, 'Objects365 gain across S-X:', `${ranges.join(' | ')} AP.`);
      return;
    }

    const scale = frontierState.scale;
    const comparisons = Object.keys(tasks).map((taskKey) => {
      const pair = edgePair(taskKey, scale);
      const gain = pair.o365.ap - pair.primary.ap;
      return `${tasks[taskKey].modelName} ${formatNumber(pair.primary.ap, 1)} -> ${formatNumber(pair.o365.ap, 1)} (+${formatNumber(gain, 1)})`;
    });
    setInsightText(insight, `${scale} scale, COCO only -> O365:`, `${comparisons.join(' | ')} AP.`);
  }

  function setInsightText(insight, heading, detail) {
    const wrapper = createElement('span');
    wrapper.appendChild(createElement('strong', '', heading));
    wrapper.appendChild(document.createTextNode(` ${detail}`));
    insight.replaceChildren(wrapper);
  }

  function initBenchmark() {
    const root = document.getElementById('benchmarkExplorer');
    if (!root) return;

    root.querySelectorAll('[data-table-task]').forEach((button) => {
      button.addEventListener('click', () => {
        benchmarkState.task = button.dataset.tableTask;
        benchmarkState.sortKey = 'ap';
        benchmarkState.sortDirection = 'desc';
        setPressedState(root, '[data-table-task]', benchmarkState.task, 'tableTask');
        renderBenchmark(root);
      });
    });

    root.querySelectorAll('[data-table-scale]').forEach((button) => {
      button.addEventListener('click', () => {
        benchmarkState.scale = button.dataset.tableScale;
        setPressedState(root, '[data-table-scale]', benchmarkState.scale, 'tableScale');
        renderBenchmark(root);
      });
    });

    root.querySelectorAll('[data-table-supervision]').forEach((button) => {
      button.addEventListener('click', () => {
        benchmarkState.supervision = button.dataset.tableSupervision;
        setPressedState(root, '[data-table-supervision]', benchmarkState.supervision, 'tableSupervision');
        renderBenchmark(root);
      });
    });

    root.querySelector('[data-table-fallback]').hidden = true;
    root.querySelector('[data-table-shell]').hidden = false;
    root.classList.add('is-enhanced');
    renderBenchmark(root);
  }

  function renderBenchmark(root) {
    const config = tasks[benchmarkState.task];
    const columns = columnsForTask(benchmarkState.task);
    const rows = filteredBenchmarkRows();
    const sortedRows = rows.slice().sort(compareBenchmarkRows);
    const table = root.querySelector('[data-benchmark-table]');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const caption = table.querySelector('caption');
    const scaleLabel = benchmarkState.scale === 'all' ? 'all scales' : `${benchmarkState.scale} scale`;
    const supervisionLabel = {
      all: 'all supervision settings',
      coco: 'COCO only',
      extra: 'additional supervision'
    }[benchmarkState.supervision];

    caption.textContent = `${config.title} results on ${payload.benchmark}, ${scaleLabel}, ${supervisionLabel}`;
    root.querySelector('[data-table-heading]').textContent = config.title;
    root.querySelector('[data-table-summary]').textContent = `${config.metric} on ${payload.benchmark} | ${scaleLabel} | ${supervisionLabel}`;
    root.querySelector('[data-table-count]').textContent = `${sortedRows.length} ${sortedRows.length === 1 ? 'method' : 'methods'}`;
    root.querySelector('[data-table-note]').textContent = `${config.note} ${payload.latencyProtocol}.`;

    thead.replaceChildren(renderTableHeader(root, columns));
    tbody.replaceChildren(...sortedRows.map((row) => renderTableRow(row, columns)));
    if (sortedRows.length === 0) {
      const emptyRow = createElement('tr');
      const emptyCell = createElement('td', '', 'No methods match the selected filters.');
      emptyCell.colSpan = columns.length;
      emptyCell.style.textAlign = 'center';
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
    }
  }

  function filteredBenchmarkRows() {
    return payload.benchmarks[benchmarkState.task].filter((row) => {
      const scaleMatches = benchmarkState.scale === 'all' || row.scale === benchmarkState.scale;
      const supervisionMatches = benchmarkState.supervision === 'all'
        || (benchmarkState.supervision === 'coco' && row.extra === 'COCO only')
        || (benchmarkState.supervision === 'extra' && row.extra !== 'COCO only');
      return scaleMatches && supervisionMatches;
    });
  }

  function compareBenchmarkRows(a, b) {
    const key = benchmarkState.sortKey;
    const aValue = a[key];
    const bValue = b[key];
    if (aValue === null || aValue === undefined || bValue === null || bValue === undefined) {
      if ((aValue === null || aValue === undefined) && (bValue === null || bValue === undefined)) {
        return key === 'ap' ? 0 : b.ap - a.ap;
      }
      return aValue === null || aValue === undefined ? 1 : -1;
    }

    let result;
    if (key === 'scale') {
      result = SCALE_ORDER[a.scale] - SCALE_ORDER[b.scale];
    } else if (typeof aValue === 'string' || typeof bValue === 'string') {
      result = String(aValue).localeCompare(String(bValue));
    } else {
      result = aValue - bValue;
    }
    if (result === 0 && key !== 'ap') return b.ap - a.ap;
    return benchmarkState.sortDirection === 'asc' ? result : -result;
  }

  function columnsForTask(taskKey) {
    const commonStart = [
      column('model', 'Model', 'text'),
      column('scale', 'Scale', 'text'),
      column('extra', 'Extra sup.', 'supervision')
    ];
    const efficiency = [
      column('params', 'Params', 'params'),
      column('gflops', 'GFLOPs', 'number'),
      column('latency', 'Latency (ms)', 'latency'),
      column('ap', 'AP', 'metric'),
      column('ap50', 'AP50', 'metric'),
      column('ap75', 'AP75', 'metric')
    ];
    if (taskKey === 'detection') {
      return [
        ...commonStart,
        column('epochs', 'Epochs', 'text'),
        ...efficiency,
        column('aps', 'AP_S', 'metric'),
        column('apm', 'AP_M', 'metric'),
        column('apl', 'AP_L', 'metric')
      ];
    }
    if (taskKey === 'pose') {
      return [
        ...commonStart,
        ...efficiency,
        column('apm', 'AP_M', 'metric'),
        column('apl', 'AP_L', 'metric'),
        column('ar', 'AR', 'metric')
      ];
    }
    return [
      ...commonStart,
      ...efficiency,
      column('aps', 'AP_S', 'metric'),
      column('apm', 'AP_M', 'metric'),
      column('apl', 'AP_L', 'metric')
    ];
  }

  function column(key, label, format) {
    return { key, label, format };
  }

  function renderTableHeader(root, columns) {
    const row = createElement('tr');
    columns.forEach((definition) => {
      const cell = createElement('th');
      cell.scope = 'col';
      const button = createElement('button', 'benchmark-sort', definition.label);
      button.type = 'button';
      button.dataset.sortKey = definition.key;
      if (benchmarkState.sortKey === definition.key) {
        button.dataset.direction = benchmarkState.sortDirection;
        cell.setAttribute('aria-sort', benchmarkState.sortDirection === 'asc' ? 'ascending' : 'descending');
      }
      button.addEventListener('click', () => {
        if (benchmarkState.sortKey === definition.key) {
          benchmarkState.sortDirection = benchmarkState.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          benchmarkState.sortKey = definition.key;
          benchmarkState.sortDirection = definition.format === 'text' ? 'asc' : 'desc';
        }
        renderBenchmark(root);
      });
      cell.appendChild(button);
      row.appendChild(cell);
    });
    return row;
  }

  function renderTableRow(row, columns) {
    const tableRow = createElement('tr');
    if (row.edgecrafter) tableRow.classList.add('is-edgecrafter');
    if (row.extra !== 'COCO only') tableRow.classList.add('is-extra');

    columns.forEach((definition) => {
      const cell = createElement('td');
      if (definition.key === 'model') cell.classList.add('model-cell');
      if (definition.format === 'supervision') {
        const label = createElement('span', 'supervision-label', row.extra);
        if (row.extra !== 'COCO only') label.classList.add('is-extra');
        cell.appendChild(label);
      } else {
        cell.textContent = formatTableValue(row[definition.key], definition.format);
      }
      tableRow.appendChild(cell);
    });
    return tableRow;
  }

  function formatTableValue(value, format) {
    if (value === null || value === undefined || value === '') return '--';
    if (format === 'params') return `${formatNumber(value)}M`;
    if (format === 'latency') return formatNumber(value, 2);
    if (format === 'metric') return formatNumber(value, 1);
    if (format === 'number') return formatNumber(value);
    return String(value);
  }

  initFrontier();
  initBenchmark();
}());
