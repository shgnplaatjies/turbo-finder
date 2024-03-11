import Modal from "react-modal";
import "./TurboModal.scss";
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
  return isOpen ? (
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
  ) : null;
};

export default UnlockModal;
