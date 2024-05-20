
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();

    const urlPrincipal = 'https://www.123leiloes.com.br';
    await page.goto(urlPrincipal);

    
    const linkUrl = await page.evaluate(() => {
        const nodes = document.evaluate(`/html/body/main/div/div[2]/div[1]/div/a`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        let result = [];
        for (let i = 0; i < nodes.snapshotLength; i++) {
            const node = nodes.snapshotItem(i);
            result.push({ urlDoc: node.getAttribute('href') });
        }
        return result;
    });
    if (linkUrl) {
        console.log('Dados extraídos:', linkUrl);

        // Salva os dados em um arquivo JSON
        fs.writeFile('urls.json', JSON.stringify({linkUrl}, null, 2), err => {
            if (err) throw new Error('Algum erro ocorreu ao escrever o arquivo JSON');
            console.log('Arquivo JSON salvo com sucesso');
        });
    } else {
        console.log('Elemento não encontrado');
    }

    await browser.close();
})();
