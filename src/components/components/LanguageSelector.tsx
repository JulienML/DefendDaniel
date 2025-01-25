'use client';

type Language = {
  code: string;
  name: string;
};

const languages: Language[] = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
];

export const LanguageSelector = ({ onSelect }: { onSelect: (lang: string) => void }) => {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="px-4 py-2 rounded-lg border-2 border-gray-300"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;