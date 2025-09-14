#!/usr/bin/env bun

import IpoPage from "./ipo-page";
import Detail from "./ipo-detail";
import Scraper from "./scraper";
import type { BunFile, FileSink } from "bun";

const path: string = "./IPO.csv";
const pathMD: string = "./IPO.md";

// CSV
await Bun.write(path, "");
const fileCsv: BunFile = Bun.file(path);
const csvOut: FileSink = fileCsv.writer();
csvOut.write("Ticker,Underwriter,Name,Price,Date,Status,Link\n");

// Markdown
await Bun.write(pathMD, "");
const fileMD: BunFile = Bun.file(pathMD);
const mdOut: FileSink = fileMD.writer();
mdOut.write("# IPO IDX\n\n");
mdOut.write("| Ticker | Underwriter | Name | Price | Date | Status |\n");
mdOut.write("| ------ | :---------: | ---: | ----- | ---- | ------ |\n");

const maxPage: number = await getLastPage();
await getData(maxPage);

async function getLastPage(): Promise<number> {
	let pageNumber: number = 1;
	let maxFound: number = 1;
	let isLast: boolean = false;

	while (!isLast) {
		try {
			const page = new IpoPage(pageNumber);
			const last: number = await page.getLastPage();
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

async function getData(maxPage: number): Promise<void> {
	for (let pageNo: number = 1; pageNo <= maxPage; pageNo++) {
		const scraper = new Scraper(pageNo);
		const itemCount: number = await scraper.getPageItemCount();
		for (let itemNo: number = 1; itemNo <= itemCount; itemNo++) {
			try {
				const basicIPO: [string, string, string, string] = await scraper.getItemData(itemNo);
				if (basicIPO && basicIPO.length >= 4 && basicIPO[2]) {
					const detail = new Detail(basicIPO[2]);
					const detailData: string[] = await detail.getDetail();
					console.info(detailData);
					const date: string = basicIPO[3].slice(-11).trim();
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
