import { parse } from "node-html-parser";

export default class Page {
	constructor(page) {
		this.response = this.init(page);
	}
	async init(page = 1) {
		const rest = await fetch("https://www.e-ipo.co.id/id/ipo/index?page=" + page + "&per-page=12&view=list");
		return await rest.text();
	}

	async getLastPage() {
		try {
			const document = parse(await this.response);
			const pageList = document
				.querySelector("#w0 > div.row.margin-top20 > div.col-md-7 > ul")
				.getElementsByTagName("li");
			return pageList[pageList.length - 2].firstChild.textContent;
		} catch (error) {
			console.error(error);
			return 1;
		}
	}
}
