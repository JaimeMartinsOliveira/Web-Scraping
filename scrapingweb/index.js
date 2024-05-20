const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();

    const url = 'https://www.123leiloes.com.br/lotes/903-1-apto-47-63m-a-priv-jd-vermelhao-guarulhos-sp-direitos';
    await page.goto(url);

    // Captura o texto do título usando XPath diretamente no evaluate
    const titulo = await page.evaluate(() => {
        const tituloElement = document.evaluate('/html/body/section/div[2]/div/div/div/div[2]/div[1]/div/h2', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return tituloElement ? tituloElement.innerText : null;
    });
    const valorAvaliacao = await page.evaluate(() => {
        const vaElement = document.evaluate('//dt[contains(text(), "Avaliação:")]/following-sibling::dd', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return vaElement ? vaElement.innerText : null;
    });
    const dataPraca = await page.evaluate(() => { 
        const dtElement = document.evaluate('/html/body/main/div/div/div[2]/div[2]/div[3]/div/table/tbody/tr[1]/td[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return dtElement ? dtElement.innerText : null;
    });
    const valorPraca = await page.evaluate(() => {
        const vpElement = document.evaluate('/html/body/main/div/div/div[2]/div[2]/div[3]/div/table/tbody/tr[2]/td[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return vpElement ? vpElement.innerText : null;
    });
    const endereco = await page.evaluate(() => {
        const endElement = document.evaluate('//strong[contains(text(), "Endereço onde está situado o imóvel")]/parent::p', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return endElement ? endElement.innerText.replace(/Endereço onde está situado o imóvel/, '').trim() : null;
    });
    const status = await page.evaluate(() => {
        const sttElement = document.evaluate('/html/body/main/div/div/div[1]/div[2]/div/div[2]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return sttElement ? sttElement.innerText : null;
    });

    const linkDocumento = await page.evaluate(() => {
        const nodes = document.evaluate('//*[@id="accordion-documentos"]/div[2]/nav//a[contains(@href, "arquivos/leiloes/lotes/anexos/")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        let result = [];
        for (let i = 0; i < nodes.snapshotLength; i++) {
            const node = nodes.snapshotItem(i);
            result.push({ urlDoc: node.getAttribute('href') });
        }
        return result;
    });

    const imgUrls = await page.evaluate(() => {
        const imgElements = document.querySelectorAll('#leilao-carousel img');
        let imgUrls = [];
        imgElements.forEach(img => {
            imgUrls.push({ src: img.getAttribute('src') });
        });
        return imgUrls;
    });

    if (titulo) {
        console.log('Dados extraídos:', titulo, valorAvaliacao, dataPraca, valorPraca, endereco, status, linkDocumento, imgUrls);

        // Salva os dados em um arquivo JSON
        fs.writeFile('dados.json', JSON.stringify({ titulo, valorAvaliacao, dataPraca, valorPraca, endereco, status, linkDocumento, imgUrls }, null, 2), err => {
            if (err) throw new Error('Algum erro ocorreu ao escrever o arquivo JSON');
            console.log('Arquivo JSON salvo com sucesso');
        });
    } else {
        console.log('Elemento não encontrado');
    }

    await browser.close();
})();
