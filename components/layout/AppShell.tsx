import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";

type AppShellProps = {
  children: React.ReactNode;
  showSidebar?: boolean;
};

export default function AppShell({
  children,
  showSidebar = true,
}: AppShellProps) {
  return (
    <SidebarProvider>
      <div
        className="app-shell-root"
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        <style>{`
        .app-shell-root {
          width: 100%;
          height: 100vh;
          max-height: 100vh;
          overflow: hidden;
          overflow-x: hidden;
          flex-direction: column;
        }

        .app-shell-layout-wrapper {
          flex: 1;
          min-height: 0;
          min-width: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .app-shell-content {
          display: flex;
          flex: 1;
          min-height: 0;
          min-width: 0;
          flex-direction: column;
          overflow: hidden;
        }

        .app-shell-main {
          padding: 24px;
          flex: 1;
          min-height: 0;
          min-width: 0;
          overflow-y: auto;
        }

        @media (min-width: 769px) {
          .app-shell-root {
            display: flex;
            flex-direction: row;
          }

          .app-shell-layout-wrapper {
            min-width: 0;
            width: 100%;
            flex-direction: row;
          }
        }

        @media (max-width: 1024px) {
          .app-shell-main {
            padding: 18px;
          }
        }

        @media (max-width: 768px) {
          .app-shell-main {
            padding: 12px;
          }
        }
      `}</style>

        <div className="app-shell-layout-wrapper" style={{ flex: 1 }}>
          {showSidebar && <Sidebar />}

          <div className="app-shell-content">
            <Header showSidebarToggle={showSidebar} />
            <main className="app-shell-main">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
