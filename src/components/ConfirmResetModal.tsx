import React from "react";

type ConfirmResetModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Start a New Game?</h2>
        <p>
          Are you sure you want to reset and start a new game? All current
          progress will be lost.
        </p>
        <div className="modal-buttons">
          <button className="btn cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn confirm" onClick={onConfirm}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmResetModal;
