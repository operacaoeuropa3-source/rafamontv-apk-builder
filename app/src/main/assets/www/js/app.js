/**
 * StreamCast TV - Smart TV Media & IPTV Player (LG webOS & TCL Android TV)
 * 100% Original Clean-Room Implementation
 */

(function () {
  "use strict";

  const STORAGE_KEYS = {
    PLAYLISTS: "streamcast_playlists_v3",
    ACTIVE_ID: "streamcast_active_playlist_v3",
    FAVORITES: "streamcast_favorites_v3",
    HISTORY: "streamcast_watch_history_v3",
    SETTINGS: "streamcast_settings_v3"
  };

  const DEFAULT_SETTINGS = {
    liveFormat: "m3u8", // "m3u8" or "ts"
    useCorsProxy: true,
    parentalEnabled: false,
    parentalPin: "0000",
    aspectRatio: "contain" // "contain" | "cover" | "fill"
  };

  const DEFAULT_MULTIVERSE_PLAYLIST = {
    id: "pl-multiversetv",
    name: "MULTIVERSETV",
    type: "xtream",
    serverUrl: "http://multiversebrasil.com",
    username: "jwrMpf",
    password: "mgNXqM"
  };

  // Built-in open-source / public domain demo catalog for instant fallback
  const DEMO_PLAYLIST = {
    id: "demo-open-streams",
    name: "Lista Demo (Canais & Filmes Abertos)",
    type: "demo",
    createdAt: "Pré-instalada",
    liveCategories: [
      { id: "all", name: "Todos os Canais" },
      { id: "open-tv", name: "Canais de Teste HLS" },
      { id: "doc-science", name: "Ciência & Espaço" },
      { id: "animation", name: "Animação 24h" }
    ],
    liveStreams: [
      {
        id: "ch-101",
        num: 101,
        name: "Blender Open TV HD",
        categoryId: "animation",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Blender_logo_no_text.svg/240px-Blender_logo_no_text.svg.png",
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        epgNow: "Big Buck Bunny - Transmissão Contínua",
        epgNext: "Documentário Open Movie Project"
      },
      {
        id: "ch-102",
        num: 102,
        name: "Sintel Action Channel HD",
        categoryId: "open-tv",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/240px-React-icon.svg.png",
        url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
        epgNow: "Sintel - Especial Fantasia (HLS Adaptive)",
        epgNext: "Making of Sintel"
      },
      {
        id: "ch-103",
        num: 103,
        name: "Tears of Steel Sci-Fi TV",
        categoryId: "doc-science",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/240px-NASA_logo.svg.png",
        url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
        epgNow: "Tears of Steel - Ficção Científica em 1080p",
        epgNext: "Bastidores de Efeitos Visuais"
      },
      {
        id: "ch-104",
        num: 104,
        name: "Apple BipBop Multistream Test",
        categoryId: "open-tv",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/200px-Apple_logo_black.svg.png",
        url: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
        epgNow: "Sinal de Calibração de Áudio e Vídeo",
        epgNext: "Teste de Taxa de Bits Adaptativa"
      }
    ],
    vodCategories: [
      { id: "all", name: "Todos os Filmes" },
      { id: "anim", name: "Animação" },
      { id: "scifi", name: "Ficção Científica" }
    ],
    vodStreams: [
      {
        id: "vod-1",
        name: "Big Buck Bunny (2008)",
        categoryId: "anim",
        year: "2008",
        rating: "8.5",
        duration: "10 min",
        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/400px-Big_buck_bunny_poster_big.jpg",
        plot: "Um coelho gigante e bem-humorado enfrenta três roedores travessos na floresta em uma produção clássica da Blender Foundation.",
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      },
      {
        id: "vod-2",
        name: "Sintel (2010)",
        categoryId: "anim",
        year: "2010",
        rating: "8.9",
        duration: "15 min",
        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sintel_poster.jpg/400px-Sintel_poster.jpg",
        plot: "Uma jovem guerreira chamada Sintel viaja pelo mundo em busca de seu pequeno dragão de estimação, Scales.",
        url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
      },
      {
        id: "vod-3",
        name: "Tears of Steel (2012)",
        categoryId: "scifi",
        year: "2012",
        rating: "8.4",
        duration: "12 min",
        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Tos-poster.png/400px-Tos-poster.png",
        plot: "Em uma Amsterdã futurista, um grupo de cientistas e guerreiros tenta recriar um evento crucial do passado para salvar o mundo de robôs.",
        url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
      }
    ],
    seriesCategories: [
      { id: "all", name: "Todas as Séries" },
      { id: "open-series", name: "Originais Open Movie" }
    ],
    seriesList: [
      {
        id: "ser-1",
        name: "Crônicas Blender Studio",
        categoryId: "open-series",
        year: "2024",
        rating: "9.1",
        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/400px-Big_buck_bunny_poster_big.jpg",
        plot: "Antologia completa de curtas-metragens abertos produzidos pelo Blender Institute em alta definição.",
        seasons: [
          {
            seasonNumber: 1,
            name: "Temporada 1",
            episodes: [
              {
                id: "ep-101",
                num: 1,
                title: "Episódio 1: Big Buck Bunny",
                duration: "10m",
                url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
              },
              {
                id: "ep-102",
                num: 2,
                title: "Episódio 2: Sintel - A Jornada",
                duration: "15m",
                url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
              },
              {
                id: "ep-103",
                num: 3,
                title: "Episódio 3: Tears of Steel",
                duration: "12m",
                url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
              }
            ]
          }
        ]
      }
    ]
  };

  // Application State
  const state = {
    currentView: "dashboard",
    searchQuery: "",
    playlists: [DEFAULT_MULTIVERSE_PLAYLIST, DEMO_PLAYLIST],
    activePlaylistId: "pl-multiversetv",
    catalog: structuredClone(DEMO_PLAYLIST),
    favorites: { live: [], vod: [], series: [] },
    history: {}, // id -> { time, duration, title, type, url, updatedAt }
    settings: { ...DEFAULT_SETTINGS },
    liveSelectedCat: "all",
    vodSelectedCat: "all",
    seriesSelectedCat: "all",
    currentChannel: null,
    currentPlayingItem: null,
    isFullscreen: false,
    osdTimer: null,
    miniHls: null,
    miniMpegts: null,
    fsHls: null,
    fsMpegts: null,
    addModalTab: "xtream"
  };

  // Helper: Safe JSON LocalStorage
  function loadStateFromStorage() {
    try {
      const savedPlaylists = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYLISTS) || "[]");
      const baseIds = new Set([DEFAULT_MULTIVERSE_PLAYLIST.id, DEMO_PLAYLIST.id]);
      state.playlists = [
        DEFAULT_MULTIVERSE_PLAYLIST,
        ...savedPlaylists.filter(p => !baseIds.has(p.id)),
        DEMO_PLAYLIST
      ];

      const savedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
      if (savedActive && state.playlists.some(p => p.id === savedActive)) {
        state.activePlaylistId = savedActive;
      } else {
        state.activePlaylistId = DEFAULT_MULTIVERSE_PLAYLIST.id;
      }

      const savedFavs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || "null");
      if (savedFavs) state.favorites = savedFavs;

      const savedHist = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "null");
      if (savedHist) state.history = savedHist;

      const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || "null");
      if (savedSettings) state.settings = { ...DEFAULT_SETTINGS, ...savedSettings };
    } catch (err) {
      console.warn("Erro ao carregar storage:", err);
      state.playlists = [DEFAULT_MULTIVERSE_PLAYLIST, DEMO_PLAYLIST];
      state.activePlaylistId = DEFAULT_MULTIVERSE_PLAYLIST.id;
    }
  }

  function savePlaylistsToStorage() {
    const custom = state.playlists.filter(p => p.id !== DEMO_PLAYLIST.id);
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(custom));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, state.activePlaylistId);
  }

  function saveFavoritesToStorage() {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
  }

  function saveHistoryToStorage() {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
  }

  function saveSettingsToStorage() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
  }

  // Toast Notification
  function showToast(msg) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const el = document.createElement("div");
    el.className = "toast-msg";
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 3600);
  }

  // Async callback registry for multi-threaded AndroidBridge.httpGetAsync
  const pendingAndroidHttp = new Map();
  let androidHttpSeq = 1;
  window.__onAndroidHttpResult = function (cbId, directRaw) {
    const entry = pendingAndroidHttp.get(cbId);
    if (!entry) return;
    pendingAndroidHttp.delete(cbId);
    const raw =
      directRaw !== undefined
        ? directRaw
        : window.AndroidBridge && typeof window.AndroidBridge.takeHttpResponse === "function"
        ? window.AndroidBridge.takeHttpResponse(cbId)
        : "";
    if (!raw || raw.startsWith("__ERROR__:")) {
      entry.reject(new Error(raw || "Falha na conexão Android"));
    } else {
      entry.resolve(raw);
    }
  };

  // Non-blocking Network Helper (Chromium C++ parallel fetch + multi-threaded Android fallback + CORS proxy)
  async function smartFetch(url, asJson = true) {
    // 1. Native Chromium/WebView asynchronous fetch (100% non-blocking, runs in parallel C++ threads)
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        return asJson ? await resp.json() : await resp.text();
      }
    } catch (_) {}

    // 2. Multi-threaded Async Java Bridge inside Rafamon TV APK (never blocks UI thread)
    if (window.AndroidBridge && typeof window.AndroidBridge.httpGetAsync === "function") {
      const raw = await new Promise((resolve, reject) => {
        const cbId = "req_" + (androidHttpSeq++);
        pendingAndroidHttp.set(cbId, { resolve, reject });
        window.AndroidBridge.httpGetAsync(url, cbId);
      });
      return asJson ? JSON.parse(raw) : raw;
    }

    // 3. Local companion server CORS proxy fallback (for desktop browser testing)
    if (state.settings.useCorsProxy && window.location.protocol.startsWith("http")) {
      const proxyUrl = `/proxy?url=${encodeURIComponent(url)}`;
      const resp = await fetch(proxyUrl);
      if (!resp.ok) throw new Error("Proxy HTTP " + resp.status);
      return asJson ? await resp.json() : await resp.text();
    }

    // 4. Legacy fallback
    if (window.AndroidBridge && typeof window.AndroidBridge.httpGet === "function") {
      const res = window.AndroidBridge.httpGet(url);
      if (!res || res.startsWith("__ERROR__:")) throw new Error(res || "Erro HTTP");
      return asJson ? JSON.parse(res) : res;
    }

    throw new Error("Falha ao conectar ao servidor");
  }

  // Startup Mini-Loader UI Controller
  function updateStartupLoader(visible, pct = 0, status = "", detail = "") {
    const overlay = document.getElementById("startup-loader-overlay");
    if (!overlay) return;
    if (!visible) {
      overlay.classList.remove("active");
      return;
    }
    overlay.classList.add("active");
    const fill = document.getElementById("startup-progress-fill");
    const statusEl = document.getElementById("startup-loader-status");
    const detailEl = document.getElementById("startup-loader-detail");
    const pctEl = document.getElementById("startup-loader-pct");
    if (fill) fill.style.width = `${Math.max(5, Math.min(100, pct))}%`;
    if (status && statusEl) statusEl.textContent = status;
    if (detail && detailEl) detailEl.textContent = detail;
    if (pctEl) pctEl.textContent = `${Math.round(pct)}%`;
  }

  // Persistent IndexedDB Cache so the app opens in <200ms without re-downloading catalogs
  const IDB_NAME = "rafamontv_cache_v4";
  const IDB_STORE = "kv";
  let idbPromise = null;

  function openCacheDB() {
    if (idbPromise) return idbPromise;
    idbPromise = new Promise(resolve => {
      try {
        const req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = e => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE);
          }
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
    return idbPromise;
  }

  async function idbGet(key) {
    const db = await openCacheDB();
    if (!db) return null;
    return new Promise(resolve => {
      try {
        const tx = db.transaction(IDB_STORE, "readonly");
        const req = tx.objectStore(IDB_STORE).get(key);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  }

  async function idbSet(key, val) {
    const db = await openCacheDB();
    if (!db) return;
    return new Promise(resolve => {
      try {
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(val, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (_) {
        resolve(false);
      }
    });
  }

  async function idbClearAll() {
    const db = await openCacheDB();
    if (!db) return;
    return new Promise(resolve => {
      try {
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).clear();
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (_) {
        resolve(false);
      }
    });
  }

  // Build in-memory O(1) category lookup Maps (Duplecast instant category switching)
  function indexCatalogMaps(cat) {
    const liveByCat = new Map([["all", cat.liveStreams || []]]);
    const vodByCat = new Map([["all", cat.vodStreams || []]]);
    const seriesByCat = new Map([["all", cat.seriesList || []]]);

    for (let i = 0; i < (cat.liveStreams || []).length; i++) {
      const item = cat.liveStreams[i];
      let arr = liveByCat.get(item.categoryId);
      if (!arr) {
        arr = [];
        liveByCat.set(item.categoryId, arr);
      }
      arr.push(item);
    }

    for (let i = 0; i < (cat.vodStreams || []).length; i++) {
      const item = cat.vodStreams[i];
      let arr = vodByCat.get(item.categoryId);
      if (!arr) {
        arr = [];
        vodByCat.set(item.categoryId, arr);
      }
      arr.push(item);
    }

    for (let i = 0; i < (cat.seriesList || []).length; i++) {
      const item = cat.seriesList[i];
      let arr = seriesByCat.get(item.categoryId);
      if (!arr) {
        arr = [];
        seriesByCat.set(item.categoryId, arr);
      }
      arr.push(item);
    }

    cat.liveByCat = liveByCat;
    cat.vodByCat = vodByCat;
    cat.seriesByCat = seriesByCat;
    cat.indexVersion = String(Date.now());

    if (!state.liveSelectedCat || state.liveSelectedCat === "all") {
      state.liveSelectedCat = cat.liveCategories?.[0]?.id || "all";
    }
    if (!state.vodSelectedCat || state.vodSelectedCat === "all") {
      state.vodSelectedCat = cat.vodCategories?.[0]?.id || "all";
    }
    if (!state.seriesSelectedCat || state.seriesSelectedCat === "all") {
      state.seriesSelectedCat = cat.seriesCategories?.[0]?.id || "all";
    }
  }

  // Load Active Playlist (Demo, Xtream Codes, or M3U)
  async function activatePlaylist(playlistId, forceRefresh = false) {
    const pl = state.playlists.find(p => p.id === playlistId) || DEFAULT_MULTIVERSE_PLAYLIST;
    state.activePlaylistId = pl.id;
    savePlaylistsToStorage();

    const pillName = document.getElementById("active-playlist-name");
    if (pillName) pillName.textContent = pl.name;

    if (pl.type === "demo") {
      state.catalog = structuredClone(DEMO_PLAYLIST);
      indexCatalogMaps(state.catalog);
      refreshAllViews();
      return;
    }

    if (forceRefresh) {
      await idbClearAll();
    }

    try {
      if (pl.type === "xtream") {
        await loadXtreamPlaylist(pl, forceRefresh);
      } else if (pl.type === "m3u") {
        await loadM3UPlaylist(pl);
        indexCatalogMaps(state.catalog);
      }
      refreshAllViews();
    } catch (err) {
      console.error("Falha ao carregar lista:", err);
      updateStartupLoader(false);
      if (!state.catalog || !state.catalog.liveCategories) {
        state.catalog = structuredClone(DEMO_PLAYLIST);
        indexCatalogMaps(state.catalog);
        refreshAllViews();
      }
      showToast(`Erro ao conectar em "${pl.name}": ${err.message || "Falha"}`);
    }
  }

  // Duplecast-style Xtream Loader:
  // - Shows a sleek Mini Startup Loader on first run, downloads in parallel without blocking UI,
  //   indexes all categories in RAM for 0ms category switching, and caches in IndexedDB for 0.2s startup!
  async function loadXtreamPlaylist(pl, forceRefresh = false) {
    const base = pl.serverUrl.replace(/\/+$/, "");
    const u = encodeURIComponent(pl.username.trim());
    const pw = encodeURIComponent(pl.password.trim());
    const apiBase = `${base}/player_api.php?username=${u}&password=${pw}`;
    const ext = state.settings.liveFormat || "m3u8";
    const cacheKey = `xtream_full_v4_${pl.id}`;

    updateStartupLoader(true, 15, "Iniciando Rafamon TV...", "Verificando memória rápida da TV...");

    if (!forceRefresh) {
      const cached = await idbGet(cacheKey);
      if (cached && Array.isArray(cached.liveStreams) && cached.liveStreams.length > 0) {
        updateStartupLoader(true, 85, "Catálogo encontrado no cache!", "Montando categorias instantâneas...");
        state.catalog = {
          ...cached,
          xtreamBase: base,
          xtreamUser: u,
          xtreamPass: pw,
          apiBase
        };
        indexCatalogMaps(state.catalog);
        updateStartupLoader(false);
        return;
      }
    }

    updateStartupLoader(true, 25, "Sincronizando categorias...", "Conectando ao servidor IPTV...");
    const [liveCatsRaw, vodCatsRaw, seriesCatsRaw] = await Promise.all([
      smartFetch(`${apiBase}&action=get_live_categories`, true).catch(() => []),
      smartFetch(`${apiBase}&action=get_vod_categories`, true).catch(() => []),
      smartFetch(`${apiBase}&action=get_series_categories`, true).catch(() => [])
    ]);

    updateStartupLoader(true, 48, "Carregando Canais de TV ao Vivo...", "Baixando lista de canais...");
    const liveStreamsRaw = await smartFetch(`${apiBase}&action=get_live_streams`, true).catch(() => []);

    updateStartupLoader(true, 72, "Carregando Filmes e Séries...", "Sincronizando catálogo VOD...");
    const [vodStreamsRaw, seriesRaw] = await Promise.all([
      smartFetch(`${apiBase}&action=get_vod_streams`, true).catch(() => []),
      smartFetch(`${apiBase}&action=get_series`, true).catch(() => [])
    ]);

    updateStartupLoader(true, 92, "Otimizando velocidade...", "Indexando categorias na memória da TV...");

    const liveCategories = [
      ...(Array.isArray(liveCatsRaw) ? liveCatsRaw : []).map(c => ({
        id: String(c.category_id),
        name: c.category_name || "Canais"
      })),
      { id: "all", name: "Todos os Canais" }
    ];

    const vodCategories = [
      ...(Array.isArray(vodCatsRaw) ? vodCatsRaw : []).map(c => ({
        id: String(c.category_id),
        name: c.category_name || "Filmes"
      })),
      { id: "all", name: "Todos os Filmes" }
    ];

    const seriesCategories = [
      ...(Array.isArray(seriesCatsRaw) ? seriesCatsRaw : []).map(c => ({
        id: String(c.category_id),
        name: c.category_name || "Séries"
      })),
      { id: "all", name: "Todas as Séries" }
    ];

    const liveStreams = (Array.isArray(liveStreamsRaw) ? liveStreamsRaw : []).map((s, idx) => ({
      id: `xt-live-${s.stream_id}`,
      streamId: s.stream_id,
      num: s.num || idx + 1,
      name: s.name || `Canal ${idx + 1}`,
      categoryId: String(s.category_id || "all"),
      logo: s.stream_icon || "",
      url: `${base}/live/${u}/${pw}/${s.stream_id}.${ext}`,
      altUrl: `${base}/live/${u}/${pw}/${s.stream_id}.${ext === "m3u8" ? "ts" : "m3u8"}`,
      epgNow: "Programação ao vivo",
      epgNext: "A seguir"
    }));

    const vodStreams = (Array.isArray(vodStreamsRaw) ? vodStreamsRaw : []).map(v => {
      const container = v.container_extension || "mp4";
      return {
        id: `xt-vod-${v.stream_id}`,
        streamId: v.stream_id,
        xtreamBase: base,
        xtreamUser: u,
        xtreamPass: pw,
        name: v.name || "Filme",
        categoryId: String(v.category_id || "all"),
        year: v.year || "",
        rating: v.rating ? String(v.rating).slice(0, 3) : "HD",
        duration: "",
        poster: v.stream_icon || "",
        plot: v.plot || "Clique em Assistir para reproduzir este filme.",
        url: `${base}/movie/${u}/${pw}/${v.stream_id}.${container}`
      };
    });

    const seriesList = (Array.isArray(seriesRaw) ? seriesRaw : []).map(sr => ({
      id: `xt-ser-${sr.series_id}`,
      seriesId: sr.series_id,
      xtreamBase: base,
      xtreamUser: u,
      xtreamPass: pw,
      name: sr.name || "Série",
      categoryId: String(sr.category_id || "all"),
      year: sr.releaseDate ? String(sr.releaseDate).slice(0, 4) : "",
      rating: sr.rating ? String(sr.rating).slice(0, 3) : "HD",
      poster: sr.cover || "",
      plot: sr.plot || "Selecione uma temporada e episódio para assistir.",
      seasons: []
    }));

    const compactCatalog = {
      id: pl.id,
      name: pl.name,
      type: "xtream",
      xtreamBase: base,
      xtreamUser: u,
      xtreamPass: pw,
      apiBase,
      liveCategories,
      liveStreams,
      vodCategories,
      vodStreams,
      seriesCategories,
      seriesList
    };

    state.catalog = compactCatalog;
    indexCatalogMaps(state.catalog);

    // Save compact catalog asynchronously to IndexedDB so future app launches take <200ms!
    idbSet(cacheKey, compactCatalog);
    updateStartupLoader(false);
  }

  async function ensureXtreamCategoryLoaded(section, catId) {
    const cat = state.catalog;
    if (!cat) return [];
    const mapRef =
      section === "live"
        ? cat.liveByCat
        : section === "vod"
        ? cat.vodByCat
        : cat.seriesByCat;
    return (mapRef && mapRef.get(catId)) || [];
  }

  // M3U / M3U8 Parser
  async function loadM3UPlaylist(pl) {
    const rawText = await smartFetch(pl.m3uUrl, false);
    const lines = rawText.split(/\r?\n/);

    const liveCatMap = new Map([["all", { id: "all", name: "Todos os Canais" }]]);
    const vodCatMap = new Map([["all", { id: "all", name: "Todos os Filmes" }]]);
    const seriesCatMap = new Map([["all", { id: "all", name: "Todas as Séries" }]]);

    const liveStreams = [];
    const vodStreams = [];
    const seriesMap = new Map();

    let currentMeta = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith("#EXTINF:")) {
        const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
        const groupMatch = line.match(/group-title="([^"]*)"/i);
        const commaIdx = line.lastIndexOf(",");
        const title = commaIdx !== -1 ? line.slice(commaIdx + 1).trim() : "Canal";
        currentMeta = {
          title: title || "Item",
          logo: logoMatch ? logoMatch[1] : "",
          group: groupMatch && groupMatch[1] ? groupMatch[1].trim() : "Geral"
        };
      } else if (!line.startsWith("#") && currentMeta) {
        const url = line;
        const lowerGroup = currentMeta.group.toLowerCase();
        const lowerUrl = url.toLowerCase();

        const isSeries = /s\d{1,2}\s*e\d{1,2}/i.test(currentMeta.title) || lowerGroup.includes("série") || lowerGroup.includes("serie");
        const isVod = !isSeries && (
          lowerUrl.endsWith(".mp4") ||
          lowerUrl.endsWith(".mkv") ||
          lowerUrl.endsWith(".avi") ||
          lowerGroup.includes("filme") ||
          lowerGroup.includes("movie") ||
          lowerGroup.includes("vod")
        );

        if (isSeries) {
          const catId = "ser-cat-" + currentMeta.group;
          if (!seriesCatMap.has(catId)) {
            seriesCatMap.set(catId, { id: catId, name: currentMeta.group });
          }
          const seMatch = currentMeta.title.match(/s(\d{1,2})\s*e(\d{1,3})/i);
          const sNum = seMatch ? Number(seMatch[1]) : 1;
          const cleanSeriesName = currentMeta.title.replace(/s\d{1,2}\s*e\d{1,3}.*$/i, "").replace(/[-–:]\s*$/, "").trim() || currentMeta.title;
          if (!seriesMap.has(cleanSeriesName)) {
            seriesMap.set(cleanSeriesName, {
              id: "m3u-ser-" + seriesMap.size,
              name: cleanSeriesName,
              categoryId: catId,
              year: "",
              rating: "HD",
              poster: currentMeta.logo,
              plot: `Série importada do grupo ${currentMeta.group}.`,
              seasons: []
            });
          }
          const sObj = seriesMap.get(cleanSeriesName);
          let targetSeason = sObj.seasons.find(s => s.seasonNumber === sNum);
          if (!targetSeason) {
            targetSeason = {
              seasonNumber: sNum,
              name: `Temporada ${sNum}`,
              episodes: []
            };
            sObj.seasons.push(targetSeason);
            sObj.seasons.sort((a, b) => a.seasonNumber - b.seasonNumber);
          }
          targetSeason.episodes.push({
            id: `m3u-ep-${sObj.id}-s${sNum}-e${targetSeason.episodes.length + 1}`,
            num: seMatch ? Number(seMatch[2]) : targetSeason.episodes.length + 1,
            title: currentMeta.title,
            duration: "",
            url
          });
        } else if (isVod) {
          const catId = "vod-cat-" + currentMeta.group;
          if (!vodCatMap.has(catId)) {
            vodCatMap.set(catId, { id: catId, name: currentMeta.group });
          }
          vodStreams.push({
            id: `m3u-vod-${vodStreams.length + 1}`,
            name: currentMeta.title,
            categoryId: catId,
            year: "",
            rating: "VOD",
            duration: "",
            poster: currentMeta.logo,
            plot: `Categoria: ${currentMeta.group}`,
            url
          });
        } else {
          const catId = "live-cat-" + currentMeta.group;
          if (!liveCatMap.has(catId)) {
            liveCatMap.set(catId, { id: catId, name: currentMeta.group });
          }
          liveStreams.push({
            id: `m3u-live-${liveStreams.length + 1}`,
            num: liveStreams.length + 1,
            name: currentMeta.title,
            categoryId: catId,
            logo: currentMeta.logo,
            url,
            epgNow: currentMeta.group,
            epgNext: "Transmissão ao Vivo"
          });
        }
        currentMeta = null;
      }
    }

    state.catalog = {
      id: pl.id,
      name: pl.name,
      type: "m3u",
      liveCategories: Array.from(liveCatMap.values()),
      liveStreams,
      vodCategories: Array.from(vodCatMap.values()),
      vodStreams,
      seriesCategories: Array.from(seriesCatMap.values()),
      seriesList: Array.from(seriesMap.values())
    };
  }

  // Video Player Core (supports HLS.js, mpegts.js, and native HTML5 video for MP4/MKV)
  function destroyPlayerInstances(isFullscreenTarget) {
    if (isFullscreenTarget) {
      if (state.fsHls) {
        state.fsHls.destroy();
        state.fsHls = null;
      }
      if (state.fsMpegts) {
        state.fsMpegts.destroy();
        state.fsMpegts = null;
      }
    } else {
      if (state.miniHls) {
        state.miniHls.destroy();
        state.miniHls = null;
      }
      if (state.miniMpegts) {
        state.miniMpegts.destroy();
        state.miniMpegts = null;
      }
    }
  }

  function attachStreamToVideo(videoEl, streamUrl, altUrl, isFullscreenTarget, startTimeSec = 0) {
    destroyPlayerInstances(isFullscreenTarget);
    if (!videoEl || !streamUrl) return;

    const lower = streamUrl.toLowerCase().split("?")[0];
    const isDirectVod =
      lower.endsWith(".mp4") ||
      lower.endsWith(".mkv") ||
      lower.endsWith(".avi") ||
      lower.endsWith(".webm") ||
      lower.includes("/movie/") ||
      lower.includes("/series/");
    const isTs = !isDirectVod && lower.endsWith(".ts");
    const isHls = !isDirectVod && !isTs && lower.includes(".m3u8");

    let hasAppliedResume = false;
    const applyResumeAndPlay = () => {
      if (!hasAppliedResume && startTimeSec > 1) {
        const dur = videoEl.duration;
        if (!dur || !isFinite(dur) || startTimeSec < dur - 3) {
          try {
            videoEl.currentTime = startTimeSec;
            hasAppliedResume = true;
            if (isFullscreenTarget) {
              showToast(`Retomando de ${formatPlayerTimestamp(startTimeSec)}`);
            }
          } catch (_) {}
        }
      }
      videoEl.play().catch(() => {});
    };

    if (isTs && window.mpegts && window.mpegts.isSupported()) {
      const player = window.mpegts.createPlayer({
        type: "mse",
        isLive: true,
        url: streamUrl
      });
      player.attachMediaElement(videoEl);
      player.load();
      player.play().catch(() => {});
      if (isFullscreenTarget) state.fsMpegts = player;
      else state.miniMpegts = player;
      return;
    }

    if (isHls && window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(videoEl);
      hls.on(window.Hls.Events.MANIFEST_PARSED, applyResumeAndPlay);
      videoEl.addEventListener("loadedmetadata", applyResumeAndPlay, { once: true });
      hls.on(window.Hls.Events.ERROR, function (_, data) {
        if (data.fatal) {
          if (altUrl && altUrl !== streamUrl) {
            attachStreamToVideo(videoEl, altUrl, null, isFullscreenTarget, startTimeSec);
          } else {
            destroyPlayerInstances(isFullscreenTarget);
            videoEl.src = streamUrl;
            videoEl.addEventListener("loadedmetadata", applyResumeAndPlay, { once: true });
            videoEl.play().catch(() => {});
          }
        }
      });
      if (isFullscreenTarget) state.fsHls = hls;
      else state.miniHls = hls;
      return;
    }

    videoEl.src = streamUrl;
    videoEl.addEventListener("loadedmetadata", applyResumeAndPlay, { once: true });
    videoEl.play().catch(() => {});
  }

  // Pre-compute O(1) category maps for all catalog types
  function buildCatalogIndexes() {
    if (!state.catalog) return;
    if (!state.catalog.liveByCat || state.catalog.liveByCat.size === 0) {
      indexCatalogMaps(state.catalog);
    }
  }

  // Switch Navigation View (Full-screen subpage mode on TV when leaving Dashboard)
  function switchView(viewName) {
    state.currentView = viewName;
    const shell = document.getElementById("app-shell");
    if (shell) {
      shell.classList.toggle("subview-active", viewName !== "dashboard");
    }

    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.toggle("active", sec.id === `view-${viewName}`);
    });

    const titles = {
      dashboard: "Início",
      live: "TV ao Vivo",
      movies: "Filmes",
      series: "Séries",
      favorites: "Favoritos",
      playlists: "Minhas Listas",
      settings: "Configurações"
    };
    const titleEl = document.getElementById("top-page-title");
    if (titleEl) titleEl.textContent = titles[viewName] || "Rafamon TV";

    // Stop mini-player when leaving Live TV view
    if (viewName !== "live") {
      const miniVideo = document.getElementById("mini-video");
      if (miniVideo) {
        destroyPlayerInstances(false);
        miniVideo.pause();
        miniVideo.removeAttribute("src");
      }
    } else if (state.currentChannel) {
      playChannelInMiniPlayer(state.currentChannel);
    }

    refreshCurrentView();

    // Place D-Pad focus immediately on the active category or main item of the opened view
    requestAnimationFrame(() => {
      if (viewName === "dashboard") {
        const navActive =
          document.querySelector(".sidebar .nav-btn.active") ||
          document.querySelector("#dash-recent-grid .poster-card");
        if (navActive) focusTvElement(navActive);
        return;
      }
      const activeSec = document.getElementById(`view-${viewName}`);
      if (!activeSec) return;
      const targetFocus =
        activeSec.querySelector(".cat-item.active") ||
        activeSec.querySelector(".focusable");
      if (targetFocus) {
        focusTvElement(targetFocus);
      }
    });
  }

  function refreshAllViews() {
    buildCatalogIndexes();
    updateSidebarCounts();
    refreshCurrentView();
  }

  function refreshCurrentView() {
    if (!state.catalog.liveByCat) buildCatalogIndexes();
    if (state.currentView === "dashboard") renderDashboard();
    else if (state.currentView === "live") renderLiveView(false);
    else if (state.currentView === "movies") renderMoviesView(false);
    else if (state.currentView === "series") renderSeriesView(false);
    else if (state.currentView === "favorites") renderFavoritesView(false);
    else if (state.currentView === "playlists") renderPlaylistsView();
  }

  function updateSidebarCounts() {
    const liveCnt = document.getElementById("count-live");
    const vodCnt = document.getElementById("count-movies");
    const serCnt = document.getElementById("count-series");
    const favCnt = document.getElementById("count-favorites");

    if (liveCnt) liveCnt.textContent = state.catalog.liveStreams?.length || 0;
    if (vodCnt) vodCnt.textContent = state.catalog.vodStreams?.length || 0;
    if (serCnt) serCnt.textContent = state.catalog.seriesList?.length || 0;
    if (favCnt) {
      const totalFavs =
        state.favorites.live.length +
        state.favorites.vod.length +
        state.favorites.series.length;
      favCnt.textContent = totalFavs;
    }
  }

  // Render Dashboard (Continuar Assistindo & Recentes - Apenas Filmes e Séries, cards grandes)
  function renderDashboard() {
    const recentGrid = document.getElementById("dash-recent-grid");
    if (!recentGrid) return;
    recentGrid.innerHTML = "";

    // Only Movies (vod) and Series (series) — NEVER Live TV channels!
    const historyItems = Object.values(state.history)
      .filter(item => item && item.type !== "live")
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 15);

    const frag = document.createDocumentFragment();
    const shownIds = new Set();

    historyItems.forEach(item => {
      shownIds.add(item.id);
      if (item.seriesId) shownIds.add(item.seriesId);
      const btn = document.createElement("button");
      btn.className = "poster-card focusable";
      const pct = item.duration ? Math.min(100, Math.round((item.time / item.duration) * 100)) : 0;

      const posterUrl = item.poster || "";
      const typeBadge = item.type === "series" ? "🍿 SÉRIE" : "🎬 FILME";
      const fallbackEmoji = item.type === "series" ? "🍿" : "🎬";

      btn.innerHTML = `
        <div class="poster-img-wrap">
          <span class="poster-fallback-icon">${fallbackEmoji}</span>
          ${posterUrl ? `<img loading="lazy" decoding="async" src="${escapeHtml(posterUrl)}" alt="" onerror="this.style.display='none'" />` : ""}
          <span class="poster-fav">${typeBadge}</span>
          ${pct > 0 ? `<span class="poster-rating">⏯ ${pct}%</span>` : ""}
          ${pct > 0 ? `<div class="poster-progress-bar"><div style="width:${pct}%"></div></div>` : ""}
        </div>
        <div class="poster-meta">
          <div class="poster-title">${escapeHtml(item.title)}</div>
          <div class="poster-sub">Continuar (${pct}%)</div>
        </div>
      `;
      btn.addEventListener("click", () => {
        const seriesObj = item.seriesId
          ? state.catalog.seriesList?.find(s => s.id === item.seriesId)
          : null;
        openFullscreenPlayer({
          id: item.id,
          title: item.title,
          subtitle: "Continuar Assistindo",
          url: item.url,
          type: item.type,
          poster: posterUrl,
          seriesId: item.seriesId || null,
          mediaObj: seriesObj || null,
          seasonIdx: item.seasonIdx ?? 0,
          resumeTime: item.time || 0
        });
      });
      frag.appendChild(btn);
    });

    // Also include recent Movies & Series from the catalog so Home always looks rich
    const recentVod = (state.catalog.vodStreams || []).slice(0, 8);
    const recentSeries = (state.catalog.seriesList || []).slice(0, 8);
    const recentCatalog = [];
    for (let i = 0; i < 8; i++) {
      if (recentVod[i]) recentCatalog.push({ item: recentVod[i], kind: "vod" });
      if (recentSeries[i]) recentCatalog.push({ item: recentSeries[i], kind: "series" });
    }

    recentCatalog.forEach(({ item, kind }) => {
      if (shownIds.has(item.id)) return;
      const btn = document.createElement("button");
      btn.className = "poster-card focusable";
      const badge = kind === "series" ? "🍿 SÉRIE" : "🎬 FILME";
      const emoji = kind === "series" ? "🍿" : "🎬";
      btn.innerHTML = `
        <div class="poster-img-wrap">
          <span class="poster-fallback-icon">${emoji}</span>
          ${item.poster ? `<img loading="lazy" decoding="async" src="${escapeHtml(item.poster)}" alt="" onerror="this.style.display='none'" />` : ""}
          <span class="poster-fav">${badge}</span>
          <span class="poster-rating">★ ${escapeHtml(item.rating || "HD")}</span>
        </div>
        <div class="poster-meta">
          <div class="poster-title">${escapeHtml(item.name)}</div>
          <div class="poster-sub">${escapeHtml(item.year || (kind === "series" ? "Série" : "Filme"))}</div>
        </div>
      `;
      btn.addEventListener("click", () => openMediaDetailsModal(item, kind));
      frag.appendChild(btn);
    });

    if (!frag.hasChildNodes()) {
      recentGrid.innerHTML = `<p style="color: var(--text-muted); font-size: 13px; grid-column: 1 / -1;">Nenhum filme ou série recente ainda. Use o menu à esquerda para abrir Filmes ou Séries.</p>`;
      return;
    }

    recentGrid.appendChild(frag);
  }

  // Render Live TV View (0ms synchronous category switching via pre-indexed RAM Map)
  function renderLiveView(onlyChannels = false) {
    const catContainer = document.getElementById("live-categories-list");
    const chContainer = document.getElementById("live-channels-list");
    if (!catContainer || !chContainer) return;

    if (!state.catalog.liveByCat) indexCatalogMaps(state.catalog);

    const idxKey = state.catalog.indexVersion + "-fav" + state.favorites.live.length;
    if (!onlyChannels || catContainer.dataset.idxKey !== idxKey) {
      catContainer.dataset.idxKey = idxKey;
      catContainer.innerHTML = "";
      const catFrag = document.createDocumentFragment();

      const catsWithFav = [
        { id: "__fav__", name: "★ Canais Favoritos" },
        ...state.catalog.liveCategories
      ];

      catsWithFav.forEach(cat => {
        const cachedArr = state.catalog.liveByCat?.get(cat.id);
        const countLabel =
          cat.id === "__fav__"
            ? state.favorites.live.length
            : cachedArr
            ? cachedArr.length
            : 0;

        const btn = document.createElement("button");
        btn.className = `cat-item focusable ${state.liveSelectedCat === cat.id ? "active" : ""}`;
        btn.dataset.catId = cat.id;
        btn.innerHTML = `
          <span>${escapeHtml(cat.name)}</span>
          <span class="count">${countLabel}</span>
        `;
        btn.addEventListener("click", () => {
          state.liveSelectedCat = cat.id;
          catContainer.querySelectorAll(".cat-item").forEach(b => {
            b.classList.toggle("active", b.dataset.catId === cat.id);
          });
          renderLiveView(true);
          btn.focus({ preventScroll: true });
        });
        catFrag.appendChild(btn);
      });
      catContainer.appendChild(catFrag);
    }

    const targetCat = state.liveSelectedCat;
    const baseList =
      targetCat === "__fav__"
        ? state.catalog.liveStreams.filter(c => state.favorites.live.includes(c.id))
        : state.catalog.liveByCat?.get(targetCat) || [];

    const query = state.searchQuery.toLowerCase();
    const filtered = query
      ? baseList.filter(ch => ch.name.toLowerCase().includes(query))
      : baseList;

    chContainer.innerHTML = "";
    chContainer.scrollTop = 0;

    if (filtered.length === 0) {
      chContainer.innerHTML = `<div style="padding:14px;color:var(--text-muted);font-size:12px;">Nenhum canal nesta categoria.</div>`;
      return;
    }

    const PAGE_SIZE = 50;
    let renderedCount = 0;

    const appendChannelsBatch = () => {
      const slice = filtered.slice(renderedCount, renderedCount + PAGE_SIZE);
      renderedCount += slice.length;
      const frag = document.createDocumentFragment();

      slice.forEach(ch => {
        const isFav = state.favorites.live.includes(ch.id);
        const isActive = state.currentChannel && state.currentChannel.id === ch.id;
        const row = document.createElement("button");
        row.className = `channel-row focusable ${isActive ? "active" : ""}`;
        row.dataset.chId = ch.id;
        row.innerHTML = `
          <span class="ch-num">${ch.num}</span>
          <img loading="lazy" decoding="async" class="ch-logo" src="${escapeHtml(ch.logo || "")}" alt="" onerror="this.style.visibility='hidden'" />
          <div class="ch-info">
            <div class="ch-name">${escapeHtml(ch.name)}</div>
            <div class="ch-epg">${escapeHtml(ch.epgNow || "Ao Vivo")}</div>
          </div>
          ${isFav ? '<span class="ch-fav-star">★</span>' : ""}
        `;
        row.addEventListener("click", () => {
          if (state.currentChannel && state.currentChannel.id === ch.id) {
            openFullscreenPlayer({
              id: ch.id,
              title: `${ch.num} - ${ch.name}`,
              subtitle: ch.epgNow || "Canal ao Vivo",
              url: ch.url,
              altUrl: ch.altUrl,
              type: "live",
              channelObj: ch
            });
          } else {
            playChannelInMiniPlayer(ch);
            chContainer.querySelectorAll(".channel-row").forEach(r => {
              r.classList.toggle("active", r.dataset.chId === ch.id);
            });
          }
        });
        frag.appendChild(row);
      });

      const oldMore = chContainer.querySelector(".btn-load-more");
      if (oldMore) oldMore.remove();

      chContainer.appendChild(frag);

      if (renderedCount < filtered.length) {
        const moreBtn = document.createElement("button");
        moreBtn.className = "btn focusable btn-load-more";
        moreBtn.style.cssText = "width:100%;margin-top:6px;flex-shrink:0;";
        moreBtn.textContent = `+ Mostrar mais canais (${filtered.length - renderedCount} restantes)`;
        moreBtn.addEventListener("click", () => {
          const prevLast = chContainer.querySelectorAll(".channel-row")[renderedCount - 1];
          appendChannelsBatch();
          if (prevLast?.nextElementSibling) prevLast.nextElementSibling.focus();
        });
        chContainer.appendChild(moreBtn);
      }
    };

    appendChannelsBatch();

    if (state.currentView === "live" && !state.currentChannel && filtered.length > 0) {
      playChannelInMiniPlayer(filtered[0]);
    }
  }

  function playChannelInMiniPlayer(ch) {
    state.currentChannel = ch;
    const titleEl = document.getElementById("mini-channel-title");
    const epgList = document.getElementById("mini-epg-list");
    const miniVideo = document.getElementById("mini-video");

    if (titleEl) titleEl.textContent = `${ch.num} - ${ch.name}`;
    if (epgList) {
      epgList.innerHTML = `
        <div class="epg-item">
          <div class="epg-time">AGORA</div>
          <div class="epg-title">${escapeHtml(ch.epgNow || "Programação ao vivo")}</div>
        </div>
        <div class="epg-item">
          <div class="epg-time">A SEGUIR</div>
          <div class="epg-title">${escapeHtml(ch.epgNext || "Próximo programa")}</div>
        </div>
      `;
    }

    if (miniVideo && state.currentView === "live" && !state.isFullscreen) {
      attachStreamToVideo(miniVideo, ch.url, ch.altUrl, false, 0);
    }
  }

  // Render Movies (VOD) View - 0ms synchronous category switching via pre-indexed RAM Map
  function renderMoviesView(onlyGrid = false) {
    const catContainer = document.getElementById("vod-categories-list");
    const gridContainer = document.getElementById("vod-poster-grid");
    if (!catContainer || !gridContainer) return;

    if (!state.catalog.vodByCat) indexCatalogMaps(state.catalog);

    const idxKey = state.catalog.indexVersion + "-fav" + state.favorites.vod.length;
    if (!onlyGrid || catContainer.dataset.idxKey !== idxKey) {
      catContainer.dataset.idxKey = idxKey;
      catContainer.innerHTML = "";
      const catFrag = document.createDocumentFragment();

      const catsWithFav = [
        { id: "__fav__", name: "★ Filmes Favoritos" },
        ...state.catalog.vodCategories
      ];

      catsWithFav.forEach(cat => {
        const cachedArr = state.catalog.vodByCat?.get(cat.id);
        const countLabel =
          cat.id === "__fav__"
            ? state.favorites.vod.length
            : cachedArr
            ? cachedArr.length
            : 0;

        const btn = document.createElement("button");
        btn.className = `cat-item focusable ${state.vodSelectedCat === cat.id ? "active" : ""}`;
        btn.dataset.catId = cat.id;
        btn.innerHTML = `
          <span>${escapeHtml(cat.name)}</span>
          <span class="count">${countLabel}</span>
        `;
        btn.addEventListener("click", () => {
          state.vodSelectedCat = cat.id;
          catContainer.querySelectorAll(".cat-item").forEach(b => {
            b.classList.toggle("active", b.dataset.catId === cat.id);
          });
          renderMoviesView(true);
          btn.focus({ preventScroll: true });
        });
        catFrag.appendChild(btn);
      });
      catContainer.appendChild(catFrag);
    }

    const targetCat = state.vodSelectedCat;
    const baseList =
      targetCat === "__fav__"
        ? state.catalog.vodStreams.filter(v => state.favorites.vod.includes(v.id))
        : state.catalog.vodByCat?.get(targetCat) || [];

    const query = state.searchQuery.toLowerCase();
    const filtered = query
      ? baseList.filter(v => v.name.toLowerCase().includes(query))
      : baseList;

    gridContainer.innerHTML = "";
    if (gridContainer.parentElement) gridContainer.parentElement.scrollTop = 0;

    if (filtered.length === 0) {
      gridContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 13px; grid-column: 1 / -1;">Nenhum filme encontrado nesta categoria.</p>`;
      return;
    }

    const PAGE_SIZE = 30;
    let renderedCount = 0;

    const appendMoviesBatch = () => {
      const slice = filtered.slice(renderedCount, renderedCount + PAGE_SIZE);
      renderedCount += slice.length;
      const frag = document.createDocumentFragment();

      slice.forEach(movie => {
        const isFav = state.favorites.vod.includes(movie.id);
        const card = document.createElement("button");
        card.className = "poster-card focusable";
        card.innerHTML = `
          <div class="poster-img-wrap">
            <span class="poster-fallback-icon">🎬</span>
            ${movie.poster ? `<img loading="lazy" decoding="async" src="${escapeHtml(movie.poster)}" alt="" onerror="this.style.display='none'" />` : ""}
            ${isFav ? '<span class="poster-fav">★</span>' : ""}
            <span class="poster-rating">★ ${escapeHtml(movie.rating || "HD")}</span>
          </div>
          <div class="poster-meta">
            <div class="poster-title">${escapeHtml(movie.name)}</div>
            <div class="poster-sub">${escapeHtml(movie.year || "Filme VOD")}</div>
          </div>
        `;
        card.addEventListener("click", () => openMediaDetailsModal(movie, "vod"));
        frag.appendChild(card);
      });

      const oldMore = gridContainer.querySelector(".btn-load-more");
      if (oldMore) oldMore.remove();

      gridContainer.appendChild(frag);

      if (renderedCount < filtered.length) {
        const moreBtn = document.createElement("button");
        moreBtn.className = "btn btn-primary focusable btn-load-more";
        moreBtn.style.cssText = "grid-column: 1 / -1; padding: 10px; margin-top: 6px;";
        moreBtn.textContent = `+ Carregar mais filmes (${filtered.length - renderedCount} restantes)`;
        moreBtn.addEventListener("click", () => {
          const cardsBefore = gridContainer.querySelectorAll(".poster-card");
          const focusIdx = cardsBefore.length;
          appendMoviesBatch();
          const cardsAfter = gridContainer.querySelectorAll(".poster-card");
          if (cardsAfter[focusIdx]) cardsAfter[focusIdx].focus();
        });
        gridContainer.appendChild(moreBtn);
      }
    };

    appendMoviesBatch();
  }

  // Render Series View - 0ms synchronous category switching via pre-indexed RAM Map
  function renderSeriesView(onlyGrid = false) {
    const catContainer = document.getElementById("series-categories-list");
    const gridContainer = document.getElementById("series-poster-grid");
    if (!catContainer || !gridContainer) return;

    if (!state.catalog.seriesByCat) indexCatalogMaps(state.catalog);

    const idxKey = state.catalog.indexVersion + "-fav" + state.favorites.series.length;
    if (!onlyGrid || catContainer.dataset.idxKey !== idxKey) {
      catContainer.dataset.idxKey = idxKey;
      catContainer.innerHTML = "";
      const catFrag = document.createDocumentFragment();

      const catsWithFav = [
        { id: "__fav__", name: "★ Séries Favoritas" },
        ...state.catalog.seriesCategories
      ];

      catsWithFav.forEach(cat => {
        const cachedArr = state.catalog.seriesByCat?.get(cat.id);
        const countLabel =
          cat.id === "__fav__"
            ? state.favorites.series.length
            : cachedArr
            ? cachedArr.length
            : 0;

        const btn = document.createElement("button");
        btn.className = `cat-item focusable ${state.seriesSelectedCat === cat.id ? "active" : ""}`;
        btn.dataset.catId = cat.id;
        btn.innerHTML = `
          <span>${escapeHtml(cat.name)}</span>
          <span class="count">${countLabel}</span>
        `;
        btn.addEventListener("click", () => {
          state.seriesSelectedCat = cat.id;
          catContainer.querySelectorAll(".cat-item").forEach(b => {
            b.classList.toggle("active", b.dataset.catId === cat.id);
          });
          renderSeriesView(true);
          btn.focus({ preventScroll: true });
        });
        catFrag.appendChild(btn);
      });
      catContainer.appendChild(catFrag);
    }

    const targetCat = state.seriesSelectedCat;
    const baseList =
      targetCat === "__fav__"
        ? state.catalog.seriesList.filter(s => state.favorites.series.includes(s.id))
        : state.catalog.seriesByCat?.get(targetCat) || [];

    const query = state.searchQuery.toLowerCase();
    const filtered = query
      ? baseList.filter(s => s.name.toLowerCase().includes(query))
      : baseList;

    gridContainer.innerHTML = "";
    if (gridContainer.parentElement) gridContainer.parentElement.scrollTop = 0;

    if (filtered.length === 0) {
      gridContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 13px; grid-column: 1 / -1;">Nenhuma série encontrada nesta categoria.</p>`;
      return;
    }

    const PAGE_SIZE = 30;
    let renderedCount = 0;

    const appendSeriesBatch = () => {
      const slice = filtered.slice(renderedCount, renderedCount + PAGE_SIZE);
      renderedCount += slice.length;
      const frag = document.createDocumentFragment();

      slice.forEach(ser => {
        const isFav = state.favorites.series.includes(ser.id);
        const card = document.createElement("button");
        card.className = "poster-card focusable";
        card.innerHTML = `
          <div class="poster-img-wrap">
            <span class="poster-fallback-icon">🍿</span>
            ${ser.poster ? `<img loading="lazy" decoding="async" src="${escapeHtml(ser.poster)}" alt="" onerror="this.style.display='none'" />` : ""}
            ${isFav ? '<span class="poster-fav">★</span>' : ""}
            <span class="poster-rating">★ ${escapeHtml(ser.rating || "Série")}</span>
          </div>
          <div class="poster-meta">
            <div class="poster-title">${escapeHtml(ser.name)}</div>
            <div class="poster-sub">${escapeHtml(ser.year || "Temporadas")}</div>
          </div>
        `;
        card.addEventListener("click", () => openMediaDetailsModal(ser, "series"));
        frag.appendChild(card);
      });

      const oldMore = gridContainer.querySelector(".btn-load-more");
      if (oldMore) oldMore.remove();

      gridContainer.appendChild(frag);

      if (renderedCount < filtered.length) {
        const moreBtn = document.createElement("button");
        moreBtn.className = "btn btn-primary focusable btn-load-more";
        moreBtn.style.cssText = "grid-column: 1 / -1; padding: 10px; margin-top: 6px;";
        moreBtn.textContent = `+ Carregar mais séries (${filtered.length - renderedCount} restantes)`;
        moreBtn.addEventListener("click", () => {
          const cardsBefore = gridContainer.querySelectorAll(".poster-card");
          const focusIdx = cardsBefore.length;
          appendSeriesBatch();
          const cardsAfter = gridContainer.querySelectorAll(".poster-card");
          if (cardsAfter[focusIdx]) cardsAfter[focusIdx].focus();
        });
        gridContainer.appendChild(moreBtn);
      }
    };

    appendSeriesBatch();
  }

  // Render Favorites View (With Left Category Sidebar matching Movies & Series)
  function renderFavoritesView(onlyGrid = false) {
    const catContainer = document.getElementById("fav-categories-list");
    const grid = document.getElementById("favorites-grid");
    if (!grid) return;

    if (!state.favSelectedCat) state.favSelectedCat = "all";

    const query = state.searchQuery ? state.searchQuery.toLowerCase() : "";
    const favChannels = state.catalog.liveStreams.filter(
      c => state.favorites.live.includes(c.id) && (!query || c.name.toLowerCase().includes(query))
    );
    const favMovies = state.catalog.vodStreams.filter(
      v => state.favorites.vod.includes(v.id) && (!query || v.name.toLowerCase().includes(query))
    );
    const favSeries = state.catalog.seriesList.filter(
      s => state.favorites.series.includes(s.id) && (!query || s.name.toLowerCase().includes(query))
    );
    const historyItems = Object.values(state.history).sort((a, b) => b.updatedAt - a.updatedAt);

    if (catContainer && !onlyGrid) {
      catContainer.innerHTML = "";
      const favCats = [
        { id: "all", name: "Todos os Favoritos", count: favChannels.length + favMovies.length + favSeries.length },
        { id: "live", name: "📺 Canais Favoritos", count: favChannels.length },
        { id: "vod", name: "🎬 Filmes Favoritos", count: favMovies.length },
        { id: "series", name: "🍿 Séries Favoritas", count: favSeries.length },
        { id: "history", name: "⏯ Continuar Assistindo", count: historyItems.length }
      ];
      favCats.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = `cat-item focusable ${state.favSelectedCat === cat.id ? "active" : ""}`;
        btn.dataset.catId = cat.id;
        btn.innerHTML = `
          <span>${escapeHtml(cat.name)}</span>
          <span class="count">${cat.count}</span>
        `;
        btn.addEventListener("click", () => {
          state.favSelectedCat = cat.id;
          catContainer.querySelectorAll(".cat-item").forEach(b => {
            b.classList.toggle("active", b.dataset.catId === cat.id);
          });
          renderFavoritesView(true);
          btn.focus({ preventScroll: true });
        });
        catContainer.appendChild(btn);
      });
    }

    grid.innerHTML = "";
    const showLive = state.favSelectedCat === "all" || state.favSelectedCat === "live";
    const showVod = state.favSelectedCat === "all" || state.favSelectedCat === "vod";
    const showSeries = state.favSelectedCat === "all" || state.favSelectedCat === "series";
    const showHistory = state.favSelectedCat === "history";

    if (showHistory) {
      if (historyItems.length === 0) {
        grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1 / -1;">Nenhum item no histórico de Continuar Assistindo.</p>`;
        return;
      }
      historyItems.forEach(item => {
        const pct = item.duration ? Math.min(100, Math.round((item.time / item.duration) * 100)) : 0;
        const card = document.createElement("button");
        card.className = "poster-card focusable";
        card.innerHTML = `
          <div class="poster-img-wrap">
            <span class="poster-fallback-icon">⏯</span>
            ${item.poster ? `<img loading="lazy" decoding="async" src="${escapeHtml(item.poster)}" alt="" onerror="this.style.display='none'" />` : ""}
            <span class="poster-fav">⏯ ${pct}%</span>
            <div class="poster-progress-bar"><div style="width:${pct}%"></div></div>
          </div>
          <div class="poster-meta">
            <div class="poster-title">${escapeHtml(item.title)}</div>
            <div class="poster-sub">Continuar (${pct}%)</div>
          </div>
        `;
        card.addEventListener("click", () => {
          openFullscreenPlayer({
            id: item.id,
            title: item.title,
            subtitle: "Continuar Assistindo",
            url: item.url,
            type: item.type,
            poster: item.poster,
            resumeTime: item.time || 0
          });
        });
        grid.appendChild(card);
      });
      return;
    }

    if (
      (!showLive || favChannels.length === 0) &&
      (!showVod || favMovies.length === 0) &&
      (!showSeries || favSeries.length === 0)
    ) {
      grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1 / -1;">Nenhum item favorito encontrado nesta categoria.</p>`;
      return;
    }

    const frag = document.createDocumentFragment();
    if (showLive) {
      favChannels.forEach(ch => {
        const card = document.createElement("button");
        card.className = "poster-card focusable";
        card.innerHTML = `
          <div class="poster-img-wrap">
            <span class="poster-fallback-icon">📺</span>
            ${ch.logo ? `<img loading="lazy" decoding="async" class="is-logo" src="${escapeHtml(ch.logo)}" alt="" onerror="this.style.display='none'" />` : ""}
            <span class="poster-fav">★ TV</span>
            <span class="poster-rating">CH ${escapeHtml(ch.num)}</span>
          </div>
          <div class="poster-meta">
            <div class="poster-title">${escapeHtml(ch.name)}</div>
            <div class="poster-sub">Canal ${escapeHtml(ch.num)} • Ao Vivo</div>
          </div>
        `;
        card.addEventListener("click", () => {
          openFullscreenPlayer({
            id: ch.id,
            title: `${ch.num} - ${ch.name}`,
            subtitle: ch.epgNow || "TV ao Vivo",
            url: ch.url,
            altUrl: ch.altUrl,
            type: "live",
            channelObj: ch
          });
        });
        frag.appendChild(card);
      });
    }

    if (showVod) {
      favMovies.forEach(movie => {
        const card = document.createElement("button");
        card.className = "poster-card focusable";
        card.innerHTML = `
          <div class="poster-img-wrap">
            <span class="poster-fallback-icon">🎬</span>
            ${movie.poster ? `<img loading="lazy" decoding="async" src="${escapeHtml(movie.poster)}" alt="" onerror="this.style.display='none'" />` : ""}
            <span class="poster-fav">★ Filme</span>
            <span class="poster-rating">★ ${escapeHtml(movie.rating || "HD")}</span>
          </div>
          <div class="poster-meta">
            <div class="poster-title">${escapeHtml(movie.name)}</div>
            <div class="poster-sub">${escapeHtml(movie.year || "Filme VOD")}</div>
          </div>
        `;
        card.addEventListener("click", () => openMediaDetailsModal(movie, "vod"));
        frag.appendChild(card);
      });
    }

    if (showSeries) {
      favSeries.forEach(ser => {
        const card = document.createElement("button");
        card.className = "poster-card focusable";
        card.innerHTML = `
          <div class="poster-img-wrap">
            <span class="poster-fallback-icon">🍿</span>
            ${ser.poster ? `<img loading="lazy" decoding="async" src="${escapeHtml(ser.poster)}" alt="" onerror="this.style.display='none'" />` : ""}
            <span class="poster-fav">★ Série</span>
            <span class="poster-rating">★ ${escapeHtml(ser.rating || "Série")}</span>
          </div>
          <div class="poster-meta">
            <div class="poster-title">${escapeHtml(ser.name)}</div>
            <div class="poster-sub">${escapeHtml(ser.year || "Temporadas")}</div>
          </div>
        `;
        card.addEventListener("click", () => openMediaDetailsModal(ser, "series"));
        frag.appendChild(card);
      });
    }
    grid.appendChild(frag);
  }

  // Render Playlists Manager View
  function renderPlaylistsView() {
    const listEl = document.getElementById("playlists-cards-container");
    if (!listEl) return;
    listEl.innerHTML = "";

    state.playlists.forEach(pl => {
      const isActive = pl.id === state.activePlaylistId;
      const card = document.createElement("div");
      card.className = `playlist-card ${isActive ? "active" : ""}`;

      const badgeLabel = pl.type === "xtream" ? "Xtream Codes" : pl.type === "m3u" ? "Lista M3U" : "Integrada";
      const subInfo = pl.type === "xtream"
        ? `Servidor: ${pl.serverUrl} • Usuário: ${pl.username}`
        : pl.type === "m3u"
        ? `URL M3U: ${pl.m3uUrl}`
        : "Canais e filmes abertos para teste imediato do player";

      card.innerHTML = `
        <div class="playlist-info">
          <h3>
            ${escapeHtml(pl.name)}
            <span class="playlist-badge">${badgeLabel}</span>
            ${isActive ? '<span class="playlist-badge" style="background:rgba(16,185,129,0.2);color:#10b981;">ATIVA</span>' : ""}
          </h3>
          <p>${escapeHtml(subInfo)}</p>
        </div>
        <div class="playlist-actions">
          <button class="btn ${isActive ? "btn-success" : "btn-primary"} focusable btn-connect">
            ${isActive ? "Recarregar Lista" : "Conectar / Usar"}
          </button>
          ${pl.id !== DEMO_PLAYLIST.id ? '<button class="btn focusable btn-edit">✎ Editar URL / Dados</button>' : ""}
          ${pl.id !== DEMO_PLAYLIST.id ? '<button class="btn btn-danger focusable btn-delete">Excluir</button>' : ""}
        </div>
      `;

      card.querySelector(".btn-connect").addEventListener("click", () => activatePlaylist(pl.id));
      const editBtn = card.querySelector(".btn-edit");
      if (editBtn) {
        editBtn.addEventListener("click", () => {
          const addModal = document.getElementById("modal-add-playlist");
          addModal?.classList.add("open");
          if (pl.type === "xtream") {
            document.getElementById("tab-btn-xtream")?.click();
            document.getElementById("xt-name").value = pl.name || "MultiverseTV";
            document.getElementById("xt-server").value = pl.serverUrl || "";
            document.getElementById("xt-user").value = pl.username || "";
            document.getElementById("xt-pass").value = pl.password || "";
            document.getElementById("xt-server")?.focus();
          } else if (pl.type === "m3u") {
            document.getElementById("tab-btn-m3u")?.click();
            document.getElementById("m3u-name").value = pl.name || "";
            document.getElementById("m3u-url").value = pl.m3uUrl || "";
            document.getElementById("m3u-url")?.focus();
          }
        });
      }
      const delBtn = card.querySelector(".btn-delete");
      if (delBtn) {
        delBtn.addEventListener("click", () => {
          state.playlists = state.playlists.filter(item => item.id !== pl.id);
          if (state.activePlaylistId === pl.id) {
            activatePlaylist(DEMO_PLAYLIST.id);
          } else {
            savePlaylistsToStorage();
            renderPlaylistsView();
            updateSidebarCounts();
          }
          showToast("Lista removida.");
        });
      }
      listEl.appendChild(card);
    });
  }

  // Open Movie / Series Details Modal
  async function openMediaDetailsModal(item, type) {
    const modal = document.getElementById("modal-media-details");
    const content = document.getElementById("media-details-body");
    if (!modal || !content) return;

    // Fetch rich VOD metadata (plot, cast, director, duration, bitrate, subtitles)
    if (type === "vod" && item.streamId && item.xtreamBase && !item.vodInfoLoaded) {
      try {
        const infoUrl = `${item.xtreamBase}/player_api.php?username=${item.xtreamUser}&password=${item.xtreamPass}&action=get_vod_info&vod_id=${item.streamId}`;
        const data = await smartFetch(infoUrl, true);
        if (data && data.info) {
          item.vodInfoLoaded = true;
          item.plot = data.info.plot || data.info.description || item.plot;
          item.duration = data.info.duration || item.duration;
          item.director = data.info.director || "";
          item.actors = data.info.actors || data.info.cast || "";
          item.genre = data.info.genre || "";
          item.bitrate = data.info.bitrate || 0;
          item.subtitles = Array.isArray(data.info.subtitles) ? data.info.subtitles : [];
          if (data.info.rating) item.rating = String(data.info.rating).slice(0, 4);
        }
      } catch (e) {
        console.warn("Não foi possível carregar detalhes extras do filme:", e);
      }
    }

    // Fetch dynamic episodes if Xtream series hasn't loaded seasons yet
    if (type === "series" && item.seriesId && (!item.seasons || item.seasons.length === 0)) {
      showToast("Carregando temporadas e episódios...");
      try {
        const infoUrl = `${item.xtreamBase}/player_api.php?username=${item.xtreamUser}&password=${item.xtreamPass}&action=get_series_info&series_id=${item.seriesId}`;
        const data = await smartFetch(infoUrl, true);
        if (data && data.episodes) {
          item.seasons = Object.keys(data.episodes)
            .sort((a, b) => Number(a) - Number(b))
            .map(sNum => ({
              seasonNumber: Number(sNum),
              name: `Temporada ${sNum}`,
              episodes: (data.episodes[sNum] || []).map((ep, idx) => {
                const ext = ep.container_extension || "mp4";
                return {
                  id: `xt-ep-${ep.id}`,
                  num: ep.episode_num || idx + 1,
                  title: ep.title || `Episódio ${ep.episode_num || idx + 1}`,
                  duration: ep.info && ep.info.duration ? ep.info.duration : "",
                  url: `${item.xtreamBase}/series/${item.xtreamUser}/${item.xtreamPass}/${ep.id}.${ext}`
                };
              })
            }));
        }
      } catch (e) {
        console.warn("Não foi possível carregar episódios detalhados:", e);
      }
    }

    state.lastOpenedModal = { item, type };

    const favArray = type === "vod" ? state.favorites.vod : state.favorites.series;
    const isFav = favArray.includes(item.id);
    const savedProgress = state.history[item.id];

    // Find most recently watched episode for this series
    let latestSeriesWatched = null;
    if (type === "series" && item.seasons && item.seasons.length > 0) {
      item.seasons.forEach((s, sIdx) => {
        (s.episodes || []).forEach(ep => {
          const h = state.history[ep.id];
          if (h && h.time > 1) {
            if (!latestSeriesWatched || (h.updatedAt || 0) >= (latestSeriesWatched.hist.updatedAt || 0)) {
              latestSeriesWatched = {
                season: s,
                seasonIdx: sIdx,
                ep,
                hist: h
              };
            }
          }
        });
      });
    }

    let episodesHtml = "";
    if (type === "series" && item.seasons && item.seasons.length > 0) {
      if (typeof item.selectedSeasonIdx !== "number" || item.selectedSeasonIdx >= item.seasons.length) {
        item.selectedSeasonIdx = latestSeriesWatched ? latestSeriesWatched.seasonIdx : 0;
      }
      const totalEpisodesCount = item.seasons.reduce((acc, s) => acc + (s.episodes ? s.episodes.length : 0), 0);

      episodesHtml = `
        <div class="season-tabs-header">
          <h3 style="font-size:17px;font-weight:700;">Temporadas (${item.seasons.length})</h3>
          <span style="font-size:12px;color:var(--text-muted);">${totalEpisodesCount} episódios disponíveis</span>
        </div>
        <div id="series-season-tabs" class="season-tabs-bar">
          ${item.seasons
            .map(
              (s, sIdx) => `
            <button class="season-tab-btn focusable ${sIdx === item.selectedSeasonIdx ? "active" : ""}" data-season-idx="${sIdx}">
              <span>${escapeHtml(s.name)}</span>
              <span class="season-tab-count">${s.episodes.length}</span>
            </button>
          `
            )
            .join("")}
        </div>
        <div id="series-episodes-list" class="episode-list"></div>
      `;
    }

    const firstSeason = type === "series" && item.seasons && item.seasons[0];
    const firstEp = firstSeason && firstSeason.episodes && firstSeason.episodes[0];

    content.innerHTML = `
      <div class="detail-hero">
        <img class="detail-poster" src="${escapeHtml(item.poster || "")}" alt="" onerror="this.style.visibility='hidden'" />
        <div class="detail-meta">
          <h2>${escapeHtml(item.name)}</h2>
          <div class="detail-badges">
            <span class="detail-badge">★ ${escapeHtml(item.rating || "HD")}</span>
            ${item.year ? `<span class="detail-badge">${escapeHtml(item.year)}</span>` : ""}
            ${item.duration ? `<span class="detail-badge">⏱ ${escapeHtml(item.duration)}</span>` : ""}
            ${item.genre ? `<span class="detail-badge">${escapeHtml(item.genre)}</span>` : ""}
          </div>
          <p class="detail-plot">${escapeHtml(item.plot || "Sem sinopse disponível.")}</p>
          ${item.actors ? `<p style="font-size:13px;color:#94a3b8;margin-bottom:8px;"><strong>Elenco:</strong> ${escapeHtml(item.actors)}</p>` : ""}
          ${item.director ? `<p style="font-size:13px;color:#94a3b8;margin-bottom:16px;"><strong>Direção:</strong> ${escapeHtml(item.director)}</p>` : ""}
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            ${
              type === "vod"
                ? `<button id="btn-play-vod-start" class="btn btn-primary focusable">▶ Assistir Agora</button>`
                : ""
            }
            ${
              type === "vod" && savedProgress && savedProgress.time > 1
                ? `<button id="btn-play-vod-resume" class="btn btn-success focusable">⏯ Continuar (${formatPlayerTimestamp(savedProgress.time)})</button>`
                : ""
            }
            ${
              type === "series" && latestSeriesWatched
                ? `<button id="btn-play-series-resume" class="btn btn-success focusable">⏯ Continuar T${latestSeriesWatched.season.seasonNumber}:E${latestSeriesWatched.ep.num} (${formatPlayerTimestamp(latestSeriesWatched.hist.time)})</button>
                   <button id="btn-play-series-restart" class="btn btn-primary focusable">▶ Do Início (T${latestSeriesWatched.season.seasonNumber}:E${latestSeriesWatched.ep.num})</button>`
                : type === "series" && firstEp
                ? `<button id="btn-play-series-first" class="btn btn-primary focusable">▶ Assistir T${firstSeason.seasonNumber}:E${firstEp.num}</button>`
                : ""
            }
            <button id="btn-toggle-detail-fav" class="btn focusable">
              ${isFav ? "★ Remover dos Favoritos" : "☆ Adicionar aos Favoritos"}
            </button>
            <button id="btn-close-detail-modal" class="btn focusable">Voltar</button>
          </div>
          ${episodesHtml}
        </div>
      </div>
    `;

    modal.classList.add("open");

    const closeBtn = document.getElementById("btn-close-detail-modal");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        state.lastOpenedModal = null;
        modal.classList.remove("open");
      });
      closeBtn.focus();
    }

    const favBtn = document.getElementById("btn-toggle-detail-fav");
    if (favBtn) {
      favBtn.addEventListener("click", () => {
        const idx = favArray.indexOf(item.id);
        if (idx === -1) favArray.push(item.id);
        else favArray.splice(idx, 1);
        saveFavoritesToStorage();
        updateSidebarCounts();
        refreshCurrentView();
        openMediaDetailsModal(item, type);
      });
    }

    const playStartBtn = document.getElementById("btn-play-vod-start");
    if (playStartBtn) {
      playStartBtn.addEventListener("click", () => {
        modal.classList.remove("open");
        openFullscreenPlayer({
          id: item.id,
          title: item.name,
          subtitle: item.genre || item.year || "Original Stream",
          url: item.url,
          type: "vod",
          resumeTime: 0,
          mediaObj: item
        });
      });
      playStartBtn.focus();
    }

    const playResumeBtn = document.getElementById("btn-play-vod-resume");
    if (playResumeBtn && savedProgress) {
      playResumeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
        openFullscreenPlayer({
          id: item.id,
          title: item.name,
          subtitle: "Original Stream",
          url: item.url,
          type: "vod",
          resumeTime: savedProgress.time,
          mediaObj: item
        });
      });
      playResumeBtn.focus();
    }

    const seriesResumeBtn = document.getElementById("btn-play-series-resume");
    if (seriesResumeBtn && latestSeriesWatched) {
      seriesResumeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
        openFullscreenPlayer({
          id: latestSeriesWatched.ep.id,
          title: `${item.name} - ${latestSeriesWatched.ep.title}`,
          subtitle: latestSeriesWatched.season.name,
          url: latestSeriesWatched.ep.url,
          type: "series",
          resumeTime: latestSeriesWatched.hist.time || 0,
          mediaObj: item,
          seasonIdx: latestSeriesWatched.seasonIdx
        });
      });
      seriesResumeBtn.focus();
    }

    const seriesRestartBtn = document.getElementById("btn-play-series-restart");
    if (seriesRestartBtn && latestSeriesWatched) {
      seriesRestartBtn.addEventListener("click", () => {
        modal.classList.remove("open");
        openFullscreenPlayer({
          id: latestSeriesWatched.ep.id,
          title: `${item.name} - ${latestSeriesWatched.ep.title}`,
          subtitle: latestSeriesWatched.season.name,
          url: latestSeriesWatched.ep.url,
          type: "series",
          resumeTime: 0,
          mediaObj: item,
          seasonIdx: latestSeriesWatched.seasonIdx
        });
      });
    }

    const seriesFirstBtn = document.getElementById("btn-play-series-first");
    if (seriesFirstBtn && firstEp) {
      seriesFirstBtn.addEventListener("click", () => {
        modal.classList.remove("open");
        openFullscreenPlayer({
          id: firstEp.id,
          title: `${item.name} - ${firstEp.title}`,
          subtitle: firstSeason.name,
          url: firstEp.url,
          type: "series",
          resumeTime: 0,
          mediaObj: item,
          seasonIdx: 0
        });
      });
      seriesFirstBtn.focus();
    }

    if (type === "series" && item.seasons && item.seasons.length > 0) {
      const epListContainer = document.getElementById("series-episodes-list");
      const renderSeasonEpisodes = seasonIdx => {
        if (!epListContainer) return;
        const seasonObj = item.seasons[seasonIdx] || item.seasons[0];
        if (!seasonObj) return;
        item.selectedSeasonIdx = seasonIdx;

        // Update active state on season tab buttons
        content.querySelectorAll(".season-tab-btn").forEach((tabBtn, idx) => {
          tabBtn.classList.toggle("active", idx === seasonIdx);
        });

        epListContainer.innerHTML = seasonObj.episodes
          .map((ep, epIdx) => {
            const epHist = state.history[ep.id];
            const hasResume = epHist && epHist.time > 1;
            const histPct =
              hasResume && epHist.duration
                ? Math.min(100, Math.round((epHist.time / epHist.duration) * 100))
                : 0;
            const subInfo = [
              ep.duration ? `⏱ ${ep.duration}` : "Episódio Completo",
              hasResume
                ? `• ⏯ Parou em ${formatPlayerTimestamp(epHist.time)}${histPct > 0 ? ` (${histPct}%)` : ""}`
                : ""
            ]
              .filter(Boolean)
              .join(" ");

            return `
              <div class="channel-row" style="${hasResume ? "border-color:rgba(16,185,129,0.5);background:rgba(16,185,129,0.09);" : ""}">
                <span class="ch-num">#${ep.num}</span>
                <div class="ch-info">
                  <div class="ch-name">${escapeHtml(ep.title)}</div>
                  <div class="ch-epg" style="${hasResume ? "color:#34d399;font-weight:600;" : ""}">${escapeHtml(subInfo)}</div>
                </div>
                <div style="display:flex;gap:8px;flex-shrink:0;">
                  ${
                    hasResume
                      ? `<button class="btn btn-success focusable ep-resume-btn" data-ep-idx="${epIdx}" style="padding:6px 12px;font-size:12px;">⏯ Continuar (${formatPlayerTimestamp(epHist.time)})</button>
                         <button class="btn focusable ep-start-btn" data-ep-idx="${epIdx}" style="padding:6px 10px;font-size:12px;">↺ Início</button>`
                      : `<button class="btn btn-primary focusable ep-start-btn" data-ep-idx="${epIdx}" style="padding:6px 12px;font-size:12px;">▶ Assistir</button>`
                  }
                </div>
              </div>
            `;
          })
          .join("");

        epListContainer.querySelectorAll(".ep-resume-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const ep = seasonObj.episodes[Number(btn.dataset.epIdx)];
            if (!ep) return;
            modal.classList.remove("open");
            openFullscreenPlayer({
              id: ep.id,
              title: `${item.name} - ${ep.title}`,
              subtitle: seasonObj.name,
              url: ep.url,
              type: "series",
              resumeTime: state.history[ep.id]?.time || 0,
              mediaObj: item,
              seasonIdx
            });
          });
        });

        epListContainer.querySelectorAll(".ep-start-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const ep = seasonObj.episodes[Number(btn.dataset.epIdx)];
            if (!ep) return;
            modal.classList.remove("open");
            openFullscreenPlayer({
              id: ep.id,
              title: `${item.name} - ${ep.title}`,
              subtitle: seasonObj.name,
              url: ep.url,
              type: "series",
              resumeTime: 0,
              mediaObj: item,
              seasonIdx
            });
          });
        });
      };

      // Bind season tab clicks
      content.querySelectorAll(".season-tab-btn").forEach(tabBtn => {
        tabBtn.addEventListener("click", () => {
          const sIdx = Number(tabBtn.dataset.seasonIdx || 0);
          renderSeasonEpisodes(sIdx);
        });
      });

      // Render initially active season
      renderSeasonEpisodes(item.selectedSeasonIdx || 0);
    }
  }

  // External / Custom Subtitle Parser (.SRT / .VTT)
  let activeSubtitleCues = [];
  let subtitlesEnabled = false;
  let audioCtx = null;
  let gainNode = null;
  let audioBoostEnabled = false;

  function parseSrtOrVtt(text) {
    const cues = [];
    const blocks = text.replace(/\r\n/g, "\n").split(/\n\n+/);
    const timeRegex = /(\d{1,2}:)?(\d{2}):(\d{2})[.,](\d{3})\s*-->\s*(\d{1,2}:)?(\d{2}):(\d{2})[.,](\d{3})/;

    const toSec = (h, m, s, ms) =>
      (h ? parseInt(h, 10) * 3600 : 0) +
      parseInt(m, 10) * 60 +
      parseInt(s, 10) +
      parseInt(ms, 10) / 1000;

    for (const block of blocks) {
      const lines = block.trim().split("\n");
      for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(timeRegex);
        if (m) {
          const start = toSec(m[1], m[2], m[3], m[4]);
          const end = toSec(m[5], m[6], m[7], m[8]);
          const content = lines.slice(i + 1).join("<br/>").replace(/<[^>]+>/g, "");
          if (content) cues.push({ start, end, text: content });
          break;
        }
      }
    }
    return cues;
  }

  function closeAllPlayerPopovers() {
    document.querySelectorAll(".player-popover.open").forEach(p => p.classList.remove("open"));
  }

  function togglePlayerPopover(popoverId) {
    const target = document.getElementById(popoverId);
    if (!target) return;
    const wasOpen = target.classList.contains("open");
    closeAllPlayerPopovers();
    if (!wasOpen) {
      target.classList.add("open");
      showOsdTemporarily(10000);
    }
  }

  function updateTechBoxInfo(videoEl, titleStr) {
    const qEl = document.getElementById("tech-quality");
    const rEl = document.getElementById("tech-resolution");
    const nEl = document.getElementById("tech-network");
    const upper = String(titleStr || "").toUpperCase();

    const w = videoEl?.videoWidth || 0;
    const h = videoEl?.videoHeight || 0;

    if (w > 0 && h > 0) {
      if (rEl) rEl.textContent = `${w}|${h}`;
      if (qEl) {
        if (w >= 3800 || h >= 2000 || upper.includes("[4K]") || upper.includes("UHD")) {
          qEl.textContent = "4K Ultra HD";
        } else if (w >= 1900 || h >= 1000 || upper.includes("[FHD]")) {
          qEl.textContent = "Full HD 1080p";
        } else if (w >= 1200 || h >= 700) {
          qEl.textContent = "HD 720p";
        } else {
          qEl.textContent = "SD Standard";
        }
      }
    } else {
      if (upper.includes("[4K]") || upper.includes("UHD")) {
        if (qEl) qEl.textContent = "4K Ultra HD";
        if (rEl) rEl.textContent = "3840|2160";
      } else if (upper.includes("[FHD]") || upper.includes("1080")) {
        if (qEl) qEl.textContent = "Full HD 1080p";
        if (rEl) rEl.textContent = "1920|1080";
      } else {
        if (qEl) qEl.textContent = "HD Stream";
        if (rEl) rEl.textContent = "1920|1080";
      }
    }
    if (nEl) nEl.textContent = "Original Stream";
  }

  function syncPlayPauseIcons(isPaused) {
    const cPause = document.getElementById("center-icon-pause");
    const cPlay = document.getElementById("center-icon-play");
    const bPlay = document.getElementById("bottom-icon-play");
    const bPause = document.getElementById("bottom-icon-pause");

    if (cPause && cPlay) {
      cPause.style.display = isPaused ? "none" : "block";
      cPlay.style.display = isPaused ? "block" : "none";
    }
    if (bPlay && bPause) {
      // Match photo: when paused, bottom button shows Play triangle (▶) to resume; when playing, shows Pause or Play
      bPlay.style.display = isPaused ? "block" : "none";
      bPause.style.display = isPaused ? "none" : "block";
    }
  }

  function populateAudioTracksPopover(videoEl) {
    const container = document.getElementById("audio-tracks-list");
    if (!container) return;
    container.innerHTML = "";

    const tracks = [];
    if (state.fsHls && Array.isArray(state.fsHls.audioTracks) && state.fsHls.audioTracks.length > 0) {
      state.fsHls.audioTracks.forEach((t, idx) => {
        tracks.push({
          label: t.name || t.lang || `Faixa de Áudio ${idx + 1}`,
          active: state.fsHls.audioTrack === idx,
          onSelect: () => {
            state.fsHls.audioTrack = idx;
            showToast(`Áudio alterado: ${t.name || t.lang || idx + 1}`);
            closeAllPlayerPopovers();
          }
        });
      });
    } else if (videoEl && videoEl.audioTracks && videoEl.audioTracks.length > 0) {
      for (let i = 0; i < videoEl.audioTracks.length; i++) {
        const t = videoEl.audioTracks[i];
        tracks.push({
          label: t.label || t.language || `Faixa ${i + 1}`,
          active: t.enabled,
          onSelect: () => {
            for (let j = 0; j < videoEl.audioTracks.length; j++) {
              videoEl.audioTracks[j].enabled = j === i;
            }
            showToast(`Faixa de áudio ${i + 1} ativada`);
            closeAllPlayerPopovers();
          }
        });
      }
    }

    if (tracks.length === 0) {
      tracks.push({
        label: "Faixa Principal (Original / Português)",
        active: true,
        onSelect: () => {
          showToast("Faixa de áudio principal selecionada");
          closeAllPlayerPopovers();
        }
      });
    }

    tracks.forEach(tr => {
      const btn = document.createElement("button");
      btn.className = `popover-option focusable ${tr.active ? "active" : ""}`;
      btn.innerHTML = `<span>${escapeHtml(tr.label)}</span><span>${tr.active ? "✓" : ""}</span>`;
      btn.addEventListener("click", tr.onSelect);
      container.appendChild(btn);
    });
  }

  function populateSubtitleTracksPopover(videoEl) {
    const container = document.getElementById("subtitle-tracks-list");
    if (!container) return;
    container.innerHTML = "";

    const offBtn = document.createElement("button");
    offBtn.className = `popover-option focusable ${!subtitlesEnabled ? "active" : ""}`;
    offBtn.innerHTML = `<span>Desativadas</span><span>${!subtitlesEnabled ? "✓" : ""}</span>`;
    offBtn.addEventListener("click", () => {
      subtitlesEnabled = false;
      const overlay = document.getElementById("custom-subtitle-overlay");
      if (overlay) overlay.style.display = "none";
      showToast("Legendas desativadas");
      closeAllPlayerPopovers();
    });
    container.appendChild(offBtn);

    if (activeSubtitleCues.length > 0) {
      const customBtn = document.createElement("button");
      customBtn.className = `popover-option focusable ${subtitlesEnabled ? "active" : ""}`;
      customBtn.innerHTML = `<span>Legenda Carregada (${activeSubtitleCues.length} linhas)</span><span>${subtitlesEnabled ? "✓" : ""}</span>`;
      customBtn.addEventListener("click", () => {
        subtitlesEnabled = true;
        showToast("Legenda ativada");
        closeAllPlayerPopovers();
      });
      container.appendChild(customBtn);
    }

    if (state.fsHls && Array.isArray(state.fsHls.subtitleTracks) && state.fsHls.subtitleTracks.length > 0) {
      state.fsHls.subtitleTracks.forEach((t, idx) => {
        const btn = document.createElement("button");
        const isAct = state.fsHls.subtitleTrack === idx;
        btn.className = `popover-option focusable ${isAct ? "active" : ""}`;
        btn.innerHTML = `<span>${escapeHtml(t.name || t.lang || `Legenda ${idx + 1}`)}</span><span>${isAct ? "✓" : ""}</span>`;
        btn.addEventListener("click", () => {
          state.fsHls.subtitleTrack = idx;
          subtitlesEnabled = true;
          showToast(`Legenda: ${t.name || idx + 1}`);
          closeAllPlayerPopovers();
        });
        container.appendChild(btn);
      });
    }
  }

  function getAdjacentSeriesEpisode(delta) {
    if (!state.currentPlayingItem || state.currentPlayingItem.type !== "series") return null;
    let mediaObj = state.currentPlayingItem.mediaObj;
    if (!mediaObj) {
      mediaObj = state.catalog.seriesList.find(
        s =>
          (state.currentPlayingItem.seriesId && s.id === state.currentPlayingItem.seriesId) ||
          (state.currentPlayingItem.title && state.currentPlayingItem.title.startsWith(s.name))
      );
      if (mediaObj) state.currentPlayingItem.mediaObj = mediaObj;
    }
    if (!mediaObj || !Array.isArray(mediaObj.seasons) || mediaObj.seasons.length === 0) return null;

    const flatList = [];
    mediaObj.seasons.forEach((s, sIdx) => {
      (s.episodes || []).forEach((ep, epIdx) => {
        flatList.push({ mediaObj, season: s, seasonIdx: sIdx, ep, epIdx });
      });
    });

    const curIdx = flatList.findIndex(entry => entry.ep.id === state.currentPlayingItem.id);
    if (curIdx === -1) return null;
    return flatList[curIdx + delta] || null;
  }

  function stepSeriesEpisode(delta, isAutoAdvance = false) {
    const target = getAdjacentSeriesEpisode(delta);
    if (!target) {
      showToast(
        delta > 0
          ? "Você concluiu o último episódio disponível desta série!"
          : "Este já é o primeiro episódio da série."
      );
      return;
    }

    persistActiveVideoProgress();
    target.mediaObj.selectedSeasonIdx = target.seasonIdx;
    showToast(
      `${isAutoAdvance ? "▶ Próximo episódio automático:" : "⏭ Pulando para:"} T${target.season.seasonNumber}:E${target.ep.num} - ${target.ep.title}`
    );

    openFullscreenPlayer({
      id: target.ep.id,
      title: `${target.mediaObj.name} - ${target.ep.title}`,
      subtitle: target.season.name,
      url: target.ep.url,
      type: "series",
      resumeTime: 0,
      mediaObj: target.mediaObj,
      seasonIdx: target.seasonIdx
    });
  }

  // Fullscreen Player & Cinema OSD
  function openFullscreenPlayer(playConfig) {
    state.isFullscreen = true;
    state.currentPlayingItem = playConfig;
    closeAllPlayerPopovers();

    // Pause mini video if running
    const miniVideo = document.getElementById("mini-video");
    if (miniVideo) {
      destroyPlayerInstances(false);
      miniVideo.pause();
    }

    const fsContainer = document.getElementById("fullscreen-player");
    const fsVideo = document.getElementById("fs-video");
    const osdTitle = document.getElementById("osd-title");
    const osdSub = document.getElementById("osd-subtitle");
    const advBanner = document.getElementById("osd-advisory-banner");
    const nextEpPill = document.getElementById("btn-osd-next-ep-pill");

    if (osdTitle) osdTitle.textContent = playConfig.title || "Reproduzindo";
    if (osdSub) osdSub.textContent = playConfig.subtitle || "Original Stream";
    if (advBanner) {
      advBanner.textContent =
        playConfig.type === "live"
          ? `Transmissão ao Vivo • ${playConfig.title || ""}`
          : "Menores de 17 apenas acompanhados por responsável de 21 anos ou mais.";
    }

    if (nextEpPill) {
      const nextEp = playConfig.type === "series" ? getAdjacentSeriesEpisode(1) : null;
      if (nextEp) {
        nextEpPill.style.display = "inline-flex";
        nextEpPill.textContent = `⏭ Próximo Ep. (T${nextEp.season.seasonNumber}:E${nextEp.ep.num})`;
      } else {
        nextEpPill.style.display = "none";
      }
    }

    updateTechBoxInfo(fsVideo, playConfig.title);

    fsContainer.classList.add("active");
    showOsdTemporarily(6000);

    attachStreamToVideo(
      fsVideo,
      playConfig.url,
      playConfig.altUrl,
      true,
      playConfig.resumeTime || 0
    );

    // Immediately focus the bottom OSD Play/Pause button so remote arrows work right away!
    requestAnimationFrame(() => {
      const playPauseBtn = document.getElementById("btn-osd-playpause");
      if (playPauseBtn) focusTvElement(playPauseBtn);
    });
  }

  function persistActiveVideoProgress() {
    const fsVideo = document.getElementById("fs-video");
    if (!fsVideo || !state.currentPlayingItem) return;
    // Never save Live TV channels to Continuar Assistindo / Recentes history
    if (state.currentPlayingItem.type === "live") return;

    const currentSec = Math.floor(fsVideo.currentTime || 0);
    const durSec = Math.floor(fsVideo.duration && isFinite(fsVideo.duration) ? fsVideo.duration : 0);
    if (currentSec <= 0 && state.history[state.currentPlayingItem.id]?.time > 0) {
      return;
    }

    const posterUrl =
      state.currentPlayingItem.mediaObj?.poster ||
      state.currentPlayingItem.poster ||
      "";

    state.history[state.currentPlayingItem.id] = {
      id: state.currentPlayingItem.id,
      title: state.currentPlayingItem.title,
      type: state.currentPlayingItem.type,
      url: state.currentPlayingItem.url,
      poster: posterUrl,
      seriesId: state.currentPlayingItem.mediaObj?.id || null,
      seasonIdx: state.currentPlayingItem.seasonIdx ?? 0,
      time: currentSec,
      duration: durSec,
      updatedAt: Date.now()
    };
    saveHistoryToStorage();
  }

  function closeFullscreenPlayer() {
    state.isFullscreen = false;
    closeAllPlayerPopovers();
    const fsContainer = document.getElementById("fullscreen-player");
    const fsVideo = document.getElementById("fs-video");

    persistActiveVideoProgress();
    if (state.currentView === "dashboard") {
      renderDashboard();
    }

    destroyPlayerInstances(true);
    if (fsVideo) {
      fsVideo.pause();
      fsVideo.removeAttribute("src");
    }
    if (fsContainer) fsContainer.classList.remove("active");

    if (state.lastOpenedModal && state.lastOpenedModal.item) {
      openMediaDetailsModal(state.lastOpenedModal.item, state.lastOpenedModal.type);
    } else if (state.currentView === "live" && state.currentChannel) {
      playChannelInMiniPlayer(state.currentChannel);
      requestAnimationFrame(() => {
        const activeCh =
          document.querySelector("#live-channels-list .channel-row.active") ||
          document.querySelector("#live-channels-list .focusable");
        if (activeCh) focusTvElement(activeCh);
      });
    } else {
      requestAnimationFrame(() => {
        const activeSec = document.querySelector(".view-section.active");
        const firstFocus = activeSec?.querySelector(".focusable");
        if (firstFocus) focusTvElement(firstFocus);
      });
    }
  }

  function showOsdTemporarily(timeoutMs = 6000) {
    const fsContainer = document.getElementById("fullscreen-player");
    if (!fsContainer) return;
    fsContainer.classList.remove("osd-hidden");
    clearTimeout(state.osdTimer);
    state.osdTimer = setTimeout(() => {
      const anyPopover = document.querySelector(".player-popover.open");
      const fsVideo = document.getElementById("fs-video");
      if (state.isFullscreen && !anyPopover && fsVideo && !fsVideo.paused) {
        fsContainer.classList.add("osd-hidden");
      }
    }, timeoutMs);
  }

  function stepLiveChannel(delta) {
    const list = state.catalog.liveByCat?.get(state.liveSelectedCat) || state.catalog.liveStreams;
    if (!list || list.length === 0) return;
    const curId = state.currentPlayingItem?.channelObj?.id || state.currentChannel?.id;
    let idx = list.findIndex(c => c.id === curId);
    if (idx === -1) idx = 0;
    idx = (idx + delta + list.length) % list.length;
    const nextCh = list[idx];
    state.currentChannel = nextCh;
    openFullscreenPlayer({
      id: nextCh.id,
      title: `${nextCh.num} - ${nextCh.name}`,
      subtitle: nextCh.epgNow || "Canal ao Vivo",
      url: nextCh.url,
      altUrl: nextCh.altUrl,
      type: "live",
      channelObj: nextCh
    });
  }

  // Duplecast-style 0ms Focus Movement: zero getBoundingClientRect() or scrollIntoView() layout thrashing
  function focusTvElement(el) {
    if (!el) return false;
    el.focus({ preventScroll: true });
    const scroller = el.closest(
      ".scroll-list, .poster-grid-wrap, .episode-list, .tv-search-results-grid, .dashboard-scroll"
    );
    if (scroller) {
      const elTop = el.offsetTop;
      const elBottom = elTop + el.offsetHeight;
      const viewTop = scroller.scrollTop;
      const viewBottom = viewTop + scroller.clientHeight;
      if (elTop < viewTop + 24) {
        scroller.scrollTop = Math.max(0, elTop - 24);
      } else if (elBottom > viewBottom - 24) {
        scroller.scrollTop = elBottom - scroller.clientHeight + 24;
      }
    }
    return true;
  }

  // Deterministic Smart TV Zone & Grid D-Pad Navigation (Zero lag, never gets stuck horizontally/vertically)
  function moveSpatialFocus(direction, customScope = null) {
    const current = document.activeElement;

    // 1. Inside an open Modal (#modal-tv-search, #modal-media-details, or #modal-add-playlist)
    const openModal = customScope || document.querySelector(".modal-backdrop.open");
    if (openModal) {
      // Smart TV Search Modal (#modal-tv-search) deterministic navigation
      if (openModal.id === "modal-tv-search") {
        const kbGrid = document.getElementById("tv-keyboard-grid");
        const kbKeys = kbGrid ? Array.from(kbGrid.querySelectorAll(".tv-kb-key")) : [];
        const kbActions = Array.from(openModal.querySelectorAll(".tv-keyboard-actions .tv-kb-action"));
        const resCards = Array.from(openModal.querySelectorAll("#tv-search-results-grid .poster-card"));
        const closeBtn = document.getElementById("btn-close-tv-search");

        // Inside 6x6 Alphanumeric Keyboard Grid
        const kIdx = kbKeys.indexOf(current);
        if (kIdx !== -1) {
          const cols = 6;
          if (direction === "right") {
            if ((kIdx + 1) % cols !== 0 && kbKeys[kIdx + 1]) {
              return focusTvElement(kbKeys[kIdx + 1]);
            }
            if (resCards[0]) return focusTvElement(resCards[0]);
            return;
          }
          if (direction === "left") {
            if (kIdx % cols !== 0 && kbKeys[kIdx - 1]) {
              return focusTvElement(kbKeys[kIdx - 1]);
            }
            return;
          }
          if (direction === "down") {
            if (kbKeys[kIdx + cols]) return focusTvElement(kbKeys[kIdx + cols]);
            if (kbActions[0]) return focusTvElement(kbActions[0]);
            return;
          }
          if (direction === "up") {
            if (kIdx >= cols && kbKeys[kIdx - cols]) return focusTvElement(kbKeys[kIdx - cols]);
            if (closeBtn) return focusTvElement(closeBtn);
            return;
          }
        }

        // Inside Keyboard Action Row (ESPAÇO, APAGAR, LIMPAR)
        const aIdx = kbActions.indexOf(current);
        if (aIdx !== -1) {
          if (direction === "right") {
            if (kbActions[aIdx + 1]) return focusTvElement(kbActions[aIdx + 1]);
            if (resCards[0]) return focusTvElement(resCards[0]);
            return;
          }
          if (direction === "left") {
            if (kbActions[aIdx - 1]) return focusTvElement(kbActions[aIdx - 1]);
            return;
          }
          if (direction === "up") {
            const targetKey = kbKeys[Math.min(kbKeys.length - 1, 30 + aIdx * 2)] || kbKeys[0];
            if (targetKey) return focusTvElement(targetKey);
            return;
          }
          return;
        }

        // Inside Search Results Poster Grid
        const rIdx = resCards.indexOf(current);
        if (rIdx !== -1) {
          let cols = 1;
          const firstTop = resCards[0].offsetTop;
          while (cols < resCards.length && Math.abs(resCards[cols].offsetTop - firstTop) < 12) {
            cols++;
          }
          if (direction === "right") {
            if ((rIdx + 1) % cols !== 0 && resCards[rIdx + 1]) {
              return focusTvElement(resCards[rIdx + 1]);
            }
            return;
          }
          if (direction === "left") {
            if (rIdx % cols !== 0 && resCards[rIdx - 1]) {
              return focusTvElement(resCards[rIdx - 1]);
            }
            if (kbKeys[5]) return focusTvElement(kbKeys[5]);
            return;
          }
          if (direction === "down") {
            if (resCards[rIdx + cols]) return focusTvElement(resCards[rIdx + cols]);
            return;
          }
          if (direction === "up") {
            if (rIdx >= cols && resCards[rIdx - cols]) return focusTvElement(resCards[rIdx - cols]);
            if (closeBtn) return focusTvElement(closeBtn);
            return;
          }
        }

        if (current === closeBtn && direction === "down") {
          if (kbKeys[0]) return focusTvElement(kbKeys[0]);
        }
      }

      // Series/Movie Details Modal deterministic zones
      if (openModal.id === "modal-media-details") {
        // Zone M1: Season Tabs Bar
        if (current && current.classList.contains("season-tab-btn")) {
          const tabs = Array.from(openModal.querySelectorAll(".season-tab-btn"));
          const tIdx = tabs.indexOf(current);
          if (direction === "right" && tabs[tIdx + 1]) {
            tabs[tIdx + 1].click();
            return focusTvElement(tabs[tIdx + 1]);
          }
          if (direction === "left" && tabs[tIdx - 1]) {
            tabs[tIdx - 1].click();
            return focusTvElement(tabs[tIdx - 1]);
          }
          if (direction === "down") {
            const firstEp = openModal.querySelector(".episode-list .focusable");
            if (firstEp) return focusTvElement(firstEp);
          }
          if (direction === "up") {
            const topBtn = openModal.querySelector(".detail-meta .focusable");
            if (topBtn) return focusTvElement(topBtn);
          }
          return;
        }

        // Zone M2: Episodes List
        const epList = current?.closest(".episode-list");
        if (epList) {
          const epBtns = Array.from(epList.querySelectorAll(".focusable"));
          const eIdx = epBtns.indexOf(current);
          if (direction === "down" && epBtns[eIdx + 1]) {
            return focusTvElement(epBtns[eIdx + 1]);
          }
          if (direction === "up") {
            if (eIdx > 0) return focusTvElement(epBtns[eIdx - 1]);
            const activeTab = openModal.querySelector(".season-tab-btn.active") || openModal.querySelector(".season-tab-btn");
            if (activeTab) return focusTvElement(activeTab);
            const topBtn = openModal.querySelector(".detail-meta .focusable");
            if (topBtn) return focusTvElement(topBtn);
          }
          return;
        }
      }
    } else {
      // 2. Main App Views - Deterministic Zone & Grid Navigation

      // Zone A: Left Categories / Vertical Scroll Lists (#vod-categories-list, #series-categories-list, #fav-categories-list, #live-categories-list, #live-channels-list)
      const scrollList = current?.closest(".scroll-list");
      if (scrollList) {
        const items = Array.from(scrollList.querySelectorAll(".focusable"));
        const idx = items.indexOf(current);

        if (direction === "down") {
          if (items[idx + 1]) return focusTvElement(items[idx + 1]);
          return;
        }
        if (direction === "up") {
          if (idx > 0 && items[idx - 1]) return focusTvElement(items[idx - 1]);
          const topTarget =
            document.getElementById("btn-top-back-home") ||
            document.getElementById("btn-open-tv-search");
          if (topTarget && topTarget.offsetParent !== null) return focusTvElement(topTarget);
          return;
        }
        if (direction === "right") {
          // From Categories on the left -> ALWAYS jump to the right grid or channel list!
          if (scrollList.id === "live-categories-list") {
            const chTarget =
              document.querySelector("#live-channels-list .channel-row.active") ||
              document.querySelector("#live-channels-list .focusable");
            if (chTarget) return focusTvElement(chTarget);
          } else if (scrollList.id === "live-channels-list") {
            const miniFs = document.getElementById("btn-mini-fullscreen");
            if (miniFs) return focusTvElement(miniFs);
          } else {
            const activeSec = current.closest(".view-section");
            const firstCard =
              activeSec?.querySelector(".poster-grid .poster-card") ||
              activeSec?.querySelector(".poster-grid .focusable");
            if (firstCard) return focusTvElement(firstCard);
          }
          return;
        }
        if (direction === "left") {
          if (scrollList.id === "live-channels-list") {
            const activeCat =
              document.querySelector("#live-categories-list .cat-item.active") ||
              document.querySelector("#live-categories-list .cat-item");
            if (activeCat) return focusTvElement(activeCat);
          } else {
            const backHome = document.getElementById("btn-top-back-home");
            if (backHome && backHome.offsetParent !== null) return focusTvElement(backHome);
          }
          return;
        }
      }

      // Zone B: Poster Grid (#vod-poster-grid, #series-poster-grid, #favorites-grid, #dash-recent-grid)
      const posterGrid = current?.closest(".poster-grid");
      if (posterGrid && current.classList.contains("poster-card")) {
        const cards = Array.from(posterGrid.querySelectorAll(".poster-card"));
        const idx = cards.indexOf(current);
        if (idx !== -1) {
          // Calculate exact columns count in current grid
          let cols = 1;
          const firstTop = cards[0].offsetTop;
          while (cols < cards.length && Math.abs(cards[cols].offsetTop - firstTop) < 12) {
            cols++;
          }

          if (direction === "right") {
            if ((idx + 1) % cols !== 0 && cards[idx + 1]) {
              return focusTvElement(cards[idx + 1]);
            }
            return;
          }
          if (direction === "left") {
            if (idx % cols !== 0 && cards[idx - 1]) {
              return focusTvElement(cards[idx - 1]);
            }
            // Leftmost column of ANY row -> ALWAYS jump straight to Left Categories Sidebar (or Dashboard Sidebar)!
            const activeSec = current.closest(".view-section");
            const catTarget =
              activeSec?.querySelector(".category-panel .cat-item.active") ||
              activeSec?.querySelector(".category-panel .cat-item") ||
              document.querySelector(".sidebar .nav-btn.active");
            if (catTarget && catTarget.offsetParent !== null) {
              return focusTvElement(catTarget);
            }
            return;
          }
          if (direction === "down") {
            if (cards[idx + cols]) {
              return focusTvElement(cards[idx + cols]);
            }
            const curRow = Math.floor(idx / cols);
            const lastRow = Math.floor((cards.length - 1) / cols);
            if (curRow < lastRow) {
              return focusTvElement(cards[cards.length - 1]);
            }
            const moreBtn = posterGrid.querySelector(".btn-load-more");
            if (moreBtn) {
              moreBtn.click();
              return;
            }
            return;
          }
          if (direction === "up") {
            if (idx >= cols && cards[idx - cols]) {
              return focusTvElement(cards[idx - cols]);
            }
            const topTarget =
              document.getElementById("btn-open-tv-search") ||
              document.getElementById("btn-top-back-home");
            if (topTarget && topTarget.offsetParent !== null) return focusTvElement(topTarget);
            return;
          }
        }
      }

      // Zone D: Dashboard Left Sidebar (.sidebar)
      if (current?.closest(".sidebar")) {
        const navBtns = Array.from(document.querySelectorAll(".sidebar .nav-btn"));
        const nIdx = navBtns.indexOf(current);
        if (direction === "down" && navBtns[nIdx + 1]) return focusTvElement(navBtns[nIdx + 1]);
        if (direction === "up") {
          if (navBtns[nIdx - 1]) return focusTvElement(navBtns[nIdx - 1]);
          const searchBtn = document.getElementById("btn-open-tv-search");
          if (searchBtn) return focusTvElement(searchBtn);
          return;
        }
        if (direction === "right") {
          const firstRecent =
            document.querySelector("#dash-recent-grid .poster-card") ||
            document.getElementById("btn-open-tv-search");
          if (firstRecent) return focusTvElement(firstRecent);
        }
        return;
      }

      // Zone E: Top Header Bar (.top-bar)
      if (current?.closest(".top-bar")) {
        const topItems = Array.from(document.querySelectorAll(".top-bar .focusable")).filter(
          el => el.offsetParent !== null
        );
        const tIdx = topItems.indexOf(current);
        if (direction === "right" && topItems[tIdx + 1]) return focusTvElement(topItems[tIdx + 1]);
        if (direction === "left") {
          if (topItems[tIdx - 1]) return focusTvElement(topItems[tIdx - 1]);
          const sideBtn = document.querySelector(".sidebar .nav-btn.active");
          if (sideBtn && sideBtn.offsetParent !== null) return focusTvElement(sideBtn);
          return;
        }
        if (direction === "down") {
          const activeSec = document.querySelector(".view-section.active");
          const intoSec =
            activeSec?.querySelector(".cat-item.active") ||
            activeSec?.querySelector(".poster-card") ||
            activeSec?.querySelector(".focusable") ||
            document.querySelector(".sidebar .nav-btn.active");
          if (intoSec) return focusTvElement(intoSec);
        }
        return;
      }

      // Zone F: Live TV Preview Panel (#view-live .live-preview-panel)
      if (current?.closest(".live-preview-panel")) {
        if (direction === "left") {
          if (current.id === "btn-mini-fav") {
            return focusTvElement(document.getElementById("btn-mini-fullscreen"));
          }
          const chTarget =
            document.querySelector("#live-channels-list .channel-row.active") ||
            document.querySelector("#live-channels-list .channel-row");
          if (chTarget) return focusTvElement(chTarget);
          return;
        }
        if (direction === "right" && current.id === "btn-mini-fullscreen") {
          return focusTvElement(document.getElementById("btn-mini-fav"));
        }
        if (direction === "up") {
          return focusTvElement(document.getElementById("btn-open-tv-search"));
        }
        return;
      }
    }

    // Fallback 2D spatial search within active scope only
    const scope =
      openModal ||
      document.querySelector(".view-section.active") ||
      document.getElementById("app-shell");
    const candidates = Array.from(scope.querySelectorAll(".focusable")).filter(
      el => el.offsetParent !== null && el.style.display !== "none"
    );

    if (candidates.length === 0) return;
    if (!current || !candidates.includes(current)) {
      focusTvElement(candidates[0]);
      return;
    }

    const curRect = current.getBoundingClientRect();
    const curCx = curRect.left + curRect.width / 2;
    const curCy = curRect.top + curRect.height / 2;

    let bestCandidate = null;
    let bestScore = Infinity;

    for (const el of candidates) {
      if (el === current) continue;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = cx - curCx;
      const dy = cy - curCy;

      if (direction === "right" && dx <= 4) continue;
      if (direction === "left" && dx >= -4) continue;
      if (direction === "down" && dy <= 4) continue;
      if (direction === "up" && dy >= -4) continue;

      const primaryDist = direction === "left" || direction === "right" ? Math.abs(dx) : Math.abs(dy);
      const orthoDist = direction === "left" || direction === "right" ? Math.abs(dy) : Math.abs(dx);
      const score = primaryDist + orthoDist * 1.8;

      if (score < bestScore) {
        bestScore = score;
        bestCandidate = el;
      }
    }

    if (bestCandidate) {
      focusTvElement(bestCandidate);
    }
  }

  // Deterministic Fullscreen OSD Remote Control Navigation (100% selectable buttons)
  function handleFullscreenOsdNavigation(key) {
    const fsVideo = document.getElementById("fs-video");
    const openPop = document.querySelector(".player-popover.open");

    // 1. If a popover (Audio / Subtitles / Settings) is open, navigate inside it
    if (openPop) {
      const popItems = Array.from(openPop.querySelectorAll(".focusable")).filter(
        el => el.offsetParent !== null && el.style.display !== "none"
      );
      if (popItems.length === 0) return;
      const pIdx = popItems.indexOf(document.activeElement);
      if (pIdx === -1) {
        focusTvElement(popItems[0]);
        return;
      }
      if (key === "ArrowDown" || key === "ArrowRight") {
        focusTvElement(popItems[(pIdx + 1) % popItems.length]);
      } else if (key === "ArrowUp" || key === "ArrowLeft") {
        focusTvElement(popItems[(pIdx - 1 + popItems.length) % popItems.length]);
      }
      return;
    }

    // 2. Get all visible OSD bottom buttons in exact left-to-right visual order:
    // [↺ Back, ✕ Close, ⏮ Prev Ep, ⏸ Play/Pause, ⏭ Next Ep, ⛶ Aspect, AD Audio, CC Subtitles, ⚙ Settings, ⏭ Próximo Ep. Pill]
    const osdButtons = Array.from(
      document.querySelectorAll("#fullscreen-player .osd-controls-row .focusable")
    ).filter(btn => btn.offsetParent !== null && btn.style.display !== "none");
    const seekBar = document.getElementById("osd-progress-wrap");
    const active = document.activeElement;
    const isLive = state.currentPlayingItem?.type === "live";

    // If focus is currently on the Seek Bar (#osd-progress-wrap)
    if (active === seekBar) {
      if (key === "ArrowLeft" && fsVideo && !isLive) {
        fsVideo.currentTime = Math.max(0, (fsVideo.currentTime || 0) - 10);
        showToast("⏪ -10s");
        return;
      }
      if (key === "ArrowRight" && fsVideo && !isLive) {
        fsVideo.currentTime = Math.min(fsVideo.duration || 999999, (fsVideo.currentTime || 0) + 10);
        showToast("⏩ +10s");
        return;
      }
      if (key === "ArrowDown") {
        const playBtn = document.getElementById("btn-osd-playpause") || osdButtons[0];
        if (playBtn) focusTvElement(playBtn);
        return;
      }
      if (key === "ArrowUp" && isLive) {
        stepLiveChannel(-1);
        return;
      }
      return;
    }

    // Check if focus is currently on one of the bottom OSD buttons
    const curBtnIdx = osdButtons.indexOf(active);
    if (curBtnIdx === -1) {
      // Focus was not on any OSD button yet -> immediately focus Play/Pause (or Next Ep pill)
      const defaultBtn = document.getElementById("btn-osd-playpause") || osdButtons[0];
      if (defaultBtn) focusTvElement(defaultBtn);
      return;
    }

    if (key === "ArrowRight") {
      const nextBtn = osdButtons[(curBtnIdx + 1) % osdButtons.length];
      if (nextBtn) focusTvElement(nextBtn);
      return;
    }

    if (key === "ArrowLeft") {
      const prevBtn = osdButtons[(curBtnIdx - 1 + osdButtons.length) % osdButtons.length];
      if (prevBtn) focusTvElement(prevBtn);
      return;
    }

    if (key === "ArrowUp") {
      if (isLive) {
        stepLiveChannel(-1);
      } else if (seekBar) {
        focusTvElement(seekBar);
      }
      return;
    }

    if (key === "ArrowDown") {
      if (isLive) {
        stepLiveChannel(1);
      }
      return;
    }
  }

  // Spatial D-Pad Navigation for Smart TV Remotes (LG webOS, TCL Android TV, Keyboard)
  function handleRemoteKeydown(e) {
    const key = e.key;
    const code = e.keyCode;
    const isBackKey =
      key === "Escape" ||
      key === "GoBack" ||
      key === "BrowserBack" ||
      code === 461 || // LG webOS Back button
      code === 10009 || // Smart TV Return
      (code === 8 && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName));

    if (state.isFullscreen) {
      showOsdTemporarily(6000);
      const fsVideo = document.getElementById("fs-video");
      const openPop = document.querySelector(".player-popover.open");
      if (isBackKey) {
        e.preventDefault();
        if (openPop) {
          closeAllPlayerPopovers();
          const playBtn = document.getElementById("btn-osd-playpause");
          if (playBtn) focusTvElement(playBtn);
        } else {
          closeFullscreenPlayer();
        }
        return;
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        handleFullscreenOsdNavigation(key);
        return;
      }
      if (key === "Enter" || key === " " || code === 13 || code === 23 || code === 66) {
        const active = document.activeElement;
        if (
          active &&
          (active.closest(".osd-controls-row") || active.closest(".player-popover"))
        ) {
          e.preventDefault();
          active.click();
          return;
        }
        e.preventDefault();
        if (fsVideo) {
          if (fsVideo.paused) fsVideo.play().catch(() => {});
          else fsVideo.pause();
        }
        const playBtn = document.getElementById("btn-osd-playpause");
        if (playBtn) focusTvElement(playBtn);
        return;
      }
      return;
    }

    // Close open modal on Back key
    const openModal = document.querySelector(".modal-backdrop.open");
    if (openModal && isBackKey) {
      e.preventDefault();
      state.lastOpenedModal = null;
      openModal.classList.remove("open");
      return;
    }

    if (isBackKey && state.currentView !== "dashboard") {
      e.preventDefault();
      switchView("dashboard");
      return;
    }

    if (
      (key === "Enter" || code === 13 || code === 23 || code === 66) &&
      document.activeElement?.classList.contains("focusable")
    ) {
      const tag = document.activeElement.tagName;
      if (!["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"].includes(tag)) {
        e.preventDefault();
        document.activeElement.click();
        return;
      }
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      const activeEl = document.activeElement;
      if (["INPUT", "TEXTAREA"].includes(activeEl?.tagName) && !activeEl.readOnly) {
        const val = activeEl.value || "";
        if (key === "ArrowLeft" && val.length > 0 && activeEl.selectionStart > 0) {
          return;
        }
        if (key === "ArrowRight" && val.length > 0 && activeEl.selectionEnd < val.length) {
          return;
        }
      }
      e.preventDefault();
      e.stopPropagation();
      moveSpatialFocus(key.replace("Arrow", "").toLowerCase());
    }
  }

  // Native Android TV D-Pad & Back button hooks
  window.__handleDpadDirection = function (dir) {
    const activeEl = document.activeElement;
    if (["INPUT", "TEXTAREA"].includes(activeEl?.tagName) && !activeEl.readOnly) {
      const val = activeEl.value || "";
      if (dir === "left" && val.length > 0 && activeEl.selectionStart > 0) {
        return false;
      }
      if (dir === "right" && val.length > 0 && activeEl.selectionEnd < val.length) {
        return false;
      }
    }
    const syntheticKey =
      dir === "up"
        ? "ArrowUp"
        : dir === "down"
        ? "ArrowDown"
        : dir === "left"
        ? "ArrowLeft"
        : "ArrowRight";
    handleRemoteKeydown({
      key: syntheticKey,
      keyCode: 0,
      preventDefault: () => {},
      stopPropagation: () => {}
    });
    return true;
  };

  window.__handleDpadSelect = function () {
    if (state.isFullscreen) {
      showOsdTemporarily(6000);
      const fsVideo = document.getElementById("fs-video");
      const active = document.activeElement;
      if (active && (active.closest(".osd-controls-row") || active.closest(".player-popover"))) {
        active.click();
        return true;
      }
      if (fsVideo) {
        if (fsVideo.paused) fsVideo.play().catch(() => {});
        else fsVideo.pause();
      }
      const playBtn = document.getElementById("btn-osd-playpause");
      if (playBtn) focusTvElement(playBtn);
      return true;
    }
    const active = document.activeElement;
    if (!active) return false;
    if (active.tagName === "SELECT") {
      active.selectedIndex = (active.selectedIndex + 1) % active.options.length;
      active.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
    if (["INPUT", "TEXTAREA"].includes(active.tagName) && !active.readOnly) {
      active.focus();
      active.click();
      if (window.AndroidBridge && typeof window.AndroidBridge.showKeyboard === "function") {
        window.AndroidBridge.showKeyboard();
      }
      return true;
    }
    active.click();
    return true;
  };

  window.__handleAndroidBack = function () {
    if (state.isFullscreen) {
      const openPop = document.querySelector(".player-popover.open");
      if (openPop) {
        closeAllPlayerPopovers();
        const playBtn = document.getElementById("btn-osd-playpause");
        if (playBtn) focusTvElement(playBtn);
      } else {
        closeFullscreenPlayer();
      }
      return true;
    }
    const openModal = document.querySelector(".modal-backdrop.open");
    if (openModal) {
      state.lastOpenedModal = null;
      openModal.classList.remove("open");
      return true;
    }
    if (state.currentView !== "dashboard") {
      switchView("dashboard");
      return true;
    }
    return false;
  };

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Format timestamp as H:MM:SS (e.g. 0:00:10 / 1:35:03 matching photo)
  function formatPlayerTimestamp(sec) {
    const total = Math.max(0, Math.floor(sec || 0));
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  // Poll companion server for playlists added via Mobile QR Code
  async function syncRemoteCompanionPlaylists() {
    if (!window.location.protocol.startsWith("http")) return;
    try {
      const resp = await fetch("/api/playlists");
      if (!resp.ok) return;
      const data = await resp.json();
      if (Array.isArray(data.playlists)) {
        let addedNew = null;
        data.playlists.forEach(remotePl => {
          if (!state.playlists.some(local => local.id === remotePl.id)) {
            state.playlists.push(remotePl);
            addedNew = remotePl;
          }
        });
        if (addedNew) {
          savePlaylistsToStorage();
          renderPlaylistsView();
          updateSidebarCounts();
          activatePlaylist(addedNew.id);
        }
      }
      if (data.mobileUrl) {
        const urlLabel = document.getElementById("qr-mobile-url");
        if (urlLabel) urlLabel.textContent = data.mobileUrl;
      }
    } catch (_) {
      // Offline or static file mode
    }
  }

  // Smart TV Search Modal: Instant search across Movies, Series & Live TV Channels
  function runTvModalSearch(rawQuery) {
    const q = String(rawQuery || "").trim().toLowerCase();
    const resultsGrid = document.getElementById("tv-search-results-grid");
    const countLabel = document.getElementById("tv-search-results-count");
    const searchModal = document.getElementById("modal-tv-search");
    if (!resultsGrid) return;

    resultsGrid.innerHTML = "";
    if (!q) {
      if (countLabel) countLabel.textContent = "Digite uma letra ao lado para buscar";
      return;
    }

    const matches = [];
    const maxMatches = 48;

    for (const mv of state.catalog.vodStreams || []) {
      if (mv.name && mv.name.toLowerCase().includes(q)) {
        matches.push({ kind: "vod", item: mv });
        if (matches.length >= maxMatches) break;
      }
    }
    if (matches.length < maxMatches) {
      for (const sr of state.catalog.seriesList || []) {
        if (sr.name && sr.name.toLowerCase().includes(q)) {
          matches.push({ kind: "series", item: sr });
          if (matches.length >= maxMatches) break;
        }
      }
    }
    if (matches.length < maxMatches) {
      for (const ch of state.catalog.liveStreams || []) {
        if (ch.name && ch.name.toLowerCase().includes(q)) {
          matches.push({ kind: "live", item: ch });
          if (matches.length >= maxMatches) break;
        }
      }
    }

    if (countLabel) {
      countLabel.textContent = `${matches.length} resultado(s) para "${rawQuery.toUpperCase()}"`;
    }

    if (matches.length === 0) {
      resultsGrid.innerHTML = `<div style="grid-column:1/-1; padding:18px; color:var(--text-muted); font-size:0.86rem;">Nenhum filme, série ou canal encontrado para "${escapeHtml(rawQuery)}".</div>`;
      return;
    }

    const frag = document.createDocumentFragment();
    matches.forEach(({ kind, item }) => {
      const card = document.createElement("div");
      card.className = "poster-card focusable";
      card.tabIndex = 0;

      const badge = kind === "vod" ? "🎬 FILME" : kind === "series" ? "🍿 SÉRIE" : "📺 AO VIVO";
      const imgUrl = item.poster || item.logo || "";
      card.innerHTML = `
        <div class="poster-thumb">
          ${imgUrl ? `<img src="${escapeHtml(imgUrl)}" alt="" loading="lazy" onerror="this.style.display='none'" />` : `<span style="font-size:1.6rem;">🎬</span>`}
          <span class="poster-rating">${badge}</span>
        </div>
        <div class="poster-info">
          <div class="poster-title">${escapeHtml(item.name)}</div>
          <div class="poster-meta"><span>${escapeHtml(item.genre || "Catálogo")}</span></div>
        </div>
      `;

      card.addEventListener("click", () => {
        searchModal?.classList.remove("open");
        if (kind === "live") {
          state.currentChannel = item;
          openFullscreenPlayer({
            id: item.id,
            title: `${item.num || ""} - ${item.name}`,
            subtitle: item.epgNow || "TV ao Vivo",
            url: item.url,
            altUrl: item.altUrl,
            type: "live",
            channelObj: item
          });
        } else {
          openMediaDetailsModal(item, kind);
        }
      });

      frag.appendChild(card);
    });
    resultsGrid.appendChild(frag);
  }

  // Initialize DOM Events
  function initApp() {
    loadStateFromStorage();

    // Update top clock
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const el = document.getElementById("top-clock");
      if (el) el.textContent = `${hh}:${mm}`;
    };
    updateClock();
    setInterval(updateClock, 15000);

    // Sidebar Navigation Buttons
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });

    // Top Bar Back to Home
    document.getElementById("btn-top-back-home")?.addEventListener("click", () => {
      switchView("dashboard");
    });

    // Top Bar Force Refresh Catalog Button
    document.getElementById("btn-refresh-catalog")?.addEventListener("click", async () => {
      const activePl = state.playlists.find(p => p.id === state.activePlaylistId);
      if (activePl && activePl.type === "xtream") {
        await idbDelete(`xtream_full_${activePl.id}`);
        await loadXtreamPlaylist(activePl, true);
        showToast("Catálogo atualizado com sucesso!");
      } else if (activePl) {
        await activatePlaylist(activePl.id);
      }
    });

    // Build Smart TV Search Modal On-Screen Keyboard (A-Z, 0-9)
    const searchModal = document.getElementById("modal-tv-search");
    const searchModalInput = document.getElementById("tv-search-modal-input");
    const kbGrid = document.getElementById("tv-keyboard-grid");
    if (kbGrid && searchModalInput) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
      const kFrag = document.createDocumentFragment();
      chars.forEach(ch => {
        const keyBtn = document.createElement("button");
        keyBtn.type = "button";
        keyBtn.className = "tv-kb-key focusable";
        keyBtn.textContent = ch;
        keyBtn.addEventListener("click", () => {
          searchModalInput.value += ch;
          runTvModalSearch(searchModalInput.value);
        });
        kFrag.appendChild(keyBtn);
      });
      kbGrid.appendChild(kFrag);

      document.getElementById("btn-kb-space")?.addEventListener("click", () => {
        searchModalInput.value += " ";
        runTvModalSearch(searchModalInput.value);
      });
      document.getElementById("btn-kb-backspace")?.addEventListener("click", () => {
        searchModalInput.value = searchModalInput.value.slice(0, -1);
        runTvModalSearch(searchModalInput.value);
      });
      document.getElementById("btn-kb-clear")?.addEventListener("click", () => {
        searchModalInput.value = "";
        runTvModalSearch("");
      });
    }

    document.getElementById("btn-open-tv-search")?.addEventListener("click", () => {
      if (!searchModal) return;
      searchModal.classList.add("open");
      if (searchModalInput && !searchModalInput.value) {
        runTvModalSearch("");
      }
      requestAnimationFrame(() => {
        const firstKey = document.querySelector("#tv-keyboard-grid .tv-kb-key");
        if (firstKey) focusTvElement(firstKey);
      });
    });

    document.getElementById("btn-close-tv-search")?.addEventListener("click", () => {
      searchModal?.classList.remove("open");
    });

    // Mini-player actions
    document.getElementById("btn-mini-fullscreen")?.addEventListener("click", () => {
      if (!state.currentChannel) return;
      openFullscreenPlayer({
        id: state.currentChannel.id,
        title: `${state.currentChannel.num} - ${state.currentChannel.name}`,
        subtitle: state.currentChannel.epgNow || "TV ao Vivo",
        url: state.currentChannel.url,
        altUrl: state.currentChannel.altUrl,
        type: "live",
        channelObj: state.currentChannel
      });
    });

    document.getElementById("btn-mini-fav")?.addEventListener("click", () => {
      if (!state.currentChannel) return;
      const id = state.currentChannel.id;
      const idx = state.favorites.live.indexOf(id);
      if (idx === -1) {
        state.favorites.live.push(id);
        showToast(`Canal adicionado aos favoritos!`);
      } else {
        state.favorites.live.splice(idx, 1);
        showToast(`Canal removido dos favoritos.`);
      }
      saveFavoritesToStorage();
      updateSidebarCounts();
      renderLiveView();
    });

    // Fullscreen Cinema OSD Controls (All 8 Buttons + Center Circle + Seek Bar)
    const fsVideo = document.getElementById("fs-video");
    const toggleVideoPlay = () => {
      if (!fsVideo) return;
      if (fsVideo.paused) fsVideo.play().catch(() => {});
      else fsVideo.pause();
      showOsdTemporarily();
    };

    document.getElementById("btn-osd-back")?.addEventListener("click", closeFullscreenPlayer);
    document.getElementById("btn-osd-close")?.addEventListener("click", closeFullscreenPlayer);
    document.getElementById("btn-osd-playpause")?.addEventListener("click", toggleVideoPlay);
    document.getElementById("btn-center-playpause")?.addEventListener("click", toggleVideoPlay);

    // 3rd button (⏮): Previous Episode / Restart on Series, Restart on VOD, or Previous Channel on Live TV
    document.getElementById("btn-osd-ch-prev")?.addEventListener("click", () => {
      if (state.currentPlayingItem?.type === "live") {
        stepLiveChannel(-1);
      } else if (state.currentPlayingItem?.type === "series") {
        if (fsVideo && fsVideo.currentTime > 15) {
          fsVideo.currentTime = 0;
          fsVideo.play().catch(() => {});
          showToast("Reiniciando episódio do início (0:00:00)");
        } else {
          stepSeriesEpisode(-1, false);
        }
      } else if (fsVideo) {
        fsVideo.currentTime = 0;
        fsVideo.play().catch(() => {});
        showToast("Reiniciando do início (0:00:00)");
      }
    });

    // 5th button (⏭): Next Episode on Series, Next Channel on Live TV, or +30s on VOD
    document.getElementById("btn-osd-ch-next")?.addEventListener("click", () => {
      if (state.currentPlayingItem?.type === "series") {
        stepSeriesEpisode(1, false);
      } else if (state.currentPlayingItem?.type === "live") {
        stepLiveChannel(1);
      } else if (fsVideo) {
        fsVideo.currentTime = Math.min(fsVideo.duration || 999999, (fsVideo.currentTime || 0) + 30);
        showToast("Avançando +30s");
      }
    });

    // Quick Next Episode Pill Button (⏭ Próximo Ep.)
    document.getElementById("btn-osd-next-ep-pill")?.addEventListener("click", () => {
      if (state.currentPlayingItem?.type === "series") {
        stepSeriesEpisode(1, false);
      }
    });

    // 6th button (⛶): Aspect Ratio / Screen Mode
    document.getElementById("btn-osd-aspect")?.addEventListener("click", () => {
      const modes = [
        { fit: "contain", label: "Original Stream" },
        { fit: "fill", label: "16:9 Tela Cheia" },
        { fit: "cover", label: "Cinema Zoom" }
      ];
      const curIdx = modes.findIndex(m => m.fit === state.settings.aspectRatio);
      const next = modes[(curIdx + 1) % modes.length];
      state.settings.aspectRatio = next.fit;
      if (fsVideo) fsVideo.style.objectFit = next.fit;
      const aspectLabel = document.getElementById("tech-aspect-label");
      if (aspectLabel) aspectLabel.textContent = next.label;
      showToast(`Formato de Tela: ${next.label}`);
    });

    // 7th button ([AD]): Audio Tracks & Dialogue Boost
    document.getElementById("btn-osd-audio")?.addEventListener("click", () => {
      populateAudioTracksPopover(fsVideo);
      togglePlayerPopover("popover-audio");
    });

    document.getElementById("btn-audio-boost")?.addEventListener("click", () => {
      if (!fsVideo) return;
      try {
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          audioCtx = new AudioContextClass();
          const source = audioCtx.createMediaElementSource(fsVideo);
          gainNode = audioCtx.createGain();
          source.connect(gainNode);
          gainNode.connect(audioCtx.destination);
        }
        audioBoostEnabled = !audioBoostEnabled;
        if (gainNode) gainNode.gain.value = audioBoostEnabled ? 1.8 : 1.0;
        const st = document.getElementById("audio-boost-status");
        if (st) st.textContent = audioBoostEnabled ? "Ativado (180%)" : "Desativado";
        showToast(audioBoostEnabled ? "Reforço de Diálogo (AD) Ativado!" : "Reforço de Diálogo Desativado");
      } catch (_) {
        showToast("Modo de áudio ajustado");
      }
    });

    document.getElementById("btn-audio-mute")?.addEventListener("click", () => {
      if (!fsVideo) return;
      fsVideo.muted = !fsVideo.muted;
      const st = document.getElementById("audio-mute-status");
      if (st) st.textContent = fsVideo.muted ? "Mudo" : "Som Ativo";
    });

    // 8th button ([CC]): Subtitles & External SRT/VTT Loader
    document.getElementById("btn-osd-subtitles")?.addEventListener("click", () => {
      populateSubtitleTracksPopover(fsVideo);
      togglePlayerPopover("popover-subtitles");
    });

    document.getElementById("btn-load-external-sub")?.addEventListener("click", () => {
      document.getElementById("subtitle-file-input")?.click();
    });

    document.getElementById("subtitle-file-input")?.addEventListener("change", e => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        activeSubtitleCues = parseSrtOrVtt(String(reader.result || ""));
        subtitlesEnabled = true;
        showToast(`Legenda "${file.name}" carregada (${activeSubtitleCues.length} falas)!`);
        closeAllPlayerPopovers();
      };
      reader.readAsText(file);
    });

    document.querySelectorAll(".sub-size-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".sub-size-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const subOverlay = document.getElementById("custom-subtitle-overlay");
        if (subOverlay) subOverlay.style.fontSize = btn.dataset.size;
      });
    });

    // 9th button (⚙): Player Settings Gear
    document.getElementById("btn-osd-settings")?.addEventListener("click", () => {
      togglePlayerPopover("popover-settings");
    });

    document.querySelectorAll(".speed-opt-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const spd = parseFloat(btn.dataset.speed || "1");
        if (fsVideo) fsVideo.playbackRate = spd;
        document.querySelectorAll(".speed-opt-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        showToast(`Velocidade: ${spd}x`);
        closeAllPlayerPopovers();
      });
    });

    document.getElementById("btn-toggle-tech-box")?.addEventListener("click", e => {
      const box = document.getElementById("osd-tech-box");
      const lbl = document.getElementById("tech-box-toggle-label");
      if (!box) return;
      const hidden = box.style.display === "none";
      box.style.display = hidden ? "block" : "none";
      e.currentTarget.classList.toggle("active", hidden);
      if (lbl) lbl.textContent = hidden ? "Visível" : "Oculto";
    });

    document.getElementById("btn-switch-stream-ext")?.addEventListener("click", () => {
      if (state.currentPlayingItem && state.currentPlayingItem.altUrl) {
        const oldUrl = state.currentPlayingItem.url;
        state.currentPlayingItem.url = state.currentPlayingItem.altUrl;
        state.currentPlayingItem.altUrl = oldUrl;
        attachStreamToVideo(fsVideo, state.currentPlayingItem.url, state.currentPlayingItem.altUrl, true, 0);
        showToast("Formato de fluxo alternado (.m3u8 ⇄ .ts)!");
      } else {
        showToast("Reproduzindo no formato nativo original do servidor.");
      }
      closeAllPlayerPopovers();
    });

    // Interactive Seek Bar Click
    document.getElementById("osd-progress-wrap")?.addEventListener("click", e => {
      if (!fsVideo || !fsVideo.duration || !isFinite(fsVideo.duration)) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      fsVideo.currentTime = ratio * fsVideo.duration;
    });

    if (fsVideo) {
      let lastSavedSec = -1;
      fsVideo.addEventListener("play", () => syncPlayPauseIcons(false));
      fsVideo.addEventListener("pause", () => {
        syncPlayPauseIcons(true);
        persistActiveVideoProgress();
        showOsdTemporarily(15000);
      });
      fsVideo.addEventListener("ended", () => {
        if (state.isFullscreen && state.currentPlayingItem?.type === "series") {
          stepSeriesEpisode(1, true);
        }
      });
      fsVideo.addEventListener("loadedmetadata", () => {
        updateTechBoxInfo(fsVideo, state.currentPlayingItem?.title);
      });
      fsVideo.addEventListener("timeupdate", () => {
        const curFloor = Math.floor(fsVideo.currentTime || 0);
        if (curFloor > 0 && curFloor !== lastSavedSec && curFloor % 3 === 0) {
          lastSavedSec = curFloor;
          persistActiveVideoProgress();
        }

        const fill = document.getElementById("osd-progress-fill");
        const timeLabel = document.getElementById("osd-time-label");
        if (fsVideo.duration && isFinite(fsVideo.duration)) {
          const pct = Math.min(100, (fsVideo.currentTime / fsVideo.duration) * 100);
          if (fill) fill.style.width = `${pct}%`;
          if (timeLabel) {
            timeLabel.textContent = `${formatPlayerTimestamp(fsVideo.currentTime)} / ${formatPlayerTimestamp(fsVideo.duration)}`;
          }
        } else if (timeLabel) {
          timeLabel.textContent = `${formatPlayerTimestamp(fsVideo.currentTime)} / AO VIVO`;
        }

        // Render active custom subtitle cue if enabled
        const subOverlay = document.getElementById("custom-subtitle-overlay");
        if (subOverlay && subtitlesEnabled && activeSubtitleCues.length > 0) {
          const t = fsVideo.currentTime;
          const cue = activeSubtitleCues.find(c => t >= c.start && t <= c.end);
          if (cue) {
            subOverlay.innerHTML = cue.text;
            subOverlay.style.display = "block";
          } else {
            subOverlay.style.display = "none";
          }
        }
      });
    }

    // Add Playlist Modal Handlers
    const addModal = document.getElementById("modal-add-playlist");
    document.getElementById("btn-open-add-playlist")?.addEventListener("click", () => {
      addModal?.classList.add("open");
      document.getElementById("xt-name")?.focus();
    });
    document.getElementById("btn-close-add-playlist")?.addEventListener("click", () => {
      addModal?.classList.remove("open");
    });

    document.getElementById("tab-btn-xtream")?.addEventListener("click", () => {
      document.getElementById("form-xtream").style.display = "flex";
      document.getElementById("form-m3u").style.display = "none";
      document.getElementById("tab-btn-xtream").classList.add("btn-primary");
      document.getElementById("tab-btn-m3u").classList.remove("btn-primary");
    });

    document.getElementById("tab-btn-m3u")?.addEventListener("click", () => {
      document.getElementById("form-xtream").style.display = "none";
      document.getElementById("form-m3u").style.display = "flex";
      document.getElementById("tab-btn-m3u").classList.add("btn-primary");
      document.getElementById("tab-btn-xtream").classList.remove("btn-primary");
    });

    document.getElementById("btn-save-xtream")?.addEventListener("click", async () => {
      const name = document.getElementById("xt-name").value.trim() || "Minha Lista IPTV";
      const serverUrl = document.getElementById("xt-server").value.trim();
      const username = document.getElementById("xt-user").value.trim();
      const password = document.getElementById("xt-pass").value.trim();

      if (!serverUrl || !username || !password) {
        showToast("Preencha a URL do Servidor, Usuário e Senha.");
        return;
      }

      const newPl = {
        id: "pl-" + Date.now(),
        name,
        type: "xtream",
        serverUrl,
        username,
        password
      };

      state.playlists.push(newPl);
      savePlaylistsToStorage();
      addModal?.classList.remove("open");
      await activatePlaylist(newPl.id);
    });

    document.getElementById("btn-save-m3u")?.addEventListener("click", async () => {
      const name = document.getElementById("m3u-name").value.trim() || "Lista M3U";
      const m3uUrl = document.getElementById("m3u-url").value.trim();

      if (!m3uUrl) {
        showToast("Informe a URL da lista M3U / M3U8.");
        return;
      }

      const newPl = {
        id: "pl-" + Date.now(),
        name,
        type: "m3u",
        m3uUrl
      };

      state.playlists.push(newPl);
      savePlaylistsToStorage();
      addModal?.classList.remove("open");
      await activatePlaylist(newPl.id);
    });

    // Settings Handlers
    const fmtSelect = document.getElementById("setting-live-format");
    if (fmtSelect) {
      fmtSelect.value = state.settings.liveFormat;
      fmtSelect.addEventListener("change", e => {
        state.settings.liveFormat = e.target.value;
        saveSettingsToStorage();
        showToast(`Formato de stream alterado para ${state.settings.liveFormat.toUpperCase()}`);
      });
    }

    document.getElementById("btn-clear-history")?.addEventListener("click", () => {
      state.history = {};
      saveHistoryToStorage();
      renderDashboard();
      showToast("Histórico de reprodução limpo.");
    });

    window.addEventListener("keydown", handleRemoteKeydown);
    window.addEventListener("mousemove", () => {
      if (state.isFullscreen) showOsdTemporarily();
    });

    // Activate initial playlist and start companion sync
    activatePlaylist(state.activePlaylistId);
    syncRemoteCompanionPlaylists();
    setInterval(syncRemoteCompanionPlaylists, 5000);
  }

  document.addEventListener("DOMContentLoaded", initApp);
})();
