import { first, isNil, memoize } from 'lodash';
import Nedb                      from 'nedb';

export class StorageManager {

    constructor(source) {

        this.getDatabase = memoize(() => {

            return new Promise((resolve, reject) => {

                let filename = !isNil(source) && source !== `:memory:` ? source : null;
                let nedb = new Nedb({ filename });

                nedb.loadDatabase(error => {
                    if (error) reject(error);
                    else resolve(nedb);
                });

            });

        });

    }

    find(document) {

        return this.getDatabase().then(nedb => {

            return new Promise((resolve, reject) => {

                nedb.find(document, (error, documents) => {
                    if (error) reject(error);
                    else resolve(first(documents));
                });

            });

        });

    }

    save(document) {

        return this.getDatabase().then(nedb => {

            return new Promise((resolve, reject) => {

                nedb.insert(document, error => {
                    if (error) reject(error);
                    else resolve();
                });

            });

        });

    }

}
