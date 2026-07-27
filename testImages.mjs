import * as cheerio from 'cheerio';

async function testFetch() {
  const detRes = await fetch(`https://villalbamartinez.com.ar/detalle.php?id=p895-i625`);
  const detBuffer = await detRes.arrayBuffer();
  const detHtml = new TextDecoder("utf-8").decode(detBuffer);
  const $ = cheerio.load(detHtml);

  const allImgs = [];
  $("img").each((_, el) => {
    allImgs.push({
      src: $(el).attr("src"),
      className: $(el).attr("class")
    });
  });

  console.log(allImgs);
}

testFetch();
