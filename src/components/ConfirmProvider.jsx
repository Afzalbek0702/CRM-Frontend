import { createContext, useContext, useState } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    message: "",
    resolve: null,
  });

  const confirm = (message, title = "Confirm") => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title,
        message,
        resolve,
      });
    });
  };

  const handleClose = () => {
    if (state.resolve) state.resolve(false);
    setState({ ...state, isOpen: false, resolve: null });
  };

  const handleConfirm = () => {
    if (state.resolve) state.resolve(true);
    setState({ ...state, isOpen: false, resolve: null });
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {state.isOpen && (
        <>
          <div
            className="side-panel-backdrop"
            onClick={handleClose}
          ></div>

          <div className="confirm-modal">
            <div className="confirm-header">
              <FaExclamationTriangle className="confirm-icon" />
              <h3>{state.title}</h3>
            </div>

            <p className="confirm-message">{state.message}</p>

            <div className="confirm-buttons">
              <button className="btn-cancel" onClick={handleClose}>
                <FaTimes /> Cancel
              </button>

              <button className="btn-danger" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
};