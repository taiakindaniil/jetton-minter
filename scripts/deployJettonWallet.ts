import { toNano } from '@ton/core';
import { JettonWallet, jettonWalletConfigToCell } from '../wrappers/JettonWallet';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const jettonWallet = provider.open(
        JettonWallet.createFromConfig({}, await compile('JettonMinter'))
    );

    await jettonWallet.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(jettonWallet.address);

    // run methods on `openedContract`
}