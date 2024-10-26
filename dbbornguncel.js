// http://localhost:5000/players/:id apisinden gelen verileri alıp born alanını js dosaysındaki id ve born ile güncelle
const mongoose = require('mongoose');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

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
    born: String,
});

const Player = mongoose.model('Player', playerSchema);

// Veritabanındaki tüm oyuncuları al
const fetchPlayers = async () => {
    try {
        return await Player.find({});
    } catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
};

// Oyuncuların doğum tarihlerini playersborn.json dosyasından al ve güncelle

const updateBorn = async () => {

    // Veritabanındaki tüm oyuncuları al
    const players = await fetchPlayers();

    // JSON dosyasındaki verileri al
    const playersBorn = JSON.parse(fs.readFileSync('playersborn.json'));

    // Oyuncuları güncelle

    for (const player of players) {
        const born = playersBorn.find((item) => item.id === player.id);
        if (born) {
            player.born = born.born;
            await player.save();
        }
    }

    console.log("Players' born updated successfully!");
    mongoose.connection.close();
}


updateBorn();








