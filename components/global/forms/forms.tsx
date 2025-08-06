type InputProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
};

const Input: React.FC<InputProps> = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="text-sm text-gray-300 block mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
};

const Select: React.FC<SelectProps> = ({ label, value, options, onChange }) => (
  <div>
    <label className="text-sm text-gray-300 block mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

type TextareaProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
};

const Textarea: React.FC<TextareaProps> = ({ label, value, onChange }) => (
  <div className="md:col-span-2">
    <label className="text-sm text-gray-300 block mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div>
    <h2 className="text-lg font-semibold mb-4 text-gray-300">{title}</h2>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </div>
);
