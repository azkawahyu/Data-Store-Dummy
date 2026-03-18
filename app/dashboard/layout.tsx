import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="dashboard-root"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <style>{`
        .dashboard-root {
          width: 100%;
          overflow-x: hidden;
        }

        .dashboard-layout-wrapper {
          min-width: 0;
        }

        .dashboard-main {
          padding: 24px;
          flex: 1;
          overflow-y: auto;
          min-width: 0;
        }

        @media (min-width: 769px) {
          .dashboard-layout-wrapper {
            display: flex;
            flex-direction: row !important;
          }
        }

        @media (max-width: 1024px) {
          .dashboard-main {
            padding: 18px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-main {
            padding: 12px;
          }
        }
      `}</style>

      <Header />

      <div
        className="dashboard-layout-wrapper"
        style={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
        <Sidebar />
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
