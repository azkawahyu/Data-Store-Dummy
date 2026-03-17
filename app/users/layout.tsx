import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @media (min-width: 769px) {
          .users-layout-wrapper {
            display: flex;
            flex-direction: row !important;
          }
        }
      `}</style>

      <Header />

      <div
        className="users-layout-wrapper"
        style={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
        <Sidebar />
        <main style={{ padding: 24, flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
