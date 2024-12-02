import React, { useState } from "react";
import "./BackOffice.scss";

const BackOffice: React.FC = () => {
  const [title, setTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState(0);
  const [description, setDescription] = useState("");
  const [characters, setCharacters] = useState("");
  const [players, setPlayers] = useState("");
  const [gameMaster, setGameMaster] = useState("");
  const [audioFile, setAudioFile] = useState("");
  const [length, setLength] = useState(0);
  const [poster, setPoster] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleCreateEpisode = async () => {
    try {
      const response = await fetch("/api/episode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Skicka cookies för autentisering
        body: JSON.stringify({
          title,
          episodeNumber,
          description,
          characters: characters.split(",").map((c) => c.trim()),
          players: players.split(",").map((p) => p.trim()),
          gameMaster,
          audioFile,
          length,
          poster,
          rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ett fel uppstod");
      }

      const data = await response.json();
      setFeedback(`Episoden skapades: ${data.title}`);
      // Rensa formuläret efter lyckad skapelse
      setTitle("");
      setEpisodeNumber(0);
      setDescription("");
      setCharacters("");
      setPlayers("");
      setGameMaster("");
      setAudioFile("");
      setLength(0);
      setPoster("");
      setRating(0);
    } catch (error: any) {
      setFeedback(
        error.message || "Ett fel uppstod vid skapandet av episoden."
      );
    }
  };

  return (
    <div className="back-office">
      <h1>Back Office</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateEpisode();
        }}
      >
        <div>
          <label htmlFor="title">Titel:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="episodeNumber">Avsnittsnummer:</label>
          <input
            id="episodeNumber"
            type="number"
            value={episodeNumber}
            onChange={(e) => setEpisodeNumber(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="description">Beskrivning:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="characters">Karaktärer (kommaseparerade):</label>
          <input
            id="characters"
            type="text"
            value={characters}
            onChange={(e) => setCharacters(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="players">Spelare (kommaseparerade):</label>
          <input
            id="players"
            type="text"
            value={players}
            onChange={(e) => setPlayers(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="gameMaster">Spelledare:</label>
          <input
            id="gameMaster"
            type="text"
            value={gameMaster}
            onChange={(e) => setGameMaster(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="audioFile">Ljudfil:</label>
          <input
            id="audioFile"
            type="text"
            value={audioFile}
            onChange={(e) => setAudioFile(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="length">Längd (minuter):</label>
          <input
            id="length"
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="poster">Poster:</label>
          <input
            id="poster"
            type="text"
            value={poster}
            onChange={(e) => setPoster(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="rating">Betyg:</label>
          <input
            id="rating"
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </div>
        <button type="submit">Skapa Episod</button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
};

export default BackOffice;
