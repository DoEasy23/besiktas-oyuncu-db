const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

async function importData() {
  try {
    // JSON dosyasını oku
    const data = await fs.readFile(path.join(__dirname, 'all_players.json'), 'utf-8');
    const players = JSON.parse(data);
    

    // Veriyi MongoDB'ye ekle
    await Player.insertMany(players);
    console.log('Veriler başarıyla eklendi!');
  } catch (error) {
    console.error('Veriler eklenirken hata oluştu:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Veriyi aktar
importData();
