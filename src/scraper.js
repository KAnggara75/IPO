import { parse } from 'node-html-parser';

export default class Scraper {
	constructor(page = 1) {
		this.page = page;
		this._html = null;
	}

	async init(page = 1) {
		const rest = await fetch('https://www.e-ipo.co.id/id/ipo/index?page=' + page + '&per-page=12&view=list');
		return await rest.text();
	}

	async getText(number) {
		try {
			const element = '#w0 > div:nth-child(1) > div:nth-child(' + number + ') > div > div > div';
			const document = parse(await this.response);
			const name = document.querySelector(element + ' > h3').firstChild.textContent;
			const date = document.querySelector(element + '> div > div:nth-child(3) > p').textContent;
			const price = name.includes('-C1)')
				? '0'
				: document
						.querySelector(element + '> div > div:nth-child(4) > p')
						.textContent.replace(/\D/gm, '')
						.trim();
			const link =
				'https://www.e-ipo.co.id' +
				document.querySelector(element + ' > div > div:nth-child(7) > a').getAttribute('href');
			return [name, price, link, date];
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	async countPageItem() {
		const document = parse(await this.response);
		const item = document.querySelectorAll('[data-key]').length;
		return item;
	}
}
