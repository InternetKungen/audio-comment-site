import React, { useContext } from "react";
import { UserContext } from "../../../UserContext";
import "./Profile.scss";

const Profile: React.FC = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <p>Ingen användare inloggad</p>;
  }

  return (
    <div className="profile">
      <h1>Din Profil</h1>
      <div className="profile-card">
        <div className="profile-field">
          <label>Förnamn:</label>
          <span>{user.firstName}</span>
        </div>
        <div className="profile-field">
          <label>Efternamn:</label>
          <span>{user.lastName}</span>
        </div>
        <div className="profile-field">
          <label>E-post:</label>
          <span>{user.email}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
