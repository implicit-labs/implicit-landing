import { useState } from "react";

export function useWaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log("Waitlist signup:", email);
    setSubmitted(true);
    setEmail("");
  };

  return { email, setEmail, submitted, handleSubmit };
}
