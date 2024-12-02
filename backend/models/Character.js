const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  backstory: { type: String, default: "" },
});

const Character = mongoose.model("Character", characterSchema);

//characters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Character" }], <- i Episode.js
