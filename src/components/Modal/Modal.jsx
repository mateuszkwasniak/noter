import classes from "./modal.module.scss";

const Modal = ({ children, style }) => {
  return (
    <div className={classes.modal} style={style}>
      {children}
    </div>
  );
};

export default Modal;
