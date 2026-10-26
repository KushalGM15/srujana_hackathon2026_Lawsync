import React, { useState, useEffect } from 'react';
import { Navigation, NavTab } from './components/Navigation';
import { TopBar } from './components/TopBar';
import { Overview } from './components/Overview';
import { DocumentComparisonStudio } from './components/DocumentComparisonStudio';
import { BusinessImpactAnalysis } from './components/BusinessImpactAnalysis';
import { ActionTracker } from './components/ActionTracker';
import { RegulatoryLibrary } from './components/RegulatoryLibrary';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { AdminReview } from './components/AdminReview';
import { BusinessProfileView } from './components/BusinessProfileView';
import { SettingsView } from './components/SettingsView';

import { 
  SEED_COMPARISON_PAIRS, 
  SEED_REGULATORY_DOCUMENTS, 
  INITIAL_BUSINESS_PROFILE, 
  SEED_COMPLIANCE_ACTIONS, 
  SEED_SOURCE_ADAPTERS, 
  SEED_AUDIT_LOGS,
  computeImpactAssessments 
} from './data/seedData';
import type { 
  BusinessProfile, 
  ComplianceAction, 
  DocumentComparisonPair, 
  RegulatoryDocument, 
  SourceAdapter, 
  AuditLogEntry, 
  DiffChunk,
  ActionStatus,
  VerificationStatus,
  IssuingAuthority 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('compare'); // Start in Document Comparison Studio as recommended by prompt!
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [searchQuery, setSearchTerm] = useState<string>('');
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Core Data Stores (initialized with seed data, synced with /api where available)
  const [profile, setProfile] = useState<BusinessProfile>(INITIAL_BUSINESS_PROFILE);
  const [comparisons, setComparisons] = useState<DocumentComparisonPair[]>(SEED_COMPARISON_PAIRS);
  const [documents, setDocuments] = useState<RegulatoryDocument[]>(SEED_REGULATORY_DOCUMENTS);
  const [actions, setActions] = useState<ComplianceAction[]>(SEED_COMPLIANCE_ACTIONS);
  const [adapters, setAdapters] = useState<SourceAdapter[]>(SEED_SOURCE_ADAPTERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(SEED_AUDIT_LOGS);

  const [selectedComparisonId, setSelectedComparisonId] = useState<string>(
    SEED_COMPARISON_PAIRS[0]?.id || ''
  );

  // Computed Impact Assessments (reactive to current profile)
  const impacts = React.useMemo(() => {
    return computeImpactAssessments(profile, comparisons);
  }, [profile, comparisons]);

  // Sync with server API on mount
  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.documents?.length) setDocuments(data.documents);
      })
      .catch(() => {});

    fetch('/api/comparisons')
      .then(res => res.json())
      .then(data => {
        if (data.comparisons?.length) setComparisons(data.comparisons);
      })
      .catch(() => {});

    fetch('/api/actions')
      .then(res => res.json())
      .then(data => {
        if (data.actions?.length) setActions(data.actions);
      })
      .catch(() => {});

    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) setProfile(data.profile);
      })
      .catch(() => {});
  }, []);

  // Handlers
  const handleUpdateProfile = (updated: Partial<BusinessProfile>) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);

    // Save to server
    fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProfile),
    }).catch(() => {});

    // Add audit entry
    const newLog: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' IST',
      actor: 'SME Officer',
      role: 'Business Compliance',
      action: 'Updated Business Profile Facts',
      targetId: newProfile.cin,
      notes: `Updated profile parameters: Turnover ₹${newProfile.annualTurnoverINR}Cr`,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateActionStatus = (id: string, status: ActionStatus) => {
    setActions(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              status,
              completedAt: status === 'Completed' ? new Date().toISOString() : undefined,
            }
          : a
      )
    );

    fetch(`/api/actions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  const handleAddAction = (actionData: Partial<ComplianceAction>) => {
    const newAction: ComplianceAction = {
      id: `act-${Date.now()}`,
      title: actionData.title || 'New Compliance Requirement',
      sourceRegulation: actionData.sourceRegulation || 'Manual Action',
      regulationId: actionData.regulationId || '',
      supportingClause: actionData.supportingClause || 'N/A',
      dueDate: actionData.dueDate || null,
      owner: actionData.owner || 'Compliance Lead',
      status: 'Not Started',
      priority: actionData.priority || 'Medium',
      notes: actionData.notes || '',
    };

    setActions(prev => [newAction, ...prev]);

    fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAction),
    }).catch(() => {});
  };

  const handleCreateActionFromClause = (
    clause: DiffChunk,
    regulationTitle: string,
    regulationId: string
  ) => {
    const newAction: ComplianceAction = {
      id: `act-${Date.now()}`,
      title: `Comply with ${clause.clauseNumber}: ${clause.title}`,
      sourceRegulation: regulationTitle,
      regulationId,
      supportingClause: `${clause.clauseNumber} (${clause.sectionRef})`,
      dueDate: clause.deadline || null,
      owner: 'Corporate Counsel / Compliance',
      status: 'In Progress',
      priority: clause.changeType === 'modified' ? 'Critical' : 'High',
      notes: clause.plainLanguageExplanation,
    };

    setActions(prev => [newAction, ...prev]);
    setActiveTab('actions');
  };

  const handleDocumentIngested = async (docData: {
    title: string;
    authority: IssuingAuthority;
    identifier: string;
    rawText: string;
    gazetteRef: string;
    effectiveDate: string;
  }) => {
    try {
      const res = await fetch('/api/documents/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData),
      });
      const data = await res.json();
      if (data.document && data.comparison) {
        setDocuments(prev => [data.document, ...prev]);
        setComparisons(prev => [data.comparison, ...prev]);
        setSelectedComparisonId(data.comparison.id);
        setActiveTab('compare');
      }
    } catch {
      // Local fallback
      const docId = `doc-${Date.now()}`;
      const newDoc: RegulatoryDocument = {
        id: docId,
        title: docData.title,
        authority: docData.authority,
        jurisdiction: 'Union of India',
        documentIdentifier: docData.identifier,
        publicationDate: new Date().toISOString().split('T')[0],
        effectiveDate: docData.effectiveDate,
        version: '1.0',
        verificationStatus: 'Pending Review',
        summary: docData.rawText.slice(0, 240) + '...',
        sourceUrl: 'Internal Repository Upload',
        extractedClausesCount: 1,
        tags: ['Uploaded', docData.authority],
      };
      setDocuments(prev => [newDoc, ...prev]);
      setActiveTab('compare');
    }
  };

  const handleUpdateDocumentStatus = (
    docId: string,
    status: VerificationStatus,
    reviewerNotes: string
  ) => {
    setDocuments(prev =>
      prev.map(d =>
        d.id === docId
          ? {
              ...d,
              verificationStatus: status,
              reviewer: {
                name: 'Senior Counsel Reviewer',
                reviewedAt: new Date().toISOString(),
              },
            }
          : d
      )
    );

    setComparisons(prev =>
      prev.map(c =>
        c.id === docId
          ? {
              ...c,
              status,
            }
          : c
      )
    );

    const log: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' IST',
      actor: 'Statutory Counsel',
      role: 'Reviewer',
      action: `Set Status to ${status}`,
      targetId: docId,
      notes: reviewerNotes,
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const tabLabels: Record<NavTab, string> = {
    overview: 'Regulatory Intelligence Command Center',
    library: 'Regulatory Library & Gazette Dossiers',
    compare: 'Document Comparison Studio',
    impact: 'Business Impact Analysis',
    actions: 'Action Tracker & Statutory Obligations',
    profile: 'Business Profile & Matching Criteria',
    settings: 'Settings & Official Source Adapters',
    'admin-review': 'Counsel Source Review & Provenance Audit',
  };

  const pendingReviewCount = documents.filter(d => d.verificationStatus === 'Pending Review').length;
  const criticalActionsCount = actions.filter(
    a => a.priority === 'Critical' && a.status !== 'Completed'
  ).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F7FB] text-[#111827]">
      {/* Midnight Cobalt Left Navigation Sidebar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        pendingReviewCount={pendingReviewCount}
        criticalActionsCount={criticalActionsCount}
        companyName={profile.companyName}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <TopBar
          currentTabName={tabLabels[activeTab]}
          onOpenUpload={() => setIsUploadOpen(true)}
          onQuickAnalyze={() => {
            setSelectedComparisonId(comparisons[0]?.id || '');
            setActiveTab('compare');
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchTerm}
          isAdmin={isAdmin}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <Overview
              documents={documents}
              comparisons={comparisons}
              actions={actions}
              profile={profile}
              impacts={impacts}
              adapters={adapters}
              onNavigateToCompare={(id) => {
                setSelectedComparisonId(id);
                setActiveTab('compare');
              }}
              onNavigateToActions={() => setActiveTab('actions')}
              onNavigateToImpact={() => setActiveTab('impact')}
              onOpenUpload={() => setIsUploadOpen(true)}
              onQuickAnalyze={() => {
                setSelectedComparisonId(comparisons[0]?.id || '');
                setActiveTab('compare');
              }}
            />
          )}

          {activeTab === 'compare' && (
            <DocumentComparisonStudio
              comparisons={comparisons}
              selectedComparisonId={selectedComparisonId}
              onSelectComparison={setSelectedComparisonId}
              onCreateActionFromClause={handleCreateActionFromClause}
            />
          )}

          {activeTab === 'impact' && (
            <BusinessImpactAnalysis
              impacts={impacts}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onNavigateToCompare={(id) => {
                setSelectedComparisonId(id);
                setActiveTab('compare');
              }}
            />
          )}

          {activeTab === 'actions' && (
            <ActionTracker
              actions={actions}
              onUpdateActionStatus={handleUpdateActionStatus}
              onAddAction={handleAddAction}
              onNavigateToCompare={(id) => {
                setSelectedComparisonId(id);
                setActiveTab('compare');
              }}
            />
          )}

          {activeTab === 'library' && (
            <RegulatoryLibrary
              documents={documents}
              onSelectDocumentForCompare={(docId) => {
                setSelectedComparisonId(docId);
                setActiveTab('compare');
              }}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {activeTab === 'profile' && (
            <BusinessProfileView
              profile={profile}
              onSaveProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              adapters={adapters}
              auditLogs={auditLogs}
              actions={actions}
              profile={profile}
              impacts={impacts}
            />
          )}

          {activeTab === 'admin-review' && (
            <AdminReview
              documents={documents}
              auditLogs={auditLogs}
              onUpdateDocumentStatus={handleUpdateDocumentStatus}
              onNavigateToCompare={(docId) => {
                setSelectedComparisonId(docId);
                setActiveTab('compare');
              }}
            />
          )}
        </main>
      </div>

      {/* Upload Document Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentIngested={handleDocumentIngested}
      />
    </div>
  );
}
