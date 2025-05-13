"use client";
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode
} from "react";

// Tipos para o Toast
type ToastType = "success" | "error" | "warning" | "info";

type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

// Componente Toast individual
const Toast: React.FC<ToastProps & { onClose: () => void }> = ({
  message,
  type,
  onClose
}) => {
  const alertClass = `alert ${
    type === "success"
      ? "alert-success"
      : type === "error"
        ? "alert-error"
        : type === "warning"
          ? "alert-warning"
          : "alert-info"
  }`;

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        );
    }
  };

  return (
    <div
      className={`${alertClass} shadow-lg transition-opacity duration-300 ease-in-out mb-2`}
    >
      {getIcon()}
      <span>{message}</span>
      <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
        ×
      </button>
    </div>
  );
};

// Estado e gerenciamento
interface ToastState {
  toasts: ToastProps[];
  position: ToastPosition;
}

const initialState: ToastState = {
  toasts: [],
  position: "top-right"
};

type ToastAction =
  | { type: "ADD_TOAST"; payload: ToastProps }
  | { type: "REMOVE_TOAST"; payload: { id: string } }
  | { type: "SET_POSITION"; payload: { position: ToastPosition } };

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, action.payload] };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload.id)
      };
    case "SET_POSITION":
      return { ...state, position: action.payload.position };
    default:
      return state;
  }
};

// Contexto
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider
interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "top-right"
}) => {
  const [state, dispatch] = useReducer(toastReducer, {
    ...initialState,
    position
  });

  const showToast = useCallback(
    (message: string, type: ToastType, duration = 5000) => {
      const id = Math.random().toString(36).substring(2, 9);

      dispatch({
        type: "ADD_TOAST",
        payload: { id, message, type, duration }
      });

      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", payload: { id } });
      }, duration);
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    dispatch({ type: "REMOVE_TOAST", payload: { id } });
  }, []);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2"
  }[state.position];

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div
        className={`fixed z-50 flex flex-col gap-2 max-w-xs ${positionClasses}`}
        style={{ maxHeight: "100vh", overflow: "hidden" }}
      >
        {state.toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Custom hook that provides access to the ToastContext.
 * This hook should be used to interact with the toast notification system.
 *
 * @throws {Error} If the `useToast` hook is called outside a `ToastProvider` component,
 *         an error is thrown to enforce proper usage.
 *
 * @returns {Object} The context value provided by the `ToastProvider`.
 * This typically includes methods and properties for managing toast notifications.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
};
