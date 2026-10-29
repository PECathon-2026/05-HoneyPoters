/**
 * PrivacyLens — Client-Side Canvas Visual Blackout Redactor
 * 
 * Part of PrivacyLens (PS-004) by Team 05-HoneyPoters
 * Offscreen HTML5 Canvas Processor: Redacts sensitive DOM bounding boxes,
 * input fields, and screenshot areas with solid blackouts before cloud dispatch.
 */

/**
 * Default masking configuration
 */
export const DEFAULT_MASK_OPTIONS = {
  blackoutColor: '#000000',
  textColor: '#FFFFFF',
  borderColor: '#38BDF8', // Subtle cyan border to indicate PrivacyLens safe seal
  padding: 4,             // Extra safety margin in px around bounding boxes
  showBadge: true,        // Draw semantic badge "[REDACTED]" over blackout
  fontSize: 11,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  outputFormat: 'image/png',
  quality: 0.95
};

/**
 * Loads an image source (data URL, Blob, File, or Image element) into an HTMLImageElement
 * @param {HTMLImageElement|HTMLCanvasElement|Blob|File|string} source
 * @returns {Promise<HTMLImageElement|HTMLCanvasElement>}
 */
export function loadImageSource(source) {
  return new Promise((resolve, reject) => {
    // If it's already an Image or Canvas element
    if (typeof HTMLCanvasElement !== 'undefined' && source instanceof HTMLCanvasElement) {
      return resolve(source);
    }
    if (typeof HTMLImageElement !== 'undefined' && source instanceof HTMLImageElement) {
      if (source.complete && source.naturalWidth > 0) {
        return resolve(source);
      }
      source.onload = () => resolve(source);
      source.onerror = (err) => reject(new Error(`Failed to load HTMLImageElement: ${err}`));
      return;
    }

    // If it's a File or Blob
    if (typeof Blob !== 'undefined' && source instanceof Blob) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(source);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image from Blob/File'));
      };
      img.src = objectUrl;
      return;
    }

    // If it's a base64 string or image URL
    if (typeof source === 'string') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image from string URL/Base64'));
      img.src = source;
      return;
    }

    reject(new Error('Unsupported image source type provided to loadImageSource'));
  });
}

/**
 * Creates an offscreen canvas of specified dimensions
 * @param {number} width 
 * @param {number} height 
 * @returns {HTMLCanvasElement|OffscreenCanvas}
 */
export function createOffscreenCanvas(width, height) {
  if (typeof OffscreenCanvas !== 'undefined') {
    return new OffscreenCanvas(Math.max(1, width), Math.max(1, height));
  }
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, width);
    canvas.height = Math.max(1, height);
    return canvas;
  }
  throw new Error('Canvas rendering environment not available in current runtime');
}

/**
 * Applies visual blackout rectangles over specified bounding boxes on a canvas context
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Array<Object>} boundingBoxes - Array of { x, y, width, height, label }
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {Object} options
 */
export function applyBlackouts(ctx, boundingBoxes, canvasWidth, canvasHeight, options) {
  const opts = { ...DEFAULT_MASK_OPTIONS, ...options };

  for (const box of boundingBoxes) {
    if (!box || typeof box.x !== 'number' || typeof box.y !== 'number') continue;

    // Apply safety padding around the coordinates
    const pad = opts.padding || 0;
    const x = Math.max(0, Math.floor(box.x - pad));
    const y = Math.max(0, Math.floor(box.y - pad));
    const w = Math.min(canvasWidth - x, Math.ceil(box.width + pad * 2));
    const h = Math.min(canvasHeight - y, Math.ceil(box.height + pad * 2));

    if (w <= 0 || h <= 0) continue;

    // 1. Draw solid opaque blackout box
    ctx.save();
    ctx.fillStyle = opts.blackoutColor;
    ctx.fillRect(x, y, w, h);

    // 2. Draw subtle security boundary seal
    ctx.strokeStyle = opts.borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

    // 3. Render semantic security badge if requested
    if (opts.showBadge && w >= 60 && h >= 16) {
      const badgeText = box.label || '[REDACTED: PRIVACY]';
      ctx.font = `600 ${opts.fontSize}px ${opts.fontFamily}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      // Measure text for badge fitting
      const textMetrics = ctx.measureText(badgeText);
      const textWidth = textMetrics.width;

      if (textWidth + 12 <= w && h >= 20) {
        // Center text in blackout box
        ctx.fillStyle = opts.textColor;
        ctx.fillText(badgeText, x + w / 2, y + h / 2);
      } else {
        // Fallback for smaller boxes
        ctx.font = `bold 9px ${opts.fontFamily}`;
        ctx.fillStyle = opts.textColor;
        ctx.fillText('REDACTED', x + w / 2, y + h / 2);
      }
    }

    ctx.restore();
  }
}

/**
 * Main Visual Redaction Function:
 * Takes an image source, paints it to offscreen canvas, blackouts sensitive coordinates,
 * and exports safe base64 data / Blob with ZERO raw pixel leakage.
 * 
 * @param {HTMLImageElement|HTMLCanvasElement|Blob|File|string} imageSource
 * @param {Array<Object>} boundingBoxes - Coordinates [{ x, y, width, height, label }]
 * @param {Object} [options={}]
 * @returns {Promise<{
 *   sanitizedBase64: string,
 *   width: number,
 *   height: number,
 *   masksCount: number,
 *   timestamp: string
 * }>}
 */
export async function maskImage(imageSource, boundingBoxes = [], options = {}) {
  const timestamp = new Date().toISOString();
  const opts = { ...DEFAULT_MASK_OPTIONS, ...options };

  const source = await loadImageSource(imageSource);
  const width = source.naturalWidth || source.width || 0;
  const height = source.naturalHeight || source.height || 0;

  if (width === 0 || height === 0) {
    throw new Error('Image dimensions must be greater than zero for visual masking');
  }

  // Create offscreen canvas and draw source image
  const canvas = createOffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not initialize 2D canvas rendering context');
  }

  // Draw clean source image onto canvas
  ctx.drawImage(source, 0, 0, width, height);

  // Apply blackout rectangles to all sensitive regions
  if (Array.isArray(boundingBoxes) && boundingBoxes.length > 0) {
    applyBlackouts(ctx, boundingBoxes, width, height, opts);
  }

  // Export sanitized image data
  let sanitizedBase64 = '';
  if (typeof canvas.convertToBlob === 'function') {
    // OffscreenCanvas standard
    const blob = await canvas.convertToBlob({ type: opts.outputFormat, quality: opts.quality });
    sanitizedBase64 = await blobToBase64(blob);
  } else if (typeof canvas.toDataURL === 'function') {
    // HTMLCanvasElement standard
    sanitizedBase64 = canvas.toDataURL(opts.outputFormat, opts.quality);
  }

  return {
    sanitizedBase64,
    width,
    height,
    masksCount: boundingBoxes.length,
    timestamp
  };
}

/**
 * In-place blackout on an existing HTML5 Canvas instance
 * @param {HTMLCanvasElement} canvas
 * @param {Array<Object>} boundingBoxes
 * @param {Object} [options={}]
 * @returns {string} base64 data URL of sanitized canvas
 */
export function maskCanvas(canvas, boundingBoxes = [], options = {}) {
  if (!canvas) throw new Error('Valid canvas element required');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context not available');

  applyBlackouts(ctx, boundingBoxes, canvas.width, canvas.height, options);
  return canvas.toDataURL(options.outputFormat || 'image/png', options.quality || 0.95);
}

/**
 * Utility: Converts a Blob to a Base64 Data URL
 * @param {Blob} blob 
 * @returns {Promise<string>}
 */
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generates an SVG placeholder image with simulated redaction boxes (ideal for mock demos)
 * @param {number} width 
 * @param {number} height 
 * @param {Array<Object>} boxes 
 * @returns {string} SVG Data URL
 */
export function generateMockRedactedSVG(width = 600, height = 400, boxes = []) {
  const rects = boxes.map(b => 
    `<rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" fill="#000000" stroke="#38BDF8" stroke-width="1.5"/>
     <text x="${b.x + b.width / 2}" y="${b.y + b.height / 2 + 4}" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="bold">${b.label || 'REDACTED'}</text>`
  ).join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#1E293B"/>
    <text x="20" y="30" fill="#94A3B8" font-family="monospace" font-size="14">PrivacyLens Screen Capture Snapshot</text>
    ${rects}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
