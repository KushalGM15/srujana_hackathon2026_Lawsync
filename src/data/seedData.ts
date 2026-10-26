import { DocumentComparisonPair, RegulatoryDocument, BusinessProfile, ComplianceAction, SourceAdapter, AuditLogEntry, ImpactAssessment } from '../types';

export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  companyName: 'Apex Precision Engineering Pvt. Ltd.',
  cin: 'U29253PN2018PTC178921',
  udyamRegistration: 'UDYAM-MH-26-0045182',
  entityType: 'Private Limited',
  sector: 'Precision Manufacturing',
  annualTurnoverINR: 14.5, // 14.5 Crores
  employeeCount: 48,
  operatingStates: ['Maharashtra', 'Karnataka', 'Gujarat'],
  hasGstRegistration: true,
  gstin: '27AABCA4821N1ZS',
  msmeCategory: 'Small',
  hasExternalBorrowings: true,
  collectsCustomerPersonalData: true,
};

export const SEED_COMPARISON_PAIRS: DocumentComparisonPair[] = [
  {
    id: 'mca-msme-43bh-2024',
    title: 'Companies (Accounts) Rules & MSME-1 Payment Disclosure Cap Amendment',
    authority: 'MCA',
    identifier: 'F. No. 01/02/2024-CL-V',
    jurisdiction: 'Union of India',
    status: 'Verified',
    summary: 'Enforces statutory compliance under Section 43B(h) of the Income-tax Act, 1961 and amends half-yearly reporting under Section 405(4) of Companies Act, 2013, mandating strict payment within 45 days to registered Micro and Small enterprises.',
    previousVersion: {
      versionNumber: 'Ver 2.1 (2020)',
      publicationDate: '2020-01-22',
      documentTitle: 'Specified Companies (Furnishing of information about payment to micro and small enterprise suppliers) Order, 2019',
      gazetteRef: 'S.O. 562(E) dated 22nd January, 2019',
    },
    updatedVersion: {
      versionNumber: 'Ver 3.0 (2024)',
      publicationDate: '2024-03-15',
      documentTitle: 'Specified Companies (Furnishing of information about payment to micro and small enterprise suppliers) Amendment Order, 2024',
      gazetteRef: 'G.S.R. 208(E) dated 15th March, 2024',
      effectiveDate: '2024-04-01',
    },
    gazetteExcerpt: `MINISTRY OF CORPORATE AFFAIRS
NOTIFICATION
New Delhi, the 15th March, 2024
G.S.R. 208(E).—In exercise of the powers conferred by sub-section (1) of section 405 of the Companies Act, 2013 (18 of 2013), the Central Government hereby makes the following Order to amend the Specified Companies (Furnishing of information about payment to micro and small enterprise suppliers) Order, 2019.
1. Short title and commencement.—(1) This Order may be called the Specified Companies (Furnishing of information about payment to micro and small enterprise suppliers) Amendment Order, 2024.
(2) It shall come into force on the 1st day of April, 2024.
2. In the principal Order, in paragraph 3, for the words "every half year within thirty days", the words "every half year in revised Form MSME-1 detailing reasons for delay exceeding forty-five days along with auditor confirmation of Udyam verification" shall be substituted.`,
    clauses: [
      {
        id: 'mca-cl-1',
        clauseNumber: 'Clause 3(1)',
        sectionRef: 'Section 405(1) read with Section 15 of MSMED Act',
        title: 'Supplier Payment Settlement Horizon',
        changeType: 'modified',
        previousText: 'Every specified company shall make payment to micro and small enterprise suppliers within a mutually agreed period not exceeding thirty days from the date of acceptance of goods or services, failing which interest under Section 16 shall accrue.',
        updatedText: 'Every specified company shall make payment to registered micro and small enterprise suppliers strictly within forty-five days where agreed in writing, or within fifteen days in the absence of agreement, failing which the expenditure shall be disallowed under Section 43B(h) of the Income-tax Act and reported under revised Form MSME-1.',
        previousPage: 3,
        updatedPage: 4,
        plainLanguageExplanation: 'The settlement window is now strictly tied to the MSMED Act statutory ceilings (45 days with written agreement; 15 days without). Non-compliance now triggers automatic income tax disallowance under Section 43B(h) alongside mandatory filing in Form MSME-1.',
        supportingCitations: [
          'G.S.R. 208(E), Paragraph 2, Page 4',
          'Section 15, Micro, Small and Medium Enterprises Development Act, 2006',
          'Finance Act 2023, Section 43B(h) enactment'
        ],
        effectiveDate: '2024-04-01',
        deadline: '2024-04-30 (End of financial year reporting cutoff)',
        confidenceScore: 0.98,
        reviewStatus: 'Verified',
        tokens: [
          { type: 'same', value: 'Every specified company shall make payment to ' },
          { type: 'added', value: 'registered ' },
          { type: 'same', value: 'micro and small enterprise suppliers ' },
          { type: 'removed', value: 'within a mutually agreed period not exceeding thirty days' },
          { type: 'added', value: 'strictly within forty-five days where agreed in writing, or within fifteen days in the absence of agreement' },
          { type: 'same', value: ', failing which ' },
          { type: 'removed', value: 'interest under Section 16 shall accrue.' },
          { type: 'added', value: 'the expenditure shall be disallowed under Section 43B(h) of the Income-tax Act and reported under revised Form MSME-1.' }
        ]
      },
      {
        id: 'mca-cl-2',
        clauseNumber: 'Clause 3(2)',
        sectionRef: 'Form MSME-1 Reporting Schedule',
        title: 'Biannual Reporting Cutoff & Udyam Audit Verification',
        changeType: 'modified',
        previousText: 'The return shall be submitted within thirty days from the close of each half year period ending 30th September and 31st March.',
        updatedText: 'The return in revised Form MSME-1 shall be filed within thirty days from the end of each half-year, duly accompanied by statutory auditor certification verifying active Udyam registration numbers for all unpaid supplier accounts exceeding 45 days.',
        previousPage: 4,
        updatedPage: 5,
        plainLanguageExplanation: 'While the half-yearly deadline remains 30 days after half-year end (April 30 and October 31), the new rule introduces a mandatory requirement for statutory auditor verification of the vendor Udyam certificates for all delayed payments.',
        supportingCitations: [
          'G.S.R. 208(E), Para 3(2), Page 5',
          'Companies (Accounts) Fourth Amendment Rules'
        ],
        effectiveDate: '2024-04-01',
        deadline: '2024-04-30 (Biannual filing due date for second half-year)',
        confidenceScore: 0.96,
        reviewStatus: 'Verified',
        tokens: [
          { type: 'same', value: 'The return ' },
          { type: 'added', value: 'in revised Form MSME-1 ' },
          { type: 'same', value: 'shall be ' },
          { type: 'removed', value: 'submitted within thirty days from the close of each half year period ending 30th September and 31st March.' },
          { type: 'added', value: 'filed within thirty days from the end of each half-year, duly accompanied by statutory auditor certification verifying active Udyam registration numbers for all unpaid supplier accounts exceeding 45 days.' }
        ]
      },
      {
        id: 'mca-cl-3',
        clauseNumber: 'Clause 4(A)',
        sectionRef: 'Section 405(4) Penal Consequences',
        title: 'Non-Filing Penalties on Company and Officers in Default',
        changeType: 'added',
        previousText: undefined,
        updatedText: 'Any failure to file Form MSME-1 within the prescribed timeline shall attract penalty under Section 405(4) of the Act of twenty thousand rupees on the company, and in case of continuing failure, one thousand rupees for each day up to a maximum of three lakh rupees.',
        previousPage: undefined,
        updatedPage: 6,
        plainLanguageExplanation: 'New explicit penalty schedule codified for failure to submit Form MSME-1: ₹20,000 base penalty plus ₹1,000/day for continuing defaults, capped at ₹3,00,000.',
        supportingCitations: [
          'G.S.R. 208(E), Item 4, Page 6',
          'Companies Act 2013, Section 405(4)'
        ],
        effectiveDate: '2024-04-01',
        deadline: null,
        confidenceScore: 0.99,
        reviewStatus: 'Verified',
        tokens: [
          { type: 'added', value: 'Any failure to file Form MSME-1 within the prescribed timeline shall attract penalty under Section 405(4) of the Act of twenty thousand rupees on the company, and in case of continuing failure, one thousand rupees for each day up to a maximum of three lakh rupees.' }
        ]
      },
      {
        id: 'mca-cl-4',
        clauseNumber: 'Clause 2(B)',
        sectionRef: 'Definition of Micro and Small Enterprises',
        title: 'Exclusion of Medium Enterprises from 45-Day Disallowance',
        changeType: 'unchanged',
        previousText: 'The provisions shall apply exclusively to suppliers categorized as Micro and Small enterprises as defined under sub-clauses (h) and (m) of Section 2 of the MSMED Act, 2006, and shall not apply to Medium enterprise entities.',
        updatedText: 'The provisions shall apply exclusively to suppliers categorized as Micro and Small enterprises as defined under sub-clauses (h) and (m) of Section 2 of the MSMED Act, 2006, and shall not apply to Medium enterprise entities.',
        previousPage: 2,
        updatedPage: 3,
        plainLanguageExplanation: 'The definition criteria remains unchanged: medium enterprises (turnover ₹50 Cr - ₹250 Cr) do not trigger Section 43B(h) disallowance; only Micro (<₹5 Cr) and Small (<₹50 Cr) enterprises qualify.',
        supportingCitations: [
          'MSMED Act 2006, Section 2(h) & Section 2(m)',
          'CBDT Circular No. 01/2024'
        ],
        effectiveDate: '2024-04-01',
        deadline: null,
        confidenceScore: 1.0,
        reviewStatus: 'Verified',
        tokens: [
          { type: 'same', value: 'The provisions shall apply exclusively to suppliers categorized as Micro and Small enterprises as defined under sub-clauses (h) and (m) of Section 2 of the MSMED Act, 2006, and shall not apply to Medium enterprise entities.' }
        ]
      }
    ]
  },
  {
    id: 'cbic-gst-einvoicing-2024',
    title: 'Central GST Rules: E-Invoicing Threshold & 2FA e-Way Bill Directives',
    authority: 'CBIC',
    identifier: 'Notification No. 10/2024-Central Tax',
    jurisdiction: 'Union of India & State GST',
    status: 'Verified',
    summary: 'Lowers the aggregate turnover threshold for mandatory electronic invoicing under Rule 48(4) of CGST Rules to ₹5 Crore for B2B supplies and introduces mandatory 2-factor authentication for e-Way Bill generation.',
    previousVersion: {
      versionNumber: 'Ver 1.4 (2022)',
      publicationDate: '2022-08-01',
      documentTitle: 'Notification No. 17/2022-Central Tax (E-Invoicing ₹10 Crore Threshold)',
      gazetteRef: 'G.S.R. 612(E) dated 1st August, 2022',
    },
    updatedVersion: {
      versionNumber: 'Ver 2.0 (2024)',
      publicationDate: '2024-02-28',
      documentTitle: 'Notification No. 10/2024-Central Tax (Lowering E-Invoicing Threshold to ₹5 Crore)',
      gazetteRef: 'G.S.R. 142(E) dated 28th February, 2024',
      effectiveDate: '2024-05-01',
    },
    gazetteExcerpt: `MINISTRY OF FINANCE (Department of Revenue)
CENTRAL BOARD OF INDIRECT TAXES AND CUSTOMS
NOTIFICATION
New Delhi, the 28th February, 2024
No. 10/2024–Central Tax
G.S.R. 142(E).—In exercise of the powers conferred by sub-rule (4) of rule 48 of the Central Goods and Services Tax Rules, 2017, the Government, on the recommendations of the Council, hereby notifies that registered persons whose aggregate turnover in any preceding financial year from 2017-18 onwards exceeds five crore rupees, as a class of registered persons who shall prepare invoice and other prescribed documents in terms of sub-rule (4) of rule 48.`,
    clauses: [
      {
        id: 'gst-cl-1',
        clauseNumber: 'Rule 48(4)',
        sectionRef: 'Turnover Threshold for Invoice Registration Portal (IRP)',
        title: 'Aggregate Turnover Threshold Reduction for B2B Invoices',
        changeType: 'modified',
        previousText: 'A registered person whose aggregate turnover in any preceding financial year from 2017-18 onwards exceeds ten crore rupees shall prepare invoice and credit-debit notes via Invoice Registration Portal (IRP) with designated QR code.',
        updatedText: 'A registered person whose aggregate turnover in any preceding financial year from 2017-18 onwards exceeds five crore rupees shall prepare invoice and credit-debit notes via Invoice Registration Portal (IRP) with designated QR code and IRN.',
        previousPage: 1,
        updatedPage: 1,
        plainLanguageExplanation: 'Businesses with annual turnover exceeding ₹5 Crore (reduced from ₹10 Crore) in any year since 2017-18 are now legally mandated to generate electronic invoices through government IRP portals for all B2B and export supplies.',
        supportingCitations: [
          'Notification No. 10/2024-Central Tax, Paragraph 1',
          'CGST Rules 2017, Rule 48(4)'
        ],
        effectiveDate: '2024-05-01',
        deadline: '2024-05-01 (Mandatory go-live for ₹5 Cr+ entities)',
        confidenceScore: 0.99,
        reviewStatus: 'Verified',
        tokens: [
          { type: 'same', value: 'A registered person whose aggregate turnover in any preceding financial year from 2017-18 onwards exceeds ' },
          { type: 'removed', value: 'ten crore rupees' },
          { type: 'added', value: 'five crore rupees' },
          { type: 'same', value: ' shall prepare invoice and credit-debit notes via Invoice Registration Portal (IRP) with designated QR code' },
          { type: 'added', value: ' and IRN.' }
        ]
      },
      {
        id: 'gst-cl-2',
        clauseNumber: 'Rule 138(A)',
        sectionRef: 'e-Way Bill Authentication Architecture',
        title: 'Mandatory Two-Factor Authentication (2FA) for Consignment Portals',
        changeType: 'added',
        previousText: undefined,
        updatedText: 'All taxpayers generating e-Way Bills or consolidated consignment slips shall authenticate user access through time-based OTP or approved authenticator application before generating Part A of e-Way Bill.',
        previousPage: undefined,
        updatedPage: 2,
        plainLanguageExplanation: 'Introduction of mandatory 2FA on the e-Way Bill portal to prevent fraudulent consignment credit transfers. Taxpayers can no longer generate transit slips with password alone.',
        supportingCitations: [
          'CBIC Advisory No. 591 dated 15th January, 2024',
          'CGST Rule 138(1)'
        ],
        effectiveDate: '2024-04-15',
        deadline: '2024-04-15 (Enforcement date for 2FA requirement)',
        confidenceScore: 0.97,
        reviewStatus: 'Verified',
        tokens: [
          { type: 'added', value: 'All taxpayers generating e-Way Bills or consolidated consignment slips shall authenticate user access through time-based OTP or approved authenticator application before generating Part A of e-Way Bill.' }
        ]
      }
    ]
  },
  {
    id: 'rbi-digital-lending-msme-2024',
    title: 'RBI Master Direction: Digital Lending & Standard Key Fact Statement (KFS)',
    authority: 'RBI',
    identifier: 'RBI/2023-24/122 DOR.STR.REC.78/14.01.001/2023-24',
    jurisdiction: 'All Scheduled Commercial Banks, NBFCs & MSME Borrowers',
    status: 'Verified',
    summary: 'Harmonizes Key Fact Statement (KFS) disclosures across all commercial loans to MSMEs, mandates explicit computation of Annual Percentage Rate (APR) inclusive of third-party verification fees, and eliminates undisclosed penal charges.',
    previousVersion: {
      versionNumber: 'Ver 1.0 (2022)',
      publicationDate: '2022-09-02',
      documentTitle: 'Guidelines on Digital Lending (RBI/2022-23/111)',
      gazetteRef: 'RBI Circular DOR.CRE.REC.66/21.07.001/2022-23',
    },
    updatedVersion: {
      versionNumber: 'Ver 2.0 (2024)',
      publicationDate: '2024-04-15',
      documentTitle: 'Key Facts Statement (KFS) for Loans & Advances to MSMEs and Retail Borrowers',
      gazetteRef: 'RBI Notification DOR.STR.REC.78/14.01.001/2023-24',
      effectiveDate: '2024-10-01',
    },
    gazetteExcerpt: `RESERVE BANK OF INDIA
DEPARTMENT OF REGULATION
Circular No. RBI/2023-24/122
April 15, 2024
Key Facts Statement (KFS) for Loans & Advances
1. In order to enhance transparency and reduce information asymmetry regarding financial products offered by Regulated Entities (REs), it has been decided to harmonize the instructions on the Key Facts Statement (KFS) for all retail and MSME term loans.
2. Regulated Entities shall provide a standardized KFS to all prospective borrowers before the execution of the loan contract in the format specified in Annex A.
3. The KFS shall provide an all-inclusive Annual Percentage Rate (APR) and a detailed repayment schedule throughout the tenure of the loan.`,
    clauses: [
      {
        id: 'rbi-cl-1',
        clauseNumber: 'Paragraph 3(a)',
        sectionRef: 'Mandatory Pre-Execution Key Fact Statement',
        title: 'Harmonized KFS Requirement for SME Term Loans',
        changeType: 'modified',
        previousText: 'Regulated entities shall issue a summary sheet containing interest rate and upfront fees to retail digital borrowers prior to loan disbursement.',
        updatedText: 'Regulated Entities shall provide a standardized Key Facts Statement (KFS) in the prescribed format to all MSME and retail borrowers prior to execution of loan contract, with validity period of at least three working days for borrower review.',
        previousPage: 2,
        updatedPage: 3,
        plainLanguageExplanation: 'Lenders must now provide a legally binding standardized Key Fact Statement to MSME borrowers before signing, giving the business at least 3 business days to review all terms, interest rates, and loan charges.',
        supportingCitations: [
          'RBI/2023-24/122, Paragraph 3(a)',
          'Annex A: Standardized Format of Key Facts Statement'
        ],
        effectiveDate: '2024-10-01',
        deadline: '2024-10-01 (Mandatory implementation for all RE agreements)',
        confidenceScore: 0.99,
        reviewStatus: 'Verified',
        tokens: [
          { type: 'same', value: 'Regulated ' },
          { type: 'removed', value: 'entities shall issue a summary sheet containing interest rate and upfront fees to retail digital borrowers prior to loan disbursement.' },
          { type: 'added', value: 'Entities shall provide a standardized Key Facts Statement (KFS) in the prescribed format to all MSME and retail borrowers prior to execution of loan contract, with validity period of at least three working days for borrower review.' }
        ]
      },
      {
        id: 'rbi-cl-2',
        clauseNumber: 'Paragraph 4(c)',
        sectionRef: 'Annual Percentage Rate (APR) Computation',
        title: 'Inclusion of Third-Party Insurance & Processing Fees in APR',
        changeType: 'modified',
        previousText: 'APR shall include interest rate and processing charges levied directly by the lending institution.',
        updatedText: 'APR shall represent the all-inclusive annual cost of credit, encompassing interest, processing fees, documentation charges, and all third-party fees such as credit assessment, legal search, and insurance premiums recovered from the borrower.',
        previousPage: 3,
        updatedPage: 4,
        plainLanguageExplanation: 'Eliminates hidden loan costs for SMEs. Banks and NBFCs must disclose the genuine effective annual rate (APR) including valuation fees, documentation charges, and insurance.',
        supportingCitations: [
          'RBI/2023-24/122, Para 4(c), Page 4'
        ],
        effectiveDate: '2024-10-01',
        deadline: null,
        confidenceScore: 0.98,
        reviewStatus: 'Verified',
        tokens: [
          { type: 'same', value: 'APR shall ' },
          { type: 'removed', value: 'include interest rate and processing charges levied directly by the lending institution.' },
          { type: 'added', value: 'represent the all-inclusive annual cost of credit, encompassing interest, processing fees, documentation charges, and all third-party fees such as credit assessment, legal search, and insurance premiums recovered from the borrower.' }
        ]
      }
    ]
  },
  {
    id: 'dpdp-act-sme-2024',
    title: 'Digital Personal Data Protection (DPDP) Act: Data Fiduciary Obligations',
    authority: 'MeitY',
    identifier: 'The Gazette of India No. 22 of 2023',
    jurisdiction: 'Union of India',
    status: 'Pending Review',
    summary: 'Codifies statutory responsibilities for commercial entities collecting employee and customer personal data, including consent itemization in 22 Eighth Schedule languages and 6-hour intimation to Data Protection Board upon breach.',
    previousVersion: {
      versionNumber: 'Ver 1.0 (2011)',
      publicationDate: '2011-04-11',
      documentTitle: 'Information Technology (Reasonable security practices and procedures) Rules, 2011',
      gazetteRef: 'G.S.R. 313(E) dated 11th April, 2011',
    },
    updatedVersion: {
      versionNumber: 'Act 22 of 2023',
      publicationDate: '2023-08-11',
      documentTitle: 'The Digital Personal Data Protection Act, 2023 (Draft Rules Framework)',
      gazetteRef: 'Act No. 22 of 2023, Ministry of Law and Justice',
      effectiveDate: '2024-11-01',
    },
    gazetteExcerpt: `THE DIGITAL PERSONAL DATA PROTECTION ACT, 2023
NO. 22 OF 2023
[11th August, 2023]
An Act to provide for the processing of digital personal data in a manner that recognises both the right of individuals to protect their personal data and the need to process such personal data for lawful purposes.
Section 6(1): On or before requesting for consent, the Data Fiduciary shall give to the Data Principal a notice informing her of the personal data sought and the purpose of processing.
Section 8(6): In the event of a personal data breach, the Data Fiduciary shall give the Board and each affected Data Principal intimation of such breach in such form and manner as may be prescribed.`,
    clauses: [
      {
        id: 'dpdp-cl-1',
        clauseNumber: 'Section 6(1) read with Rule 3',
        sectionRef: 'Notice and Multilingual Consent Architecture',
        title: 'Itemized Notice in English or 22 Scheduled Indian Languages',
        changeType: 'added',
        previousText: undefined,
        updatedText: 'Before or at the time of requesting consent, every Data Fiduciary shall provide an itemized notice specifying data categories and processing purposes, with option to access such notice in English or any language specified in the Eighth Schedule to the Constitution.',
        previousPage: undefined,
        updatedPage: 5,
        plainLanguageExplanation: 'SMEs that maintain customer, vendor, or employee portals must present an itemized privacy notice specifying why each data point is collected, with optional language switches for Indian languages.',
        supportingCitations: [
          'DPDP Act 2023, Section 6(1)',
          'Draft DPDP Rules, Schedule II'
        ],
        effectiveDate: '2024-11-01',
        deadline: '2024-11-01 (Statutory compliance deadline)',
        confidenceScore: 0.91,
        reviewStatus: 'Needs Review',
        tokens: [
          { type: 'added', value: 'Before or at the time of requesting consent, every Data Fiduciary shall provide an itemized notice specifying data categories and processing purposes, with option to access such notice in English or any language specified in the Eighth Schedule to the Constitution.' }
        ]
      },
      {
        id: 'dpdp-cl-2',
        clauseNumber: 'Section 8(6)',
        sectionRef: 'Security Safeguards and Breach Intimation',
        title: 'Mandatory Personal Data Breach Notification within 6 Hours',
        changeType: 'modified',
        previousText: 'Body corporate shall implement reasonable security practices and report significant cyber security incidents to CERT-In in accordance with Information Technology Act guidelines.',
        updatedText: 'In the event of any personal data breach affecting digital personal data, the Data Fiduciary shall immediately, and not later than six hours from discovery, notify the Data Protection Board of India and each affected Data Principal.',
        previousPage: 4,
        updatedPage: 8,
        plainLanguageExplanation: 'Tightens the incident notification window: any breach involving stored customer or employee personal data must be reported to the DPBI and affected individuals without delay (within 6 hours).',
        supportingCitations: [
          'DPDP Act 2023, Section 8(6)',
          'CERT-In Cyber Security Directions (2022)'
        ],
        effectiveDate: '2024-11-01',
        deadline: null,
        confidenceScore: 0.88,
        reviewStatus: 'Needs Review',
        tokens: [
          { type: 'same', value: 'In the event of any personal data breach ' },
          { type: 'removed', value: 'Body corporate shall implement reasonable security practices and report significant cyber security incidents to CERT-In in accordance with Information Technology Act guidelines.' },
          { type: 'added', value: 'affecting digital personal data, the Data Fiduciary shall immediately, and not later than six hours from discovery, notify the Data Protection Board of India and each affected Data Principal.' }
        ]
      }
    ]
  }
];

export const SEED_REGULATORY_DOCUMENTS: RegulatoryDocument[] = [
  {
    id: 'mca-msme-43bh-2024',
    title: 'Companies (Accounts) Rules & Form MSME-1 Amendment (Section 43B(h))',
    authority: 'MCA',
    jurisdiction: 'Union of India',
    documentIdentifier: 'F. No. 01/02/2024-CL-V / G.S.R. 208(E)',
    publicationDate: '2024-03-15',
    effectiveDate: '2024-04-01',
    version: '3.0',
    verificationStatus: 'Verified',
    summary: 'Codifies strict 45-day payment cap for registered Micro and Small suppliers, disallowing outstanding unpaid sums under Section 43B(h) of Income-tax Act and penalizing non-filing under Section 405(4).',
    sourceUrl: 'https://www.mca.gov.in/content/mca/global/en/notifications.html',
    extractedClausesCount: 4,
    reviewer: {
      name: 'R. K. Iyer (Principal Legal Counsel)',
      reviewedAt: '2024-03-18T10:30:00Z',
    },
    tags: ['MSME', 'Section 43B(h)', 'Companies Act', 'Form MSME-1', 'Income Tax'],
  },
  {
    id: 'cbic-gst-einvoicing-2024',
    title: 'Notification No. 10/2024-Central Tax: Lowering E-Invoicing Threshold to ₹5 Crore',
    authority: 'CBIC',
    jurisdiction: 'Union of India & State GST',
    documentIdentifier: 'Notification No. 10/2024-Central Tax / G.S.R. 142(E)',
    publicationDate: '2024-02-28',
    effectiveDate: '2024-05-01',
    version: '2.0',
    verificationStatus: 'Verified',
    summary: 'Reduces aggregate turnover threshold for mandatory electronic invoicing under Rule 48(4) of CGST Rules from ₹10 Crore to ₹5 Crore for all B2B supplies.',
    sourceUrl: 'https://cbic-gst.gov.in/central-tax-notifications.html',
    extractedClausesCount: 2,
    reviewer: {
      name: 'P. Sengupta (GST Advisory Practice)',
      reviewedAt: '2024-03-02T14:15:00Z',
    },
    tags: ['GST', 'E-Invoicing', 'Rule 48(4)', 'B2B', 'IRP'],
  },
  {
    id: 'rbi-digital-lending-msme-2024',
    title: 'RBI Master Direction: Standard Key Fact Statement (KFS) for MSME Loans',
    authority: 'RBI',
    jurisdiction: 'All Scheduled Commercial Banks & NBFCs',
    documentIdentifier: 'RBI/2023-24/122 DOR.STR.REC.78/14.01.001/2023-24',
    publicationDate: '2024-04-15',
    effectiveDate: '2024-10-01',
    version: '2.0',
    verificationStatus: 'Verified',
    summary: 'Harmonizes Key Fact Statement disclosures across all commercial loans to MSMEs, mandating explicit computation of APR inclusive of third-party verification fees.',
    sourceUrl: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
    extractedClausesCount: 2,
    reviewer: {
      name: 'Anita Deshmukh (Banking Regulatory Specialist)',
      reviewedAt: '2024-04-18T09:00:00Z',
    },
    tags: ['RBI', 'Digital Lending', 'MSME Borrowings', 'APR', 'Key Fact Statement'],
  },
  {
    id: 'dpdp-act-sme-2024',
    title: 'The Digital Personal Data Protection Act, 2023 (Draft Rules Framework)',
    authority: 'MeitY',
    jurisdiction: 'Union of India',
    documentIdentifier: 'Act No. 22 of 2023',
    publicationDate: '2023-08-11',
    effectiveDate: '2024-11-01',
    version: '1.0',
    verificationStatus: 'Pending Review',
    summary: 'Legal framework governing processing of digital personal data. Mandates itemized multilingual notice, consent managers, and 6-hour breach reporting to Data Protection Board.',
    sourceUrl: 'https://www.meity.gov.in/data-protection-framework',
    extractedClausesCount: 2,
    reviewer: undefined,
    tags: ['Data Privacy', 'DPDP Act', 'MeitY', 'Consent Architecture', 'Compliance'],
  }
];

export const SEED_COMPLIANCE_ACTIONS: ComplianceAction[] = [
  {
    id: 'act-001',
    title: 'Audit Creditor Aging Ledger for Micro & Small Suppliers (45-Day Cap)',
    sourceRegulation: 'Companies (Accounts) Rules & Form MSME-1 Amendment',
    regulationId: 'mca-msme-43bh-2024',
    supportingClause: 'Clause 3(1) (G.S.R. 208(E))',
    dueDate: '2024-04-30',
    owner: 'CFO / Accounts Lead',
    status: 'In Progress',
    priority: 'Critical',
    notes: 'Verify Udyam numbers of all active vendors in Tally/SAP to identify Micro and Small suppliers eligible under Section 43B(h).',
  },
  {
    id: 'act-002',
    title: 'Integrate ERP with Invoice Registration Portal (IRP) for B2B E-Invoicing',
    sourceRegulation: 'Notification No. 10/2024-Central Tax (₹5 Cr Threshold)',
    regulationId: 'cbic-gst-einvoicing-2024',
    supportingClause: 'Rule 48(4) (G.S.R. 142(E))',
    dueDate: '2024-05-01',
    owner: 'IT & Billing Systems Lead',
    status: 'Not Started',
    priority: 'High',
    notes: 'Since Apex turnover is ₹14.5 Cr (>₹5 Cr threshold), generation of IRN and QR code on all B2B invoices is statutory.',
  },
  {
    id: 'act-003',
    title: 'File Half-Yearly Form MSME-1 with Auditor Udyam Verification',
    sourceRegulation: 'Companies (Accounts) Rules & Form MSME-1 Amendment',
    regulationId: 'mca-msme-43bh-2024',
    supportingClause: 'Clause 3(2) (Para 3(2), Page 5)',
    dueDate: '2024-04-30',
    owner: 'Company Secretary',
    status: 'Not Started',
    priority: 'Critical',
    notes: 'Obtain certificate from Statutory Auditor confirming Udyam certificate validity for all unpaid balances past 45 days.',
  },
  {
    id: 'act-004',
    title: 'Request Standard Key Fact Statement (KFS) from Working Capital Lenders',
    sourceRegulation: 'RBI Master Direction: Standard Key Fact Statement',
    regulationId: 'rbi-digital-lending-msme-2024',
    supportingClause: 'Paragraph 3(a) (RBI/2023-24/122)',
    dueDate: '2024-10-01',
    owner: 'Finance Manager',
    status: 'Not Started',
    priority: 'Medium',
    notes: 'Verify effective APR computation on existing Cash Credit / Term Loan renewal agreements.',
  },
  {
    id: 'act-005',
    title: 'Review Employee & Customer Portal Privacy Notice for DPDP Act Readiness',
    sourceRegulation: 'The Digital Personal Data Protection Act, 2023',
    regulationId: 'dpdp-act-sme-2024',
    supportingClause: 'Section 6(1) read with Rule 3',
    dueDate: null, // Source states: "No deadline identified in the source."
    owner: 'Operations / Legal',
    status: 'Not Started',
    priority: 'Medium',
    notes: 'Draft multilingual notice for web portal and vendor onboarding forms once official DPDP rules are gazetted.',
  }
];

export const SEED_SOURCE_ADAPTERS: SourceAdapter[] = [
  {
    id: 'adapter-egazette',
    name: 'The Gazette of India (eGazette.gov.in)',
    sourceAuthority: 'MoF',
    endpointUrl: 'https://egazette.gov.in/api/v1/extraordinary-notifications',
    type: 'Official Gazette RSS',
    status: 'Ready (Adapter Standby)',
    lastPolled: '2026-10-25 09:30 IST',
    cadence: 'Hourly automated ingest',
    totalDocumentsIngested: 1420,
  },
  {
    id: 'adapter-mca',
    name: 'Ministry of Corporate Affairs (MCA21 e-Portal)',
    sourceAuthority: 'MCA',
    endpointUrl: 'https://mca.gov.in/content/mca/global/en/notifications-feed.xml',
    type: 'MCA21 e-Portal Feed',
    status: 'Ready (Adapter Standby)',
    lastPolled: '2026-10-25 09:00 IST',
    cadence: 'Daily at 06:00 and 18:00 IST',
    totalDocumentsIngested: 856,
  },
  {
    id: 'adapter-rbi',
    name: 'Reserve Bank of India Master Directions Repository',
    sourceAuthority: 'RBI',
    endpointUrl: 'https://rbi.org.in/scripts/BS_MasterDirections.aspx',
    type: 'RBI Master Directions API',
    status: 'Ready (Adapter Standby)',
    lastPolled: '2026-10-25 08:45 IST',
    cadence: 'Daily at 08:00 IST',
    totalDocumentsIngested: 412,
  },
  {
    id: 'adapter-cbic',
    name: 'Central Board of Indirect Taxes & Customs (CBIC GST)',
    sourceAuthority: 'CBIC',
    endpointUrl: 'https://taxinformation.cbic.gov.in/notifications/central-tax',
    type: 'CBIC GST Notifications Gateway',
    status: 'Ready (Adapter Standby)',
    lastPolled: '2026-10-25 09:15 IST',
    cadence: 'Hourly sync during parliamentary gazette releases',
    totalDocumentsIngested: 620,
  },
  {
    id: 'adapter-dpdp',
    name: 'Data Protection Board of India Gateway',
    sourceAuthority: 'MeitY',
    endpointUrl: 'https://dpbi.gov.in/registry/rules-stream',
    type: 'DPDP Portal',
    status: 'Unconnected',
    lastPolled: 'Never (Official portal awaiting gazette notification)',
    cadence: 'Awaiting gazette activation',
    totalDocumentsIngested: 0,
  }
];

export const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-1',
    timestamp: '2024-03-18 10:30 IST',
    actor: 'R. K. Iyer',
    role: 'Principal Legal Counsel',
    action: 'Approved & Verified Document',
    targetId: 'mca-msme-43bh-2024',
    notes: 'Verified against Gazette G.S.R. 208(E). Diff chunks checked for Section 43B(h) and Form MSME-1 alignment.',
  },
  {
    id: 'audit-2',
    timestamp: '2024-03-02 14:15 IST',
    actor: 'P. Sengupta',
    role: 'GST Advisory Practice',
    action: 'Approved & Verified Document',
    targetId: 'cbic-gst-einvoicing-2024',
    notes: 'Confirmed ₹5 Cr aggregate turnover threshold applicability from Notification 10/2024-Central Tax.',
  },
  {
    id: 'audit-3',
    timestamp: '2024-04-18 09:00 IST',
    actor: 'Anita Deshmukh',
    role: 'Banking Regulatory Specialist',
    action: 'Approved & Verified Document',
    targetId: 'rbi-digital-lending-msme-2024',
    notes: 'Key Facts Statement format verified against RBI circular Annex A.',
  }
];

export function computeImpactAssessments(profile: BusinessProfile, pairs: DocumentComparisonPair[]): ImpactAssessment[] {
  return [
    {
      id: 'impact-mca-43bh',
      regulationId: 'mca-msme-43bh-2024',
      regulationTitle: 'Companies (Accounts) Rules & MSME-1 Payment Disclosure Cap Amendment',
      authority: 'MCA',
      clauseRef: 'Clause 3(1) & Clause 3(2)',
      status: 'Potentially Applicable',
      criteriaChecked: [
        {
          parameter: 'Entity Structure',
          requiredCondition: 'Companies registered under Companies Act, 2013',
          businessActual: profile.entityType,
          isMet: profile.entityType === 'Private Limited' || profile.entityType === 'Public Limited',
        },
        {
          parameter: 'Suppliers Category',
          requiredCondition: 'Procures goods or services from active Udyam-registered Micro or Small enterprises',
          businessActual: 'Apex procures raw materials from 28 domestic vendors',
          isMet: true,
        },
        {
          parameter: 'Turnover & Payment Terms',
          requiredCondition: 'Payment delayed beyond 45 days (with agreement) or 15 days (without agreement)',
          businessActual: `Turnover ₹${profile.annualTurnoverINR} Cr; standard vendor PO credit cycle is 60 days`,
          isMet: true,
        }
      ],
      supportingPassage: 'G.S.R. 208(E) Clause 3(1): "Every specified company shall make payment to registered micro and small enterprise suppliers strictly within forty-five days... failing which the expenditure shall be disallowed under Section 43B(h)."',
      unresolvedConditions: [
        'Must verify whether all 28 suppliers possess valid, active Udyam certificates for FY 2024-25.',
        'Must confirm if any supplier has self-upgraded to Medium enterprise (which exempts them from 43B(h)).'
      ],
      humanReviewRecommendation: 'Review all outstanding vendor payment terms in PO templates and cap credit period strictly to 45 days. Coordinate with statutory auditor before April 30 filing.',
      potentialExposureSummary: 'Direct disallowance of unpaid supplier invoices from taxable business income, adding 25-30% tax liability on unpaid balances past 45 days, plus ₹20,000 base fine under Section 405(4).',
      lastEvaluatedAt: new Date().toISOString(),
    },
    {
      id: 'impact-gst-einvoicing',
      regulationId: 'cbic-gst-einvoicing-2024',
      regulationTitle: 'Central GST Rules: E-Invoicing Threshold Lowered to ₹5 Crore',
      authority: 'CBIC',
      clauseRef: 'Rule 48(4)',
      status: profile.annualTurnoverINR > 5 ? 'Potentially Applicable' : 'Not Applicable',
      criteriaChecked: [
        {
          parameter: 'GST Registration',
          requiredCondition: 'Registered taxable person under GST',
          businessActual: profile.hasGstRegistration ? `Registered (${profile.gstin})` : 'Unregistered',
          isMet: profile.hasGstRegistration,
        },
        {
          parameter: 'Aggregate Annual Turnover',
          requiredCondition: 'Exceeds ₹5 Crore in any preceding financial year from 2017-18',
          businessActual: `₹${profile.annualTurnoverINR} Crore`,
          isMet: profile.annualTurnoverINR > 5,
        },
        {
          parameter: 'Supply Type',
          requiredCondition: 'Supplies goods or services to registered persons (B2B) or exports',
          businessActual: `${profile.sector} (B2B Precision Components)`,
          isMet: true,
        }
      ],
      supportingPassage: 'Notification 10/2024-CT: "Registered persons whose aggregate turnover in any preceding financial year from 2017-18 onwards exceeds five crore rupees... shall prepare invoice in terms of sub-rule (4) of rule 48."',
      unresolvedConditions: [
        'Confirm if ERP accounting software has active API connection with an authorized Invoice Registration Portal (IRP).'
      ],
      humanReviewRecommendation: 'Ensure ERP generates valid IRN (Invoice Reference Number) and QR codes before May 1 deadline; B2B invoices without IRN are legally invalid under GST.',
      potentialExposureSummary: 'Invoices issued without IRN are treated as invalid documents; recipient cannot claim Input Tax Credit (ITC), and penalty up to ₹25,000 per invoice under Section 122(1).',
      lastEvaluatedAt: new Date().toISOString(),
    },
    {
      id: 'impact-rbi-kfs',
      regulationId: 'rbi-digital-lending-msme-2024',
      regulationTitle: 'RBI Master Direction: Standard Key Fact Statement (KFS)',
      authority: 'RBI',
      clauseRef: 'Paragraph 3(a) & 4(c)',
      status: profile.hasExternalBorrowings ? 'Potentially Applicable' : 'Not Applicable',
      criteriaChecked: [
        {
          parameter: 'Borrower Category',
          requiredCondition: 'MSME enterprise obtaining credit facilities from Commercial Banks or NBFCs',
          businessActual: `${profile.msmeCategory} Enterprise (${profile.udyamRegistration})`,
          isMet: profile.msmeCategory !== 'Non-MSME',
        },
        {
          parameter: 'Credit Facilities',
          requiredCondition: 'Active term loans, working capital limits, or machinery financing',
          businessActual: profile.hasExternalBorrowings ? 'Has active Bank Cash Credit and Term Loan' : 'No external borrowings',
          isMet: profile.hasExternalBorrowings,
        }
      ],
      supportingPassage: 'RBI/2023-24/122 Paragraph 3(a): "Regulated Entities shall provide a standardized Key Facts Statement (KFS) in the prescribed format to all MSME borrowers prior to execution of loan contract."',
      unresolvedConditions: [
        'Review sanction letters for scheduled renewals between April and October to ensure lender provides standardized KFS without unauthorized processing markups.'
      ],
      humanReviewRecommendation: 'Audit all new banking sanction letters against the standardized KFS format; verify that computed APR matches the effective rate promised.',
      potentialExposureSummary: 'Borrower protection regulation. Enables the business to contest hidden charges, penal interest rates, or insurance loadings exceeding disclosed APR.',
      lastEvaluatedAt: new Date().toISOString(),
    },
    {
      id: 'impact-dpdp-act',
      regulationId: 'dpdp-act-sme-2024',
      regulationTitle: 'The Digital Personal Data Protection Act, 2023',
      authority: 'MeitY',
      clauseRef: 'Section 6(1) & Section 8(6)',
      status: 'Needs Human Review',
      criteriaChecked: [
        {
          parameter: 'Data Fiduciary Role',
          requiredCondition: 'Determines the purpose and means of processing personal data of individuals',
          businessActual: 'Processes biometric attendance for 48 employees and maintains customer billing contacts',
          isMet: profile.collectsCustomerPersonalData,
        },
        {
          parameter: 'Exemption Eligibility',
          requiredCondition: 'Draft rules pending regarding SME volume-based exemptions',
          businessActual: `Small Enterprise with ${profile.employeeCount} employees`,
          isMet: false,
        }
      ],
      supportingPassage: 'DPDP Act 2023, Section 6(1): "On or before requesting for consent, the Data Fiduciary shall give to the Data Principal a notice informing her of the personal data sought and the purpose of processing."',
      unresolvedConditions: [
        'Final rules under Section 17 regarding specific exemptions for research or small entities are pending parliamentary notification.',
        'Breach reporting procedure under Section 8(6) requires 6-hour intimation to Data Protection Board once constituted.'
      ],
      humanReviewRecommendation: 'Conduct preliminary personal data audit across HR, customer databases, and CCTV footage. Await final DPDP notified rules before executing formal consent forms.',
      potentialExposureSummary: 'Statutory penalties up to ₹250 Crore for significant data breaches, though SME proportionality guidelines are anticipated in secondary rules.',
      lastEvaluatedAt: new Date().toISOString(),
    }
  ];
}
