import "../styling/modalStyles.css";

const Modal = ({ open = false, children }) => {
  return (
    <>
      {open && (
        <div className="modal">
          <div className="mainContent">{children}</div>
        </div>
      )}
    </>
  );
};

export default Modal;
