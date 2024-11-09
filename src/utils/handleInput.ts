import React from "react";

// Função utilitária para lidar com entradas de formulários
export default function handleInput<T>(
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: React.Dispatch<React.SetStateAction<T>>
) {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value
  }));
}
