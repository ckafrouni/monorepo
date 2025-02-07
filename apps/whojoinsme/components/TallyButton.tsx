"use client";

import { useEffect, useState } from "react";

interface TallyButtonProps {
  className?: string;
}

export default function TallyButton({ className = "" }: TallyButtonProps) {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const userEmail = localStorage.getItem("lumaEmail");
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  return (
    <button
      data-tally-open="3EZ8No"
      data-tally-layout="modal"
      data-tally-emoji-text="💖"
      data-tally-emoji-animation="heart-beat"
      data-tally-auto-close="0"
      data-email={email}
      className={`fixed bottom-6 right-16 rounded-full bg-blue-500 px-4 py-2 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-600 active:scale-95 ${className}`}
    >
      {`I'm missing something`}
    </button>
  );
}
