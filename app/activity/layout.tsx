import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function ActivityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <style>{`
        @media (min-width: 769px) {
          .activity-layout-wrapper {
            display: flex;
            flex-direction: row !important;
          }
        }
      `}</style>
      <Header />

      <div
        className="activity-layout-wrapper"
        style={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
        <Sidebar />

        <main style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
