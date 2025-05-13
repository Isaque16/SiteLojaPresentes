import { useState, useEffect } from "react";

interface PersonalDataProps {
  userData: {
    username: string;
    email: string;
  };
  onSave: (userData: { username: string; email: string }) => Promise<void>;
}

export default function PersonalDataForm({
  userData,
  onSave
}: PersonalDataProps) {
  const [formData, setFormData] = useState(userData);

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  return (
    <section className="card card-body card-bordered shadow-md mb-5 w-full md:w-1/2">
      <h2 className="card-title">Dados Pessoais</h2>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="label">
            Nome de Usuário
          </label>
          <input
            type="text"
            id="username"
            className="input input-bordered"
            placeholder="Seu usuário"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="label">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            className="input input-bordered"
            placeholder="Seu e-mail"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <button
          onClick={() => onSave(formData)}
          className="btn btn-primary mt-2"
        >
          Salvar Alterações
        </button>
      </div>
    </section>
  );
}
