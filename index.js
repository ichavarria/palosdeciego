const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/pdf", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).send("Missing ?url parameter");

    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process"
      ]
    });

    const page = await browser.newPage();
    await page.goto(url, { 
      waitUntil: "networkidle0",
      timeout: 60000 
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm"
      }
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=gaceta.pdf");
    res.send(pdf);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF: " + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("PDF server running on port", port));
