const mongoose = require('mongoose');
const env = require('dotenv').config();

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

// Oyuncu şeması
const playerSchema = new mongoose.Schema({
  id: String,
  name: String,
  nationality: String,
  matchesPlayed: String,
  goals: String,
  assists: String,
  yellowCards: String,
  redCards: String,
  image: String,
});

const Player = mongoose.model('Player', playerSchema);

// Duplicate belgeleri silme işlemi
const removeDuplicates = async () => {
  try {
    // Aynı 'id' değerine sahip tüm oyuncuları bul
    const duplicates = await Player.aggregate([
      {
        $group: {
          _id: { id: "$id" },       // 'id' alanına göre grupla
          duplicates: { $push: "$_id" },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gt: 1 } } }  // 1'den fazla olanları seç
    ]);

    // Tekrarlanan belgeleri kaldır
    for (const duplicate of duplicates) {
      const [first, ...rest] = duplicate.duplicates;  // İlk kaydı tut, diğerlerini sil
      await Player.deleteMany({ _id: { $in: rest } });
    }

    console.log("Duplicate players removed successfully!");
  } catch (error) {
    console.error("Error removing duplicates:", error);
  } finally {
    mongoose.connection.close();
  }
};

removeDuplicates();
