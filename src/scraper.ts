import { HTMLElement, parse } from "node-html-parser";

export default class Scraper {
	private readonly page: number;
	private _html: string | null = null;

	constructor(page: number = 1) {
		this.page = page;
	}

	async fetchPageHtml(page: number = this.page): Promise<string | null> {
		try {
			const res = await fetch(`https://www.e-ipo.co.id/id/ipo/index?page=${page}&per-page=12&view=list`);
			if (!res.ok) {
				console.error(`Failed to fetch IPO page: HTTP ${res.status}`);
				return null;
			}
			const text = await res.text();
			if (page === this.page) this._html = text;
			return text;
		} catch (error) {
			console.error("Failed to fetch IPO page:", error);
			return null;
		}
	}

	async getDocument(): Promise<HTMLElement> {
		if (!this._html) {
			this._html = await this.fetchPageHtml(this.page);
		}
		if (!this._html) throw new Error("No HTML to parse");
		return parse(this._html);
	}

	async getPageItemCount(): Promise<number> {
		try {
			const document = await this.getDocument();
			return document.querySelectorAll("[data-key]").length;
		} catch (error) {
			console.error("Failed to count items on page:", error);
			return 0;
		}
	}

	/**
	 * Retrieves IPO data at the specified position on the current page.
	 * @param number - The 1-based index of the IPO item on this page.
	 * @returns Promise<[name: string, price: string, link: string, date: string]>
	 */
	async getItemData(number: number): Promise<[string, string, string, string]> {
		try {
			const selector = `#w0 > div:nth-child(1) > div:nth-child(${number}) > div > div > div`;
			const document = await this.getDocument();
			const h3 = document.querySelector(`${selector} > h3`);
			if (!h3 || !h3.firstChild) {
				console.error(`No item found at position ${number}`);
				return ["", "", "", ""];
			}
			const name: string = (h3.firstChild as any).text || "";

			const dateElem = document.querySelector(`${selector} > div > div:nth-child(3) > p`);
			const date: string = dateElem ? dateElem.text.trim?.() || dateElem.textContent || "" : "";

			let price: string = "0";
			if (!name.includes("-C1)")) {
				const priceElem = document.querySelector(`${selector} > div > div:nth-child(4) > p`);
				if (priceElem) {
					price = priceElem.text.replace(/\D/gm, "").trim();
				}
			}

			const linkElem = document.querySelector(`${selector} > div > div:nth-child(7) > a`);
			const link: string = linkElem ? "https://www.e-ipo.co.id" + (linkElem.getAttribute("href") || "") : "";

			return [name, price, link, date];
		} catch (error) {
			console.error("Failed to get item data:", error);
			return ["", "", "", ""];
		}
	}
}
