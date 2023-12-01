import { useState } from "react";

export default function Button() {
  const [buttonState, setButtonState] = useState(false);

  return (
    <>
      <div className="button">
        <button></button>
      </div>
      <div className="button">
        <button></button>
      </div>
      <div className="button">
        <button></button>
      </div>
    </>
  );
}
