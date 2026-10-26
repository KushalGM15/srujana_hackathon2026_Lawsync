import { jsPDF } from 'jspdf';
import type { ImpactAssessment, BusinessProfile } from '../types';

interface GeneratePdfOptions {
  profile: BusinessProfile;
  impacts: ImpactAssessment[];
  includeNotApplicable?: boolean;
  preparedBy?: string;
}

export function generateImpactPdf({
  profile,
  impacts,
  includeNotApplicable = true,
  preparedBy = 'Compliance Officer / Corporate Secretarial Practice'
}: GeneratePdfOptions): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  // Helper for adding new page with header/footer
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
      renderPageHeader();
    }
  };

  const renderPageHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(69, 104, 245); // Cobalt #4568F5
    doc.text('CLAUSESIGNAL', margin, 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 112, 133);
    doc.text('Statutory Regulatory Intelligence Dossier · Indian SME Compliance', margin + 28, 12);

    doc.setDrawColor(229, 233, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 14, pageWidth - margin, 14);
  };

  const renderPageFooter = (pageNumber: number, totalPages: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 150, 165);
    
    const footerText = 'Privileged & Confidential · Prepared for Management & Statutory Audit Committee';
    doc.text(footerText, margin, pageHeight - 10);
    
    const pageText = `Page ${pageNumber} of ${totalPages}`;
    doc.text(pageText, pageWidth - margin - doc.getTextWidth(pageText), pageHeight - 10);
    
    doc.setDrawColor(229, 233, 240);
    doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);
  };

  // --- COVER / HEADER SECTION ---
  // Top Banner Box
  doc.setFillColor(11, 16, 32); // Midnight #0B1020
  doc.rect(margin, y, contentWidth, 32, 'F');

  // Accent Line
  doc.setFillColor(69, 104, 245); // Cobalt #4568F5
  doc.rect(margin, y, 4, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('BUSINESS IMPACT & STATUTORY APPLICABILITY REPORT', margin + 8, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Evaluation of Gazette Notifications & SME Operational Liability`, margin + 8, y + 19);
  doc.text(`Target Entity: ${profile.companyName} (${profile.cin})`, margin + 8, y + 26);

  y += 38;

  // Metadata Grid
  doc.setFillColor(245, 247, 251); // #F5F7FB
  doc.setDrawColor(229, 233, 240);
  doc.rect(margin, y, contentWidth, 24, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(100, 112, 133);
  doc.text('REPORT GENERATED', margin + 4, y + 6);
  doc.text('ANNUAL TURNOVER', margin + 46, y + 6);
  doc.text('MSME STATUS', margin + 90, y + 6);
  doc.text('AUDIT EVALUATOR', margin + 130, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  doc.text(dateStr, margin + 4, y + 12);
  doc.text(`INR ${profile.annualTurnoverINR} Crore`, margin + 46, y + 12);
  doc.text(`${profile.msmeCategory} Enterprise`, margin + 90, y + 12);
  doc.text(profile.entityType, margin + 130, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 112, 133);
  doc.text(`Operating States: ${profile.operatingStates.join(', ')}`, margin + 4, y + 19);
  doc.text(`GSTIN: ${profile.gstin}`, margin + 90, y + 19);
  doc.text(`Udyam: ${profile.udyamRegistration || 'N/A'}`, margin + 130, y + 19);

  y += 30;

  // --- EXECUTIVE SUMMARY SECTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  doc.text('1. EXECUTIVE SUMMARY & STATUTORY EXPOSURE INDEX', margin, y);
  y += 5;

  const applicable = impacts.filter(i => i.status === 'Potentially Applicable');
  const needsReview = impacts.filter(i => i.status === 'Needs Human Review');
  const notApplicable = impacts.filter(i => i.status === 'Not Applicable');

  // Summary box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 233, 240);
  doc.rect(margin, y, contentWidth, 22, 'FD');

  const statColWidth = contentWidth / 4;
  
  // Total
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 112, 133);
  doc.text('REGULATIONS ANALYZED', margin + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text(`${impacts.length}`, margin + 4, y + 14);

  // Applicable
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9); // Amber
  doc.text('POTENTIALLY APPLICABLE', margin + statColWidth + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(180, 83, 9);
  doc.text(`${applicable.length}`, margin + statColWidth + 4, y + 14);

  // Needs Review
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(69, 104, 245); // Cobalt
  doc.text('NEEDS HUMAN REVIEW', margin + statColWidth * 2 + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(69, 104, 245);
  doc.text(`${needsReview.length}`, margin + statColWidth * 2 + 4, y + 14);

  // Not Applicable
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 163, 74); // Green
  doc.text('NOT APPLICABLE', margin + statColWidth * 3 + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(22, 163, 74);
  doc.text(`${notApplicable.length}`, margin + statColWidth * 3 + 4, y + 14);

  y += 28;

  // Executive Overview Paragraph
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const execText = `This report evaluates the legal and operational exposure for ${profile.companyName} based on verified statutory Gazette notifications. Under Section 43B(h) of the Income-tax Act read with MCA Orders, the entity's trade creditors require mandatory audit verification to prevent income tax disallowances on delayed supplier settlements exceeding 45 days. Concurrently, aggregate turnover of INR ${profile.annualTurnoverINR} Cr activates Rule 48(4) mandatory B2B electronic invoicing via government IRP portals.`;
  const splitExec = doc.splitTextToSize(execText, contentWidth);
  doc.text(splitExec, margin, y);
  y += splitExec.length * 4.2 + 6;

  // --- DETAILED STATUTORY ASSESSMENTS ---
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  doc.text('2. DETAILED STATUTORY APPLICABILITY BREAKDOWN', margin, y);
  y += 6;

  const displayedImpacts = includeNotApplicable ? impacts : impacts.filter(i => i.status !== 'Not Applicable');

  displayedImpacts.forEach((item, index) => {
    checkPageBreak(50);

    // Card Container
    const cardStartY = y;
    
    // Header line
    doc.setFillColor(245, 247, 251);
    doc.setDrawColor(229, 233, 240);
    doc.rect(margin, y, contentWidth, 9, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(17, 24, 39);
    doc.text(`${index + 1}. [${item.authority}] ${item.regulationTitle}`, margin + 3, y + 6);

    // Status Badge on Right
    doc.setFontSize(7.5);
    if (item.status === 'Potentially Applicable') {
      doc.setFillColor(254, 243, 199);
      doc.setTextColor(146, 64, 14);
      doc.rect(pageWidth - margin - 38, y + 1.5, 36, 6, 'F');
      doc.text('POTENTIALLY APPLICABLE', pageWidth - margin - 36, y + 5.5);
    } else if (item.status === 'Needs Human Review') {
      doc.setFillColor(238, 242, 255);
      doc.setTextColor(69, 104, 245);
      doc.rect(pageWidth - margin - 36, y + 1.5, 34, 6, 'F');
      doc.text('NEEDS HUMAN REVIEW', pageWidth - margin - 34, y + 5.5);
    } else {
      doc.setFillColor(241, 245, 249);
      doc.setTextColor(100, 116, 139);
      doc.rect(pageWidth - margin - 30, y + 1.5, 28, 6, 'F');
      doc.text('NOT APPLICABLE', pageWidth - margin - 28, y + 5.5);
    }

    y += 13;

    // Clause Ref & Exposure
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 112, 133);
    doc.text('CLAUSE REF:', margin + 3, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    doc.text(item.clauseRef, margin + 26, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 112, 133);
    doc.text('EXPOSURE:', margin + 3, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitExp = doc.splitTextToSize(item.potentialExposureSummary, contentWidth - 28);
    doc.text(splitExp, margin + 26, y);
    y += splitExp.length * 4 + 2;

    // Matched Criteria table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 112, 133);
    doc.text('VERIFIED FACT MATCHING:', margin + 3, y);
    y += 4;

    item.criteriaChecked.forEach(crit => {
      checkPageBreak(10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(crit.isMet ? 22 : 120, crit.isMet ? 101 : 130, crit.isMet ? 52 : 145);
      doc.text(crit.isMet ? '[MET]' : '[UNMET]', margin + 5, y);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(17, 24, 39);
      doc.text(`${crit.parameter}:`, margin + 17, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const factLine = `${crit.businessActual} (Statutory condition: ${crit.requiredCondition})`;
      const splitFact = doc.splitTextToSize(factLine, contentWidth - 45);
      doc.text(splitFact, margin + 45, y);
      y += splitFact.length * 3.8 + 1;
    });

    // Verbatim Source Excerpt Box
    checkPageBreak(18);
    y += 2;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    const sourceText = `Gazette Citation Passage: ${item.supportingPassage}`;
    const splitSource = doc.splitTextToSize(sourceText, contentWidth - 8);
    const sourceBoxHeight = splitSource.length * 3.6 + 6;
    doc.rect(margin + 2, y, contentWidth - 4, sourceBoxHeight, 'FD');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text(splitSource, margin + 5, y + 4.5);
    y += sourceBoxHeight + 4;

    // Recommendation
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(69, 104, 245);
    doc.text('ACTION RECOMMENDATION:', margin + 3, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    const splitRec = doc.splitTextToSize(item.humanReviewRecommendation, contentWidth - 45);
    doc.text(splitRec, margin + 45, y);
    y += splitRec.length * 4 + 6;

    // Divider Line
    doc.setDrawColor(229, 233, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  });

  // --- SIGN-OFF & CERTIFICATION BLOCK ---
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  doc.text('3. COMPLIANCE CERTIFICATION & BOARD SIGN-OFF', margin, y);
  y += 6;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 233, 240);
  doc.rect(margin, y, contentWidth, 28, 'FD');

  const halfWidth = contentWidth / 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 112, 133);
  doc.text('PREPARED & VERIFIED BY:', margin + 5, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(preparedBy, margin + 5, y + 12);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 112, 133);
  doc.text(`Digital Verification Timestamp: ${new Date().toISOString()}`, margin + 5, y + 18);
  doc.text('System Integrity: Gazette Grounding Engine verified', margin + 5, y + 23);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 112, 133);
  doc.text('STAKEHOLDER / BOARD RECEIPT:', margin + halfWidth + 5, y + 6);
  doc.setDrawColor(203, 213, 225);
  doc.line(margin + halfWidth + 5, y + 18, margin + contentWidth - 5, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 112, 133);
  doc.text('Authorized Director / Chief Financial Officer Signature', margin + halfWidth + 5, y + 22);

  // Add page numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    renderPageFooter(i, totalPages);
  }

  return doc;
}
