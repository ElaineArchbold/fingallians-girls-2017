import { useEffect, useState } from "react";

const NEW_APP_URL = "https://fingallians-shared-platform.vercel.app/";
const LOGO = "/favicon.png";

export default function App() {
  const [seconds, setSeconds] = useState(3);

  function goToNewApp() {
    localStorage.setItem("redirect_seen", "true");
    window.location.replace(NEW_APP_URL);
  }

  useEffect(() => {
    if (localStorage.getItem("redirect_seen")) {
      window.location.replace(NEW_APP_URL);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          clearInterval(timer);
          localStorage.setItem("redirect_seen", "true");
          window.location.replace(NEW_APP_URL);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#7A0017 0%,#99001D 40%,#54000F 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 650,
          background: "#ffffff",
          borderRadius: 28,
          padding: 40,
          textAlign: "center",
          border: "5px solid #D4AF37",
          boxShadow: "0 25px 70px rgba(0,0,0,.35)",
        }}
      >
        <img
          src={LOGO}
          alt="Fingallians Summer Fitness Challenge"
          style={{
            width: 240,
            maxWidth: "80%",
            marginBottom: 20,
          }}
        />

        <h1
          style={{
            margin: 0,
            color: "#9B001C",
            fontSize: 38,
            fontWeight: 900,
          }}
        >
          Welcome to the New App!
        </h1>

        <p
          style={{
            fontSize: 21,
            color: "#444",
            lineHeight: 1.6,
            marginTop: 18,
          }}
        >
          We've upgraded the
          <br />
          <strong>Fingallians Summer Fitness Challenge</strong>
          <br />
          into one shared platform.
        </p>

        <div
          style={{
            marginTop: 30,
            marginBottom: 30,
            background: "#FFF8EF",
            border: "2px solid #D4AF37",
            borderRadius: 18,
            padding: 24,
            textAlign: "left",
          }}
        >
          <p style={{ margin: "12px 0", fontSize: 17 }}>
            ✅ All player progress has been safely transferred.
          </p>

          <p style={{ margin: "12px 0", fontSize: 17 }}>
            ✅ Runs, XP, badges and achievements are all still there.
          </p>

          <p style={{ margin: "12px 0", fontSize: 17 }}>
            👨‍👩‍👧 Parents should continue using the{" "}
            <strong>same email address</strong>.
          </p>

          <p style={{ margin: "12px 0", fontSize: 17 }}>
            🔐 The first time you sign in you'll be asked to create a password.
          </p>

          <p style={{ margin: "12px 0", fontSize: 17 }}>
            ❤️ Once you've created your password your linked children will
            appear automatically.
          </p>
        </div>

        <button
          onClick={goToNewApp}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: 16,
            border: "none",
            background: "#B30024",
            color: "#fff",
            fontSize: 22,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(179,0,36,.35)",
          }}
        >
          Continue to the New App →
        </button>

        <p
          style={{
            marginTop: 22,
            color: "#666",
            fontSize: 15,
          }}
        >
          Redirecting automatically in{" "}
          <strong>{seconds}</strong> second{seconds === 1 ? "" : "s"}...
        </p>

        <div
          style={{
            marginTop: 24,
            borderTop: "1px solid #eee",
            paddingTop: 16,
            color: "#888",
            fontSize: 14,
          }}
        >
          Fingallians GAA Club • Est. 1884
        </div>
      </div>
    </div>
  );
}