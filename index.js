import Page from "./src/page";
import Detail from "./src/detail";
import Scraper from "./src/scraper";

const path = "./IPO.csv";
const pathMD = "./IPO.md";

// CSV
await Bun.write(path, "");
const fileCsv = Bun.file(path);
const csvOut = fileCsv.writer();
csvOut.write("Ticker,Underwriter,Name,Price,Date,Status,Link\n");

// Markdown
await Bun.write(pathMD, "");
const fileMD = Bun.file(pathMD);
const mdOut = fileMD.writer();
mdOut.write("# IPO IDX\n\n");
mdOut.write("| Ticker | Underwriter | Name | Price | Date | Status |\n");
mdOut.write("| ------ | :---------: | ---: | ----- | ---- | ------ |\n");

const maxPage = await getLastPage();
await getData(maxPage);

async function getLastPage() {
	let pageNumber = 1;
	let maxFound = 1;
	let isLast = false;

	while (!isLast) {
		try {
			const page = new Page(pageNumber);
			const last = await page.getLastPage();
			if (last > pageNumber) {
				pageNumber = last;
				maxFound = last;
			} else {
				isLast = true;
			}
		} catch (e) {
			console.error("Failed to get last page:", e);
			break;
		}
	}
	console.info("Last is page " + maxFound);
	return maxFound;
}

async function getData(maxPage) {
	for (let pageNo = 1; pageNo <= maxPage; pageNo++) {
		const scraper = new Scraper(pageNo);
		const itemCount = await scraper.getPageItemCount();
		for (let itemNo = 1; itemNo <= itemCount; itemNo++) {
			try {
				const basicIPO = await scraper.getItemData(itemNo);
				if (basicIPO && basicIPO.length >= 4 && basicIPO[2]) {
					const detail = new Detail(basicIPO[2]);
					const detailData = await detail.getDetail();
					const date = basicIPO[3].slice(-11).trim();
					const [ticker, underwriter] = detailData.length >= 2 ? detailData : ["", ""];

					console.log(`${ticker} | ${date}`);

					csvOut.write(`"${ticker}","${underwriter}","${basicIPO[0]}",${basicIPO[1]},"${date}","","${basicIPO[2]}"\n`);

					mdOut.write(`| [${ticker}](${basicIPO[2]}) |${underwriter}|${basicIPO[0]}|${basicIPO[1]}|${date}| - |\n`);
				}
			} catch (e) {
				console.error(`Error processing page ${pageNo} item ${itemNo}:`, e);
			}
		}
	}
	await csvOut.end();
	await mdOut.end();
}
