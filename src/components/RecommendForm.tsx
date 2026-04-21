"use client";

import { useState } from "react";

export default function RecommendForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/mrerlnjw", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ shopName: name, address, note }),
      });
      if (res.ok) {
        setStatus("success");
        setName("");
        setAddress("");
        setNote("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl px-6 py-5 text-green-800 dark:text-green-200 text-sm">
        Thanks for the recommendation! Ethan will check it out.
      </div>
    );
  }

  const inputClass = "w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 border font-sans";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1 font-sans" style={{ color: "var(--foreground)" }}>Shop Name *</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Onyx Coffee Lab"
          className={inputClass}
          style={{ background: "var(--card)", color: "var(--foreground)", borderColor: "var(--card-border)" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 font-sans" style={{ color: "var(--foreground)" }}>Address</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. 123 Main St, Houston, TX"
          className={inputClass}
          style={{ background: "var(--card)", color: "var(--foreground)", borderColor: "var(--card-border)" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 font-sans" style={{ color: "var(--foreground)" }}>Why should Ethan try it?</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="What makes it special?"
          className={`${inputClass} resize-none`}
          style={{ background: "var(--card)", color: "var(--foreground)", borderColor: "var(--card-border)" }}
        />
      </div>
      {status === "error" && (
        <p className="text-red-500 text-xs">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="text-white px-6 py-2 rounded-full text-sm font-medium transition-opacity disabled:opacity-50 cursor-pointer hover:opacity-80 font-sans"
        style={{ background: "var(--accent)" }}
      >
        {status === "sending" ? "Sending..." : "Submit Recommendation"}
      </button>
    </form>
  );
}
