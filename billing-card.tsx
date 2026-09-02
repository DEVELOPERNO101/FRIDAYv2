"use client";

import { useState } from "react";

export default function BillingCard() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upgrade(tier: "pro" | "ultra") {
    setError(null);
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong starting checkout.");
        setLoadingTier(null);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      setError("Could not reach the server.");
      setLoadingTier(null);
    }
  }

  return (
    <div className="card">
      <div className="card-label">Billing</div>
      <div style={{ fontSize: 14, color: "var(--slate)", marginBottom: 14 }}>
        No active plan yet.
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          className="btn"
          onClick={() => upgrade("pro")}
          disabled={loadingTier !== null}
          style={{ opacity: loadingTier === "pro" ? 0.6 : 1 }}
        >
          {loadingTier === "pro" ? "Redirecting..." : "Upgrade to Pro"}
        </button>
        <button
          className="btn"
          onClick={() => upgrade("ultra")}
          disabled={loadingTier !== null}
          style={{
            opacity: loadingTier === "ultra" ? 0.6 : 1,
            background: "var(--gold)",
          }}
        >
          {loadingTier === "ultra" ? "Redirecting..." : "Upgrade to Ultra"}
        </button>
      </div>

      {error && (
        <div style={{ color: "#ff8a8a", fontSize: 13, marginTop: 10 }}>
          {error}
        </div>
      )}
    </div>
  );
}
