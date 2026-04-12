import React, { useState } from 'react';
import {
  VEDIC_THEME,
  cardStyle,
  sectionLabel,
  tabStyle,
  badgeStyle,
  hexToRgba,
  pageRoot,
  headerBar,
  footerStyle,
} from './vedic_theme.js';

const T = VEDIC_THEME;

/**
 * SettingsPanel Component
 * Comprehensive Settings & Profile management for Silicon Siddhanta
 */
export default function SettingsPanel() {
  // ─────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('profile');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Default Hemant profile
  const defaultProfile = {
    id: 'hemant-1980',
    name: 'Hemant Thackeray',
    dob: { day: 27, month: 3, year: 1980 },
    tob: { hour: 11, minute: 45, ampm: 'AM' },
    pob: 'Kalyan, Maharashtra',
    latitude: 19.2183,
    longitude: 73.1305,
    gender: 'Male',
    ayanamsha: 'Lahiri',
    houseSystem: 'Placidus',
    notes: 'Practitioner-level Jyotish knowledge. Gemini Asc, Cancer Moon, Ashlesha Nak.',
  };

  // ─────────────────────────────────────────────
  // PROFILE TAB STATE
  // ─────────────────────────────────────────────
  const [profiles, setProfiles] = useState([defaultProfile]);
  const [activeProfileId, setActiveProfileId] = useState(defaultProfile.id);
  const [formData, setFormData] = useState(defaultProfile);

  // ─────────────────────────────────────────────
  // EMAIL TAB STATE
  // ─────────────────────────────────────────────
  const [emailData, setEmailData] = useState({
    recipient: '',
    subject: `Silicon Siddhanta — Birth Chart Analysis for ${formData.name}`,
    format: 'Full Report',
    includeSections: {
      birthChart: true,
      planets: true,
      dashas: true,
      kpAnalysis: true,
      predictions: true,
      ashtakavarga: true,
      auspiciousWindows: true,
      multiMethodAnalysis: true,
    },
  });

  // ─────────────────────────────────────────────
  // SETTINGS TAB STATE
  // ─────────────────────────────────────────────
  const [appSettings, setAppSettings] = useState({
    chartStyle: 'Both',
    showSanskritNames: true,
    showRemedies: true,
    showNadiPredictions: true,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
  });

  // ─────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Profile handlers
  const handleFormChange = (field, value) => {
    setFormData((prev) => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: { ...prev[parent], [child]: value },
        };
      }
      return { ...prev, [field]: value };
    });

    // Update email subject when name changes
    if (field === 'name') {
      setEmailData((prev) => ({
        ...prev,
        subject: `Silicon Siddhanta — Birth Chart Analysis for ${value}`,
      }));
    }
  };

  const handleLoadProfile = (profileId) => {
    const profile = profiles.find((p) => p.id === profileId);
    if (profile) {
      setFormData(profile);
      setActiveProfileId(profileId);
      showNotification(`Loaded profile: ${profile.name}`);
    }
  };

  const handleSaveProfile = () => {
    const profileId = formData.id || `profile-${Date.now()}`;
    const newProfile = { ...formData, id: profileId };

    const existingIndex = profiles.findIndex((p) => p.id === profileId);
    if (existingIndex >= 0) {
      const updated = [...profiles];
      updated[existingIndex] = newProfile;
      setProfiles(updated);
      showNotification(`Profile updated: ${newProfile.name}`);
    } else {
      setProfiles((prev) => [...prev, newProfile]);
      setFormData((prev) => ({ ...prev, id: profileId }));
      showNotification(`Profile saved: ${newProfile.name}`);
    }
    setActiveProfileId(profileId);
  };

  const handleDeleteProfile = (profileId) => {
    if (profiles.length > 1) {
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
      if (activeProfileId === profileId) {
        const nextProfile = profiles.find((p) => p.id !== profileId);
        setActiveProfileId(nextProfile.id);
        setFormData(nextProfile);
      }
      showNotification('Profile deleted');
    } else {
      showNotification('Cannot delete the last profile');
    }
  };

  const handleNewProfile = () => {
    const newProfile = {
      id: `profile-${Date.now()}`,
      name: 'New Profile',
      dob: { day: 1, month: 1, year: 2000 },
      tob: { hour: 12, minute: 0, ampm: 'PM' },
      pob: '',
      latitude: 0,
      longitude: 0,
      gender: 'Male',
      ayanamsha: 'Lahiri',
      houseSystem: 'Placidus',
      notes: '',
    };
    setFormData(newProfile);
    setActiveProfileId(newProfile.id);
  };

  // Email handlers
  const handleEmailChange = (field, value) => {
    setEmailData((prev) => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: { ...prev[parent], [child]: value },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSendChart = () => {
    if (!emailData.recipient) {
      showNotification('Please enter a recipient email address');
      return;
    }
    showNotification(`Chart sent to ${emailData.recipient} (simulated)`);
    setEmailData((prev) => ({ ...prev, recipient: '' }));
  };

  // Settings handlers
  const handleSettingChange = (field, value) => {
    setAppSettings((prev) => ({ ...prev, [field]: value }));
  };

  // ─────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────

  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);
  const monthOptions = [
    { val: 1, name: 'January' },
    { val: 2, name: 'February' },
    { val: 3, name: 'March' },
    { val: 4, name: 'April' },
    { val: 5, name: 'May' },
    { val: 6, name: 'June' },
    { val: 7, name: 'July' },
    { val: 8, name: 'August' },
    { val: 9, name: 'September' },
    { val: 10, name: 'October' },
    { val: 11, name: 'November' },
    { val: 12, name: 'December' },
  ];
  const yearOptions = Array.from({ length: 100 }, (_, i) => 1920 + i);
  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  // ─────────────────────────────────────────────
  // STYLES
  // ─────────────────────────────────────────────

  const containerStyle = {
    maxWidth: 1000,
    margin: '0 auto',
    padding: '24px 16px',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingBottom: 16,
    borderBottom: `1px solid ${T.border}`,
  };

  const titleStyle = {
    fontSize: 28,
    fontWeight: 700,
    color: T.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const tabsStyle = {
    display: 'flex',
    borderBottom: `1px solid ${T.border}`,
    marginBottom: 32,
    gap: 4,
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: hexToRgba(T.bgSecondary, 0.5),
    border: `1px solid ${T.border}`,
    borderRadius: T.radiusSm,
    color: T.textPrimary,
    fontFamily: T.fontFamily,
    fontSize: 13,
    transition: 'all 0.2s ease',
    outlineColor: T.accent,
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: 100,
    resize: 'vertical',
    fontFamily: T.fontFamily,
  };

  const buttonStyle = (variant = 'primary') => ({
    padding: '10px 16px',
    border: 'none',
    borderRadius: T.radiusSm,
    fontFamily: T.fontFamily,
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background:
      variant === 'primary'
        ? T.accent
        : variant === 'danger'
        ? T.negative
        : hexToRgba(T.textSecondary, 0.15),
    color: variant === 'danger' ? '#fff' : T.bgPrimary,
    '&:hover': {
      opacity: 0.85,
    },
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 16,
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: T.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const checkboxWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 0',
  };

  const radioGroupStyle = {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    marginBottom: 16,
  };

  // ─────────────────────────────────────────────
  // TAB CONTENT RENDERERS
  // ─────────────────────────────────────────────

  const renderProfileTab = () => (
    <div>
      {/* Form Section */}
      <div style={{ ...cardStyle() }}>
        <h3 style={sectionLabel()}>Create / Edit Profile</h3>

        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              style={inputStyle}
              placeholder="Enter name"
            />
          </div>
          <div>
            <label style={labelStyle}>Gender</label>
            <div style={radioGroupStyle}>
              {['Male', 'Female', 'Other'].map((g) => (
                <label
                  key={g}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={(e) => handleFormChange('gender', e.target.value)}
                    style={{ cursor: 'pointer' }}
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={{ ...sectionLabel(), marginTop: 16 }}>Date of Birth</p>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Day</label>
              <select
                value={formData.dob.day}
                onChange={(e) => handleFormChange('dob.day', parseInt(e.target.value))}
                style={selectStyle}
              >
                {dayOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Month</label>
              <select
                value={formData.dob.month}
                onChange={(e) => handleFormChange('dob.month', parseInt(e.target.value))}
                style={selectStyle}
              >
                {monthOptions.map((m) => (
                  <option key={m.val} value={m.val}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <select
                value={formData.dob.year}
                onChange={(e) => handleFormChange('dob.year', parseInt(e.target.value))}
                style={selectStyle}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={sectionLabel()}>Time of Birth</p>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Hour</label>
              <select
                value={formData.tob.hour}
                onChange={(e) => handleFormChange('tob.hour', parseInt(e.target.value))}
                style={selectStyle}
              >
                {hourOptions.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Minute</label>
              <select
                value={formData.tob.minute}
                onChange={(e) => handleFormChange('tob.minute', parseInt(e.target.value))}
                style={selectStyle}
              >
                {minuteOptions.map((m) => (
                  <option key={m} value={m}>
                    {m.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>AM / PM</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['AM', 'PM'].map((ap) => (
                  <button
                    key={ap}
                    onClick={() => handleFormChange('tob.ampm', ap)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      border: `1px solid ${
                        formData.tob.ampm === ap ? T.accent : T.border
                      }`,
                      borderRadius: T.radiusSm,
                      background:
                        formData.tob.ampm === ap
                          ? hexToRgba(T.accent, 0.15)
                          : 'transparent',
                      color: formData.tob.ampm === ap ? T.accent : T.textSecondary,
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 12,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {ap}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Place of Birth</label>
          <input
            type="text"
            value={formData.pob}
            onChange={(e) => handleFormChange('pob', e.target.value)}
            style={inputStyle}
            placeholder="e.g., Kalyan, Maharashtra"
          />
          <p style={{ fontSize: 11, color: T.textMuted, marginTop: 6 }}>
            Coordinates are used for precise house calculations.
          </p>
        </div>

        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Latitude</label>
            <input
              type="number"
              value={formData.latitude}
              onChange={(e) => handleFormChange('latitude', parseFloat(e.target.value))}
              style={inputStyle}
              placeholder="19.2183"
              step="0.0001"
            />
          </div>
          <div>
            <label style={labelStyle}>Longitude</label>
            <input
              type="number"
              value={formData.longitude}
              onChange={(e) => handleFormChange('longitude', parseFloat(e.target.value))}
              style={inputStyle}
              placeholder="73.1305"
              step="0.0001"
            />
          </div>
        </div>

        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Ayanamsha</label>
            <select
              value={formData.ayanamsha}
              onChange={(e) => handleFormChange('ayanamsha', e.target.value)}
              style={selectStyle}
            >
              {['Lahiri', 'KP/Krishnamurti', 'Raman', 'True Chitrapaksha'].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>House System</label>
            <select
              value={formData.houseSystem}
              onChange={(e) => handleFormChange('houseSystem', e.target.value)}
              style={selectStyle}
            >
              {['Placidus', 'Koch', 'Equal'].map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Personal Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleFormChange('notes', e.target.value)}
            style={textareaStyle}
            placeholder="Add any notes about this profile..."
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleSaveProfile} style={buttonStyle('primary')}>
            Save Profile
          </button>
          <button onClick={handleNewProfile} style={buttonStyle()}>
            New Profile
          </button>
        </div>
      </div>

      {/* Saved Profiles Section */}
      <div style={{ ...cardStyle(), marginTop: 24 }}>
        <h3 style={sectionLabel()}>Saved Profiles ({profiles.length})</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {profiles.map((profile) => (
            <div
              key={profile.id}
              style={{
                ...cardStyle(),
                background:
                  activeProfileId === profile.id
                    ? hexToRgba(T.accent, 0.1)
                    : T.bgCard,
                border:
                  activeProfileId === profile.id
                    ? `1px solid ${T.borderAccent}`
                    : `1px solid ${T.border}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>
                    {profile.name}
                  </p>
                  {activeProfileId === profile.id && (
                    <span
                      style={{
                        ...badgeStyle(T.accent),
                        display: 'inline-block',
                        marginTop: 6,
                      }}
                    >
                      Currently Active
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteProfile(profile.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: T.negative,
                    cursor: 'pointer',
                    fontSize: 16,
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ fontSize: 12, color: T.textSecondary, marginBottom: 12 }}>
                <p>
                  DOB:{' '}
                  {`${profile.dob.day}/${profile.dob.month}/${profile.dob.year}`}
                </p>
                <p>
                  TOB:{' '}
                  {`${profile.tob.hour}:${profile.tob.minute
                    .toString()
                    .padStart(2, '0')} ${profile.tob.ampm}`}
                </p>
                <p>Place: {profile.pob}</p>
              </div>

              <button
                onClick={() => handleLoadProfile(profile.id)}
                style={{
                  ...buttonStyle('primary'),
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                Load
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEmailTab = () => (
    <div>
      <div style={{ ...cardStyle() }}>
        <h3 style={sectionLabel()}>Email Chart</h3>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Recipient Email</label>
          <input
            type="email"
            value={emailData.recipient}
            onChange={(e) => handleEmailChange('recipient', e.target.value)}
            style={inputStyle}
            placeholder="recipient@example.com"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Subject Line</label>
          <input
            type="text"
            value={emailData.subject}
            onChange={(e) => handleEmailChange('subject', e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Report Format</label>
          <div style={radioGroupStyle}>
            {['Full Report', 'Summary Only', 'PDF Export'].map((fmt) => (
              <label
                key={fmt}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                <input
                  type="radio"
                  name="format"
                  value={fmt}
                  checked={emailData.format === fmt}
                  onChange={(e) => handleEmailChange('format', e.target.value)}
                  style={{ cursor: 'pointer' }}
                />
                {fmt}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Include Sections</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {[
              { key: 'birthChart', label: 'Birth Chart' },
              { key: 'planets', label: 'Planets' },
              { key: 'dashas', label: 'Dashas' },
              { key: 'kpAnalysis', label: 'KP Analysis' },
              { key: 'predictions', label: 'Predictions' },
              { key: 'ashtakavarga', label: 'Ashtakavarga' },
              { key: 'auspiciousWindows', label: 'Auspicious Windows' },
              { key: 'multiMethodAnalysis', label: 'Multi-Method Analysis' },
            ].map(({ key, label }) => (
              <label key={key} style={checkboxWrapperStyle}>
                <input
                  type="checkbox"
                  checked={emailData.includeSections[key]}
                  onChange={(e) =>
                    handleEmailChange(`includeSections.${key}`, e.target.checked)
                  }
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: 12 }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, color: T.textMuted, fontStyle: 'italic' }}>
            Email delivery requires server configuration. Contact admin for SMTP setup.
          </p>
        </div>

        <button onClick={handleSendChart} style={{ ...buttonStyle('primary'), width: '100%' }}>
          Send Chart
        </button>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div>
      <div style={{ ...cardStyle() }}>
        <h3 style={sectionLabel()}>Theme</h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: T.gradientAccent,
              boxShadow: T.shadowGlow,
            }}
          />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>
              Vedic Mystic (Active)
            </p>
            <p style={{ fontSize: 11, color: T.textMuted }}>
              Deep cosmic navy with saffron gold accents
            </p>
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle(), marginTop: 24 }}>
        <h3 style={sectionLabel()}>Display Options</h3>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Chart Style</label>
          <div style={radioGroupStyle}>
            {['South Indian', 'North Indian', 'Both'].map((style) => (
              <label
                key={style}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                <input
                  type="radio"
                  name="chartStyle"
                  value={style}
                  checked={appSettings.chartStyle === style}
                  onChange={(e) => handleSettingChange('chartStyle', e.target.value)}
                  style={{ cursor: 'pointer' }}
                />
                {style}
              </label>
            ))}
          </div>
        </div>

        <label style={checkboxWrapperStyle}>
          <input
            type="checkbox"
            checked={appSettings.showSanskritNames}
            onChange={(e) => handleSettingChange('showSanskritNames', e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: 12 }}>Show Sanskrit Names</span>
        </label>

        <label style={checkboxWrapperStyle}>
          <input
            type="checkbox"
            checked={appSettings.showRemedies}
            onChange={(e) => handleSettingChange('showRemedies', e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: 12 }}>Show Remedies</span>
        </label>

        <label style={checkboxWrapperStyle}>
          <input
            type="checkbox"
            checked={appSettings.showNadiPredictions}
            onChange={(e) => handleSettingChange('showNadiPredictions', e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: 12 }}>Show Nadi Predictions</span>
        </label>

        <div style={{ marginTop: 20 }}>
          <label style={labelStyle}>Date Format</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['DD/MM/YYYY', 'MM/DD/YYYY'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleSettingChange('dateFormat', fmt)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: `1px solid ${
                    appSettings.dateFormat === fmt ? T.accent : T.border
                  }`,
                  borderRadius: T.radiusSm,
                  background:
                    appSettings.dateFormat === fmt
                      ? hexToRgba(T.accent, 0.15)
                      : 'transparent',
                  color: appSettings.dateFormat === fmt ? T.accent : T.textSecondary,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 12,
                  transition: 'all 0.2s ease',
                }}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={labelStyle}>Time Format</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['12h', '24h'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleSettingChange('timeFormat', fmt)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: `1px solid ${
                    appSettings.timeFormat === fmt ? T.accent : T.border
                  }`,
                  borderRadius: T.radiusSm,
                  background:
                    appSettings.timeFormat === fmt
                      ? hexToRgba(T.accent, 0.15)
                      : 'transparent',
                  color: appSettings.timeFormat === fmt ? T.accent : T.textSecondary,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 12,
                  transition: 'all 0.2s ease',
                }}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAboutTab = () => (
    <div style={{ ...cardStyle() }}>
      <h3 style={sectionLabel()}>About Silicon Siddhanta</h3>

      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: T.textPrimary,
            marginBottom: 4,
          }}
        >
          Silicon Siddhanta v1.0.0
        </p>
        <p style={{ fontSize: 12, color: T.textMuted }}>
          Vedic Astrology Engine for Precise Calculations & Multi-Method Analysis
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ ...cardStyle(true), background: hexToRgba(T.accent, 0.06) }}>
          <p style={{ ...sectionLabel(), marginBottom: 8 }}>Ephemeris</p>
          <p style={{ fontSize: 13, color: T.textPrimary }}>Swiss Ephemeris (Moshier)</p>
        </div>

        <div style={{ ...cardStyle(true), background: hexToRgba(T.accent, 0.06) }}>
          <p style={{ ...sectionLabel(), marginBottom: 8 }}>Systems</p>
          <ul style={{ fontSize: 12, color: T.textSecondary, margin: 0, paddingLeft: 16 }}>
            <li>Parashari</li>
            <li>KP (Krishnamurti Paddhati)</li>
            <li>Nadi</li>
            <li>KCIL</li>
          </ul>
        </div>

        <div style={{ ...cardStyle(true), background: hexToRgba(T.accent, 0.06) }}>
          <p style={{ ...sectionLabel(), marginBottom: 8 }}>Ayanamsha</p>
          <p style={{ fontSize: 13, color: T.textPrimary }}>
            Lahiri (Chitrapaksha)
          </p>
          <p style={{ fontSize: 11, color: T.textMuted }}>23.581° at epoch</p>
        </div>
      </div>

      <div
        style={{
          padding: 16,
          background: hexToRgba(T.accent, 0.08),
          borderRadius: T.radiusSm,
          borderLeft: `3px solid ${T.accent}`,
          marginBottom: 24,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: T.textHighlight,
            fontStyle: 'italic',
            fontWeight: 500,
          }}
        >
          Built with precision. Every calculation is deterministic and astronomically
          verified.
        </p>
      </div>

      <p style={{ fontSize: 11, color: T.textMuted, textAlign: 'center' }}>
        Created with Vedic wisdom and modern computational accuracy.
      </p>
    </div>
  );

  // ─────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────

  return (
    <div style={{ ...pageRoot, background: T.gradientBg }}>
      {/* Header */}
      <div style={headerBar}>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <div style={titleStyle}>
              <span>⚙</span>
              Silicon Siddhanta Settings
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={containerStyle}>
        {/* Tabs */}
        <div style={tabsStyle}>
          {['Profile', 'Email Chart', 'Settings', 'About'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              style={tabStyle(
                activeTab === tab.toLowerCase().replace(' ', '-')
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'email-chart' && renderEmailTab()}
          {activeTab === 'settings' && renderSettingsTab()}
          {activeTab === 'about' && renderAboutTab()}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            padding: '12px 18px',
            background: T.accent,
            color: '#000',
            borderRadius: T.radiusSm,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: T.shadowElevated,
            animation: 'slideIn 0.3s ease',
            zIndex: 1000,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Footer */}
      <div style={{ ...footerStyle, color: T.textMuted }}>
        <p>Silicon Siddhanta © 2026 — Precision in Vedic Astrology</p>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
