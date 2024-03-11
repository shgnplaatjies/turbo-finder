import Modal from "react-modal";

interface UnlockModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  modalText: string;
  contentLabel?: string;
  closeButtonText?: string;
}

const UnlockModal: React.FC<UnlockModalProps> = ({
  isOpen,
  onRequestClose,
  modalText,
  closeButtonText = "Close",
  contentLabel = "",
}) => {
  return (
    <article className="abstract-modal">
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel={contentLabel}
      >
        <p>{modalText}</p>
        <button type="button" onClick={onRequestClose}>
          {closeButtonText}
        </button>
      </Modal>
    </article>
  );
};

export default UnlockModal;
