import { parse } from "node-html-parser";
import HTMLElement from "node-html-parser/dist/nodes/html";
import Node from "node-html-parser/dist/nodes/node";

export default class IpoPage {
	private readonly page: number;
	private response?: string;

	constructor(page: number = 1) {
		this.page = page;
	}

	/**
	 * Fetch the HTML for the IPO page and store it.
	 */
	async init(): Promise<void> {
		const res: Response = await fetch(`https://www.e-ipo.co.id/id/ipo/index?page=${this.page}&per-page=12&view=list`);
		this.response = await res.text();
	}

	/**
	 * Parse the response and get the last page number.
	 */
	async getLastPage(): Promise<number> {
		try {
			if (!this.response) {
				await this.init();
			}
			const document: HTMLElement = parse(this.response!);
			const pageList: HTMLElement[] | undefined = document
				.querySelector("#w0 > div.row.margin-top20 > div.col-md-7 > ul")
				?.getElementsByTagName("li");
			if (pageList && pageList.length >= 2) {
				const target: Node | undefined = pageList[pageList.length - 2].firstChild;
				return target ? parseInt(target.textContent.trim(), 10) : 1;
			}
			return 1;
		} catch (error) {
			console.error(error);
			return 1;
		}
	}
}
