import{ useEffect } from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message, isError, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Menyembunyikan notifikasi setelah 3 detik

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white ${
        isError ? 'bg-red-500' : 'bg-green-500'
      }`}
      role="alert"
    >
      <p>{message}</p>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  isError: PropTypes.bool,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

Notification.defaultProps = {
  isError: false,
};

export default Notification;
