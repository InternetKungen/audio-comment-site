import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import LoginModal from "../../views/modals/LoginModal";
import { UserContext } from "../../UserContext";
import LoginIcon from "../../assets/icons/person_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png";
import LogoutIcon from "../../assets/icons/logout_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png";
import ProfileIcon from "../../assets/icons/clarify_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png";
import Logo from "../../assets/img/logo-dnd-site.png";

const Header: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [alertPopup, setAlertPopup] = useState<string | null>(null);

  const handleClose = () => setShowModal(false);

  const handleLogout = () => {
    fetch("/api/auth/logout", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setUser(null);
          navigate("/");
          setAlertPopup(data.message);
        } else if (data.error) {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <header className="header">
      <div className="header__content">
        <Link to="/" className="header__logo">
          <img className="header__logo__img" src={Logo} alt="Logo" />
          <h1>Dungeons & Dragons: Huvudsta</h1>
        </Link>

        <div className="header__actions">
          {/* Om användaren är inloggad */}
          {user ? (
            <>
              <Link to="/profile" className="header__icon">
                <img src={ProfileIcon} alt="Profile" />
              </Link>
              <button onClick={handleLogout} className="header__icon">
                <img src={LogoutIcon} alt="Logout" />
              </button>
            </>
          ) : (
            // Om användaren inte är inloggad
            <button onClick={() => setShowModal(true)} className="header__icon">
              <img src={LoginIcon} alt="Login" />
            </button>
          )}
        </div>
      </div>

      <LoginModal
        show={showModal}
        setModalType={setModalType}
        type={modalType}
        handleClose={handleClose}
        setAlertPopup={setAlertPopup}
      />

      {/* Popup för utloggning */}
      {alertPopup && <p className="alert-popup">{alertPopup}</p>}
    </header>
  );
};

export default Header;
