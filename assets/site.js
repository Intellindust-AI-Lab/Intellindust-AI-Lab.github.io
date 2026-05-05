    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el, idx) => {
      el.style.transitionDelay = `${idx * 60}ms`;
      revealObserver.observe(el);
    });

    const CONTENT_CACHE_VERSION = '2026-05-05-1';

    const compactNumber = (value) => new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value);
    const nowMs = () => Date.now();
    const cacheKey = (key) => `cache:${key}`;
    const readCache = (key, ttlMs) => {
      try {
        const raw = localStorage.getItem(cacheKey(key));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.ts !== 'number') return null;
        if (ttlMs > 0 && (nowMs() - parsed.ts > ttlMs)) return null;
        return parsed.value;
      } catch (_) {
        return null;
      }
    };
    const readStaleCache = (key) => {
      try {
        const raw = localStorage.getItem(cacheKey(key));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed ? parsed.value : null;
      } catch (_) {
        return null;
      }
    };
    const writeCache = (key, value) => {
      try {
        localStorage.setItem(cacheKey(key), JSON.stringify({ ts: nowMs(), value }));
      } catch (_) {
        // Ignore cache write failures.
      }
    };
    const fetchJsonWithCache = async (key, url, ttlMs) => {
      const cached = readCache(key, ttlMs);
      if (cached !== null) return cached;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`fetch ${url}`);
        const data = await res.json();
        writeCache(key, data);
        return data;
      } catch (_) {
        const stale = readStaleCache(key);
        if (stale !== null) return stale;
        throw _;
      }
    };
    const fetchTextWithCache = async (key, url, ttlMs) => {
      const cached = readCache(key, ttlMs);
      if (cached !== null) return cached;
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`fetch ${url}`);
        const text = await res.text();
        writeCache(key, text);
        return text;
      } catch (error) {
        const stale = readStaleCache(key);
        if (stale !== null) return stale;
        throw error;
      }
    };
    const animateCounterTo = (element, target) => {
      const safeTarget = Number.isFinite(target) && target >= 0 ? target : 0;
      const start = Number(element.dataset.value || 0);
      const startTime = performance.now();
      const duration = 900;
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.round(start + (safeTarget - start) * progress);
        element.textContent = compactNumber(current);
        if (progress < 1) {
          requestAnimationFrame(step);
          return;
        }
        element.dataset.value = String(safeTarget);
      };
      requestAnimationFrame(step);
    };

    const statsEls = {
      stars: document.querySelector('[data-stat=\"stars\"]'),
      repos: document.querySelector('[data-stat=\"repos\"]')
    };
    const apiStatusEl = document.querySelector('[data-api-status]');
    let currentLocale = 'en';
    const getLoadingText = () => {
      if (currentLocale === 'zh') return '加载中...';
      if (currentLocale === 'fr') return 'Chargement...';
      return 'Loading...';
    };
    const setStatLoading = (name) => {
      const el = statsEls[name];
      if (!el) return;
      el.textContent = getLoadingText();
      delete el.dataset.value;
    };
    const metricStatus = {
      stars: { done: false, ok: false }
    };
    const markMetric = (name, ok) => {
      if (!metricStatus[name]) return;
      metricStatus[name].done = true;
      metricStatus[name].ok = !!ok;
      renderDataStatus();
    };

    const tiltedCards = new WeakSet();
    const bindCardTilt = (root = document) => {
      root.querySelectorAll('.card').forEach((card) => {
        if (tiltedCards.has(card)) return;
        card.addEventListener('mousemove', (e) => {
          if (window.innerWidth < 860) return;
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const rotateY = (px - 0.5) * 5;
          const rotateX = (0.5 - py) * 4;
          card.style.transform = `translateY(-2px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
        tiltedCards.add(card);
      });
    };
    bindCardTilt();

    const i18n = {
      en: {
        heroTitle: 'Intellindust AI Lab',
        heroSub: 'Pioneering vision AI for edge intelligence with fast, efficient, and robust models deployed in real-world environments.',
        statStars: 'GitHub Stars',
        statRepos: 'Open Repositories',
        followLine: 'Follow our <a href=\"https://github.com/Intellindust-AI-Lab\" target=\"_blank\" rel=\"noopener noreferrer\">GitHub repos</a> for latest code, checkpoints, and updates.',
        dataStatusPartial: 'Some live metrics are temporarily unavailable.',
        loadingText: 'Loading...',
        contentUnavailable: 'Content unavailable.',
        publicationsLoading: 'Loading publications...',
        publicationsUnavailable: 'Publications unavailable.',
        projectLabel: 'Project Page',
        paperLabel: 'Paper Link',
        pdfLabel: 'PDF',
        codeLabel: 'Code Repository',
        slidesLabel: 'Slides',
        starLabel: 'Star',
        wipLabel: 'WIP',
        localOpenTitle: 'Local Preview Requires a Web Server',
        localOpenBody: 'Opening `index.html` directly via `file://` blocks section loading in browsers. Run `./run_local.sh` and open `http://localhost:8000/index.html` instead.',
        footerText: '\u00a9 2025 Intellindust AI Lab. All rights reserved.'
      },
      fr: {
        heroTitle: 'Intellindust AI Lab',
        heroSub: "Nous concevons des systèmes de vision par ordinateur pour l'edge, avec des modèles rapides, efficaces et robustes, pensés pour des usages réels.",
        statStars: 'Total des stars GitHub',
        statRepos: 'Dépôts open source',
        followLine: 'Suivez nos <a href=\"https://github.com/Intellindust-AI-Lab\" target=\"_blank\" rel=\"noopener noreferrer\">dépôts GitHub</a> pour accéder à nos derniers codes, checkpoints et mises à jour.',
        dataStatusPartial: 'Certaines métriques en direct sont temporairement indisponibles.',
        loadingText: 'Chargement...',
        contentUnavailable: 'Contenu indisponible.',
        publicationsLoading: 'Chargement des publications...',
        publicationsUnavailable: 'Publications indisponibles.',
        projectLabel: 'Page du projet',
        paperLabel: 'Article',
        pdfLabel: 'PDF',
        codeLabel: 'Code source',
        slidesLabel: 'Diapositives',
        starLabel: 'Star',
        wipLabel: 'WIP',
        localOpenTitle: 'L’aperçu local nécessite un serveur web',
        localOpenBody: 'Ouvrir `index.html` directement via `file://` empêche le chargement des sections dans le navigateur. Lancez `./run_local.sh` puis ouvrez `http://localhost:8000/index.html`.',
        footerText: '\u00a9 2025 Intellindust AI Lab. Tous droits réservés.'
      },
      zh: {
        heroTitle: '英特灵达人工智能实验室',
        heroSub: '面向边缘智能场景，打造快速、高效、可靠的视觉 AI 模型与系统。',
        statStars: 'GitHub 总 Star',
        statRepos: '开源仓库',
        followLine: '欢迎关注我们的 <a href=\"https://github.com/Intellindust-AI-Lab\" target=\"_blank\" rel=\"noopener noreferrer\">GitHub 仓库</a>，获取最新代码、权重与更新。',
        dataStatusPartial: '部分实时数据暂时不可用。',
        loadingText: '加载中...',
        contentUnavailable: '内容暂时不可用。',
        publicationsLoading: '正在加载论文...',
        publicationsUnavailable: '论文列表暂时不可用。',
        projectLabel: '项目主页',
        paperLabel: '论文链接',
        pdfLabel: 'PDF',
        codeLabel: '代码仓库',
        slidesLabel: '幻灯片',
        starLabel: 'Star',
        wipLabel: 'WIP',
        localOpenTitle: '本地预览需要通过 Web 服务器打开',
        localOpenBody: '直接用 `file://` 打开 `index.html` 时，浏览器会拦截页面对各分区内容的加载。请运行 `./run_local.sh`，然后访问 `http://localhost:8000/index.html`。',
        footerText: '\u00a9 2025 Intellindust AI Lab。保留所有权利。'
      }
    };
    const getLocalOpenFallbackHtml = (locale) => {
      const pack = i18n[locale] || i18n.en;
      return `<div class="card"><h3>${pack.localOpenTitle || i18n.en.localOpenTitle}</h3><p>${pack.localOpenBody || i18n.en.localOpenBody}</p></div>`;
    };
    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
    const escapeAttr = escapeHtml;
    const renderDataStatus = () => {
      if (!apiStatusEl) return;
      const allDone = Object.values(metricStatus).every((m) => m.done);
      const allFailed = Object.values(metricStatus).every((m) => m.done && !m.ok);
      if (!allDone || !allFailed) {
        apiStatusEl.hidden = true;
        apiStatusEl.textContent = '';
        return;
      }
      const pack = i18n[currentLocale] || i18n.en;
      apiStatusEl.hidden = false;
      apiStatusEl.textContent = pack.dataStatusPartial || i18n.en.dataStatusPartial;
    };

    const fetchMarkdown = async (locale, section) => {
      const preferred = `content/${locale}/${section}.md`;
      const fallback = `content/en/${section}.md`;
      try {
        return await fetchTextWithCache(`md_${CONTENT_CACHE_VERSION}_${locale}_${section}`, preferred, 10 * 60 * 1000);
      } catch (_) {
        return fetchTextWithCache(`md_${CONTENT_CACHE_VERSION}_en_${section}`, fallback, 10 * 60 * 1000);
      }
    };

    const fetchPublications = () => fetchJsonWithCache(
      `publications_${CONTENT_CACHE_VERSION}`,
      'data/publications.json',
      10 * 60 * 1000
    );

    const renderPublicationAction = (action, pack) => {
      const label = pack[`${action.type}Label`] || action.label || action.type;
      if (action.status === 'wip' || !action.href) {
        return `<span>[${escapeHtml(label)}] ${escapeHtml(pack.wipLabel || i18n.en.wipLabel)}</span>`;
      }
      const safeHref = escapeAttr(action.href);
      const link = `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">[${escapeHtml(label)}]</a>`;
      if (action.type !== 'code') return link;
      const repoPath = action.repo || action.href.replace(/^https:\/\/github\.com\//, '');
      const starText = escapeHtml(pack.starLabel || i18n.en.starLabel);
      const starLink = `<a class="github-button" href="${safeHref}" aria-label="Star ${escapeAttr(repoPath)} on GitHub" data-repo="${escapeAttr(repoPath)}">${starText}</a>`;
      return `${link} &nbsp; ${starLink}`;
    };

    const renderPublications = async (locale) => {
      const host = document.querySelector('[data-publications-list]');
      if (!host) return;
      const pack = i18n[locale] || i18n.en;
      host.innerHTML = `<p>${escapeHtml(pack.publicationsLoading || i18n.en.publicationsLoading)}</p>`;
      try {
        const publications = await fetchPublications();
        if (!Array.isArray(publications)) throw new Error('invalid publications data');
        host.innerHTML = publications.map((pub) => {
          const actions = Array.isArray(pub.actions) ? pub.actions.map((action) => renderPublicationAction(action, pack)).join(' &nbsp; ') : '';
          return `
            <div class="pub-item">
              <img src="${escapeAttr(pub.image)}" alt="${escapeAttr(pub.alt || `${pub.title} Thumbnail`)}">
              <div class="pub-details">
                <h3>${escapeHtml(pub.title)}</h3>
                <p>${escapeHtml(pub.venue)}</p>
                <p>${actions}</p>
              </div>
            </div>
          `;
        }).join('');
      } catch (_) {
        host.innerHTML = `<p>${escapeHtml(pack.publicationsUnavailable || i18n.en.publicationsUnavailable)}</p>`;
      }
    };

    const starCache = new Map();
    const fetchRepoStarCount = async (repoPath) => {
      if (starCache.has(repoPath)) return starCache.get(repoPath);
      const data = await fetchJsonWithCache(
        `gh_repo_${repoPath}`,
        `https://api.github.com/repos/${repoPath}`,
        15 * 60 * 1000
      );
      const count = Number(data.stargazers_count || 0);
      starCache.set(repoPath, count);
      return count;
    };

    const hydratePublicationStars = async () => {
      const starLinks = Array.from(document.querySelectorAll('a.github-button'));
      const pack = i18n[currentLocale] || i18n.en;
      const starText = pack.starLabel || i18n.en.starLabel;
      starLinks.forEach((link) => {
        link.textContent = `${starText} ...`;
        link.classList.add('loading');
      });
      await Promise.all(starLinks.map(async (link) => {
        try {
          const repoPath = link.dataset.repo || (() => {
            const url = new URL(link.href);
            const seg = url.pathname.split('/').filter(Boolean);
            return seg.length >= 2 ? `${seg[0]}/${seg[1]}` : '';
          })();
          if (!repoPath) return;
          const stars = await fetchRepoStarCount(repoPath);
          link.textContent = `${starText} ${compactNumber(stars)}`;
        } catch (_) {
          link.textContent = starText;
        } finally {
          link.classList.remove('loading');
        }
      }));
    };

    const loadMarkdownSections = async (locale) => {
      const resolved = locale === 'zh' || locale === 'fr' ? locale : 'en';
      const parser = window.marked || null;
      if (!parser) return;
      const sections = document.querySelectorAll('[data-md-section]');
      if (window.location.protocol === 'file:') {
        const fallbackHtml = getLocalOpenFallbackHtml(resolved);
        sections.forEach((host) => {
          host.innerHTML = fallbackHtml;
        });
        bindCardTilt(document);
        return;
      }
      await Promise.all(Array.from(sections).map(async (host) => {
        const section = host.dataset.mdSection;
        try {
          const mdText = await fetchMarkdown(resolved, section);
          host.innerHTML = parser.parse(mdText);
        } catch (_) {
          host.innerHTML = '<div class="card">Content unavailable.</div>';
        }
      }));
      await renderPublications(resolved);
      bindCardTilt(document);
      await hydratePublicationStars();
    };

    const fetchAllOrgRepos = async (org) => {
      const cacheK = `gh_org_repos_${org}`;
      const cached = readCache(cacheK, 15 * 60 * 1000);
      if (cached !== null) return cached;
      let page = 1;
      const all = [];
      while (true) {
        const url = `https://api.github.com/orgs/${encodeURIComponent(org)}/repos?type=public&per_page=100&page=${page}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`github org repos ${org}`);
        const repos = await res.json();
        if (!Array.isArray(repos) || repos.length === 0) break;
        all.push(...repos);
        if (repos.length < 100) break;
        page += 1;
      }
      writeCache(cacheK, all);
      return all;
    };

    const fetchAllOrgReposWithFallback = async (org) => {
      try {
        return await fetchAllOrgRepos(org);
      } catch (error) {
        const stale = readStaleCache(`gh_org_repos_${org}`);
        if (stale !== null) return stale;
        throw error;
      }
    };

    const loadImpactStats = async () => {
      let orgRepos = [];
      try {
        orgRepos = await fetchAllOrgReposWithFallback('Intellindust-AI-Lab');
      } catch (_) {}

      const repoCount = orgRepos.length;
      if (statsEls.repos && repoCount > 0) {
        animateCounterTo(statsEls.repos, repoCount);
      } else {
        setStatLoading('repos');
      }

      const totalStars = orgRepos.reduce((sum, repo) => sum + Number(repo && repo.stargazers_count ? repo.stargazers_count : 0), 0);
      const starOk = totalStars > 0;
      if (statsEls.stars && starOk) {
        animateCounterTo(statsEls.stars, totalStars);
      } else {
        setStatLoading('stars');
      }
      markMetric('stars', starOk);
    };

    setStatLoading('stars');
    loadImpactStats();

    const setLanguage = async (lang) => {
      const locale = i18n[lang] ? lang : 'en';
      currentLocale = locale;
      document.documentElement.lang = locale === 'zh' ? 'zh-CN' : (locale === 'fr' ? 'fr' : 'en');
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        if (i18n[locale][key]) el.textContent = i18n[locale][key];
      });
      document.querySelectorAll('[data-i18n-html]').forEach((el) => {
        const key = el.dataset.i18nHtml;
        if (i18n[locale][key]) el.innerHTML = i18n[locale][key];
      });
      document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.lang === locale);
      });
      localStorage.setItem('site-lang', locale);
      Object.keys(metricStatus).forEach((k) => {
        if (!metricStatus[k].ok) setStatLoading(k);
      });
      await loadMarkdownSections(locale);
      renderDataStatus();
    };

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => { setLanguage(btn.dataset.lang); });
    });

    const detectPreferredLanguage = () => {
      const preferred = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language])
        .map((lang) => String(lang || '').toLowerCase());
      if (preferred.some((lang) => lang.startsWith('zh'))) return 'zh';
      if (preferred.some((lang) => lang.startsWith('fr'))) return 'fr';
      return 'en';
    };

    const initLanguage = async () => {
      const saved = localStorage.getItem('site-lang');
      if (saved === 'en' || saved === 'zh' || saved === 'fr') {
        await setLanguage(saved);
        return;
      }
      const detected = detectPreferredLanguage();
      await setLanguage(detected);
    };

    initLanguage();
