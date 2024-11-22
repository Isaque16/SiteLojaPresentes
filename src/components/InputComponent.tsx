import { UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
}

export default function InputComponent({
  label,
  name,
  type,
  placeholder,
  value,
  register
}: InputProps) {
  return (
    <div className="w-full max-w-xs">
      <label className="label">
        <span className="label-text text-xl">{label}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        className={
          "input input-bordered focus-within:ring-white focus-within:ring-2 w-full max-w-xs"
        }
        {...register(name)}
      />
    </div>
  );
}
