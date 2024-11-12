import { UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<any>;
}

export default function InputComponent({
  label,
  name,
  type,
  placeholder,
  register
}: InputProps) {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text text-xl">{label}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={"input input-bordered w-full max-w-xs"}
        {...register(name)}
      />
    </div>
  );
}
