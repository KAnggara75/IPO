import { parse } from "node-html-parser";

export default class Detail {
	constructor(url) {
		this.url = url;
		this._html = null;
	}

	async fetchHtml() {
		if (!this.url || typeof this.url !== "string" || !/^https?:\/\//.test(this.url)) {
			console.error("Invalid or empty URL provided to Detail");
			return null;
		}
		try {
			const res = await fetch(this.url);
			if (!res.ok) {
				console.error(`HTTP error: ${res.status}`);
				return null;
			}
			this._html = await res.text();
			return this._html;
		} catch (e) {
			console.error("Failed to fetch:", e);
			return null;
		}
	}

	async getDetail() {
		try {
			if (!this._html) {
				await this.fetchHtml();
			}
			if (!this._html) {
				console.error("No HTML to parse");
				return [];
			}
			const document = parse(this._html);

			const tickerElem = document.querySelector("p:nth-child(2)");
			const ticker = tickerElem && tickerElem.firstChild ? tickerElem.firstChild.textContent.trim() : "";

			const underwriterList = document.querySelector("div.panel-body.panel-scroll")?.getElementsByTagName("p");
			let uw = "";
			if (underwriterList && underwriterList.length > 0) {
				const lastUW = underwriterList[underwriterList.length - 1];
				uw = lastUW?.firstChild?.textContent?.trim() || "";
			}

			return [ticker, uw];
		} catch (error) {
			console.error("Error in getDetail:", error);
			return [];
		}
	}
}
