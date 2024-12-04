import React, { useEffect, useContext, useState } from "react";
import "./LoginModal.scss"; // Ensure this import is correct
import { UserContext } from "../../UserContext";
import Spinner from "../../components/Spinner/Spinner";

type Props = {
  type: string;
  show: boolean;
  handleClose: () => void;
  setModalType: (type: string) => void;
  setAlertPopup: (message: string) => void;
};

const LoginModal: React.FC<Props> = ({
  type,
  show,
  handleClose,
  setModalType,
  setAlertPopup,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  useEffect(() => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");

    if (show) {
      setModalType("login");
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [show]);

  if (!show) {
    return null;
  }

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setAlertPopup("Användaren har skapats");
          setUser(data.user);
          handleClose();
        } else {
          setAlertPopup(data.error);
        }
      });
  };
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setAlertPopup("Du har loggats in");
          setUser(data.user);
          handleClose();
        } else {
          setAlertPopup(data.error);
        }
      });
  };
  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setAlertPopup(data.message);
          setLoading(false);
        } else {
          setTimeout(() => {
            setAlertPopup(data.error);
            setLoading(false);
          }, 1000);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className="login-modal-background">
      {type === "login" && (
        <section className="login-modal-content">
          <span className="close-button" onClick={handleClose}>
            &times;
          </span>
          <h2>Logga in</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">E-post</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Logga in
            </button>
            <div className="my-3">
              <p>
                Har du glömt lösenordet? Klicka{" "}
                <span
                  className="text-decoration-underline password-reset"
                  onClick={() => setModalType("reset")}
                >
                  här
                </span>
              </p>
            </div>
            <button
              onClick={() => setModalType("register")}
              type="button"
              className="submit-button"
            >
              Skapa användare
            </button>
          </form>
        </section>
      )}
      {type === "register" && (
        <div className="login-modal-content">
          <span className="close-button" onClick={handleClose}>
            &times;
          </span>
          <h2>Skapa användare</h2>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="email">E-post</label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name="email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Lösenord</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                name="password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstname">Förnamn</label>
              <input
                type="text"
                id="firstname"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                name="firstname"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Efternamn</label>
              <input
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                id="lastname"
                name="lastname"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Skapa användare
            </button>
          </form>
        </div>
      )}
      {type === "reset" && (
        <div className="login-modal-content">
          <span className="close-button" onClick={handleClose}>
            &times;
          </span>
          <h2>Glömt lösenord</h2>
          <p>
            Fyll i din e-postadress så skickar vi ett nytt lösenord till dig.
          </p>
          <form onSubmit={handleReset}>
            <div className="form-group">
              <label htmlFor="email">E-post</label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name="email"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              {loading ? <Spinner size="sm" /> : "Skicka"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginModal;
