// import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
// import { Cell, toNano } from '@ton/core';
// import { Jetton } from '../wrappers/Jetton';
// import '@ton/test-utils';
// import { compile } from '@ton/blueprint';

// describe('Jetton', () => {
//     let code: Cell;

//     beforeAll(async () => {
//         code = await compile('Jetton');
//     });

//     let blockchain: Blockchain;
//     let deployer: SandboxContract<TreasuryContract>;
//     let jetton: SandboxContract<Jetton>;

//     beforeEach(async () => {
//         blockchain = await Blockchain.create();

//         jetton = blockchain.openContract(
//             Jetton.createFromConfig(
//                 {
//                     id: 0,
//                     counter: 0,
//                 },
//                 code
//             )
//         );

//         deployer = await blockchain.treasury('deployer');

//         const deployResult = await jetton.sendDeploy(deployer.getSender(), toNano('0.05'));

//         expect(deployResult.transactions).toHaveTransaction({
//             from: deployer.address,
//             to: jetton.address,
//             deploy: true,
//             success: true,
//         });
//     });

//     it('should deploy', async () => {
//         // the check is done inside beforeEach
//         // blockchain and jetton are ready to use
//     });

//     it('should increase counter', async () => {
//         const increaseTimes = 3;
//         for (let i = 0; i < increaseTimes; i++) {
//             console.log(`increase ${i + 1}/${increaseTimes}`);

//             const increaser = await blockchain.treasury('increaser' + i);

//             const counterBefore = await jetton.getCounter();

//             console.log('counter before increasing', counterBefore);

//             const increaseBy = Math.floor(Math.random() * 100);

//             console.log('increasing by', increaseBy);

//             const increaseResult = await jetton.sendIncrease(increaser.getSender(), {
//                 increaseBy,
//                 value: toNano('0.05'),
//             });

//             expect(increaseResult.transactions).toHaveTransaction({
//                 from: increaser.address,
//                 to: jetton.address,
//                 success: true,
//             });

//             const counterAfter = await jetton.getCounter();

//             console.log('counter after increasing', counterAfter);

//             expect(counterAfter).toBe(counterBefore + increaseBy);
//         }
//     });
// });
