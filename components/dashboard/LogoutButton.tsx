"use client";

export default function LogoutButton() {
  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <button
      onClick={logout}
      style={{
        textAlign: "left",
        border: "none",
        background: "transparent",
        padding: "8px 10px",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
