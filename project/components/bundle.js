/* @ds-bundle: {"format":4,"namespace":"HG","components":[]} */
/* Hossam Gouraan — template helpers. Plain classic script, no dependencies.
   HG.ab(w,h,scale,inner)           -> artboard wrapper (native px, scaled for display)
   HG.portrait(opts)                -> an <img> placed by the head, not by the file
   HG.thumb(opts)                   -> a 1280x720 thumbnail from the A / B / C templates
   HG.mount(selector, html)         -> write html into an element */
(function () {
  var P = {
    // head data as fractions of the source frame (1122x1402): face centre x, top of hair, chin
    p1: { src: "/_blob/73a3a50a4089a4f7b666b7a7a5cd0112", cut: "/_blob/c95942c645ef177c3958775b1b87024e", fx: 0.425, ft: 0.07, fc: 0.36, pose: "seated, low, close" },
    p2: { src: "/_blob/6dbfcff196b5578a2989a13d20b99fae", cut: "/_blob/4d78e97189eadc0c129718d753181125", fx: 0.617, ft: 0.145, fc: 0.345, pose: "standing, waist-up" },
    p3: { src: "/_blob/5c3cf073d9123870dccf5570c21cf41e", cut: "/_blob/0d072d189c827d827d06fc2b750e84d5", fx: 0.607, ft: 0.207, fc: 0.43, pose: "seated on stool, light beam" }
  };
  var RATIO = 1402 / 1122;

  function ab(w, h, s, inner, cls) {
    return '<div class="hg-ab ' + (cls || '') + '" style="--w:' + w + ';--h:' + h + ';--s:' + s + '"><div class="hg-c">' + inner + '</div></div>';
  }

  /* opts: photo, w, h (box), head (head height as fraction of box h), top (head top as fraction of box h),
     cx (face centre as fraction of box w), cut (use cut-out), cover (clamp to fill box), x,y (box offset), extra class */
  function portrait(o) {
    var p = P[o.photo || 'p2'];
    var headPx = (o.head || 0.4) * o.h;
    var W = headPx / ((p.fc - p.ft) * RATIO);
    var H = W * RATIO;
    var left = (o.cx == null ? 0.5 : o.cx) * o.w - p.fx * W;
    var top = (o.top == null ? 0.12 : o.top) * o.h - p.ft * H;
    if (o.cover !== false && !o.cut) {
      if (W < o.w) { W = o.w; H = W * RATIO; }
      if (H < o.h) { H = o.h; W = H / RATIO; }
      left = Math.min(0, Math.max(o.w - W, left));
      top = Math.min(0, Math.max(o.h - H, top));
    }
    if (o.cut && top + H < o.h) top = o.h - H; // a cut-out never floats: it always meets the bottom edge
    var img = '<img class="ph ' + (o.cls || '') + '" alt="Hossam Gouraan" src="' + (o.cut ? p.cut : p.src) + '" style="width:' + W.toFixed(1) + 'px;left:' + left.toFixed(1) + 'px;top:' + top.toFixed(1) + 'px">';
    if (o.box === false) return img;
    return '<div class="frame-clip" style="left:' + (o.x || 0) + 'px;top:' + (o.y || 0) + 'px;width:' + o.w + 'px;height:' + o.h + 'px;' + (o.bg ? 'background:var(--' + o.bg + ')' : '') + '">' + img + '</div>';
  }

  /* Thumbnail system, 1280x720.
     tpl A: Field right (56%), portrait left      — default
     tpl B: portrait right, Field left (56%)
     tpl C: flat blue ground, large cut-out, type beside the head (close crop)
     opts: photo, field ('black'|'blue'), lines (array of html), size (px), tab (text), label (html, optional outline tag) */
  function thumb(o) {
    var W = 1280, H = 720, M = 48, tpl = o.tpl || 'A';
    var field = o.field || 'black';
    var size = o.size || 170;
    var fw = Math.round(W * 0.56), pw = W - fw;
    var head = '<h1 class="d" style="font-size:' + size + 'px">' + o.lines.join('<br>') + '</h1>';
    var tab = o.tab ? '<div style="position:absolute;top:' + M + 'px;right:' + M + 'px;font-size:24px"><span class="tab' + (field === 'black' ? ' b' : '') + '">' + o.tab + '</span></div>' : '';
    var label = o.label ? '<div style="margin-top:22px;font-size:26px">' + o.label + '</div>' : '';
    var html = '';
    if (tpl === 'A' || tpl === 'B') {
      var fx = tpl === 'A' ? 'right:0' : 'left:0';
      var px = tpl === 'A' ? 0 : fw;
      html += portrait({ photo: o.photo, w: pw, h: H, x: px, y: 0, head: o.head || 0.46, top: o.top || 0.1, cx: o.cx || 0.5, cls: o.imgcls });
      var tabPos = tpl === 'A' ? 'right:' + M + 'px' : 'right:' + (pw + M) + 'px';
      html += '<div class="f f-' + field + '" style="' + fx + ';width:' + fw + 'px"></div>';
      html += '<div style="position:absolute;' + (tpl === 'A' ? 'right:' + M + 'px' : 'right:' + (pw + 40) + 'px') + ';width:' + (fw - M - 40) + 'px;bottom:' + (o.bottom || 92) + 'px;' + (field === 'blue' ? '' : '') + '" class="' + (field === 'blue' ? 'on-blue' : '') + '">' + head + label + '</div>';
      if (o.tab) html += '<div style="position:absolute;top:' + M + 'px;' + tabPos + ';font-size:24px"><span class="tab' + (field === 'black' ? ' b' : '') + '">' + o.tab + '</span></div>';
    } else {
      html += '<div class="f f-blue" style="left:0;right:0"></div>';
      html += portrait({ photo: o.photo, cut: true, w: W, h: H, head: o.head || 0.56, top: o.top || 0.08, cx: o.cx || 0.21, box: false });
      html += '<div class="on-blue" style="position:absolute;right:' + M + 'px;width:' + (o.tw || 600) + 'px;bottom:' + (o.bottom || 92) + 'px">' + head + label + '</div>';
      if (o.tab) html += '<div style="position:absolute;top:' + M + 'px;right:' + M + 'px;font-size:24px"><span class="tab">' + o.tab + '</span></div>';
    }
    return html;
  }

  /* shrink every [data-fit] / .d line until it fits its box (display lines never wrap) */
  function fit(root) {
    var els = (root || document).querySelectorAll('.hg-c .d, .hg-c [data-fit]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], box = el.parentNode, n = 0;
      if (!box.style.width && !box.hasAttribute('data-box')) continue;
      el.style.whiteSpace = 'nowrap';
      if (!el.dataset.fs) el.dataset.fs = parseFloat(getComputedStyle(el).fontSize);
      var fs = +el.dataset.fs; el.style.fontSize = fs + 'px';
      while (el.scrollWidth > box.clientWidth + fs * 0.12 && n < 60) { fs *= 0.97; el.style.fontSize = fs + 'px'; n++; }
    }
  }

  /* ---------- MASTER: the 100 Journey grid ----------
     5 rows x 20 = the five 20-episode horizons of the core journey (Master Strategy §12).
     o: done (episodes published), cell (px), gap (px), ground ('dark'|'blue'), rows (default 5), label (bool) */
  function journey(o) {
    o = o || {}; var n = o.done || 0, c = o.cell || 16, g = o.gap == null ? Math.round(c * 0.375) : o.gap, rows = o.rows || 5, out = '';
    var onBlue = o.ground === 'blue';
    out += '<div class="jg" style="display:grid;grid-template-columns:repeat(20,' + c + 'px);gap:' + g + 'px;direction:rtl">';
    for (var i = 1; i <= rows * 20; i++) {
      var st = i < n ? 'done' : (i === n ? 'now' : 'next');
      var bg = st === 'done' ? (onBlue ? 'var(--black)' : 'var(--brand-blue)') : st === 'now' ? 'var(--white)' : 'transparent';
      var bd = st === 'next' ? (onBlue ? 'var(--brand-blue-deep)' : 'var(--grey-700)') : bg;
      out += '<span style="width:' + c + 'px;height:' + c + 'px;background:' + bg + ';box-shadow:inset 0 0 0 ' + Math.max(1, Math.round(c / 10)) + 'px ' + bd + '"></span>';
    }
    return out + '</div>';
  }

  /* ---------- asset templates (native size; wrap with HG.ab) ---------- */
  var A = {};
  A.journey = journey;
  var SCHEDULE = 'كل خميس · 8 م بتوقيت القاهرة';
  // 1080x1350 carousel cover. o: ground, lines, tab, photo, topic
  A.carouselCover = function (o) {
    var g = o.ground || 'black', ob = g === 'blue' ? ' on-blue' : '';
    var h = '<div class="f f-' + g + '" style="left:0;right:0"></div>';
    if (o.photo) h += portrait({ photo: o.photo, w: 1080, h: 620, head: 0.5, top: 0.12, cx: 0.5 });
    h += '<div class="' + ob + '" style="position:absolute;top:64px;right:64px;font-size:28px"><span class="tab' + (g === 'blue' ? '' : ' b') + '">' + (o.tab || '01 / 06') + '</span></div>';
    h += '<div class="' + ob + '" style="position:absolute;right:64px;left:64px;' + (o.photo ? 'top:690px' : 'top:470px') + '"><h1 class="d" style="font-size:' + (o.size || 132) + 'px;line-height:1.2">' + o.lines.join('<br>') + '</h1></div>';
    h += '<div class="mono" style="position:absolute;left:64px;bottom:64px;font-size:22px;color:' + (g === 'blue' ? 'var(--white)' : 'var(--grey-400)') + '">HOSSAM GOURAAN · ' + (o.topic || 'NOTES') + '</div><div class="mono" style="position:absolute;right:64px;bottom:64px;font-size:22px;color:' + (g === 'blue' ? 'var(--white)' : 'var(--grey-400)') + '">←</div>';
    return h;
  };
  // 1080x1350 quote (others' words, navy) or insight (Hossam's own line)
  A.card = function (o) {
    var g = o.ground || (o.quote ? 'navy' : 'black');
    var h = '<div class="f f-' + g + '" style="left:0;right:0"></div>';
    if (o.tab) h += '<div class="' + (g === 'blue' ? 'on-blue' : '') + '" style="position:absolute;top:64px;right:64px;font-size:28px"><span class="tab' + (g === 'blue' ? '' : ' b') + '">' + o.tab + '</span></div>';
    h += '<div class="' + (g === 'blue' ? 'on-blue' : '') + '" style="position:absolute;right:64px;left:64px;top:' + (o.top || (o.quote ? 280 : 380)) + 'px">';
    if (o.quote) h += '<div class="d" style="font-size:300px;line-height:.5;color:var(--brand-blue-bright)">”</div>';
    h += '<h1 class="' + (o.quote ? 'd8' : 'd') + '" style="font-size:' + (o.size || 88) + 'px;line-height:1.35;margin-top:' + (o.quote ? 40 : 0) + 'px">' + o.text + '</h1>';
    if (o.by) h += '<div class="t" style="margin-top:40px;font-size:34px;font-weight:700">' + o.by + '</div>';
    h += '</div><div class="mono" style="position:absolute;left:64px;bottom:64px;font-size:22px;color:' + (g === 'blue' ? 'var(--white)' : 'var(--grey-400)') + '">@GOURAAN</div><div class="' + (g === 'blue' ? 'on-blue' : '') + '" style="position:absolute;right:64px;bottom:56px"><div class="d" style="font-size:34px">حسام جعران<span class="stop"></span></div></div>';
    return h;
  };
  // 1080x1350 table card (evidence / comparison)
  A.table = function (o) {
    var h = '<div class="f f-paper" style="left:0;right:0"></div><div style="position:absolute;top:64px;right:64px;font-size:28px"><span class="tab">' + (o.tab || 'TABLE') + '</span></div>';
    h += '<div style="position:absolute;right:64px;left:64px;top:200px"><h1 class="d" style="font-size:' + (o.size || 72) + 'px;line-height:1.25">' + o.title + '</h1>';
    h += '<div style="margin-top:50px;border-top:6px solid var(--ink-900)">';
    o.rows.forEach(function (r, i) {
      h += '<div style="display:grid;grid-template-columns:' + (o.cols || '1fr 1fr') + ';gap:30px;padding:26px 0;border-bottom:' + (i === 0 ? '3px solid var(--ink-900)' : '2px solid var(--grey-200)') + ';font-family:var(--font-ar-text);font-size:' + (i === 0 ? 26 : 34) + 'px;font-weight:' + (i === 0 ? 700 : 500) + ';color:' + (i === 0 ? 'var(--grey-500)' : 'var(--ink-900)') + '">';
      r.forEach(function (c) { h += '<div>' + c + '</div>'; });
      h += '</div>';
    });
    h += '</div></div><div class="mono" style="position:absolute;left:64px;bottom:64px;font-size:20px;color:var(--grey-500)">' + (o.source || 'SOURCE — NAME, YEAR') + '</div>';
    return h;
  };
  // 1080x1920 reel cover
  A.reel = function (o) {
    if (!o.photo) return '<div class="f f-blue" style="left:0;right:0"></div><div class="on-blue" style="position:absolute;top:320px;right:64px;font-size:34px"><span class="tab">' + o.tab + '</span></div><div class="on-blue" style="position:absolute;right:64px;left:64px;top:760px"><h1 class="d" style="font-size:' + (o.size || 150) + 'px;line-height:1.18">' + o.lines.join('<br>') + '</h1></div>';
    return portrait({ photo: o.photo, w: 1080, h: 1100, head: 0.3, top: 0.26, cx: 0.55 }) + '<div class="f f-black" style="top:1000px;left:0;right:0"></div><div style="position:absolute;top:320px;right:64px;font-size:34px"><span class="tab b">' + o.tab + '</span></div><div style="position:absolute;right:64px;left:64px;top:1060px"><h1 class="d" style="font-size:' + (o.size || 136) + 'px;line-height:1.18">' + o.lines.join('<br>') + '</h1></div>';
  };
  // 2560x1440 YouTube banner — master: name, role, journey, schedule. No tagline.
  A.ytBanner = function (o) {
    o = o || {};
    return '<div class="f f-black" style="left:0;right:0"></div>' + portrait({ photo: 'p3', cut: true, w: 1500, h: 1440, head: 0.3, top: 0.3, cx: 0.62, box: false }) +
      '<div class="f f-blue" style="right:0;width:1180px"></div><div class="on-blue" style="position:absolute;right:560px;top:540px;width:600px"><h1 class="d" style="font-size:118px;line-height:1.1">حسام جعران<span class="stop"></span></h1><div class="mono" style="font-size:24px;margin-top:22px;color:var(--white);text-align:right">BUILDER · OPERATOR · RESEARCHER</div><div style="margin-top:40px;display:flex;justify-content:flex-end">' + journey({ done: o.done || 4, cell: 17, gap: 6, ground: 'blue' }) + '</div><div class="t" style="font-size:28px;font-weight:600;margin-top:22px;text-align:right">' + SCHEDULE + '</div></div>';
  };
  // 851x315 Facebook cover
  A.fbCover = function (o) {
    o = o || {};
    return '<div class="f f-black" style="left:0;right:0"></div>' + portrait({ photo: 'p1', w: 320, h: 315, x: 105, y: 0, head: 0.62, top: 0.1, cx: 0.5 }) + '<div class="f f-blue" style="left:0;width:105px"></div><div style="position:absolute;right:126px;top:64px;width:300px"><h1 class="d" style="font-size:50px;line-height:1.15">حسام جعران<span class="stop"></span></h1><div class="mono" style="font-size:11px;margin-top:12px;color:var(--grey-400);text-align:right">BUILDER · OPERATOR · RESEARCHER</div><div style="margin-top:20px;display:flex;justify-content:flex-end">' + journey({ done: o.done || 4, cell: 8, gap: 3 }) + '</div><div class="t" style="font-size:13px;font-weight:600;margin-top:12px;text-align:right">' + SCHEDULE + '</div></div>';
  };
  // 1584x396 LinkedIn cover — English lead, factual
  A.liCover = function (o) {
    o = o || {};
    return '<div class="f f-navy" style="left:0;right:0"></div><div class="f f-blue" style="left:0;width:560px"></div>' + portrait({ photo: 'p2', cut: true, w: 560, h: 396, head: 0.5, top: 0.12, cx: 0.5, box: false }) + '<div style="position:absolute;left:640px;top:70px;direction:ltr"><div class="en" style="font-size:68px">Hossam Gouraan</div><div class="mono" style="font-size:18px;margin-top:14px;color:var(--brand-blue-soft)">BUILDER · OPERATOR · RESEARCHER</div><div class="ent" style="font-size:24px;margin-top:26px;color:var(--white)">100 weekly episodes on work, business, systems and decisions.</div><div style="margin-top:22px">' + journey({ done: o.done || 4, cell: 10, gap: 4 }).replace('direction:rtl', 'direction:ltr') + '</div></div>';
  };
  // 1440x900 website hero — master
  A.web = function (o) {
    o = o || {};
    return '<div class="f f-black" style="left:0;right:0"></div><div class="f f-blue" style="left:0;width:560px"></div>' + portrait({ photo: 'p3', cut: true, w: 560, h: 900, head: 0.3, top: 0.24, cx: 0.55, box: false }) +
      '<div style="position:absolute;left:0;right:0;top:0;height:96px;display:flex;align-items:center;justify-content:space-between;padding:0 64px"><div class="d" style="font-size:34px">حسام جعران<span class="stop"></span></div><div class="t" style="display:flex;gap:40px;font-size:18px;font-weight:600"><span>الحلقات</span><span>المواسم</span><span>المصادر</span><span>عنّي</span><span class="mono" style="font-size:14px;color:var(--grey-400)">EN</span></div></div>' +
      '<div style="position:absolute;right:64px;width:720px;top:200px"><div class="mono" style="font-size:15px;color:var(--brand-blue-bright);text-align:right">BUILDER · OPERATOR · RESEARCHER</div><h1 class="d" style="font-size:96px;line-height:1.15;margin-top:26px">100 حلقة.<br>كل أسبوع <span class="mk">سؤال</span>.</h1><p class="t" style="font-size:20px;line-height:1.8;color:var(--grey-400);margin-top:26px;max-width:600px">رحلة أسبوعية في الشغل والبيزنس والأنظمة والقرارات — بالبحث والتجربة والسياق، مش بالوصفات الجاهزة.</p>' +
      '<div style="margin-top:36px;display:flex;justify-content:flex-end">' + journey({ done: o.done || 4, cell: 18, gap: 7 }) + '</div><div style="display:flex;justify-content:space-between;margin-top:14px"><span class="mono" style="font-size:13px;color:var(--grey-400)">' + String(o.done || 4).padStart(2, '0') + ' / 100</span><span class="t" style="font-size:15px;font-weight:600;color:var(--grey-400)">' + SCHEDULE + '</span></div></div>';
  };
  // 1920x1080 season cover (Season 01 layer on master frame)
  A.seasonCover = function () {
    return '<div class="f f-black" style="left:0;right:0"></div>' + portrait({ photo: 'p3', w: 760, h: 1080, x: 0, head: 0.36, top: 0.16, cx: 0.55 }) + '<div class="f f-blue" style="right:0;width:1160px"></div><div class="on-blue" style="position:absolute;right:96px;top:96px;font-size:30px"><span class="tab">S01 · 01—20 / 100</span></div><div class="on-blue" style="position:absolute;right:96px;width:970px;top:280px"><div class="t" style="font-size:40px;font-weight:700">الموسم الأول</div><h1 class="d" style="font-size:210px;line-height:1.15;margin-top:6px">تكسير<br><span class="s brk">المسلّمات</span></h1></div><div class="on-blue" style="position:absolute;right:96px;bottom:96px"><div class="d" style="font-size:48px">حسام جعران<span class="stop"></span></div></div>';
  };
  // 1920x1080 in-video graphics (master)
  A.vg = function (k) {
    var head = portrait({ photo: 'p2', w: 1920, h: 1080, head: 0.42, top: 0.14, cx: 0.34 });
    if (k === 'keyword') return head + '<div style="position:absolute;right:96px;top:420px;background:var(--brand-blue);padding:10px 34px 24px"><h1 class="d" style="font-size:120px">الـBottleneck</h1></div>';
    if (k === 'lower') return head + '<div style="position:absolute;right:96px;bottom:120px;display:flex;align-items:stretch"><div style="background:var(--black);padding:20px 34px"><div class="d" style="font-size:52px">حسام جعران<span class="stop"></span></div></div><div style="background:var(--brand-blue);padding:0 26px;display:flex;align-items:center"><span class="mono" style="font-size:24px">04 / 100</span></div></div>';
    if (k === 'statement') return '<div class="f f-black" style="left:0;right:0"></div><div style="position:absolute;right:96px;left:260px;top:320px"><h1 class="d" style="font-size:112px;line-height:1.25">المشكلة مش إن عندك قرارات كتير.<br>المشكلة إن <span class="mk">كل قرار</span> لازم يعدي عليك.</h1></div>';
    if (k === 'stat') return '<div class="f f-black" style="left:0;right:0"></div><div class="num" style="position:absolute;left:96px;top:170px;font-size:520px;color:var(--brand-blue)">00%</div><div style="position:absolute;right:96px;width:640px;top:300px"><h1 class="d8" style="font-size:66px;line-height:1.35">[الرقم ومعناه كما ورد في المصدر]</h1></div><div class="mono" style="position:absolute;right:96px;bottom:96px;font-size:22px;color:var(--grey-400)">SOURCE — STUDY / REPORT, YEAR · SCOPE</div>';
    if (k === 'chapter') return '<div class="f f-black" style="left:0;right:0"></div><div class="num" style="position:absolute;right:96px;top:96px;font-size:300px;color:var(--brand-blue)">02</div><div style="position:absolute;right:96px;left:96px;bottom:150px;border-top:6px solid var(--white);padding-top:36px"><h1 class="d" style="font-size:130px">إيه اللي بيحصل فعلًا؟</h1></div>';
    if (k === 'question') return '<div class="f f-blue" style="left:0;right:0"></div><div class="on-blue" style="position:absolute;right:96px;top:96px;font-size:28px"><span class="tab">سؤال</span></div><div class="on-blue" style="position:absolute;right:96px;left:260px;top:360px"><h1 class="d" style="font-size:132px;line-height:1.2">قبل ما تقول الموظف<br>مش عايز يشتغل، راجعت إيه؟</h1></div>';
    if (k === 'revised') return head + '<div style="position:absolute;right:96px;top:300px;width:860px;background:var(--black)"><div style="display:flex;justify-content:space-between;align-items:center;padding:22px 34px;border-bottom:2px solid var(--grey-700)"><span class="mono" style="font-size:22px;color:var(--brand-blue-bright)">REVISED · FROM 07 / 100</span><span class="t" style="font-size:24px;font-weight:600;color:var(--grey-400)">حلقة 07</span></div><div style="padding:28px 34px 36px"><div class="t" style="font-size:30px;font-weight:600;color:var(--grey-400)">كنت شايفها بشكل مختلف:</div><h1 class="d" style="font-size:72px;line-height:1.3;margin-top:14px">اللي اتغيّر في فهمي هو <span class="mk">السياق</span></h1></div></div>';
    if (k === 'next') return '<div class="f f-black" style="left:0;right:0"></div><div style="position:absolute;left:96px;top:250px;width:760px;height:428px;border:3px solid var(--grey-700)"></div><div class="mono" style="position:absolute;left:120px;top:274px;font-size:20px;color:var(--grey-400)">YOUTUBE END SCREEN</div><div style="position:absolute;right:96px;width:780px;top:230px"><div class="t" style="font-size:34px;font-weight:600;color:var(--grey-400)">السؤال الجاي</div><h1 class="d" style="font-size:96px;margin-top:20px;line-height:1.25">لو إنت نفسك<br>جزء من المشكلة؟</h1></div><div style="position:absolute;right:96px;bottom:96px;display:flex;align-items:center;gap:30px"><span class="mono" style="font-size:22px;color:var(--grey-400)">05 / 100</span><div class="d" style="font-size:52px">حسام جعران<span class="stop"></span></div></div>';
    return head;
  };

  /* 12-column overlay for grid diagrams */
  function grid(w, h, m, cols, gut) {
    cols = cols || 12; gut = gut == null ? 24 : gut;
    var cw = (w - 2 * m - (cols - 1) * gut) / cols, out = '';
    for (var i = 0; i < cols; i++) out += '<div style="position:absolute;top:0;bottom:0;left:' + (m + i * (cw + gut)).toFixed(1) + 'px;width:' + cw.toFixed(1) + 'px;background:rgba(255,255,255,.10);border-left:1px solid rgba(255,255,255,.25);border-right:1px solid rgba(255,255,255,.25)"></div>';
    out += '<div class="sz" style="left:' + m + 'px;top:' + m + 'px;right:' + m + 'px;bottom:' + m + 'px"></div>';
    return out;
  }
  function mount(sel, html) { var el = document.querySelector(sel); if (el) { el.innerHTML = html; fit(el); if (document.fonts) document.fonts.ready.then(function () { fit(el); }); } }

  window.HG = { journey: journey, assets: A, photos: P, ab: ab, portrait: portrait, thumb: thumb, mount: mount, fit: fit, grid: grid };
})();
