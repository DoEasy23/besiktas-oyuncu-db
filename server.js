const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const fetchPlayersData = async (page) => {
  try {
    //max page sayfası 30 olcak
    if (page > 25) {
        return [];
        }
    const url = `https://www.transfermarkt.com.tr/besiktas-istanbul/rekordspieler/verein/114/page/${page}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const players = [];

    // Tablo satırlarını bul ve bilgileri al
    $('#yw1 .items > tbody > tr').each((index, element) => {
      const id = $(element).find('td:nth-child(1)').text().trim().replace(/\D/g, '');
      const born = $(element).find('td:nth-child(4)').text().trim();
      

      players.push({
        id,
        born,
      });
    });

    return players;

  } catch (error) {
    console.error(`Error fetching data from page ${page}:`, error);
    return [];
  }
};

const fetchAllPlayers = async () => {
  let allPlayers = [];
  let page = 1;
  let players;

  do {
    console.log(`Fetching data from page ${page}...`);
    players = await fetchPlayersData(page);
    allPlayers = allPlayers.concat(players);
    page++;
  } while (players.length > 0); // Son sayfaya ulaştığında duracak

  //gelen verileri console a yazdır
  console.log(allPlayers);

  // Verileri JSON dosyasına yaz

  fs.writeFile('playersborn.json', JSON.stringify(allPlayers, null, 2), (error) => {
    if (error) {
      console.error("Error writing to players.json:", error);
    } else {
      console.log("Data written to players.json successfully!");
    }
  });


};

// Tüm sayfalardan veriyi çek
fetchAllPlayers();
