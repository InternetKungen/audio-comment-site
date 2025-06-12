export const handleAudioUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Ingen fil har laddats upp" });
  }

  res.json({
    filename: req.file.filename,
    path: `/api/stream/audio/${req.file.filename}`,
  });
};

export const handlePosterUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Ingen poster har laddats upp" });
  }

  res.json({
    filename: req.file.filename,
    path: `/public/uploads/posters/${req.file.filename}`,
  });
};
