import { type HTMLElement, parse } from "node-html-parser";

export default class Detail {
	private readonly url: string;
	private _html: string | null = null;

	constructor(url: string) {
		this.url = url;
	}

	async fetchHtml(): Promise<string | null> {
		if (!this.url || !/^https?:\/\//.test(this.url)) {
			console.error("Invalid or empty URL provided to Detail");
			return null;
		}
		try {
			const res: Response = await fetch(this.url);
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

	async getDetail(): Promise<[string, string]> {
		try {
			if (!this._html) {
				await this.fetchHtml();
			}
			if (!this._html) {
				console.error("No HTML to parse");
				return ["", ""];
			}
			const document: HTMLElement = parse(this._html);

			// Ticker parsing
			const tickerElem = document.querySelector("p:nth-child(2)") as HTMLElement | null;
			const ticker =
				tickerElem && tickerElem.firstChild && typeof (tickerElem.firstChild as any).text === "string"
					? (tickerElem.firstChild as any).text.trim()
					: "";

			const panel = document.querySelector("div.panel-body.panel-scroll") as HTMLElement | null;
			const underwriterList: HTMLElement[] = panel ? panel.getElementsByTagName("p") : [];
			let uw: string = "";
			if (underwriterList && underwriterList.length > 0) {
				const lastUW: HTMLElement = underwriterList[underwriterList.length - 1];
				uw =
					lastUW.firstChild && typeof (lastUW.firstChild as any).text === "string"
						? (lastUW.firstChild as any).text.trim()
						: "";
			}

			return [ticker, uw];
		} catch (error) {
			console.error("Error in getDetail:", error);
			return ["", ""];
		}
	}
}
