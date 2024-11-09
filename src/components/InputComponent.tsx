export default function InputComponent({
  label,
  name,
  type,
  placeholder,
  value,
  onChange
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string | number;
  onChange: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text text-xl">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={"input input-bordered w-full max-w-xs"}
      />
    </div>
  );
}
