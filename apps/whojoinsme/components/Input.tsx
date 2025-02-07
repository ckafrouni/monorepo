type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  className?: string;
  onSubmit?: () => void;
  disabled?: boolean;
};

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  className = "",
  disabled = false,
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={`w-full rounded-full bg-[#787878] px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 ${className}`}
      disabled={disabled}
    />
  );
}
