import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../UserContext";
import { Link } from "react-router-dom";
import Popup from "../../../components/Popup/Popup";
import "./Profile.scss";

const Profile: React.FC = () => {
  const { user, setUser, fetchUserData } = useContext(UserContext);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  // const [message, setMessage] = useState("");
  const [alertPopup, setAlertPopup] = useState<string | null>(null);

  // Funktion för att uppdatera profil

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (!response.ok) throw new Error("Profiluppdatering misslyckades");

      const updatedUser = await response.json();
      setUser((prevUser) => ({
        ...prevUser, // Behåller befintlig data som email
        ...updatedUser, // Uppdaterar ny data
      }));

      setAlertPopup("Profil uppdaterad!");

      await fetchUserData();
    } catch (error) {
      setAlertPopup("Fel vid uppdatering av profil");
    }
  };

  // Funktion för att uppdatera lösenord
  const handleUpdatePassword = async () => {
    try {
      const response = await fetch("/api/user/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) throw new Error("Lösenordsuppdatering misslyckades");
      setAlertPopup("Lösenord uppdaterat!");
    } catch (error) {
      setAlertPopup("Fel vid uppdatering av lösenord");
    }
  };

  if (!user) {
    return <p>Ingen användare inloggad</p>;
  }

  return (
    <div className="profile">
      <h1>Din Profil</h1>
      <div className="profile-card">
        <div className="profile-field">
          <label>Förnamn:</label>
          {/* <span>{user.firstName}</span> */}
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            aria-label="Förnamn"
          />
        </div>
        <div className="profile-field">
          <label>Efternamn:</label>
          {/* <span>{user.lastName}</span> */}
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            aria-label="Efternamn"
          />
        </div>
        <div className="profile-field">
          <label>E-post:</label>
          <span>{user.email}</span>
        </div>
        <button
          className="update-button"
          onClick={handleUpdateProfile}
          aria-label="Uppdatera Profil"
        >
          Uppdatera Profil
        </button>
      </div>

      <div className="password-update">
        <h2>Uppdatera Lösenord</h2>
        <div className="password-field">
          <input
            type="password"
            placeholder="Gammalt lösenord"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="password-field">
          <input
            type="password"
            placeholder="Nytt lösenord"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="update-button"
          onClick={handleUpdatePassword}
          aria-label="Uppdatera Lösenord"
        >
          Uppdatera Lösenord
        </button>
      </div>

      {user.role === "admin" && (
        <Link to="/back-office">
          <button type="button" className="back-office-button">
            Back Office
          </button>
        </Link>
      )}

      {alertPopup && (
        <div className="popup-overlay">
          <Popup
            title=" "
            info={alertPopup}
            onClose={() => setAlertPopup(null)}
          />
        </div>
      )}
      {/* {message && <p className="message">{message}</p>} */}
    </div>
  );
};

export default Profile;
