/**
 * PrivacyLens — In-Browser Contextual RAG Privacy Engine
 * 
 * Part of PrivacyLens (PS-004) by Team 05-HoneyPoters
 * 100% Client-Side Vector Search: Identifies semantic and contextual privacy violations
 * (Medical diagnoses, enterprise secrets, financial records, salary info)
 * using In-Memory Orama Vector DB + @xenova/transformers (all-MiniLM-L6-v2).
 */

import { create, insert, search } from '@orama/orama';

// ============================================================================
// 1. Contextual Categories & Knowledge Base Definitions
// ============================================================================

export const CONTEXTUAL_CATEGORIES = {
  MEDICAL_DIAGNOSIS: 'MEDICAL_DIAGNOSIS',
  ENTERPRISE_SECRET: 'ENTERPRISE_SECRET',
  HEALTH_BIOMETRIC: 'HEALTH_BIOMETRIC',
  FINANCIAL_RECORD: 'FINANCIAL_RECORD',
  SALARY_COMPENSATION: 'SALARY_COMPENSATION',
  LEGAL_CONFIDENTIAL: 'LEGAL_CONFIDENTIAL'
};

export const CONTEXTUAL_RULES = [
  {
    category: CONTEXTUAL_CATEGORIES.MEDICAL_DIAGNOSIS,
    label: 'Medical Condition & Clinical Diagnosis',
    replacementToken: '[REDACTED: MEDICAL_RECORD]',
    exemplars: [
      'patient diagnosed with stage 3 cancer lymphoma tumor',
      'clinical diagnosis confirms acute chronic kidney disease failure',
      'prescribed antipsychotic medication for bipolar depression schizophrenia',
      'tested positive for HIV hepatitis infectious medical syndrome',
      'patient undergoes chemotherapy radiation oncology treatment'
    ]
  },
  {
    category: CONTEXTUAL_CATEGORIES.HEALTH_BIOMETRIC,
    label: 'Health Metric & Biometric Record',
    replacementToken: '[REDACTED: HEALTH_METRIC]',
    exemplars: [
      'blood pressure measured 180 120 severe hypertension reading',
      'fasting blood sugar level glucose 320 mg dl diabetic',
      'resting heart rate pulse 145 bpm tachycardia emergency',
      'retinal scan biometric facial fingerprint template vector'
    ]
  },
  {
    category: CONTEXTUAL_CATEGORIES.ENTERPRISE_SECRET,
    label: 'Corporate Confidential & Internal Secret',
    replacementToken: '[REDACTED: ENTERPRISE_SECRET]',
    exemplars: [
      'internal staging database master root password vault',
      'confidential unannounced product roadmap source code repository',
      'proprietary trade secret algorithmic model weights architecture',
      'internal VPN gateway private certificate key configuration'
    ]
  },
  {
    category: CONTEXTUAL_CATEGORIES.FINANCIAL_RECORD,
    label: 'Bank Balance & Financial Ledger',
    replacementToken: '[REDACTED: FINANCIAL_BALANCE]',
    exemplars: [
      'current bank account balance Rs rupees lakh savings ledger',
      'net portfolio investment stock demat mutual fund valuation',
      'outstanding personal loan debt credit card balance payable'
    ]
  },
  {
    category: CONTEXTUAL_CATEGORIES.SALARY_COMPENSATION,
    label: 'Employee Compensation & Salary Data',
    replacementToken: '[REDACTED: SALARY_INFO]',
    exemplars: [
      'employee annual CTC compensation package per annum salary',
      'monthly in-hand take home paycheck stipend bonus calculation',
      'performance appraisal bonus stock equity grant ESOP allocation'
    ]
  }
];

const VECTOR_DIMENSION = 384;

// ============================================================================
// 2. Client-Side Vector Embedding Pipeline
// ============================================================================

let pipelineExtractor = null;
let isPipelineLoading = false;
let oramaDbInstance = null;
let isDbInitialized = false;

/**
 * Deterministic Fallback 384-dimensional Embedder.
 * Used during initial download, offline hackathon wifi dropouts, or fast headless runs.
 * Computes frequency-weighted token projection vectors normalized to unit length.
 * 
 * @param {string} text 
 * @returns {number[]} 384-dimensional float array
 */
export function generateDeterministicEmbedding(text) {
  const vec = new Float32Array(VECTOR_DIMENSION);
  if (!text || typeof text !== 'string') return Array.from(vec);

  const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = clean.split(/\s+/).filter(Boolean);

  if (words.length === 0) return Array.from(vec);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = (hash << 5) - hash + word.charCodeAt(j);
      hash |= 0;
    }

    const pos = Math.abs(hash) % VECTOR_DIMENSION;
    const sign = hash % 2 === 0 ? 1 : -1;
    vec[pos] += sign * (1.0 / (i + 1));

    // Secondary dispersion
    const pos2 = (pos + 197) % VECTOR_DIMENSION;
    vec[pos2] += -sign * 0.5;
  }

  // L2 unit normalization
  let norm = 0;
  for (let i = 0; i < VECTOR_DIMENSION; i++) {
    norm += vec[i] * vec[i];
  }
  norm = Math.sqrt(norm) || 1.0;

  for (let i = 0; i < VECTOR_DIMENSION; i++) {
    vec[i] = vec[i] / norm;
  }

  return Array.from(vec);
}

/**
 * Loads @xenova/transformers pipeline or returns fallback embedder
 * @returns {Promise<Function>} embedder function: (text) => Promise<number[]>
 */
export async function getVectorEmbedder() {
  if (pipelineExtractor) {
    return async (text) => {
      try {
        const output = await pipelineExtractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
      } catch (err) {
        console.warn('[PrivacyLens RAG] Pipeline error, using fallback:', err);
        return generateDeterministicEmbedding(text);
      }
    };
  }

  // Try dynamic import of @xenova/transformers
  if (!isPipelineLoading) {
    isPipelineLoading = true;
    try {
      const { pipeline, env } = await import('@xenova/transformers');
      if (env) {
        env.allowLocalModels = false;
        env.useBrowserCache = true;
      }
      pipelineExtractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        quantized: true
      });
      isPipelineLoading = false;
      return async (text) => {
        try {
          const output = await pipelineExtractor(text, { pooling: 'mean', normalize: true });
          return Array.from(output.data);
        } catch {
          return generateDeterministicEmbedding(text);
        }
      };
    } catch {
      // Offline fallback
      isPipelineLoading = false;
      return async (text) => generateDeterministicEmbedding(text);
    }
  }

  return async (text) => generateDeterministicEmbedding(text);
}

// ============================================================================
// 3. In-Memory Orama Vector Database Setup
// ============================================================================

/**
 * Initializes the in-memory Orama Vector DB and populates privacy exemplars
 * @returns {Promise<Object>} Orama DB instance
 */
export async function initRagScanner() {
  if (isDbInitialized && oramaDbInstance) {
    return oramaDbInstance;
  }

  // 1. Create In-Memory Orama Database
  oramaDbInstance = await create({
    schema: {
      ruleId: 'string',
      category: 'string',
      label: 'string',
      text: 'string',
      replacementToken: 'string',
      embedding: `vector[${VECTOR_DIMENSION}]`
    }
  });

  const embedder = await getVectorEmbedder();

  // 2. Populate privacy exemplar vectors
  for (const rule of CONTEXTUAL_RULES) {
    for (const exemplar of rule.exemplars) {
      const vector = await embedder(exemplar);
      await insert(oramaDbInstance, {
        ruleId: `rule_${rule.category}_${Math.random().toString(36).substring(2, 6)}`,
        category: rule.category,
        label: rule.label,
        text: exemplar,
        replacementToken: rule.replacementToken,
        embedding: vector
      });
    }
  }

  isDbInitialized = true;
  return oramaDbInstance;
}

// ============================================================================
// 4. Contextual Semantic Scanning & Sanitization Engine
// ============================================================================

/**
 * Splits prose into candidate sentence units
 * @param {string} text 
 * @returns {Array<{ text: string, index: number, endIndex: number }>}
 */
function extractSentences(text) {
  const segments = [];
  const regex = /[^.!?\n]+[.!?\n]*/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const raw = match[0].trim();
    if (raw.length > 5) {
      segments.push({
        text: raw,
        index: match.index + match[0].indexOf(raw),
        endIndex: match.index + match[0].indexOf(raw) + raw.length
      });
    }
  }
  return segments;
}

/**
 * Scans text for contextual privacy violations using Vector DB similarity search
 * 
 * @param {string} text 
 * @param {Object} [options={}]
 * @param {number} [options.similarityThreshold=0.65] - Vector similarity cutoff (0 to 1)
 * @returns {Promise<Array<Object>>} List of detected contextual threats
 */
export async function scanContextualText(text, options = {}) {
  if (!text || typeof text !== 'string') return [];

  const db = await initRagScanner();
  const embedder = await getVectorEmbedder();
  const threshold = options.similarityThreshold || 0.65;
  const segments = extractSentences(text);
  const threats = [];

  for (const segment of segments) {
    const vector = await embedder(segment.text);
    const searchResult = await search(db, {
      mode: 'vector',
      vector: {
        value: vector,
        property: 'embedding'
      },
      similarity: threshold,
      limit: 1
    });

    if (searchResult.hits && searchResult.hits.length > 0) {
      const topHit = searchResult.hits[0];
      const doc = topHit.document;
      
      threats.push({
        id: `ctx_threat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        category: doc.category,
        label: doc.label,
        matchedExemplar: doc.text,
        score: topHit.score,
        replacementToken: doc.replacementToken,
        detectedText: segment.text,
        index: segment.index,
        endIndex: segment.endIndex
      });
    }
  }

  return threats;
}

/**
 * Contextual Sanitization Function:
 * Replaces high-similarity contextual PII segments with semantic tokens.
 * 
 * @param {string} text 
 * @param {Object} [options={}]
 * @returns {Promise<{
 *   isSafe: boolean,
 *   originalText: string,
 *   sanitizedText: string,
 *   contextualThreats: Array<Object>,
 *   stats: Object,
 *   timestamp: string
 * }>}
 */
export async function sanitizeContextualText(text, options = {}) {
  const timestamp = new Date().toISOString();
  if (!text || typeof text !== 'string') {
    return {
      isSafe: true,
      originalText: '',
      sanitizedText: '',
      contextualThreats: [],
      stats: { totalContextualThreats: 0 },
      timestamp
    };
  }

  const threats = await scanContextualText(text, options);

  if (threats.length === 0) {
    return {
      isSafe: true,
      originalText: text,
      sanitizedText: text,
      contextualThreats: [],
      stats: { totalContextualThreats: 0 },
      timestamp
    };
  }

  // Deduplicate overlapping segments from back to front
  const sorted = [...threats].sort((a, b) => b.index - a.index);
  let sanitized = text;

  for (const threat of sorted) {
    const before = sanitized.slice(0, threat.index);
    const after = sanitized.slice(threat.endIndex);
    sanitized = before + threat.replacementToken + after;
  }

  return {
    isSafe: true,
    originalText: text,
    sanitizedText: sanitized,
    contextualThreats: threats,
    stats: {
      totalContextualThreats: threats.length,
      categories: threats.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {})
    },
    timestamp
  };
}

/**
 * Adds a custom privacy rule to the in-memory vector database
 * (e.g. for custom enterprise project code words)
 * 
 * @param {Object} rule 
 * @param {string} rule.category 
 * @param {string} rule.label 
 * @param {string} rule.exemplar 
 * @param {string} rule.replacementToken 
 */
export async function addCustomPrivacyRule(rule) {
  const db = await initRagScanner();
  const embedder = await getVectorEmbedder();
  const vector = await embedder(rule.exemplar);

  await insert(db, {
    ruleId: `rule_custom_${Date.now()}`,
    category: rule.category || 'CUSTOM_CONFIDENTIAL',
    label: rule.label || 'Custom Confidential Record',
    text: rule.exemplar,
    replacementToken: rule.replacementToken || '[REDACTED: CUSTOM_CONFIDENTIAL]',
    embedding: vector
  });
}
