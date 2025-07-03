import Page from "./src/page";
import Detail from "./src/detail";
import Scraper from "./src/scraper";

let lastPage = 1;
let maxPage = 1;
let isLast = false;
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

getLastPage();
getData();

async function getLastPage() {
	while (!isLast) {
		const page = new Page(lastPage);
		maxPage = await page.getLastPage();
		if (maxPage > lastPage) {
			lastPage = maxPage;
		} else {
			isLast = true;
		}
	}
	console.info("Last is page " + lastPage);
}

async function getData() {
	for (let data = 1; data <= maxPage; data++) {
		const scrape = new Scraper(data);
		const countItem = await scrape.getPageItemCount();
		for (let data = 1; data <= countItem; data++) {
			const basicIPO = await scrape.getItemData(data);
			if (typeof basicIPO !== "undefined" || basicIPO) {
				const detail = new Detail(basicIPO[2]);
				const detailData = await detail.getDetail();
				const date = basicIPO[3].slice(-11);
				console.log(detailData[0] + " | " + date);
				if (typeof detailData !== "undefined" || detailData) {
					csvOut.write('"' + detailData[0] + '","');
					csvOut.write(detailData[1] + '","');
					csvOut.write(basicIPO[0] + '",');
					csvOut.write(basicIPO[1] + ',"');
					csvOut.write(date + '","","');
					csvOut.write(basicIPO[2] + '"\n');
					csvOut.flush();
					mdOut.write("| [" + detailData[0] + "](" + basicIPO[2] + ") |");
					mdOut.write(detailData[1] + "|");
					mdOut.write(basicIPO[0] + "|");
					mdOut.write(basicIPO[1] + "|");
					mdOut.write(date + "| - |\n");
					mdOut.flush();
				}
			}
		}
	}
}
