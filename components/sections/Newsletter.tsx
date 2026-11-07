"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setDone(true); // mock subscribe
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Newsletter signup">
      {/* nee existing input, button, glass styling ikkada move chey */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <button type="submit">{done ? "Subscribed!" : "Subscribe"}</button>
    </form>
  );
}