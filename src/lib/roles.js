/**
 * PrivacyLens — Role-Based Access Control (RBAC) Role Definitions
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

export const USER_ROLES = {
  SECOPS_LEAD: {
    id: 'secops-lead',
    name: 'Pranav Pushya',
    role: 'SecOps Lead',
    email: 'secops@privacylens.internal',
    clearance: 'Level 3 — Root Forensics & Policy Tuning',
    team: 'Team 05-HoneyPoters',
    permissions: ['ALL_FORENSICS', 'POLICY_OVERRIDE', 'DOM_INJECTOR', 'LIVE_BENCHMARKS']
  },
  PECATHON_EVALUATOR: {
    id: 'pecathon-judge',
    name: 'PECathon 2026 Evaluator',
    role: 'PECathon Evaluator',
    email: 'evaluator@pecathon.org',
    clearance: 'Level 3 — Evaluation Scenarios & Synthetic Benchmarks',
    team: 'PECathon PS-004 Jury',
    permissions: ['SCENARIOS_EXECUTION', 'BENCHMARK_SCORING', 'CANARY_LEAK_AUDIT']
  },
  DPDP_AUDITOR: {
    id: 'compliance-auditor',
    name: 'DPDP Privacy Auditor',
    role: 'DPDP Auditor',
    email: 'compliance@dpdp-board.gov.in',
    clearance: 'Level 2 — Audit Trail & Ledger Verification',
    team: 'Regulatory Oversight',
    permissions: ['AUDIT_LOG_READ', 'EXPORT_CSV', 'EXPORT_JSON', 'HEALTH_TELEMETRY']
  }
};

export const DEFAULT_PROFILES = Object.values(USER_ROLES);
