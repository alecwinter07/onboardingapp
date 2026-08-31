export type FieldType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'tags'
  | 'color'
  | 'file'
  | 'repeating-license'
  | 'address';

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  helpText?: string;
  maxWords?: number;
}

export interface Section {
  id: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q6';
  title: string;
  description: string;
  fields: Field[];
}

export const SECTIONS: Section[] = [
  {
    id: 'Q1',
    title: 'Confirm Your Details',
    description: 'A few details we already have on file — just confirm they\'re correct.',
    fields: [
      { key: 'full_name', label: 'Full name (Same As You Entered on Stripe)', type: 'text', required: true },
      { key: 'email', label: 'Email (Same As You Entered on Stripe)', type: 'text', required: true },
      { key: 'phone', label: 'Phone (Same As You Entered on Stripe)', type: 'text', required: true },
      { key: 'existing_dr_relationship', label: 'Do you have an existing relationship with Direct Rate?', type: 'select', options: ['Yes', 'No'], required: true },
      { key: 'sms_consent', label: 'I agree to receive SMS communications regarding my real estate inquiry, including automated messages. Message and data rates may apply. Reply STOP to unsubscribe at any time.', type: 'checkbox', required: true },
    ],
  },
  {
    id: 'Q2',
    title: 'Personal Details',
    description: 'Basic information we need for identity verification and scheduling.',
    fields: [
      { key: 'preferred_display_name', label: 'Preferred display name', type: 'text' },
      { key: 'date_of_birth', label: 'Date of birth', type: 'date', required: true },
      { key: 'home_address', label: 'Home address', type: 'address', required: true },
      { key: 'time_zone', label: 'Time zone', type: 'select', required: true, options: ['Eastern', 'Central', 'Mountain', 'Pacific', 'Alaska', 'Hawaii'] },
      { key: 'languages_spoken', label: 'Languages spoken', type: 'multiselect', options: ['English', 'Spanish', 'Mandarin', 'Vietnamese', 'Tagalog', 'Other'] },
    ],
  },
  {
    id: 'Q3',
    title: 'Business Details',
    description: 'Your brokerage and licensing information.',
    fields: [
      { key: 'brokerage_name', label: 'Brokerage name', type: 'text', required: true },
      { key: 'brokerage_address', label: 'Brokerage address', type: 'address', required: true },
      { key: 'brokerage_phone', label: 'Brokerage phone', type: 'text', required: true },
      { key: 'licenses', label: 'Real estate license(s) — state, number, expiration', type: 'repeating-license', required: true },
      { key: 'nmls_company_id', label: 'NMLS Company ID (if mortgage-related)', type: 'text' },
      { key: 'nmls_originator_id', label: 'NMLS Originator ID (personal, if applicable)', type: 'text' },
      { key: 'equal_housing_affirmation', label: 'I affirm compliance with Equal Housing requirements (required for mortgage states)', type: 'checkbox' },
      { key: 'specialty_areas', label: 'Specialty areas', type: 'multiselect', required: true, options: ['First-time buyer', 'Luxury', 'Investor', 'Commercial', 'New construction', '55+'] },
      { key: 'average_price_point', label: 'Average price point', type: 'select', required: true, options: ['Under $300k', '$300k–$500k', '$500k–$750k', '$750k–$1M', '$1M+'] },
      { key: 'service_area', label: 'Service area cities/zips ($200 on 2+ Selections)', type: 'tags', required: true, helpText: 'This drives your ad targeting — be specific. Please type one Zip Code and Press Enter Then Type the Next One!' },
    ],
  },
  {
    id: 'Q4',
    title: 'Compliance Confirmations',
    description: 'Please read and confirm each statement below.',
    fields: [
      { key: 'aff_license_holder', label: 'I am the legal holder of the real estate license(s) listed in Q3*', type: 'checkbox', required: true },
      { key: 'aff_broker_notified', label: 'My broker has been notified that I am running paid digital advertising on my behalf*', type: 'checkbox', required: true },
      { key: 'aff_license_updates', label: 'I will provide updated license info within 7 days of any change*', type: 'checkbox', required: true },
      { key: 'aff_no_dual_agency', label: 'I will not pursue dual-agency on leads delivered through LEVEL Market without explicit consumer consent*', type: 'checkbox', required: true },
      { key: 'aff_automated_contact', label: 'I understand that LEVEL Market\'s automated systems handle initial consumer contact in my name with my brand voice*', type: 'checkbox', required: true },
      { key: 'aff_24h_response', label: 'I will respond to qualified warm leads within 24 hours of handoff*', type: 'checkbox', required: true },
      { key: 'aff_review_requests', label: 'I authorize LEVEL Market to issue review requests on my behalf following NAR + FTC guidelines*', type: 'checkbox', required: true },
      { key: 'aff_marketing_use', label: 'I authorize LEVEL Market to use my name, headshot, and brand assets in generated marketing content*', type: 'checkbox', required: true },
      { key: 'aff_dual_role_disclosure', label: 'I have read and accept the Dual-Role Disclosure framework', type: 'checkbox' },
      { key: 'aff_mortgage_disclosures', label: 'I understand mortgage-side communications must include NMLS and Equal Housing disclosures', type: 'checkbox' },
    ],
  },
  {
    id: 'Q6',
    title: 'Brand Preferences',
    description: 'What you want your landing page and content to look like.',
    fields: [
      { key: 'headshot', label: 'Headshot photo URL *', type: 'text', helpText: 'Paste a google drive link (With Viewer Access) to your headshot photo. If skipped, a default avatar applies after 14 days.', required: true },
      { key: 'hero_background', label: 'Hero background image URL *', type: 'text', helpText: 'Paste a google drive link (With Viewer Access) to a background image, or leave blank to use a city default.', required: true },
      { key: 'tagline', label: 'Tagline (max 12 words)', type: 'text', required: true, maxWords: 12 },
      { key: 'about', label: 'About paragraph (3–5 sentences)', type: 'textarea', required: true },
      { key: 'voice_sample', label: 'Voice sample, 30–60 sec (optional)', type: 'file' },
      { key: 'intro_video', label: 'Brief intro video (optional)', type: 'file' },
      { key: 'service_tone', label: 'Service tone preferences', type: 'multiselect', options: ['Warm', 'Professional', 'Direct', 'Approachable', 'Energetic'] },
    ],
  },
];
