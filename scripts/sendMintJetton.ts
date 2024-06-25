import { Address, toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton/blueprint';

const randomSeed = Math.floor(Math.random() * 10000);

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Jetton Minter address'));

    const minter = provider.open(JettonMinter.createFromAddress(address));

    const mintAmount = await ui.input('Amount to mint');

    await minter.sendMint(provider.sender(), provider.sender().address!, toNano(mintAmount), toNano('0.001'), toNano('0.1'));
}