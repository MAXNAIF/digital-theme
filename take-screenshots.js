const puppeteer = require('puppeteer');
const path = require('path');

const OUTPUT = 'H:/Downloads/Salla/themes/digital-theme/screenshots';
const URL = 'http://localhost:5500/preview.html';
const W = 1600, H = 1200;

async function shot(page, filename, scrollY = 0, dark = false) {
    if (dark) {
        await page.evaluate(() => {
            document.documentElement.setAttribute('data-theme', 'dark');
        });
    } else {
        await page.evaluate(() => {
            document.documentElement.setAttribute('data-theme', 'light');
        });
    }
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
        path: `${OUTPUT}/${filename}`,
        clip: { x: 0, y: 0, width: W, height: H }
    });
    console.log(`✅ Saved: ${filename}`);
}

(async () => {
    const fs = require('fs');
    if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT, { recursive: true });

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', `--window-size=${W},${H}`]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));

    // صورة 1: الوضع الفاتح - Hero + Features
    await shot(page, '01-light-hero.jpg', 0, false);

    // صورة 2: الوضع الفاتح - المنتجات
    await shot(page, '02-light-products.jpg', 520, false);

    // صورة 3: الوضع الداكن - Hero + Features
    await shot(page, '03-dark-hero.jpg', 0, true);

    // صورة 4: الوضع الداكن - المنتجات
    await shot(page, '04-dark-products.jpg', 520, true);

    // صورة 5: لماذا نختارنا (فاتح)
    await shot(page, '05-light-why.jpg', 1400, false);

    // صورة 6: CTA بانر (داكن)
    await shot(page, '06-dark-cta.jpg', 1800, true);

    await browser.close();
    console.log('\n🎉 كل الصور جاهزة في مجلد screenshots/');
})();
