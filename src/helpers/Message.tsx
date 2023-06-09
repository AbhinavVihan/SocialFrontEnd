import React, { useEffect, useState } from "react";

const Message: React.FC<{ text: string; duration: number }> = ({
  text,
  duration,
}) => {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return showMessage ? (
    <div className="fixed top-0 left-0 right-0 flex items-center justify-center h-screen">
      <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow">
        <p>{text}</p>
      </div>
    </div>
  ) : null;
};

export default Message;
