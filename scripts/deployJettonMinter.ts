import { toNano } from '@ton/core';
import { JettonMinter, jettonContentToCell } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton/blueprint';
import { promptAddress, promptBool, promptUrl } from '../utils/uiUtils';

// const jettonParams = {
//     owner: Address.parse("EQD4gS-Nj2Gjr2FYtg-s3fXUvjzKbzHGZ5_1Xe_V0-GCp0p2"),
//     name: "MyJetton",
//     symbol: "JET1",
//     image: "https://www.linkpicture.com/q/download_183.png", // Image url
//     description: "My jetton",
// };

const formatUrl = "https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain";
const exampleContent = {
    "name": "Sample Jetton",
    "description": "Sample of Jetton",
    "symbol": "JTN",
    "decimals": 0,
    "image": "https://www.svgrepo.com/download/483336/coin-vector.svg"
};
const urlPrompt = 'Please specify url pointing to jetton metadata(json):';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const sender = provider.sender();
    const adminPrompt = `Please specify admin address`;
    ui.write(`Jetton deployer\nCurrent deployer only supports off-chain format:${formatUrl}`);

    let admin = await promptAddress(adminPrompt, ui, sender.address);
    ui.write(`Admin address:${admin}\n`);
    let contentUrl = await promptUrl(urlPrompt, ui);
    ui.write(`Jetton content url:${contentUrl}`);

    let dataCorrect = false;
    do {
        ui.write("Please verify data:\n");
        ui.write(`Admin:${admin}\n\n`);
        ui.write('Metadata url:' + contentUrl);
        dataCorrect = await promptBool('Is everything ok?', ['y','n'], ui);
        if (!dataCorrect) {
            const upd = await ui.choose('What do you want to update?', ['Admin', 'Url'], (c) => c);

            if (upd == 'Admin') {
                admin = await promptAddress(adminPrompt, ui, sender.address);
            } else {
                contentUrl = await promptUrl(urlPrompt, ui);
            }
        }

    } while(!dataCorrect);

    const content = jettonContentToCell({type: 1, uri: contentUrl});

    const walletCode = await compile('JettonWallet');

    const minter = provider.open(
        JettonMinter.createFromConfig({
            admin,
            content,
            walletCode,
        }, await compile('JettonMinter'))
    );

    await minter.sendDeploy(sender, toNano('0.05'));

    await provider.waitForDeploy(minter.address);
}
