"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useReducer
} from "react";
import Toast from "@/components/Toast";

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastState {
  toasts: ToastProps[];
  position: ToastPosition;
}

export const initialState: ToastState = {
  toasts: [],
  position: "top-right"
};

export type ToastAction =
  | { type: "ADD_TOAST"; payload: ToastProps }
  | { type: "REMOVE_TOAST"; payload: { id: string } }
  | { type: "SET_POSITION"; payload: { position: ToastPosition } };

export const toastReducer = (
  state: ToastState,
  action: ToastAction
): ToastState => {
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

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

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

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
};
