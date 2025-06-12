import React, { useEffect, useState } from "react";
import "./BackOffice.scss";

interface Episode {
  _id: string;
  title: string;
  episodeNumber: number;
  description: string;
  characters: string[];
  players: string[];
  gameMaster: string;
  audioFile: string;
  length: number;
  poster: string;
  dateOfRecording: string;
}

const BackOffice: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(
    null
  );
  const [title, setTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState(0);
  const [description, setDescription] = useState("");
  const [characters, setCharacters] = useState("");
  const [players, setPlayers] = useState("");
  const [gameMaster, setGameMaster] = useState("");
  const [audioFile, setAudioFile] = useState("");
  const [length, setLength] = useState(0);
  const [poster, setPoster] = useState("");
  const [dateOfRecording, setDateOfRecording] = useState("");
  const [feedback, setFeedback] = useState("");

  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [selectedPosterFile, setSelectedPosterFile] = useState<File | null>(
    null
  );

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [converting, setConverting] = useState(false);

  // Lyssna på WebSocket-meddelanden för konverteringsstatus
  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.progress !== undefined) {
        setUploading(false);
        setProgress(data.progress);
        setConverting(true);
      }
      if (data.path) {
        setAudioFile(data.path);
        setConverting(false);
        setProgress(null);
      }
    };

    return () => ws.close();
  }, []);

  // Hämta alla episoder
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch("/api/episode");
        const data = await response.json();
        setEpisodes(data);
      } catch (error) {
        setFeedback("Kunde inte hämta episoder.");
      }
    };
    fetchEpisodes();
  }, []);

  // Fyll i formuläret vid val av episod
  const handleSelectEpisode = (episode: Episode) => {
    setSelectedEpisodeId(episode._id);
    setTitle(episode.title);
    setEpisodeNumber(episode.episodeNumber);
    setDescription(episode.description);
    setCharacters(episode.characters.join(", "));
    setPlayers(episode.players.join(", "));
    setGameMaster(episode.gameMaster);
    setAudioFile(episode.audioFile);
    setLength(episode.length);
    setPoster(episode.poster);
    const formattedDate = episode.dateOfRecording.split("T")[0];
    setDateOfRecording(formattedDate);
  };

  // Utility function to get audio file length
  const getAudioLength = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(URL.createObjectURL(file));

      audio.addEventListener("loadedmetadata", () => {
        // Convert seconds to minutes and round to nearest integer
        const lengthInMinutes = Math.round(audio.duration / 60);
        resolve(lengthInMinutes);
      });

      audio.addEventListener("error", (e) => {
        console.error("Error loading audio", e);
        reject(new Error("Kunde inte läsa av ljudfilens längd"));
      });
    });
  };

  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAudioFile(file);
      setAudioFile(file.name);

      // Automatically set length when audio is selected
      getAudioLength(file)
        .then((audioLength) => {
          setLength(audioLength);
        })
        .catch((error) => {
          setFeedback(error.message);
        });
    }
  };

  const handlePosterFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPosterFile(file);
      setPoster(file.name);
    }
  };

  // Upload audio file without progress tracking
  // const uploadAudioFile = async () => {
  //   if (!selectedAudioFile) {
  //     setFeedback("Ingen ljudfil vald");
  //     return null;
  //   }

  //   setFeedback("");
  //   setProgress(0);
  //   setConverting(false);

  //   const formData = new FormData();
  //   formData.append("audioFile", selectedAudioFile);

  //   try {
  //     const response = await fetch("/api/upload/audio", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error("Kunde inte ladda upp ljudfilen");
  //     }

  //     const data = await response.json();
  //     setConverting(true);
  //     return data.path;
  //   } catch (error) {
  //     setFeedback("Uppladdning av ljudfil misslyckades");
  //     return null;
  //   }
  // };

  // Upload audio file with progress tracking
  const uploadAudioFile = async () => {
    if (!selectedAudioFile) {
      setFeedback("Ingen ljudfil vald");
      return null;
    }

    setFeedback("");
    setUploading(true);
    setProgress(0);
    setConverting(false);

    const formData = new FormData();
    formData.append("audioFile", selectedAudioFile);

    try {
      const data = await new Promise<{ path: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const resData = JSON.parse(xhr.responseText);
              resolve(resData);
            } catch {
              reject(new Error("Ogiltigt JSON-svar"));
            }
          } else {
            reject(new Error("Fel vid uppladdning"));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Nätverksfel vid uppladdning"));
        };

        xhr.open("POST", "/api/upload/audio");
        xhr.send(formData);
      });

      setUploading(false);
      setConverting(true);
      return data.path;
    } catch (err) {
      console.error(err);
      setFeedback("Uppladdning av ljudfil misslyckades");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Upload poster file
  const uploadPosterFile = async () => {
    if (!selectedPosterFile) {
      return null;
    }

    const formData = new FormData();
    formData.append("posterFile", selectedPosterFile);

    try {
      const response = await fetch("/api/upload/poster", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Kunde inte ladda upp postern");
      }

      const data = await response.json();
      return data.path;
    } catch (error) {
      setFeedback("Uppladdning av poster misslyckades");
      return null;
    }
  };

  // Skapa en ny episod
  const handleCreateEpisode = async () => {
    try {
      // Upload files first if selected
      // const uploadedAudioPath = selectedAudioFile
      //   ? await uploadAudioFile()
      //   : null;

      let uploadedAudioPath = null;

      if (selectedAudioFile) {
        uploadedAudioPath = await uploadAudioFile();
        if (!uploadedAudioPath) return;
      }

      const uploadedPosterPath = selectedPosterFile
        ? await uploadPosterFile()
        : null;

      const response = await fetch("/api/episode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          episodeNumber,
          description,
          characters: characters.split(",").map((c) => c.trim()),
          players: players.split(",").map((p) => p.trim()),
          gameMaster,
          audioFile: uploadedAudioPath || audioFile,
          length,
          poster: uploadedPosterPath || poster,
          dateOfRecording,
        }),
      });

      if (!response.ok) throw new Error("Ett fel uppstod vid skapandet.");

      const newEpisode = await response.json();
      setEpisodes([...episodes, newEpisode]);
      setFeedback(`Episoden skapades: ${newEpisode.title}`);
      clearForm();
    } catch (error: any) {
      setFeedback(error.message || "Ett fel uppstod.");
    }
  };

  // Uppdatera en episod
  const handleUpdateEpisode = async () => {
    if (!selectedEpisodeId) return;

    try {
      // Upload files first if selected
      const uploadedAudioPath = selectedAudioFile
        ? await uploadAudioFile()
        : null;
      const uploadedPosterPath = selectedPosterFile
        ? await uploadPosterFile()
        : null;

      const response = await fetch(`/api/episode/${selectedEpisodeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          episodeNumber,
          description,
          characters: characters.split(",").map((c) => c.trim()),
          players: players.split(",").map((p) => p.trim()),
          gameMaster,
          audioFile: uploadedAudioPath || audioFile,
          length,
          poster: uploadedPosterPath || poster,
          dateOfRecording,
        }),
      });

      if (!response.ok) throw new Error("Ett fel uppstod vid uppdateringen.");

      const updatedEpisode = await response.json();
      setEpisodes(
        episodes.map((ep) =>
          ep._id === updatedEpisode._id ? updatedEpisode : ep
        )
      );
      setFeedback(`Episoden uppdaterades: ${updatedEpisode.title}`);
      clearForm();
    } catch (error: any) {
      setFeedback(error.message || "Ett fel uppstod.");
    }
  };

  const handleDeleteEpisode = async () => {
    if (!selectedEpisodeId) {
      setFeedback("Ingen episod vald att ta bort.");
      return;
    }

    try {
      const response = await fetch(`/api/episode/${selectedEpisodeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Kunde inte ta bort episoden.");
      }

      // Ta bort episoden från state
      const updatedEpisodes = episodes.filter(
        (ep) => ep._id !== selectedEpisodeId
      );
      setEpisodes(updatedEpisodes);

      // Rensa formuläret och återställ vald episod
      clearForm();
      setFeedback("Episoden har tagits bort.");
    } catch (error: any) {
      setFeedback(error.message || "Ett fel uppstod vid borttagning.");
    }
  };

  const clearForm = () => {
    setSelectedEpisodeId(null);
    setTitle("");
    setEpisodeNumber(0);
    setDescription("");
    setCharacters("");
    setPlayers("");
    setGameMaster("");
    setAudioFile("");
    setLength(0);
    setPoster("");
    setDateOfRecording("");
  };

  return (
    <div className="back-office">
      <h1>Back Office</h1>
      <div className="back-office-inner">
        <div className="episode-list">
          <h2>Lista av episoder</h2>
          <ul>
            {episodes.map((ep) => (
              <li key={ep._id} onClick={() => handleSelectEpisode(ep)}>
                {ep.episodeNumber}: {ep.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="episode-form">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              selectedEpisodeId ? handleUpdateEpisode() : handleCreateEpisode();
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
                type="file"
                accept="audio/*"
                onChange={handleAudioFileSelect}
              />
              {selectedAudioFile && (
                <p>Vald ljudfil: {selectedAudioFile.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="posterFile">Poster:</label>
              <input
                id="posterFile"
                type="file"
                accept="image/*"
                onChange={handlePosterFileSelect}
              />
              {selectedPosterFile && (
                <p>Vald poster: {selectedPosterFile.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="dateOfRecording">Datum:</label>
              <input
                id="dateOfRecording"
                type="date"
                value={dateOfRecording}
                onChange={(e) => setDateOfRecording(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button type="submit">
                {selectedEpisodeId ? "Uppdatera Episod" : "Skapa Episod"}
              </button>
              <button type="button" onClick={clearForm}>
                Rensa Formulär
              </button>
              {selectedEpisodeId && (
                <button
                  type="button"
                  onClick={handleDeleteEpisode}
                  className="delete-button"
                >
                  Ta Bort Episod
                </button>
              )}
            </div>
          </form>
          {(uploading || converting) && (
            <div
              className={`progress-container ${
                (progress ?? 0) > 0 ? "show" : ""
              }`}
            >
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
              <div className="progress-text">
                <p>
                  {uploading
                    ? "Uppladdning"
                    : converting
                    ? "Konvertering"
                    : "Klar"}
                  : {progress?.toFixed(1)}%
                </p>
              </div>
            </div>
          )}
          {feedback && <p className="feedback">{feedback}</p>}
        </div>
      </div>
    </div>
  );
};

export default BackOffice;
