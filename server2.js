const puppeteer = require('puppeteer');

const fetchPlayersData = async () => {
  try {
    const url = 'https://www.transfermarkt.com.tr/besiktas-istanbul/rekordspieler/verein/114';

    // Puppeteer ile tarayıcı başlat
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Sayfa yüklendikten sonra veri çek
    const players = await page.evaluate(() => {
      const rows = document.querySelectorAll('#yw1 .items > tbody > tr');
      const data = [];

      rows.forEach(row => {
        const id = row.querySelector('td:nth-child(1)').textContent.trim().replace(/\D/g, '');
        const playerName = row.querySelector('td:nth-child(2) a').textContent.trim();
        const nationality = row.querySelector('td:nth-child(3) img.flaggenrahmen')?.title || '';
        const matchesPlayed = row.querySelector('td:nth-child(5)').textContent.trim();
        const goals = row.querySelector('td:nth-child(6)').textContent.trim();
        const assists = row.querySelector('td:nth-child(7)').textContent.trim();
        const yellowCards = row.querySelector('td:nth-child(8)').textContent.trim();
        const redCards = row.querySelector('td:nth-child(9)').textContent.trim();

        data.push({
          id,
          name: playerName,
          nationality,
          matchesPlayed,
          goals,
          assists,
          yellowCards,
          redCards,
        });
      });

      return data;
    });

    console.log(players); // Çekilen verileri kontrol et
    await browser.close();
    return players;

  } catch (error) {
    console.error('Error fetching player data:', error);
  }
};

// Veriyi çek
fetchPlayersData();
