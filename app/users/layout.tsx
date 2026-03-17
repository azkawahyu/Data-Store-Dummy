import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />

        <main style={{ padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}
