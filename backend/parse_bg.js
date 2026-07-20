const https = require('https');

https.get('https://www.banggood.com/search/drill.html', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    
    // Attempt to match list items
    // Product items usually have class like "p-wrap" or similar
    // Let's just find titles and prices via a generic regex
    const titleRegex = /<a[^>]*class="title"[^>]*href="([^"]+)"[^>]*title="([^"]+)"/g;
    const priceRegex = /data-ori-price="([^"]+)"/g;
    const imgRegex = /data-src="([^"]+)"/g;
    
    console.log("TITLES:");
    let tMatch;
    let i = 0;
    while((tMatch = titleRegex.exec(data)) !== null && i < 3) {
      console.log('URL:', tMatch[1]);
      console.log('Title:', tMatch[2]);
      i++;
    }
    
    console.log("\nPRICES:");
    let pMatch;
    i = 0;
    while((pMatch = priceRegex.exec(data)) !== null && i < 3) {
      console.log('Price:', pMatch[1]);
      i++;
    }
    
    console.log("\nIMAGES:");
    let iMatch;
    i = 0;
    while((iMatch = imgRegex.exec(data)) !== null && i < 3) {
      console.log('Image:', iMatch[1]);
      i++;
    }
    
  });
}).on('error', (e) => {
  console.error(e);
});
