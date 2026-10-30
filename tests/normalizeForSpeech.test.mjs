import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Inline normalization logic for standalone Node test runner
const ABBREVIATIONS_EN = [
  { pattern: /\bSmt\.?(?=\s|$)/gi, replacement: 'Shrimati' },
  { pattern: /\bShri\.?(?=\s|$)/gi, replacement: 'Shri' },
  { pattern: /\bDr\.?(?=\s|$)/gi, replacement: 'Doctor' },
  { pattern: /\bCol\.?(?=\s|$)/gi, replacement: 'Colonel' },
  { pattern: /\(Retd\.?\)/gi, replacement: '(Retired)' },
  { pattern: /\bRetd\.?(?=\s|$)/gi, replacement: 'Retired' },
  { pattern: /\bProf\.?(?=\s|$)/gi, replacement: 'Professor' },
  { pattern: /\bMr\.?(?=\s|$)/gi, replacement: 'Mister' },
  { pattern: /\bMrs\.?(?=\s|$)/gi, replacement: 'Missus' },
  { pattern: /\bMs\.?(?=\s|$)/gi, replacement: 'Ms' },
  { pattern: /\bBP\b/g, replacement: 'blood pressure' },
  { pattern: /\bb\.p\.\b/gi, replacement: 'blood pressure' },
  { pattern: /\bSpO2\b/gi, replacement: 'oxygen level' },
  { pattern: /\b(\d+)\s?mmHg\b/gi, replacement: '$1 millimetres of mercury' },
  { pattern: /\b(\d+)\s?bpm\b/gi, replacement: '$1 beats per minute' },
  { pattern: /\b(\d+)\s?mg\b/gi, replacement: '$1 milligrams' },
  { pattern: /\b(\d+)\s?ml\b/gi, replacement: '$1 millilitres' },
  { pattern: /\b(\d+)\s?kg\b/gi, replacement: '$1 kilograms' },
  { pattern: /(\d+)\s?%/g, replacement: '$1 percent' },
  { pattern: /\bNo\.?\s?(\d+)/gi, replacement: 'number $1' },
  { pattern: /₹\s?(\d+)/g, replacement: '$1 rupees' },
  { pattern: /\bRs\.?\s?(\d+)/gi, replacement: '$1 rupees' },
];

const ABBREVIATIONS_HI = [
  { pattern: /\bSmt\.?(?=\s|$)/gi, replacement: 'श्रीमती' },
  { pattern: /श्रीमती\.?(?=\s|$)/g, replacement: 'श्रीमती' },
  { pattern: /\bShri\.?(?=\s|$)/gi, replacement: 'श्री' },
  { pattern: /श्री\.?(?=\s|$)/g, replacement: 'श्री' },
  { pattern: /\bDr\.?(?=\s|$)/gi, replacement: 'डॉक्टर' },
  { pattern: /डॉ\.?(?=\s|$)/g, replacement: 'डॉक्टर' },
  { pattern: /\bCol\.?(?=\s|$)/gi, replacement: 'कर्नल' },
  { pattern: /कर्नल\.?(?=\s|$)/g, replacement: 'कर्नल' },
  { pattern: /\b\(Retd\.?\)/gi, replacement: '(सेवानिवृत्त)' },
  { pattern: /\bRetd\.?(?=\s|$)/gi, replacement: 'सेवानिवृत्त' },
  { pattern: /\bProf\.?(?=\s|$)/gi, replacement: 'प्रोफेसर' },
  { pattern: /\bBP\b/gi, replacement: 'ब्लड प्रेशर' },
  { pattern: /\bSpO2\b/gi, replacement: 'ऑक्सीजन स्तर' },
  { pattern: /\b(\d+)\s?mmHg\b/gi, replacement: '$1 मिलीमीटर मरकरी' },
  { pattern: /\b(\d+)\s?bpm\b/gi, replacement: '$1 धड़कन प्रति मिनट' },
  { pattern: /\b(\d+)\s?mg\b/gi, replacement: '$1 मिलीग्राम' },
  { pattern: /\b(\d+)\s?kg\b/gi, replacement: '$1 किलो' },
  { pattern: /\b(\d+)\s?%\b/g, replacement: '$1 प्रतिशत' },
  { pattern: /\bNo\.?\s?(\d+)/gi, replacement: 'नंबर $1' },
  { pattern: /₹\s?(\d+)/g, replacement: '$1 रुपये' },
  { pattern: /\bRs\.?\s?(\d+)/gi, replacement: '$1 रुपये' },
];

function normalizeTimes(text, lang) {
  if (lang === 'hi') {
    return text.replace(/\b(\d{1,2}):(\d{2})\s?(AM|PM)\b/gi, (_, h, m, ampm) => {
      const hour = parseInt(h, 10);
      const min = parseInt(m, 10);
      const isAm = ampm.toUpperCase() === 'AM';
      let period = 'सुबह';
      if (!isAm) period = hour >= 4 && hour < 8 ? 'शाम' : hour >= 8 ? 'रात' : 'दोपहर';
      else if (hour >= 12 || hour < 4) period = 'रात';
      const h12 = hour % 12 === 0 ? 12 : hour % 12;
      const hindiHours = { 1: 'एक', 2: 'दो', 3: 'तीन', 4: 'चार', 5: 'पाँच', 6: 'छह', 7: 'सात', 8: 'आठ', 9: 'नौ', 10: 'दस', 11: 'ग्यारह', 12: 'बारह' };
      const hWord = hindiHours[h12] || String(h12);
      if (min === 0) return `${period} ${hWord} बजे`;
      return `${period} ${hWord} बजकर ${min} मिनट`;
    });
  }

  return text.replace(/\b(\d{1,2}):(\d{2})\s?(AM|PM)\b/gi, (_, h, m, ampm) => {
    const hour = parseInt(h, 10);
    const min = parseInt(m, 10);
    const isAm = ampm.toUpperCase() === 'AM';
    const period = isAm ? 'in the morning' : hour < 5 ? 'in the afternoon' : 'in the evening';
    const hourWords = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    const hWord = hourWords[h12] || String(h12);
    if (min === 0) return `${hWord} o'clock ${period}`;
    const minWord = min < 10 ? `oh ${min}` : String(min);
    return `${hWord} ${minWord} ${period}`;
  });
}

function stripDecorativeAndHidden(text) {
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/[•★\u2022\u25CF\u25AA*~`_]/g, ' ')
    .replace(/(\d+)\/(\d+)/g, '$1 over $2')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeForSpeech(text, lang) {
  if (!text) return '';
  let normalized = stripDecorativeAndHidden(text);
  normalized = normalizeTimes(normalized, lang);
  const dict = lang === 'hi' ? ABBREVIATIONS_HI : ABBREVIATIONS_EN;
  for (const rule of dict) {
    normalized = normalized.replace(rule.pattern, rule.replacement);
  }
  return normalized;
}

describe('normalizeForSpeech - 25+ Comprehensive Unit Test Cases', () => {
  // Required key tests
  test('1. Expands "Smt. Kamala Devi" to "Shrimati Kamala Devi"', () => {
    assert.equal(normalizeForSpeech('Smt. Kamala Devi', 'en'), 'Shrimati Kamala Devi');
  });

  test('2. Expands "Col. Rajeshwar Bakshi (Retd.)" to "Colonel Rajeshwar Bakshi (Retired)"', () => {
    assert.equal(
      normalizeForSpeech('Col. Rajeshwar Bakshi (Retd.)', 'en'),
      'Colonel Rajeshwar Bakshi (Retired)'
    );
  });

  test('3. Expands "Dr. K. S. Ramanathan" to "Doctor K. S. Ramanathan"', () => {
    assert.equal(normalizeForSpeech('Dr. K. S. Ramanathan', 'en'), 'Doctor K. S. Ramanathan');
  });

  test('4. Preserves "Shri Rameshwar Pathak" as "Shri Rameshwar Pathak"', () => {
    assert.equal(normalizeForSpeech('Shri Rameshwar Pathak', 'en'), 'Shri Rameshwar Pathak');
  });

  test('5. Expands clinical BP acronym to "blood pressure"', () => {
    const res = normalizeForSpeech('BP 130/85 mmHg', 'en');
    assert.ok(res.includes('blood pressure'));
    assert.ok(res.includes('130 over 85'));
    assert.ok(res.includes('millimetres of mercury'));
  });

  test('6. Expands SpO2 to "oxygen level"', () => {
    const res = normalizeForSpeech('SpO2 96%', 'en');
    assert.equal(res, 'oxygen level 96 percent');
  });

  test('7. Expands dosages in milligrams: "Amlodipine 5mg"', () => {
    assert.equal(normalizeForSpeech('Amlodipine 5mg', 'en'), 'Amlodipine 5 milligrams');
  });

  test('8. Formats morning time naturally: "08:00 AM"', () => {
    const res = normalizeForSpeech('Take dose at 08:00 AM', 'en');
    assert.ok(res.includes("eight o'clock in the morning"));
  });

  test('9. Formats afternoon time naturally: "02:30 PM"', () => {
    const res = normalizeForSpeech('Appointment at 02:30 PM', 'en');
    assert.ok(res.includes('two 30 in the afternoon'));
  });

  test('10. Expands "No. 412" to "number 412"', () => {
    assert.equal(normalizeForSpeech('House No. 412', 'en'), 'House number 412');
  });

  test('11. Expands "Mr. Sharma" to "Mister Sharma"', () => {
    assert.equal(normalizeForSpeech('Mr. Sharma', 'en'), 'Mister Sharma');
  });

  test('12. Expands "Mrs. Verma" to "Missus Verma"', () => {
    assert.equal(normalizeForSpeech('Mrs. Verma', 'en'), 'Missus Verma');
  });

  test('13. Expands "Prof. Sen" to "Professor Sen"', () => {
    assert.equal(normalizeForSpeech('Prof. Sen', 'en'), 'Professor Sen');
  });

  test('14. Expands Rupee symbol: "₹500"', () => {
    assert.equal(normalizeForSpeech('Consultation fee ₹500', 'en'), 'Consultation fee 500 rupees');
  });

  test('15. Expands pulse rate: "72 bpm"', () => {
    assert.equal(normalizeForSpeech('Pulse 72 bpm', 'en'), 'Pulse 72 beats per minute');
  });

  test('16. Hindi normalization: "श्रीमती कमला देवी"', () => {
    assert.equal(normalizeForSpeech('श्रीमती कमला देवी', 'hi'), 'श्रीमती कमला देवी');
  });

  test('17. Hindi normalization of English abbreviation: "Smt. Kamala Devi"', () => {
    assert.equal(normalizeForSpeech('Smt. Kamala Devi', 'hi'), 'श्रीमती Kamala Devi');
  });

  test('18. Hindi normalization: "डॉ. शर्मा"', () => {
    assert.equal(normalizeForSpeech('डॉ. शर्मा', 'hi'), 'डॉक्टर शर्मा');
  });

  test('19. Hindi normalization of BP: "BP सामान्य है"', () => {
    assert.equal(normalizeForSpeech('BP सामान्य है', 'hi'), 'ब्लड प्रेशर सामान्य है');
  });

  test('20. Hindi natural time format: "09:00 AM"', () => {
    const res = normalizeForSpeech('समय 09:00 AM', 'hi');
    assert.ok(res.includes('सुबह नौ बजे'));
  });

  test('21. Handles case-insensitivity: "smt." and "SMT"', () => {
    assert.equal(normalizeForSpeech('smt. Kamala', 'en'), 'Shrimati Kamala');
    assert.equal(normalizeForSpeech('SMT Kamala', 'en'), 'Shrimati Kamala');
  });

  test('22. Handles titles without full stop: "Col Rajeshwar"', () => {
    assert.equal(normalizeForSpeech('Col Rajeshwar', 'en'), 'Colonel Rajeshwar');
  });

  test('23. Strips HTML markup cleanly', () => {
    const res = normalizeForSpeech('<strong>Attention:</strong> Blood pressure checked', 'en');
    assert.equal(res, 'Attention: Blood pressure checked');
  });

  test('24. Strips decorative bullet points and asterisks', () => {
    const res = normalizeForSpeech('• Take tablets * Regular check', 'en');
    assert.equal(res, 'Take tablets Regular check');
  });

  test('25. Preserves respectful honorific "ji": "Kamala ji"', () => {
    assert.equal(normalizeForSpeech('Namaste Kamala ji', 'en'), 'Namaste Kamala ji');
  });

  test('26. Multiple abbreviations in one sentence', () => {
    const res = normalizeForSpeech('Dr. Sharma reviewed Smt. Devi BP at 08:00 AM', 'en');
    assert.ok(res.includes('Doctor Sharma'));
    assert.ok(res.includes('Shrimati Devi'));
    assert.ok(res.includes('blood pressure'));
    assert.ok(res.includes("eight o'clock in the morning"));
  });
});
