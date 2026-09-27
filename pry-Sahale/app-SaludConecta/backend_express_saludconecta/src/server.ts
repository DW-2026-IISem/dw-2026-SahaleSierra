import { App } from './config/index';

async function main() {
    const app = new App();
    await app.listen();
}

main();
