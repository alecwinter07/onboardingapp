'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SECTIONS, Field } from '@/lib/sections';

function FieldInput({
  field,
  value,
  onChange,
  token,
}: {
  field: Field;
  value: any;
  onChange: (v: any) => void;
  token: string;
}) {
  const [uploading, setUploading] = useState(false);

  if (field.type === 'text') {
    return (
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === 'date') {
    return (
      <input
        type="date"
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === 'address') {
    const addr = value || { street: '', city: '', state: '', zip: '' };
    return (
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Street" className="col-span-2 border border-gray-300 rounded-lg px-4 py-2.5"
          value={addr.street} onChange={(e) => onChange({ ...addr, street: e.target.value })} />
        <input placeholder="City" className="border border-gray-300 rounded-lg px-4 py-2.5"
          value={addr.city} onChange={(e) => onChange({ ...addr, city: e.target.value })} />
        <input placeholder="State" className="border border-gray-300 rounded-lg px-4 py-2.5"
          value={addr.state} onChange={(e) => onChange({ ...addr, state: e.target.value })} />
        <input placeholder="Zip" className="border border-gray-300 rounded-lg px-4 py-2.5"
          value={addr.zip} onChange={(e) => onChange({ ...addr, zip: e.target.value })} />
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <select
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  if (field.type === 'multiselect') {
    const selected: string[] = value || [];
    const toggle = (opt: string) => {
      if (selected.includes(opt)) onChange(selected.filter((s) => s !== opt));
      else onChange([...selected, opt]);
    };
    return (
      <div className="flex flex-wrap gap-2">
        {field.options?.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              selected.includes(opt)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1 w-5 h-5"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-sm text-gray-700">{field.label}</span>
      </label>
    );
  }

  if (field.type === 'tags') {
    const tags: string[] = value || [];
    const [input, setInput] = useState('');
    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((t, i) => (
            <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {t}
              <button type="button" onClick={() => onChange(tags.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-gray-700">×</button>
            </span>
          ))}
        </div>
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          placeholder="Type and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              e.preventDefault();
              onChange([...tags, input.trim()]);
              setInput('');
            }
          }}
        />
      </div>
    );
  }

  if (field.type === 'color') {
    return (
      <input
        type="color"
        className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
        value={value || '#2563eb'}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === 'file') {
    return (
      <div>
        <input
          type="file"
          className="w-full text-sm"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            const fd = new FormData();
            fd.append('token', token);
            fd.append('fieldKey', field.key);
            fd.append('file', file);
            try {
              const res = await fetch('/api/q/upload', { method: 'POST', body: fd });
              const data = await res.json();
              if (data.ok) onChange({ fileName: file.name, url: data.url });
            } finally {
              setUploading(false);
            }
          }}
        />
        {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
        {value?.fileName && !uploading && <p className="text-xs text-green-600 mt-1">✓ {value.fileName}</p>}
      </div>
    );
  }

  if (field.type === 'repeating-license') {
    const licenses: any[] = value?.length ? value : [{ state: '', number: '', expiration: '' }];
    return (
      <div className="space-y-3">
        {licenses.map((lic, i) => (
          <div key={i} className="grid grid-cols-3 gap-2">
            <input placeholder="State" className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={lic.state} onChange={(e) => {
                const next = [...licenses]; next[i] = { ...lic, state: e.target.value }; onChange(next);
              }} />
            <input placeholder="License #" className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={lic.number} onChange={(e) => {
                const next = [...licenses]; next[i] = { ...lic, number: e.target.value }; onChange(next);
              }} />
            <input placeholder="Expiration" type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={lic.expiration} onChange={(e) => {
                const next = [...licenses]; next[i] = { ...lic, expiration: e.target.value }; onChange(next);
              }} />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-blue-600 hover:underline"
          onClick={() => onChange([...licenses, { state: '', number: '', expiration: '' }])}
        >
          + Add another license
        </button>
      </div>
    );
  }

  return null;
}

function QuestionnaireInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, Record<string, any>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setTokenError('No token provided in link.');
      setVerifying(false);
      return;
    }
    fetch(`/api/q/verify?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) setTokenValid(true);
        else setTokenError(data.error || 'Invalid link');
        setVerifying(false);
      })
      .catch(() => {
        setTokenError('Could not verify link.');
        setVerifying(false);
      });
  }, [token]);

  const section = SECTIONS[stepIndex];
  const sectionData = formData[section?.id] || {};

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section.id]: { ...prev[section.id], [key]: value },
    }));
  };

  const missingRequired = () => {
    return section.fields.some((f) => f.required && !sectionData[f.key]);
  };

  const handleContinue = async () => {
    setError('');
    if (missingRequired()) {
      setError('Please fill in all required fields before continuing.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/q/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, section: section.id, data: sectionData }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong saving this section.');
        setSubmitting(false);
        return;
      }
      if (stepIndex === SECTIONS.length - 1) {
        setAllDone(true);
      } else {
        setStepIndex(stepIndex + 1);
      }
    } catch (e) {
      setError('Network error — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (verifying) {
    return <CenteredMessage>Loading your onboarding form...</CenteredMessage>;
  }

  if (!tokenValid) {
    return (
      <CenteredMessage>
        <p className="text-red-600 font-medium mb-2">This link isn't valid.</p>
        <p className="text-gray-500 text-sm">{tokenError}</p>
        <p className="text-gray-500 text-sm mt-2">Please contact your LEVEL representative for a new link.</p>
      </CenteredMessage>
    );
  }

  if (allDone) {
    return (
      <CenteredMessage>
        <p className="text-green-600 text-xl font-semibold mb-2">All done! 🎉</p>
        <p className="text-gray-600">Thanks for completing your onboarding. We'll take it from here — your landing page and marketing will be live soon.</p>
      </CenteredMessage>
    );
  }

  const progressPct = Math.round(((stepIndex) / SECTIONS.length) * 100);

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="text-sm text-gray-500">Step {stepIndex + 1} of {SECTIONS.length}</p>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{section.title}</h1>
      <p className="text-gray-500 mb-8">{section.description}</p>

      <div className="space-y-6">
        {section.fields.map((field) => (
          <div key={field.key}>
            {field.type !== 'checkbox' && (
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            )}
            <FieldInput
              field={field}
              value={sectionData[field.key]}
              onChange={(v) => updateField(field.key, v)}
              token={token}
            />
            {field.helpText && <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>}
          </div>
        ))}
      </div>

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

      <div className="flex justify-between mt-10">
        <button
          type="button"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex(stepIndex - 1)}
          className="px-5 py-2.5 rounded-lg text-gray-600 disabled:opacity-0"
        >
          Back
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={handleContinue}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : stepIndex === SECTIONS.length - 1 ? 'Finish' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">{children}</div>
    </div>
  );
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={<CenteredMessage>Loading...</CenteredMessage>}>
      <QuestionnaireInner />
    </Suspense>
  );
}
