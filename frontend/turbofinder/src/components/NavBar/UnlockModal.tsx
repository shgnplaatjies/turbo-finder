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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
    >
      <article className="abstract-modal">
        <p>{modalText}</p>
        <button type="button" onClick={onRequestClose}>
          {closeButtonText}
        </button>
      </article>
    </Modal>
  );
};

export default UnlockModal;
