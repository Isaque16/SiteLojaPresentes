import { useState } from "react";

interface PasswordChangeProps {
  currentPassword: string;
  onSave: (passwords: {
    current: string;
    new: string;
    confirm: string;
  }) => Promise<boolean>;
}

export default function PasswordChangeForm({
  currentPassword,
  onSave
}: PasswordChangeProps) {
  const [passwords, setPasswords] = useState({
    current: currentPassword,
    new: "",
    confirm: ""
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSave = async () => {
    const success = await onSave(passwords);
    if (success) {
      setPasswords((prev) => ({ ...prev, new: "", confirm: "" }));
    }
  };

  return (
    <section className="card card-body card-bordered shadow-md mb-5 w-full md:w-1/2">
      <h2 className="card-title">Alteração de Senha</h2>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="current-password" className="label">
            Senha atual
          </label>
          <div className="flex flex-row justify-between input input-bordered">
            <input
              id="current-password"
              type={isPasswordVisible ? "text" : "password"}
              value={passwords.current}
              readOnly
              className="input-disabled border-none w-full focus:outline-none"
            />
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
            >
              {isPasswordVisible ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="new-password" className="label">
            Nova senha
          </label>
          <input
            id="new-password"
            type="password"
            className="input input-bordered"
            placeholder="Nova Senha"
            value={passwords.new}
            onChange={(e) =>
              setPasswords({ ...passwords, new: e.target.value })
            }
            aria-describedby="password-requirements"
          />
          <p id="password-requirements" className="text-xs mt-1">
            A senha deve ter pelo menos 6 caracteres
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-password" className="label">
            Confirme a senha
          </label>
          <input
            id="confirm-password"
            type="password"
            className="input input-bordered"
            placeholder="Confirme a senha"
            value={passwords.confirm}
            onChange={(e) =>
              setPasswords({ ...passwords, confirm: e.target.value })
            }
          />
        </div>

        <button onClick={handleSave} className="btn btn-primary mt-2">
          Alterar Senha
        </button>
      </div>
    </section>
  );
}
