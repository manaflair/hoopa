export function consumeStream(stream) {

    return new Promise((resolve, reject) => {

        let buffers = [];

        stream.on(`data`, buffer => {
            buffers.push(buffer);
        });

        stream.on(`end`, () => {
            resolve(Buffer.concat(buffers));
        });

        stream.on(`error`, error => {
            reject(error);
        });

    });

}
