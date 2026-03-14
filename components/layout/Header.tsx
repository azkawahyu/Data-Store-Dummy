import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "3px solid #ccc",
      }}
    >
      <div style={{ fontWeight: 600 }}>Dashboard</div>

      <UserMenu />
    </header>
  );
}
