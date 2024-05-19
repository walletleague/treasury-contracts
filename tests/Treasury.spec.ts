import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import {Cell, Dictionary, toNano} from '@ton/core';
import {emptyDictionaryValue, Treasury} from '../wrappers/Treasury';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Treasury', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Treasury');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let treasury: SandboxContract<Treasury>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        treasury = blockchain.openContract(Treasury.createFromConfig({
            owner: deployer.address,
            jettonWallet: deployer.address,
            whitelist: Dictionary.empty(Dictionary.Keys.BigUint(256), emptyDictionaryValue)
        }, code));

        const deployResult = await treasury.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: treasury.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and treasury are ready to use
    });

    it('sendTest', async () => {
        const res = await treasury.sendTest(deployer.getSender(), toNano('0.05'));
    });
});
