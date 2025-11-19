const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/pdf", async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).send("Missing ?url=https://example.com");
        }

        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=export.pdf");
        res.send(pdfBuffer);

    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send("Error generating PDF");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("PDF server running on port " + port));
