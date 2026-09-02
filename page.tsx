import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "./sign-out-button";
import UpgradeButtons from "./upgrade-buttons";
import LiveData from "./live-data";
import Image from "next/image";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div className="who">
          <Image src="/logo.png" alt="Jarvis" width={36} height={36} style={{ borderRadius: 8 }} />
          <div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>
              JARVIS
            </div>
            <div style={{ fontSize: 12, color: "var(--slate)" }}>
              {session?.user?.email ?? "not signed in"}
            </div>
          </div>
        </div>
        <SignOutButton />
      </div>

      <div className="card">
        <div className="card-label">Account</div>
        <div style={{ fontSize: 14 }}>
          Signed in as <strong>{session?.user?.name}</strong>
        </div>
      </div>

      <div className="card">
        <div className="card-label">Integrations</div>

        <div className="integration-row">
          <span className="integration-name">Google Account</span>
          <span className="integration-status status-connected">CONNECTED</span>
        </div>
        <LiveData />
      </div>

      <div className="card">
        <div className="card-label">Billing</div>
        <div style={{ fontSize: 14, color: "var(--slate)", marginBottom: 12 }}>
          No active plan yet. Pro unlocks the core assistant. Ultra adds full
          social + analytics integration and unlimited vault memory.
        </div>
        <UpgradeButtons />
      </div>
    </div>
  );
}
