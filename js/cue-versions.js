/**
 * Single source of truth for @qaecy package versions.
 *
 * Referenced by:
 *   dist/html/components/*.html  — imported as an ES module to inject CDN assets
 *   components.html              — CUE_UI_VERSION is mirrored in an inline <script>
 *                                  at the top of <body> (search "Cue version config")
 *
 * The importmap in each demo file also references CUE_SDK_VERSION — update manually
 * when bumping the SDK (search for "keep in sync" in those files).
 */

export const CUE_UI_VERSION   = '0.0.35';
export const CUE_SDK_VERSION  = '0.0.26';
export const CUE_MAPBOX_TOKEN = 'pk.eyJ1IjoibWFkc2hvbHRlbiIsImEiOiJjbWFiMTYyc3EwOXM5MmtzYzRqcWJ0N2dzIn0.cPH3wfmHY6LbquPWzH5zdQ';
