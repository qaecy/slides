import { Cue } from '@qaecy/cue-sdk';

const SPARQL_PREFIXES = `
PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX qcy:  <https://dev.qaecy.com/ont#>
`;

// ── SDK ──────────────────────────────────────────────────────────────────────
const cue = new Cue();

// ── State ────────────────────────────────────────────────────────────────────
let activeProjectId = null;

// ── DOM refs ─────────────────────────────────────────────────────────────────
const screenLogin        = document.getElementById('screen-login');
const screenApp          = document.getElementById('screen-app');
const authError          = document.getElementById('auth-error');
const projectSelect      = document.getElementById('project-select');
const filesPlaceholder   = document.getElementById('files-placeholder');
const filesLoading       = document.getElementById('files-loading');
const filesEmpty         = document.getElementById('files-empty');
const filesEmptyMsg      = document.getElementById('files-empty-msg');
const filesList          = document.getElementById('files-list');
const fileCountBadge     = document.getElementById('file-count');
const viewerPlaceholder  = document.getElementById('viewer-placeholder');
const viewerContainer    = document.getElementById('viewer-container');
const viewerTitle        = document.getElementById('viewer-title');
const viewerHost         = document.getElementById('viewer-host');

// ── Auth ─────────────────────────────────────────────────────────────────────
cue.auth.onAuthStateChanged(async (user) => {
  if (user) {
    screenLogin.classList.add('hidden');
    screenApp.classList.remove('hidden');
    await loadProjects();
  } else {
    screenLogin.classList.remove('hidden');
    screenApp.classList.add('hidden');
    resetAppState();
  }
});

document.getElementById('btn-google').addEventListener('click', async () => {
  clearAuthError();
  try {
    await cue.auth.signIn('google');
  } catch (err) {
    showAuthError(err.message ?? 'Sign-in failed. Please try again.');
  }
});

document.getElementById('btn-microsoft').addEventListener('click', async () => {
  clearAuthError();
  try {
    await cue.auth.signIn('microsoft');
  } catch (err) {
    showAuthError(err.message ?? 'Sign-in failed. Please try again.');
  }
});

document.getElementById('btn-signout').addEventListener('click', async () => {
  await cue.auth.signOut();
});

// ── Projects ─────────────────────────────────────────────────────────────────
async function loadProjects() {
  try {
    const projects = await cue.projects.listProjects();
    projectSelect.innerHTML = '<option value="">— Select a project —</option>';
    for (const p of projects) {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      projectSelect.appendChild(opt);
    }
  } catch (err) {
    console.error('Failed to load projects:', err);
  }
}

projectSelect.addEventListener('change', async (e) => {
  const projectId = e.target.value;
  closeViewer();
  if (!projectId) {
    resetFileState();
    return;
  }
  activeProjectId = projectId;
  await loadIFCFiles(projectId);
});

// ── IFC file list ─────────────────────────────────────────────────────────────
async function loadIFCFiles(projectId) {
  setFilesState('loading');

  try {
    const result = await cue.api.sparql(
      SPARQL_PREFIXES + `
        SELECT ?doc ?name ?size WHERE {
          ?doc a qcy:FileContent ;
               qcy:hasFileLocation ?loc .
          ?loc qcy:value ?name ;
               qcy:suffix ?suffix .
          OPTIONAL { ?doc qcy:sizeBytes ?size }
          FILTER(LCASE(?suffix) = ".ifc")
        }
        ORDER BY ?name
      `,
      projectId
    );

    const files = result.results.bindings.map((b) => ({
      iri:  b.doc.value,
      uuid: b.doc.value.split('/').pop(),
      name: b.name.value,
      size: b.size?.value != null ? Number(b.size.value) : null,
    }));

    if (files.length === 0) {
      filesEmptyMsg.textContent = 'No IFC files found in this project.';
      setFilesState('empty');
      return;
    }

    fileCountBadge.textContent = `${files.length}`;
    fileCountBadge.classList.remove('hidden');
    renderFileList(files);
    setFilesState('list');

  } catch (err) {
    console.error('Failed to load IFC files:', err);
    filesEmptyMsg.textContent = `Error loading files: ${err.message}`;
    setFilesState('empty');
  }
}

function renderFileList(files) {
  filesList.innerHTML = '';
  for (const file of files) {
    const li = document.createElement('li');
    li.className = 'file-item';
    li.setAttribute('role', 'option');
    li.dataset.uuid = file.uuid;
    li.innerHTML = `
      <span class="file-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      </span>
      <span class="file-info">
        <span class="file-name">${escapeHtml(file.name)}</span>
        ${file.size != null ? `<span class="file-size">${formatSize(file.size)}</span>` : ''}
      </span>
      <span class="file-badge">IFC</span>
    `;
    li.addEventListener('click', () => openModel(file));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModel(file);
      }
    });
    li.setAttribute('tabindex', '0');
    filesList.appendChild(li);
  }
}

// ── Viewer ────────────────────────────────────────────────────────────────────
async function openModel(file) {
  // Highlight selected item
  document.querySelectorAll('.file-item').forEach((el) => {
    el.classList.remove('active');
    el.setAttribute('aria-selected', 'false');
  });
  const activeItem = document.querySelector(`.file-item[data-uuid="${CSS.escape(file.uuid)}"]`);
  activeItem?.classList.add('active');
  activeItem?.setAttribute('aria-selected', 'true');

  viewerTitle.textContent = file.name;
  viewerPlaceholder.classList.add('hidden');
  viewerContainer.classList.remove('hidden');

  // Remove any existing viewer element
  viewerHost.innerHTML = '';

  try {
    // Wait for the element to be registered (10 s timeout)
    await Promise.race([
      customElements.whenDefined('cue-document-viewer'),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(
          'cue-document-viewer was not registered after 10 s. ' +
          'Check the browser console (F12) for script load errors.'
        )), 10_000)
      ),
    ]);

    // Create wrapper so the viewer has a real box in the flex layout
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'flex:1;min-height:0;width:100%;overflow:hidden;position:relative;display:flex;';

    const viewer = document.createElement('cue-document-viewer');
    viewer.style.cssText = 'display:block;height:100%;width:100%;';

    // Set properties BEFORE appending (v0.0.14 single-file bundle pattern)
    viewer.cue = cue;
    viewer.projectId = activeProjectId;
    viewer.uuid = file.uuid;

    wrapper.appendChild(viewer);
    viewerHost.appendChild(wrapper);

  } catch (err) {
    console.error('[viewer] openModel failed:', err);
    viewerHost.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                  flex:1;padding:32px;gap:12px;color:#f56565;text-align:center;">
        <strong>Viewer failed to load</strong>
        <p style="font-size:12px;color:#888;max-width:360px;">${escapeHtml(err.message)}</p>
      </div>`;
  }
}

function closeViewer() {
  viewerPlaceholder.classList.remove('hidden');
  viewerContainer.classList.add('hidden');
  viewerHost.innerHTML = '';
  document.querySelectorAll('.file-item').forEach((el) => {
    el.classList.remove('active');
    el.setAttribute('aria-selected', 'false');
  });
}

document.getElementById('btn-close-viewer').addEventListener('click', closeViewer);

// ── State helpers ─────────────────────────────────────────────────────────────
function setFilesState(state) {
  filesPlaceholder.classList.toggle('hidden', state !== 'placeholder');
  filesLoading.classList.toggle('hidden', state !== 'loading');
  filesEmpty.classList.toggle('hidden', state !== 'empty');
  filesList.classList.toggle('hidden', state !== 'list');
  if (state !== 'list') {
    fileCountBadge.classList.add('hidden');
  }
}

function resetFileState() {
  setFilesState('placeholder');
}

function resetAppState() {
  activeProjectId = null;
  if (projectSelect) {
    projectSelect.innerHTML = '<option value="">— Select a project —</option>';
  }
  resetFileState();
  closeViewer();
}

// ── Auth error ────────────────────────────────────────────────────────────────
function showAuthError(msg) {
  authError.textContent = msg;
  authError.classList.remove('hidden');
}

function clearAuthError() {
  authError.classList.add('hidden');
  authError.textContent = '';
}

// ── Utility ───────────────────────────────────────────────────────────────────
function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024)        return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Diagnostics ───────────────────────────────────────────────────────────────
window.addEventListener('error', (evt) =>
  console.error('[app] Global error:', evt.error ?? evt.message));
window.addEventListener('unhandledrejection', (evt) =>
  console.error('[app] Unhandled rejection:', evt.reason));

// Health check — warns if the element isn't registered 8 s after page load.
window.addEventListener('load', () => {
  setTimeout(() => {
    if (customElements.get('cue-document-viewer')) {
      console.log('[app] ✓ cue-document-viewer registered OK');
    } else {
      console.error(
        '[app] ✗ cue-document-viewer NOT registered after 8 s.\n' +
        'Check the Network tab for a failed load of ' +
        'cdn.jsdelivr.net/npm/@qaecy/cue-ui/index.js'
      );
    }
  }, 8_000);
});
