"use client";

import { useEffect, useState } from "react";

type Status = "loading" | "ok" | "error";

function StatusPill({ status }: { status: Status }) {
  if (status === "loading") return <span className="integration-status status-pending">LOADING...</span>;
  if (status === "error") return <span className="integration-status status-error">ERROR</span>;
  return <span className="integration-status status-connected">LIVE</span>;
}

export default function LiveData() {
  const [gmail, setGmail] = useState<{ status: Status; data?: any; error?: string }>({ status: "loading" });
  const [drive, setDrive] = useState<{ status: Status; data?: any; error?: string }>({ status: "loading" });
  const [youtube, setYoutube] = useState<{ status: Status; data?: any; error?: string }>({ status: "loading" });

  useEffect(() => {
    fetch("/api/gmail")
      .then((r) => r.json())
      .then((d) => (d.error ? setGmail({ status: "error", error: d.error }) : setGmail({ status: "ok", data: d })))
      .catch((e) => setGmail({ status: "error", error: String(e) }));

    fetch("/api/drive")
      .then((r) => r.json())
      .then((d) => (d.error ? setDrive({ status: "error", error: d.error }) : setDrive({ status: "ok", data: d })))
      .catch((e) => setDrive({ status: "error", error: String(e) }));

    fetch("/api/youtube")
      .then((r) => r.json())
      .then((d) => (d.error ? setYoutube({ status: "error", error: d.error }) : setYoutube({ status: "ok", data: d })))
      .catch((e) => setYoutube({ status: "error", error: String(e) }));
  }, []);

  return (
    <>
      <div className="integration-row">
        <span className="integration-name">Gmail</span>
        <StatusPill status={gmail.status} />
      </div>
      {gmail.status === "error" && (
        <div className="live-detail live-detail-error">{gmail.error}</div>
      )}
      {gmail.status === "ok" && (
        <div className="live-detail">
          {gmail.data.messages.length === 0 && "Inbox is empty."}
          {gmail.data.messages.map((m: any) => (
            <div key={m.id} className="live-item">
              <span className={m.unread ? "live-item-title unread" : "live-item-title"}>{m.subject}</span>
              <span className="live-item-sub">{m.from}</span>
            </div>
          ))}
        </div>
      )}

      <div className="integration-row">
        <span className="integration-name">Google Drive</span>
        <StatusPill status={drive.status} />
      </div>
      {drive.status === "error" && (
        <div className="live-detail live-detail-error">{drive.error}</div>
      )}
      {drive.status === "ok" && (
        <div className="live-detail">
          {drive.data.files.length === 0 && "No files found."}
          {drive.data.files.map((f: any) => (
            <div key={f.id} className="live-item">
              <a href={f.webViewLink} target="_blank" rel="noreferrer" className="live-item-title">
                {f.name}
              </a>
              <span className="live-item-sub">{new Date(f.modifiedTime).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}

      <div className="integration-row">
        <span className="integration-name">YouTube</span>
        <StatusPill status={youtube.status} />
      </div>
      {youtube.status === "error" && (
        <div className="live-detail live-detail-error">{youtube.error}</div>
      )}
      {youtube.status === "ok" && (
        <div className="live-detail">
          <div className="live-item">
            <span className="live-item-title">{youtube.data.title}</span>
            <span className="live-item-sub">
              {Number(youtube.data.subscribers).toLocaleString()} subs ·{" "}
              {Number(youtube.data.views).toLocaleString()} views ·{" "}
              {youtube.data.videos} videos
            </span>
          </div>
        </div>
      )}

      <div className="integration-row">
        <span className="integration-name">Instagram</span>
        <span className="integration-status status-pending">NOT WIRED YET</span>
      </div>
    </>
  );
}
