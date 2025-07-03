import Scraper from "../src/scraper.js";

(async () => {
	const scraper = new Scraper(1);
	console.log(await scraper.getPageItemCount());
	console.log(await scraper.getPageItemCount());
})();
