(() => {
  "use strict";

  const CONFIG = {
    organization: "Intellindust-AI-Lab",
    contentCacheVersion: "2026-07-10-2",
    contentTtlMs: 10 * 60 * 1000,
    githubTtlMs: 15 * 60 * 1000
  };

  const LOCALE_CODES = {
    en: "en-US",
    fr: "fr-FR",
    zh: "zh-CN"
  };

  const i18n = {
    en: {
      primaryNavLabel: "Primary navigation",
      languageSwitchLabel: "Language switch",
      skipToContent: "Skip to content",
      navAbout: "About",
      navResearch: "Research",
      navAwards: "Awards",
      navPublications: "Publications",
      navContact: "Contact",
      heroEyebrow: "Vision systems / Edge intelligence",
      heroTitle: "Intellindust AI Lab",
      heroSub: "Pioneering vision AI for edge intelligence with fast, efficient, and robust models deployed in real-world environments.",
      explorePublications: "Explore publications",
      viewGitHub: "View GitHub",
      impactLabel: "Open-source activity",
      statStars: "GitHub Stars",
      statRepos: "Open Repositories",
      followLine: "Follow our <a href=\"https://github.com/Intellindust-AI-Lab\" target=\"_blank\" rel=\"noopener noreferrer\">GitHub repos</a> for the latest code, checkpoints, and updates.",
      dataStatusPartial: "Some live GitHub metrics are temporarily unavailable.",
      loadingText: "Loading...",
      contentUnavailable: "Content unavailable.",
      publicationsLoading: "Loading publications...",
      publicationsUnavailable: "Publications unavailable.",
      projectLabel: "Project Page",
      paperLabel: "Paper",
      pdfLabel: "PDF",
      codeLabel: "Code",
      slidesLabel: "Slides",
      starLabel: "Star",
      wipLabel: "WIP",
      localOpenTitle: "Local preview requires a web server",
      localOpenBody: "Opening <code>index.html</code> directly through <code>file://</code> blocks section loading. Run <code>./run_local.sh</code> and open <code>http://localhost:8000/index.html</code> instead.",
      footerText: "Intellindust AI Lab. All rights reserved."
    },
    fr: {
      primaryNavLabel: "Navigation principale",
      languageSwitchLabel: "Choix de la langue",
      skipToContent: "Aller au contenu",
      navAbout: "À propos",
      navResearch: "Recherche",
      navAwards: "Distinctions",
      navPublications: "Publications",
      navContact: "Contact",
      heroEyebrow: "Vision par ordinateur / IA embarquée",
      heroTitle: "Intellindust AI Lab",
      heroSub: "Nous concevons des systèmes de vision par ordinateur pour l'edge, avec des modèles rapides, efficaces et robustes, pensés pour des usages réels.",
      explorePublications: "Voir les publications",
      viewGitHub: "Voir sur GitHub",
      impactLabel: "Activité open source",
      statStars: "Stars sur GitHub",
      statRepos: "Dépôts publics",
      followLine: "Suivez nos <a href=\"https://github.com/Intellindust-AI-Lab\" target=\"_blank\" rel=\"noopener noreferrer\">dépôts GitHub</a> pour découvrir nos derniers codes, checkpoints et mises à jour.",
      dataStatusPartial: "Certaines métriques GitHub ne sont pas disponibles pour le moment.",
      loadingText: "Chargement...",
      contentUnavailable: "Contenu indisponible.",
      publicationsLoading: "Chargement des publications...",
      publicationsUnavailable: "Publications indisponibles.",
      projectLabel: "Page du projet",
      paperLabel: "Article",
      pdfLabel: "PDF",
      codeLabel: "Code source",
      slidesLabel: "Présentation",
      starLabel: "Star",
      wipLabel: "À venir",
      localOpenTitle: "L'aperçu local nécessite un serveur web",
      localOpenBody: "L'ouverture directe de <code>index.html</code> via <code>file://</code> empêche le chargement des sections. Lancez <code>./run_local.sh</code>, puis ouvrez <code>http://localhost:8000/index.html</code>.",
      footerText: "Intellindust AI Lab. Tous droits réservés."
    },
    zh: {
      primaryNavLabel: "主导航",
      languageSwitchLabel: "语言切换",
      skipToContent: "跳转到主要内容",
      navAbout: "关于我们",
      navResearch: "研究方向",
      navAwards: "获奖荣誉",
      navPublications: "代表论文",
      navContact: "联系方式",
      heroEyebrow: "视觉系统 / 边缘智能",
      heroTitle: "英特灵达人工智能实验室",
      heroSub: "面向边缘智能场景，打造快速、高效、可靠的视觉 AI 模型与系统。",
      explorePublications: "浏览代表论文",
      viewGitHub: "访问 GitHub",
      impactLabel: "开源动态",
      statStars: "GitHub 总 Star",
      statRepos: "开源仓库",
      followLine: "欢迎关注我们的 <a href=\"https://github.com/Intellindust-AI-Lab\" target=\"_blank\" rel=\"noopener noreferrer\">GitHub 仓库</a>，获取最新代码、权重与更新。",
      dataStatusPartial: "部分 GitHub 实时数据暂时不可用。",
      loadingText: "加载中...",
      contentUnavailable: "内容暂时不可用。",
      publicationsLoading: "正在加载论文...",
      publicationsUnavailable: "论文列表暂时不可用。",
      projectLabel: "项目主页",
      paperLabel: "论文",
      pdfLabel: "PDF",
      codeLabel: "代码",
      slidesLabel: "幻灯片",
      starLabel: "Star",
      wipLabel: "待更新",
      localOpenTitle: "本地预览需要通过 Web 服务器打开",
      localOpenBody: "直接通过 <code>file://</code> 打开 <code>index.html</code> 时，浏览器会阻止分区内容加载。请运行 <code>./run_local.sh</code>，然后访问 <code>http://localhost:8000/index.html</code>。",
      footerText: "Intellindust AI Lab。保留所有权利。"
    }
  };

  const statsElements = {
    stars: document.querySelector('[data-stat="stars"]'),
    repos: document.querySelector('[data-stat="repos"]')
  };
  const apiStatusElement = document.querySelector("[data-api-status]");
  const metricStatus = {
    stars: { done: false, ok: false },
    repos: { done: false, ok: false }
  };
  const starCache = new Map();
  const observedMotionItems = new WeakSet();

  let currentLocale = "en";
  let organizationReposPromise = null;
  let motionItemObserver = null;
  let requestScrollEffectUpdate = () => {};

  // Storage and fetch helpers
  const nowMs = () => Date.now();
  const cacheKey = (key) => `cache:${key}`;

  const readStorage = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      // Browsing modes that block local storage can safely skip caching.
    }
  };

  const readCache = (key, ttlMs) => {
    try {
      const raw = readStorage(cacheKey(key));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.ts !== "number") return null;
      if (ttlMs > 0 && nowMs() - parsed.ts > ttlMs) return null;
      return parsed.value;
    } catch (_) {
      return null;
    }
  };

  const readStaleCache = (key) => {
    try {
      const raw = readStorage(cacheKey(key));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed ? parsed.value : null;
    } catch (_) {
      return null;
    }
  };

  const writeCache = (key, value) => {
    writeStorage(cacheKey(key), JSON.stringify({ ts: nowMs(), value }));
  };

  const fetchWithCache = async (key, url, ttlMs, responseType) => {
    const cached = readCache(key, ttlMs);
    if (cached !== null) return cached;

    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`Unable to fetch ${url}`);
      const value = responseType === "json" ? await response.json() : await response.text();
      writeCache(key, value);
      return value;
    } catch (error) {
      const stale = readStaleCache(key);
      if (stale !== null) return stale;
      throw error;
    }
  };

  const fetchJsonWithCache = (key, url, ttlMs) => fetchWithCache(key, url, ttlMs, "json");
  const fetchTextWithCache = (key, url, ttlMs) => fetchWithCache(key, url, ttlMs, "text");

  // Rendering helpers
  const getPack = (locale = currentLocale) => i18n[locale] || i18n.en;
  const compactNumber = (value) => new Intl.NumberFormat(LOCALE_CODES[currentLocale], {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));

  const escapeAttr = escapeHtml;

  const prepareContentImages = (root) => {
    root.querySelectorAll("img").forEach((image) => {
      if (!image.hasAttribute("loading")) image.loading = "lazy";
      if (!image.hasAttribute("decoding")) image.decoding = "async";
    });
  };

  const initRevealAnimations = () => {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    elements.forEach((element, index) => {
      element.classList.add("will-reveal");
      element.style.transitionDelay = `${Math.min(index, 4) * 55}ms`;
    });

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    elements.forEach((element) => observer.observe(element));
  };

  const initScrollEffects = () => {
    const progress = document.querySelector("[data-scroll-progress]");
    const navigation = document.querySelector(".site-nav");
    if (!progress && !navigation) return;

    let animationFrame = null;
    const update = () => {
      const scrollableHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      const ratio = scrollableHeight > 0 ? Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1) : 0;
      if (progress) progress.style.transform = `scaleX(${ratio.toFixed(4)})`;
      if (navigation) navigation.classList.toggle("is-scrolled", window.scrollY > 24);
      animationFrame = null;
    };

    const requestUpdate = () => {
      if (animationFrame === null) animationFrame = requestAnimationFrame(update);
    };

    requestScrollEffectUpdate = requestUpdate;
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
  };

  const initStaggeredContent = (root = document) => {
    const items = Array.from(root.querySelectorAll([
      ".about-logo",
      ".about-text",
      '[data-md-section="research"] li',
      ".award-item",
      ".pub-item",
      '[data-md-section="contact"] .card p'
    ].join(", ")));
    if (!items.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canObserve = "IntersectionObserver" in window;
    if (!motionItemObserver && canObserve && !reducedMotion) {
      motionItemObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          motionItemObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
    }

    items.forEach((item, index) => {
      if (observedMotionItems.has(item)) return;
      observedMotionItems.add(item);
      item.classList.add("motion-item");
      item.style.setProperty("--motion-delay", `${(index % 6) * 55}ms`);

      if (!motionItemObserver || reducedMotion) {
        item.classList.add("in-view");
        return;
      }
      motionItemObserver.observe(item);
    });
  };

  const initHeroSpotlight = () => {
    const hero = document.querySelector(".hero");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hero || reducedMotion || !finePointer) return;

    let animationFrame = null;
    let pointerPosition = null;

    const paintSpotlight = () => {
      const rect = hero.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((pointerPosition.x - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((pointerPosition.y - rect.top) / rect.height) * 100));
      hero.style.setProperty("--spotlight-x", `${x.toFixed(2)}%`);
      hero.style.setProperty("--spotlight-y", `${y.toFixed(2)}%`);
      animationFrame = null;
    };

    hero.addEventListener("pointermove", (event) => {
      hero.classList.add("is-pointer-active");
      pointerPosition = { x: event.clientX, y: event.clientY };
      if (animationFrame === null) animationFrame = requestAnimationFrame(paintSpotlight);
    }, { passive: true });
    hero.addEventListener("pointerleave", () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null;
      pointerPosition = null;
      hero.classList.remove("is-pointer-active");
      hero.style.removeProperty("--spotlight-x");
      hero.style.removeProperty("--spotlight-y");
    });
  };

  const initActiveNavigation = () => {
    const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    if (!links.length || !sections.length || !("IntersectionObserver" in window)) return;

    const activate = (sectionId) => {
      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${sectionId}`;
        link.classList.toggle("active", active);
        if (active) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) activate(visible[0].target.id);
    }, {
      rootMargin: "-22% 0px -48% 0px",
      threshold: [0, 0.01]
    });

    sections.forEach((section) => observer.observe(section));
    links.forEach((link) => {
      link.addEventListener("click", () => activate(link.getAttribute("href").slice(1)));
    });
  };

  // Live GitHub metrics
  const getLoadingText = () => getPack().loadingText;

  const setStatLoading = (name) => {
    const element = statsElements[name];
    if (!element) return;
    element.textContent = getLoadingText();
    element.classList.add("is-loading");
    delete element.dataset.value;
  };

  const setStatUnavailable = (name) => {
    const element = statsElements[name];
    if (!element) return;
    element.textContent = "\u2014";
    element.classList.remove("is-loading");
    delete element.dataset.value;
  };

  const animateCounterTo = (element, target) => {
    const safeTarget = Number.isFinite(target) && target >= 0 ? target : 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = Number(element.dataset.value || 0);
    element.classList.remove("is-loading");

    if (reducedMotion) {
      element.textContent = compactNumber(safeTarget);
      element.dataset.value = String(safeTarget);
      return;
    }

    const startTime = performance.now();
    const duration = 800;
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (safeTarget - start) * eased);
      element.textContent = compactNumber(current);
      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }
      element.dataset.value = String(safeTarget);
    };

    requestAnimationFrame(step);
  };

  const renderDataStatus = () => {
    if (!apiStatusElement) return;
    const metrics = Object.values(metricStatus);
    const allDone = metrics.every((metric) => metric.done);
    const anyFailed = metrics.some((metric) => metric.done && !metric.ok);

    if (!allDone || !anyFailed) {
      apiStatusElement.hidden = true;
      apiStatusElement.textContent = "";
      return;
    }

    apiStatusElement.hidden = false;
    apiStatusElement.textContent = getPack().dataStatusPartial;
  };

  const markMetric = (name, ok) => {
    metricStatus[name].done = true;
    metricStatus[name].ok = Boolean(ok);
    renderDataStatus();
  };

  const fetchAllOrganizationRepos = async () => {
    const cacheName = `gh_org_repos_${CONFIG.organization}`;
    const cached = readCache(cacheName, CONFIG.githubTtlMs);
    if (cached !== null) return cached;

    const repos = [];
    let page = 1;

    try {
      while (true) {
        const url = `https://api.github.com/orgs/${encodeURIComponent(CONFIG.organization)}/repos?type=public&per_page=100&page=${page}`;
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error(`Unable to fetch repositories for ${CONFIG.organization}`);

        const pageRepos = await response.json();
        if (!Array.isArray(pageRepos) || pageRepos.length === 0) break;
        repos.push(...pageRepos);
        if (pageRepos.length < 100) break;
        page += 1;
      }

      writeCache(cacheName, repos);
      return repos;
    } catch (error) {
      const stale = readStaleCache(cacheName);
      if (stale !== null) return stale;
      throw error;
    }
  };

  const getOrganizationRepos = () => {
    if (!organizationReposPromise) organizationReposPromise = fetchAllOrganizationRepos();
    return organizationReposPromise;
  };

  const fetchRepoStarCount = async (repoPath) => {
    if (starCache.has(repoPath)) return starCache.get(repoPath);

    try {
      const organizationRepos = await getOrganizationRepos();
      const matchingRepo = organizationRepos.find((repo) => (
        String(repo.full_name || "").toLowerCase() === repoPath.toLowerCase()
      ));
      if (matchingRepo) {
        const count = Number(matchingRepo.stargazers_count);
        if (Number.isFinite(count)) {
          starCache.set(repoPath, count);
          return count;
        }
      }
    } catch (_) {
      // Fall back to the repository endpoint and its own stale cache.
    }

    const data = await fetchJsonWithCache(
      `gh_repo_${repoPath}`,
      `https://api.github.com/repos/${repoPath}`,
      CONFIG.githubTtlMs
    );
    const count = Number(data.stargazers_count);
    if (!Number.isFinite(count)) throw new Error(`Invalid star count for ${repoPath}`);
    starCache.set(repoPath, count);
    return count;
  };

  const loadImpactStats = async () => {
    try {
      const repos = await getOrganizationRepos();
      if (!Array.isArray(repos)) throw new Error("Invalid organization repository data");

      animateCounterTo(statsElements.repos, repos.length);
      markMetric("repos", true);

      const stars = repos.reduce((total, repo) => total + Number(repo.stargazers_count || 0), 0);
      animateCounterTo(statsElements.stars, stars);
      markMetric("stars", true);
    } catch (_) {
      setStatUnavailable("repos");
      setStatUnavailable("stars");
      markMetric("repos", false);
      markMetric("stars", false);
    }
  };

  // Publication rendering
  const renderPublicationAction = (action, pack) => {
    const knownTypes = new Set(["project", "paper", "pdf", "code", "slides"]);
    const type = knownTypes.has(action.type) ? action.type : "link";
    const label = pack[`${type}Label`] || action.label || type;

    if (action.status === "wip" || !action.href) {
      return `<span class="pub-action is-disabled">${escapeHtml(label)} · ${escapeHtml(pack.wipLabel)}</span>`;
    }

    const safeHref = escapeAttr(action.href);
    const link = `<a class="pub-action pub-action-${escapeAttr(type)}" href="${safeHref}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
    if (type !== "code") return link;

    const repoPath = action.repo || action.href.replace(/^https:\/\/github\.com\//, "");
    const starLink = `<a class="github-button" href="${safeHref}" target="_blank" rel="noopener noreferrer" aria-label="${escapeAttr(pack.starLabel)} ${escapeAttr(repoPath)} on GitHub" data-repo="${escapeAttr(repoPath)}">${escapeHtml(pack.starLabel)}</a>`;
    return `${link}${starLink}`;
  };

  const renderPublications = async (locale) => {
    const host = document.querySelector("[data-publications-list]");
    if (!host) return;

    const pack = getPack(locale);
    host.innerHTML = `<p class="loading-state">${escapeHtml(pack.publicationsLoading)}</p>`;

    try {
      const publications = await fetchJsonWithCache(
        `publications_${CONFIG.contentCacheVersion}`,
        "data/publications.json",
        CONFIG.contentTtlMs
      );
      if (!Array.isArray(publications)) throw new Error("Invalid publications data");

      host.innerHTML = publications.map((publication) => {
        const actions = Array.isArray(publication.actions)
          ? publication.actions.map((action) => renderPublicationAction(action, pack)).join("")
          : "";

        return `
          <article class="pub-item">
            <div class="pub-media">
              <img src="${escapeAttr(publication.image)}" alt="${escapeAttr(publication.alt || `${publication.title} thumbnail`)}" loading="lazy" decoding="async">
            </div>
            <div class="pub-details">
              <p class="pub-venue">${escapeHtml(publication.venue)}</p>
              <h3>${escapeHtml(publication.title)}</h3>
              ${actions ? `<div class="pub-actions">${actions}</div>` : ""}
            </div>
          </article>
        `;
      }).join("");
    } catch (_) {
      host.innerHTML = `<p class="error-state">${escapeHtml(pack.publicationsUnavailable)}</p>`;
    }
  };

  const hydratePublicationStars = async () => {
    const starLinks = Array.from(document.querySelectorAll("a.github-button"));

    starLinks.forEach((link) => {
      link.textContent = `${getPack().starLabel} ...`;
      link.classList.add("loading");
    });

    await Promise.all(starLinks.map(async (link) => {
      try {
        const repoPath = link.dataset.repo;
        if (!repoPath) throw new Error("Missing repository path");
        const stars = await fetchRepoStarCount(repoPath);
        link.textContent = `${getPack().starLabel} ${compactNumber(stars)}`;
      } catch (_) {
        link.textContent = getPack().starLabel;
      } finally {
        link.classList.remove("loading");
      }
    }));
  };

  // Localized Markdown content
  const fetchMarkdown = async (locale, section) => {
    const preferred = `content/${locale}/${section}.md`;
    const fallback = `content/en/${section}.md`;

    try {
      return await fetchTextWithCache(
        `md_${CONFIG.contentCacheVersion}_${locale}_${section}`,
        preferred,
        CONFIG.contentTtlMs
      );
    } catch (_) {
      return fetchTextWithCache(
        `md_${CONFIG.contentCacheVersion}_en_${section}`,
        fallback,
        CONFIG.contentTtlMs
      );
    }
  };

  const getLocalOpenFallbackHtml = (locale) => {
    const pack = getPack(locale);
    return `<div class="card"><h3>${pack.localOpenTitle}</h3><p>${pack.localOpenBody}</p></div>`;
  };

  const loadMarkdownSections = async (locale) => {
    const resolvedLocale = i18n[locale] ? locale : "en";
    const sections = Array.from(document.querySelectorAll("[data-md-section]"));

    if (window.location.protocol === "file:") {
      const fallbackHtml = getLocalOpenFallbackHtml(resolvedLocale);
      sections.forEach((host) => { host.innerHTML = fallbackHtml; });
      return;
    }

    if (!window.marked) {
      const message = escapeHtml(getPack(resolvedLocale).contentUnavailable);
      sections.forEach((host) => { host.innerHTML = `<div class="card">${message}</div>`; });
      return;
    }

    await Promise.all(sections.map(async (host) => {
      try {
        const markdown = await fetchMarkdown(resolvedLocale, host.dataset.mdSection);
        host.innerHTML = window.marked.parse(markdown);
        prepareContentImages(host);
      } catch (_) {
        host.innerHTML = `<div class="card">${escapeHtml(getPack(resolvedLocale).contentUnavailable)}</div>`;
      }
    }));

    await renderPublications(resolvedLocale);
    initStaggeredContent(document);
    await hydratePublicationStars();
    requestScrollEffectUpdate();
  };

  // Language switching and startup
  const applyTranslations = (locale) => {
    const pack = getPack(locale);

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = pack[element.dataset.i18n];
      if (value) element.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      const value = pack[element.dataset.i18nHtml];
      if (value) element.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      const value = pack[element.dataset.i18nAriaLabel];
      if (value) element.setAttribute("aria-label", value);
    });
  };

  const refreshStatLocale = () => {
    Object.entries(metricStatus).forEach(([name, status]) => {
      const element = statsElements[name];
      if (status.ok && element.dataset.value) {
        element.textContent = compactNumber(Number(element.dataset.value));
      } else if (status.done) {
        setStatUnavailable(name);
      } else {
        setStatLoading(name);
      }
    });
  };

  const setLanguage = async (language) => {
    const locale = i18n[language] ? language : "en";
    currentLocale = locale;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : locale;
    applyTranslations(locale);

    document.querySelectorAll(".lang-btn").forEach((button) => {
      const active = button.dataset.lang === locale;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    writeStorage("site-lang", locale);
    refreshStatLocale();
    await loadMarkdownSections(locale);
    renderDataStatus();
  };

  const detectPreferredLanguage = () => {
    const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const normalized = browserLanguages.map((language) => String(language || "").toLowerCase());
    if (normalized.some((language) => language.startsWith("zh"))) return "zh";
    if (normalized.some((language) => language.startsWith("fr"))) return "fr";
    return "en";
  };

  const initLanguage = async () => {
    const saved = readStorage("site-lang");
    const initial = i18n[saved] ? saved : detectPreferredLanguage();
    await setLanguage(initial);
  };

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => { setLanguage(button.dataset.lang); });
  });

  const currentYear = document.querySelector("[data-current-year]");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  initRevealAnimations();
  initScrollEffects();
  initHeroSpotlight();
  initActiveNavigation();
  setStatLoading("stars");
  setStatLoading("repos");
  loadImpactStats();
  initLanguage();
})();
