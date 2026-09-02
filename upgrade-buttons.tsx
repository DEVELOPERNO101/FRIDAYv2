"use client";

import { useState } from "react";

export default function UpgradeButtons() {
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
    <div>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          className="btn"
          onClick={() => upgrade("pro")}
          disabled={loadingTier !== null}
        >
          {loadingTier === "pro" ? "Redirecting..." : "Upgrade to Pro"}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => upgrade("ultra")}
          disabled={loadingTier !== null}
        >
          {loadingTier === "ultra" ? "Redirecting..." : "Upgrade to Ultra"}
        </button>
      </div>
      {error && (
        <div style={{ color: "#ff8a8a", fontSize: 12, marginTop: 10 }}>{error}</div>
      )}
    </div>
  );
}
