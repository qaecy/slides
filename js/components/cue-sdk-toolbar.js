/**
 * <cue-sdk-toolbar>
 *
 * Requires the host page to declare an importmap resolving '@qaecy/cue-sdk'
 * (e.g. to https://esm.sh/@qaecy/cue-sdk@0.0.25).
 *
 * Dispatches "projectchange" CustomEvent (bubbles + composed) with:
 *   { projectId: string | null, sdkState: { cue, documents } | null }
 */

import { Cue, CueProjectDocuments } from "@qaecy/cue-sdk";

const LAST_PROJECT_KEY = "cue-sdk-last-project-id";

// ── Shared Cue singleton (one per page) ──────────────────────────────────────

let _cue = null;
function _getCue() {
  if (!_cue) {
    _cue = new Cue();
  }
  return _cue;
}

// ── Styles ───────────────────────────────────────────────────────────────────

const STYLES = /* css */ `
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
    background: #18181b;
    border-top: 1px solid #3f3f46;
    border-radius: 6px;
    font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
    font-size: 12px;
    color: #a1a1aa;
  }
  .bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px;
    flex-wrap: nowrap;
    overflow: hidden;
    white-space: nowrap;
  }
  .label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #71717a;
    flex-shrink: 0;
    user-select: none;
  }
  .sep {
    color: #3f3f46;
    user-select: none;
    flex-shrink: 0;
    margin: 0 1px;
  }
  .user  { color: #a78bfa; font-weight: 600; flex-shrink: 0; }
  .status { color: #facc15; font-style: italic; flex-shrink: 0; }
  .error  { color: #f87171; flex-shrink: 1; overflow: hidden; text-overflow: ellipsis; }
  select {
    background: #27272a;
    color: #e4e4e7;
    border: 1px solid #3f3f46;
    border-radius: 5px;
    padding: 3px 8px;
    font-size: 12px;
    font-family: inherit;
    cursor: pointer;
    min-width: 160px;
    max-width: 280px;
    outline: none;
    flex-shrink: 1;
  }
  select:focus { border-color: #6366f1; }
  button {
    background: #27272a;
    color: #e4e4e7;
    border: 1px solid #3f3f46;
    border-radius: 5px;
    padding: 3px 10px;
    font-size: 12px;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s;
    flex-shrink: 0;
    white-space: nowrap;
  }
  button:hover  { background: #3f3f46; }
  button.primary { background: #4f46e5; border-color: #4f46e5; color: #fff; }
  button.primary:hover { background: #4338ca; }
  button:disabled { opacity: 0.45; cursor: default; pointer-events: none; }
`;

// ── Component ─────────────────────────────────────────────────────────────────

class CueSdkToolbar extends HTMLElement {
  static get observedAttributes() { return ["hide-project-select"]; }

  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
    this._state = "loading";
    this._projects = [];
    this._selectedProjectId = "";
    this._userName = "";
    this._errorMsg = "";
    this._unsubAuth = null;
    this._render();
    this._init();
  }

  attributeChangedCallback() {
    this._render();
  }

  get _hideProjectSelect() {
    return this.hasAttribute("hide-project-select");
  }

  disconnectedCallback() {
    this._unsubAuth?.();
    this._unsubAuth = null;
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  _init() {
    try {
      const cue = _getCue();
      this._state = "signed-out";
      this._render();

      this._unsubAuth = cue.auth.onAuthStateChanged(async (user) => {
        if (user) {
          this._userName = user.displayName ?? user.email ?? "User";
          await this._loadProjects();
        } else {
          this._state = "signed-out";
          this._projects = [];
          this._selectedProjectId = "";
          this._render();
          this._emit(null);
        }
      });
    } catch (err) {
      this._state = "error";
      this._errorMsg = err?.message ?? "SDK init failed";
      this._render();
    }
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  async _signIn(provider) {
    this._state = "signing-in";
    this._render();
    try {
      await _getCue().auth.signIn(provider);
    } catch (err) {
      this._state = "error";
      this._errorMsg = err?.message ?? "Sign-in failed";
      this._render();
    }
  }

  async _signOut() {
    await _getCue().auth.signOut();
  }

  // ── Projects ──────────────────────────────────────────────────────────────

  async _loadProjects() {
    this._state = "loading-projects";
    this._render();
    try {
      const list = await _getCue().projects.listProjects();
      this._projects = list.sort((a, b) => a.name.localeCompare(b.name));
      this._state = "ready";
      this._render();

      const cached = localStorage.getItem(LAST_PROJECT_KEY);
      if (cached && this._projects.some((p) => p.id === cached)) {
        this._selectedProjectId = cached;
        this._render();
        this._emit(cached);
      } else {
        this._emit(null);
      }
    } catch (err) {
      this._state = "error";
      this._errorMsg = err?.message ?? "Failed to load projects";
      this._render();
    }
  }

  _onProjectSelect(id) {
    this._selectedProjectId = id;
    if (id) {
      localStorage.setItem(LAST_PROJECT_KEY, id);
      this._emit(id);
    } else {
      localStorage.removeItem(LAST_PROJECT_KEY);
      this._emit(null);
    }
  }

  // ── Event ─────────────────────────────────────────────────────────────────

  _emit(projectId) {
    const cue = _getCue();
    let sdkState = null;
    if (projectId) {
      const documents = new CueProjectDocuments(cue.api, projectId);
      sdkState = { cue, documents };
    } else if (this._state !== "signed-out") {
      sdkState = { cue };
    }
    this.dispatchEvent(
      new CustomEvent("projectchange", {
        detail: { projectId, sdkState },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  _render() {
    const s = this._state;
    let body = "";

    if (s === "loading") {
      body = `<span class="status">Loading SDK…</span>`;
    } else if (s === "signed-out") {
      body = `
        <button class="primary" id="btn-google">Sign in with Google</button>
        <button id="btn-ms">Sign in with Microsoft</button>`;
    } else if (s === "signing-in") {
      body = `<span class="status">Signing in…</span>`;
    } else if (s === "loading-projects") {
      body = `<span class="user">${this._esc(this._userName)}</span>
              <span class="sep">|</span>
              <span class="status">Loading projects…</span>`;
    } else if (s === "ready") {
      const projectSelect = this._hideProjectSelect ? "" : (() => {
        const opts = this._projects
          .map(
            (p) =>
              `<option value="${this._esc(p.id)}"${p.id === this._selectedProjectId ? " selected" : ""}>${this._esc(p.name)}</option>`,
          )
          .join("");
        return `<span class="sep">|</span>
        <select id="sel-project">
          <option value="">— select project —</option>
          ${opts}
        </select>`;
      })();
      body = `
        <span class="user">${this._esc(this._userName)}</span>
        ${projectSelect}
        <span class="sep">|</span>
        <button id="btn-signout">Sign out</button>`;
    } else if (s === "error") {
      body = `<span class="error">${this._esc(this._errorMsg)}</span>
              <button id="btn-retry">Retry</button>`;
    }

    this._root.innerHTML = `<style>${STYLES}</style>
      <div class="bar">
        <span class="label">Cue SDK</span>
        <span class="sep">|</span>
        ${body}
      </div>`;

    // Bind events after innerHTML assignment
    const $ = (id) => this._root.getElementById(id);
    $("btn-google")?.addEventListener("click", () => this._signIn("google"));
    $("btn-ms")?.addEventListener("click", () => this._signIn("microsoft"));
    $("btn-signout")?.addEventListener("click", () => this._signOut());
    $("btn-retry")?.addEventListener("click", () => {
      this._state = "signed-out";
      this._render();
    });
    $("sel-project")?.addEventListener("change", (e) =>
      this._onProjectSelect(e.target.value),
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}

customElements.define("cue-sdk-toolbar", CueSdkToolbar);
