import { useState, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next/client";
import { useToast } from "@/components";

export default function ThemePreferences() {
  const [theme, setTheme] = useState("escuro");
  const { showToast } = useToast();

  useEffect(() => {
    const savedTheme = getCookie("theme") as string;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(savedTheme || (mediaQuery.matches ? "escuro" : "claro"));

    const handleChange = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "escuro" : "claro");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const saveTheme = () => {
    setCookie("theme", theme);
    showToast("Tema salvo com sucesso!", "success");
  };

  return (
    <section className="card card-body card-bordered shadow-md mb-5 w-full md:w-1/2">
      <h2 className="card-title">Preferências</h2>
      <div className="flex flex-col gap-2">
        <fieldset className="flex flex-col gap-3">
          <legend className="font-medium mb-2">Temas</legend>
          <div className="flex flex-row gap-2 items-center">
            <input
              type="radio"
              name="tema"
              id="claro"
              checked={theme === "claro"}
              value="claro"
              onChange={(e) => setTheme(e.target.value)}
              className="radio radio-sm"
            />
            <label htmlFor="claro" className="label cursor-pointer">
              Claro
            </label>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <input
              type="radio"
              name="tema"
              id="escuro"
              checked={theme === "escuro"}
              value="escuro"
              onChange={(e) => setTheme(e.target.value)}
              className="radio radio-sm"
            />
            <label htmlFor="escuro" className="label cursor-pointer">
              Escuro
            </label>
          </div>
        </fieldset>
        <button onClick={saveTheme} className="btn btn-primary mt-2">
          Salvar preferências
        </button>
      </div>
    </section>
  );
}
