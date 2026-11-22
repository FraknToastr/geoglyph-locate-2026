
(() => {
  "use strict";
  const MAGIC_EYE_PAYLOAD = "1Q~ktM0RxXPjE@a)'dJE.ZK+xM8/bw#sM\"}6VLQNg67]j*3Y>W\\w*T,d&n0za$z.?S!E>86$Tv3)28t=&}(KH}1e4Lhx@$!nGLE4<MWJ}5:]5=ut5x[!O#X1>I@Sxa4l$V;J*`c7r;)$;YEY^NHu3;,F!5*2*N=?!#R5\\1)K:[fs6V'Ja7jK#*l&&:*@%&sQ0M1=$(D0*@32<{?>p,g37:N'*05'm37,?M\":@\\Y7`3lEgl56'jg-H;4D1EHVM@<FjW_>JDNHxyS}f,!?q-n0+g-@m;,o;*=0o6E!o?T`&6.{uS4OYPn$7~A;|tO'/+|D3S@qtd'*e)\"O#$1V\\8uN6Z2_03+)C?=4Z6HF'1:&+t*]98C6l+oWG[1@OOMn>ub2<Us#?MoZ4$(g$9@td;Y\\Uxi6s^QB`^-:1%f*RFRwVg\"6\\I?1uk41+34n4.&2^1:z\"2$>:=MwLSS7%/>!#_;@z0$m{q2QH--_x{7>8;+X;i+4a6-4B+!!i7)\\+o2)Ky7(_=4V?x#>39!uYxn7<7a9\"fO3+b.|<;*E~Y(}MY'.6E[L`0i\\>Hx2&,Yx`qtat82[5ug9]&$!!XO7'k<*@&81b<hl0N!$M+Assq&,1%p}j:Bv7(I'$$)3?\\I'))ca?4EI-~NkB91f74FHt-66I8{-:Mnn'(J4f@E%6|$1)6E$D%<;0cS$<9:vG8d[:sP-4(.aJ$ED%q6%|?)k6Y'=]o,':<-`B@RF<'%:i$al+?n7wYY2ZeSG~):]QF)V!\"}eu}\\W%Gw,33bv?U)%m:9!KY_%i|L6y#{9K@>&*KtO8/{v)i0$]PQSi,-,n#19g9)33&7dj!+8~z7.M='od=k*f0?T!##8zS03R8=0/TO@X\"6?k9FQ69L&\"\\k'H>M.)27/bs!!bE+I7\\29OQ^i0(`I3,8]_\\5758+M_g;+T0Yi0'Q)3#76)6oA3;\\'I;)\"h:Ky>s|/K%9;7^0)F&,\"cAS685|X0Nq6#tBK(>N/drP%R#dy9M!9%=:.h[$a.2N@Hph0c?H7|pq69/m|gr::5on5k1aFi@**?hL+=x$7=~{6aR+&W/-,.TaJ!3=8v'ELJ+4OVYTT6$=0>88CX.$eI.OX[5e(toA.LGa')a,B?:F4\\Lw1RD)<>I75?5u0!Yj4+=3+a157sj'KMN-6.6xg\\{t36o3oL3We4]uxw#'G5IS=y9)#Av)!=3)-Z5+q$;*!f*i=J3mD?9/l@8ef==e!L6!$qY.24+_770'5esI,U$0X+/9Nk2xT@x!+)O`0\"0iqt<6n>CQ_Myv)G;ycts1[y4nF@S@<[H[K4!0\\!Z=%p772(1??eYMoHsBC&}i\":XKp.&}yg3?D%!:?.d|$*(*d&mz9SVM*OH:>$A]3?,k6+S/v!?!C6xg.?tCa0!TL5,<EFM(P)B=`;4m34Cg.Lq9BKt'y>D\"I0>cRUzJmeO2P54@*'@s6Y8@o;hs)Q/#Y@5@~_1e%>|&!$.#'.+E4QG&HPu%p1sb'!hbdd+w/^?!R*6*\\E:A3&c,F58=94S*{2vTi(TbQ#T5\\]:]\\UEV?\"?!0u:(%79j7DL!7cvm4@8Z4!8<cCS;(3;/;%C+kdgpz^|Z)|/ikB4<F:0'1,;^(?1BMC32.'B@fs##$g<x&*C*KxPF^gIpUP64A<~f?0&$)-*7:#I=s&?3&6T!p>JC2QMQ$8@N;,)?z_2V!,S9+#1=&i%22#)9{%W;#5|I&8b8ZE_<fOPk5L(qIdOJk?&e)wqr~&(nrf.?a80wG@k%&7;X\"\"(s+*M0=4!&M1?.#*+G`a(:2`6.A<@A\"]69K)@NIad;~,^KD$am:<.NV2z7B2*4961oA0xqJ+X&)|`vi~#$1u35n!8dG4<?|He+L,^6\".%SUHm):=+1_Dk9e4)+y),-$ez$K97=HB+4Urf;!.1=l,tL6>l+~-{x=54X.4;9*:j<%p(rhrz:;/I1>{78;kA9Wl56nWt9<B/q-q\\Y:fzvzvRu}'C,n%;8?r*/n\"]8#K3]iPBRJn)V){4i\"O(d4lCOWYL5@+4&Bn?,TdN&2^#!Fb-j/O3c\\s0%x|<?}x!\\F7C-61$IN11iK;@3\\:[f3,au\"|\"<A!heg(#ZG.G/T-+i}]<!,9|*|63xmC<#hH+;Kb84i$8c2^^i7+E?dOu8.%\"@!.BJ7!9i.to@~C/*?{Z#t2:lu,(FJ/3U7%1$#u`k~\"Qhiu^W-<P<T0+5l[xWsex0?H|=\"'D\"lPCq?0q|~}B.0+)`,TZ4Fr5!><~}j6\"6T.,3aJ@#D6>G^4VZ!>4x1\"%6`@(xI$4V_r8;?dOgQB;1<n'==&O?9qKJm4S-O+@o!bDjQH9[Vo]`U#c?j!?)|cJa7e*;P^S;j*-fSi?@$f1VD6p2#+(:%Z~ziuUS#\\iWz;pI=lgk8$EE13Ui(Q2U;/a([V-:@,%T{lV=\\HA`[:\"7.a%j:a>8;=CsAW&\"ih6$)N$j+>=n9r*\\ixsL-vlU-_qc=yk*t>W'cX::n!G$)$XW}RH5$6iS!]e*4n9g}p)8!?=.?:4:m[k`|d?M@'%to[m'[7,'>*10q)+V@.#b7`mbf8b2/1[=!u<%@bR@!E?4v${+0H/J)5EF$!6t$y:+VtEEgo_u4q2Jb;-<(N#z?U=39]I'&\\%>0u<6$b.&m#B9*H95:>w}9]q41k|(0zM.#,88(5T@%LQT?)aaz~3x!s>Wm'B$?ioO/El9F@A,f>M;>7/#<i)kFCF;9g6HM-:`<(+;bH;5~?[1*d!/A{%L:(=L3'|g#=>=4$=;v50-$naa-krLH-YLG!+_@7.~*>kZmr8_)91292?Xt]-rpJ#;)0D&NW/p68t!xlc8-9?%%)cBI~hVoM{s1&AadF}@J<\\f,uf+%d-yu,6de09Qz6f9<pXNsj-)/:b[*3i?,I?8C&,)@,q6Hf+tOE\"K5cq+Z0)@>&Qa/D@gK%f2f}ZJU,@34IzK80b=$aw?lD~[$vVa[<%F$Z";

  window.addEventListener("DOMContentLoaded", () => {
    const api = window.GeoGlyphStudio;
    if (!api) return;
    const $ = id => document.getElementById(id);
    const state = api.state;
    const drawer = $("explorerDrawer");
    const workflowNav = document.querySelector(".workflow-nav");
    const previewHead = document.querySelector(".preview-panel-head");
    const exportButton = document.querySelector(".header-export-btn");
    const oldFontButton = document.querySelector(".workflow-font-btn");
    const fontList = $("fontList");
    const drawerOptions = drawer?.querySelector(".drawer-options");
    const glyphToolbar = drawer?.querySelector(".glyph-toolbar");

    document.title=GeoGlyphVersion.title;

    function setExplorer(open) {
      if (!drawer) return;
      if (open) {
        const symbolTab = document.querySelector('.preview-tabs [data-preview="symbol"]');
        symbolTab?.click();
        document.body.dataset.workflow = "symbol";
      }
      document.body.classList.toggle("drawer-open", Boolean(open));
      drawer.setAttribute("aria-hidden", String(!open));
      fontToggle?.classList.toggle("is-active", Boolean(open));
      fontToggle?.setAttribute("aria-pressed", String(Boolean(open)));
      fontToggle.dataset.hoverTip = open ? "Close Font Explorer" : "Open Font Explorer and preview symbols";
      fontToggle.removeAttribute("title");
      if (open) {
        api.syncControlsFromState();
        api.renderPreview();
      }
    }

    /* Replace the inherited button node so stale open-only listeners cannot interfere with toggle behaviour. */
    let fontToggle = oldFontButton;
    if (oldFontButton) {
      fontToggle = oldFontButton.cloneNode(true);
      oldFontButton.replaceWith(fontToggle);
      fontToggle.type = "button";
      fontToggle.textContent = "Font Explorer";
      fontToggle.setAttribute("aria-pressed", String(document.body.classList.contains("drawer-open")));
      fontToggle.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        setExplorer(!document.body.classList.contains("drawer-open"));
      });
    }

    /* Keep the internal collapse/close control as an independent way to close the Explorer. */
    $("closeDrawerBtn")?.addEventListener("click", () => {
      window.setTimeout(() => setExplorer(false), 0);
    });

    /* Remove the Selection block visually, but retain its live elements for existing state synchronisation. */
    const selectionBlock = [...(drawerOptions?.querySelectorAll(".option-block") || [])]
      .find(block => block.querySelector(".option-title")?.textContent.trim() === "Selection");
    selectionBlock?.classList.add("font-selection-section");

    /* Move selection actions onto the Code Grid / Favourites toolbar. */
    const toolbarButtonBar = glyphToolbar?.querySelector(".favourites-toolbar-row>.button-bar");
    const copyCode = $("copyCodeBtn");
    const useSelection = $("useSymbolBtn");
    if (toolbarButtonBar && copyCode && useSelection) {
      copyCode.textContent = "Copy Code";
      useSelection.textContent = "Use Selection";
      toolbarButtonBar.append(copyCode, useSelection);
    }

    /* Move Favourite beside Export in the persistent Preview header. */
    const favouriteButton = $("addFavouriteBtn");
    if (previewHead && favouriteButton) {
      favouriteButton.classList.add("header-favourite-btn");
      favouriteButton.textContent = "Favourite";
      if (exportButton) previewHead.insertBefore(favouriteButton, exportButton);
      else previewHead.append(favouriteButton);
    }

    function selectedFont() {
      return state.fonts.find(font => font.id === state.selectedFontId) || state.fonts[0] || null;
    }
    function refreshFontVisuals() {
      const font = selectedFont();
      if (!font) return;
      const family = font.cssFamily || font.family || font.name || "system-ui";
      fontList?.querySelectorAll("[data-font-id]").forEach(row => row.classList.toggle("is-active", row.dataset.fontId === state.selectedFontId));
      $("glyphGrid")?.querySelectorAll(".glyph-cell strong:not(.emoji-glyph)").forEach(glyph => { glyph.style.fontFamily = family; });
      const fontStatus = $("fontStatus");
      if (fontStatus) fontStatus.textContent = font.name || family;
      api.syncControlsFromState();
      api.renderPreview();
    }

    /* Delegated font selection remains valid even when the list is rebuilt. */
    fontList?.addEventListener("click", event => {
      const row = event.target.closest("[data-font-id]");
      if (!row || !fontList.contains(row)) return;
      state.selectedFontId = row.dataset.fontId;
      window.setTimeout(refreshFontVisuals, 0);
    }, true);

    /* Add Magic Eye payload access to the Preview header. */
    const magicEyeAboutButton = document.createElement("button");
    magicEyeAboutButton.className = "square-btn magic-eye-about-btn";
    magicEyeAboutButton.id = "magicEyeAboutBtn";
    magicEyeAboutButton.type = "button";
    magicEyeAboutButton.textContent = "About";
    magicEyeAboutButton.title = "About The Magic Eye";

    const payloadButton = document.createElement("button");
    payloadButton.className = "square-btn magic-eye-payload-btn";
    payloadButton.id = "magicEyePayloadBtn";
    payloadButton.type = "button";
    payloadButton.textContent = "Show Payload";
    payloadButton.title = "Display the text encoded in the Magic Eye QR";
    if (previewHead) {
      if (favouriteButton?.parentElement === previewHead) previewHead.insertBefore(magicEyeAboutButton, favouriteButton);
      else if (exportButton?.parentElement === previewHead) previewHead.insertBefore(magicEyeAboutButton, exportButton);
      else previewHead.append(magicEyeAboutButton);
      if (favouriteButton?.parentElement === previewHead) previewHead.insertBefore(payloadButton, favouriteButton);
      else if (exportButton?.parentElement === previewHead) previewHead.insertBefore(payloadButton, exportButton);
      else previewHead.append(payloadButton);
    }

    const magicEyeAboutModal = document.createElement("div");
    magicEyeAboutModal.className = "modal-backdrop";
    magicEyeAboutModal.id = "magicEyeAboutModal";
    magicEyeAboutModal.hidden = true;
    magicEyeAboutModal.innerHTML = `
      <section aria-labelledby="magicEyeAboutTitle" aria-modal="true" class="about-dialog magic-eye-about-dialog" id="magicEyeAboutDialog" role="dialog" tabindex="-1">
        <header class="about-head">
          <h2 id="magicEyeAboutTitle">About The Magic Eye</h2>
          <span class="spacer"></span>
          <button aria-label="Close About The Magic Eye" class="icon-btn" id="closeMagicEyeAbout" type="button">×</button>
        </header>
        <div class="about-body magic-eye-about-copy">
          <p><strong>The Magic Eye</strong> began as an experiment while I was working on GeoGlyph and testing the character limits of QR codes. As the codes became denser, they started to remind me of those old “Magic Eye” 3D stereograms.</p>
          <p>That led to a question: could a QR code be both fully scannable and a genuine stereogram?</p>
          <p>I asked ChatGPT 5.5 to explore the idea. After thinking it through, this is what it produced.</p>
          <p>Not everyone can see stereograms easily, so I also wondered whether different colour palettes might make the hidden image easier to perceive. Perhaps blurring the image a bit might help? Have a play, and see whether you have a Magic Eye.</p>
        </div>
      </section>`;
    document.body.append(magicEyeAboutModal);

    function openMagicEyeAbout() {
      magicEyeAboutModal.hidden = false;
      document.body.classList.add("modal-open");
      window.setTimeout(() => $("magicEyeAboutDialog")?.focus({ preventScroll:true }), 0);
    }
    function closeMagicEyeAbout() {
      magicEyeAboutModal.hidden = true;
      document.body.classList.remove("modal-open");
      magicEyeAboutButton.focus();
    }
    magicEyeAboutButton.addEventListener("click", openMagicEyeAbout);
    $("closeMagicEyeAbout")?.addEventListener("click", closeMagicEyeAbout);
    magicEyeAboutModal.addEventListener("pointerdown", event => { if (event.target === magicEyeAboutModal) closeMagicEyeAbout(); });

    const payloadModal = document.createElement("div");
    payloadModal.className = "modal-backdrop";
    payloadModal.id = "magicEyePayloadModal";
    payloadModal.hidden = true;
    payloadModal.innerHTML = `
      <section aria-labelledby="magicEyePayloadTitle" aria-modal="true" class="magic-eye-payload-dialog" role="dialog">
        <header class="about-head">
          <h2 id="magicEyePayloadTitle">Magic Eye Payload</h2>
          <span class="spacer"></span>
          <button aria-label="Close payload" class="icon-btn" id="closeMagicEyePayload" type="button">×</button>
        </header>
        <div class="magic-eye-payload-body">
          <textarea aria-label="Magic Eye QR payload" class="magic-eye-payload-text" id="magicEyePayloadText" readonly spellcheck="false"></textarea>
        </div>
        <footer class="magic-eye-payload-footer">
          <span class="magic-eye-payload-meta">${MAGIC_EYE_PAYLOAD.length.toLocaleString()} characters</span>
          <span class="spacer"></span>
          <button class="square-btn" id="copyMagicEyePayload" type="button">Copy Payload</button>
          <button class="square-btn is-active" id="doneMagicEyePayload" type="button">Close</button>
        </footer>
      </section>`;
    document.body.append(payloadModal);
    $("magicEyePayloadText").value = MAGIC_EYE_PAYLOAD;

    function openPayload() {
      payloadModal.hidden = false;
      document.body.classList.add("modal-open");
      window.setTimeout(() => $("magicEyePayloadText")?.focus(), 0);
    }
    function closePayload() {
      payloadModal.hidden = true;
      document.body.classList.remove("modal-open");
      payloadButton.focus();
    }
    payloadButton.addEventListener("click", openPayload);
    $("closeMagicEyePayload")?.addEventListener("click", closePayload);
    $("doneMagicEyePayload")?.addEventListener("click", closePayload);
    payloadModal.addEventListener("pointerdown", event => { if (event.target === payloadModal) closePayload(); });
    $("copyMagicEyePayload")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(MAGIC_EYE_PAYLOAD);
        api.showToast("Magic Eye payload copied");
      } catch {
        $("magicEyePayloadText")?.select();
        api.showToast("Payload selected for copying");
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !magicEyeAboutModal.hidden) closeMagicEyeAbout();
      if (event.key === "Escape" && !payloadModal.hidden) closePayload();
    });

    refreshFontVisuals();
  });
})();
