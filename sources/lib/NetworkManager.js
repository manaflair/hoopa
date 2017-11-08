import { TaskQueue }         from 'cwait';
import fetch                 from 'node-fetch';
import { parse as parseUrl } from 'url';

import { sleep }             from './fn/sleep';

export class NetworkHostManager {

    constructor({ userAgent = `Hoopa`, maxConcurrentRequests = 6, minRequestInterval = 0 } = {}) {

        this.userAgent = userAgent;
        this.maxConcurrentRequests = maxConcurrentRequests;
        this.minRequestInterval = minRequestInterval;

        this.taskQueue = new TaskQueue(Promise, this.maxConcurrentRequests);

    }

    get(url, { type = `text`, full = false } = {}) {

        return new Promise((resolve, reject) => {

            this.taskQueue.add(() => {

                return fetch(url, { headers: { [`User-Agent`]: this.userAgent } }).then(response => {

		    return response[type]().then(body => {
			resolve(full ? { status: response.status, body } : body);
		    });

		}).catch(error => {

                    reject(error);

		}).then(() => {

		    return sleep(this.minRequestInterval);

                });

            });

        });

    }

}

export class NetworkManager {

    constructor(config = {}) {

        this.config = config;

        this.rules = Object.create(null);

    }

    get(url, options) {

        let host = parseUrl(url).host;

        if (!Reflect.has(this.rules, host)) {
            let hostConfig = Object.assign({}, this.config.all, this.config[host]);
            this.rules[host] = new NetworkHostManager(hostConfig);
        }

        return this.rules[host].get(url, options);

    }

}
