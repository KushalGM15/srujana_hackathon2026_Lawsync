export type IssuingAuthority = 'MCA' | 'RBI' | 'CBIC' | 'MeitY' | 'MoF' | 'DGFT';

export type VerificationStatus = 'Verified' | 'Pending Review' | 'Archived' | 'Flagged';

export type ApplicabilityStatus = 'Potentially Applicable' | 'Not Applicable' | 'Needs Human Review';

export type ActionStatus = 'Not Started' | 'In Progress' | 'Completed';

export type ActionPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface RegulatoryClause {
  id: string;
  clauseNumber: string;
  title: string;
  text: string;
  pageNumber?: number;
  sectionRef?: string;
}

export interface DiffChunk {
  id: string;
  clauseNumber: string;
  sectionRef: string;
  title: string;
  changeType: 'modified' | 'added' | 'removed' | 'unchanged';
  previousText?: string;
  updatedText?: string;
  previousPage?: number;
  updatedPage?: number;
  plainLanguageExplanation: string;
  supportingCitations: string[];
  effectiveDate?: string;
  deadline?: string | null; // If source-supported, otherwise null
  confidenceScore: number;
  reviewStatus: 'Verified' | 'Needs Review';
  tokens?: {
    type: 'same' | 'added' | 'removed';
    value: string;
  }[];
}

export interface DocumentComparisonPair {
  id: string;
  title: string;
  authority: IssuingAuthority;
  identifier: string;
  jurisdiction: string;
  previousVersion: {
    versionNumber: string;
    publicationDate: string;
    documentTitle: string;
    gazetteRef: string;
  };
  updatedVersion: {
    versionNumber: string;
    publicationDate: string;
    documentTitle: string;
    gazetteRef: string;
    effectiveDate: string;
  };
  summary: string;
  status: VerificationStatus;
  clauses: DiffChunk[];
  sourceDocumentPdfUrl?: string;
  gazetteExcerpt?: string;
}

export interface RegulatoryDocument {
  id: string;
  title: string;
  authority: IssuingAuthority;
  jurisdiction: string;
  documentIdentifier: string;
  publicationDate: string;
  effectiveDate: string;
  version: string;
  verificationStatus: VerificationStatus;
  summary: string;
  sourceUrl: string;
  extractedClausesCount: number;
  reviewer?: {
    name: string;
    reviewedAt: string;
  };
  tags: string[];
}

export interface BusinessProfile {
  companyName: string;
  cin: string;
  udyamRegistration: string;
  entityType: 'Private Limited' | 'Public Limited' | 'LLP' | 'Partnership' | 'Sole Proprietorship';
  sector: 'Precision Manufacturing' | 'IT & Software Services' | 'Retail & E-Commerce' | 'Healthcare & Pharma' | 'Logistics & Supply Chain';
  annualTurnoverINR: number; // in Crores
  employeeCount: number;
  operatingStates: string[];
  hasGstRegistration: boolean;
  gstin: string;
  msmeCategory: 'Micro' | 'Small' | 'Medium' | 'Non-MSME';
  hasExternalBorrowings: boolean;
  collectsCustomerPersonalData: boolean;
}

export interface ImpactRuleCriterion {
  parameter: string;
  requiredCondition: string;
  businessActual: string;
  isMet: boolean;
}

export interface ImpactAssessment {
  id: string;
  regulationId: string;
  regulationTitle: string;
  authority: IssuingAuthority;
  clauseRef: string;
  status: ApplicabilityStatus;
  criteriaChecked: ImpactRuleCriterion[];
  supportingPassage: string;
  unresolvedConditions: string[];
  humanReviewRecommendation: string;
  potentialExposureSummary: string;
  lastEvaluatedAt: string;
}

export interface ComplianceAction {
  id: string;
  title: string;
  sourceRegulation: string;
  regulationId: string;
  supportingClause: string;
  dueDate: string | null; // Null if not in source
  owner: string;
  status: ActionStatus;
  priority: ActionPriority;
  notes?: string;
  completedAt?: string;
  completedBy?: string;
}

export interface SourceAdapter {
  id: string;
  name: string;
  sourceAuthority: IssuingAuthority;
  endpointUrl: string;
  type: 'Official Gazette RSS' | 'MCA21 e-Portal Feed' | 'RBI Master Directions API' | 'CBIC GST Notifications Gateway' | 'DPDP Portal';
  status: 'Ready (Adapter Standby)' | 'Simulated Polling' | 'Unconnected';
  lastPolled: string;
  cadence: string;
  totalDocumentsIngested: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  targetId: string;
  notes: string;
}
