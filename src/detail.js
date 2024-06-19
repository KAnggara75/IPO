import { parse } from 'node-html-parser';

export default class Detail {
	constructor(url) {
		this.response = this.init(url);
	}
	async init(url) {
		const rest = await fetch(url);
		return await rest.text();
	}

	async getDetail() {
		try {
			const document = parse(await this.response);
			const ticker = document.querySelector('p:nth-child(2)').firstChild.textContent;
			const underwriter = document.querySelector('div.panel-body.panel-scroll').getElementsByTagName('p');
			const uw = underwriter[underwriter.length - 1].firstChild.textContent;
			return [ticker, uw];
		} catch (error) {
			console.error(error);
			return [];
		}
	}
}
