export default function InputComponent({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const verifyInput = (): boolean => {
    return value.trim() !== "" && value !== "0";
  };

  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input input-bordered w-full max-w-xs ${verifyInput() ? "input-success" : "input-error"}`}
      />
    </div>
  );
}
