import { useState } from "react";
import { supabase } from "../lib/supabase";

export function useWaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const { error } = await supabase
      .from("landing_waitlist")
      .insert({ email });

    // Show success even on duplicate (don't leak membership)
    if (!error || error.code === "23505") {
      setSubmitted(true);
      setEmail("");
    }
  };

  return { email, setEmail, submitted, handleSubmit };
}
