import PropTypes from "prop-types";

const CheckError = ({ error, inputName, fieldName, children }) => {
  return (
    error[inputName]?.type === fieldName && (
      <div className="leading-3 text-sm text-red-500">{children}</div>
    )
  );
};

CheckError.propTypes = {
  error: PropTypes.object,
  inputName: PropTypes.string,
  fieldName: PropTypes.string,
  children: PropTypes.node,
};

export default CheckError;
