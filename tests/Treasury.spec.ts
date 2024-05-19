import {Blockchain, printTransactionFees, SandboxContract, TreasuryContract} from '@ton/sandbox';
import {beginCell, Cell, Dictionary, toNano} from '@ton/core';
import {emptyDictionaryValue, Treasury} from '../wrappers/Treasury';
import '@ton/test-utils';
import {compile} from '@ton/blueprint';
import {sha256_sync} from "@ton/crypto";
import {bufferToBigUint256} from "../scripts/helper";
import {flattenTransaction, randomAddress} from "@ton/test-utils";

describe('Treasury', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Treasury');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let treasury: SandboxContract<Treasury>;

    const validSecretPhrases = [
        'a',
        'b',
        'c',
        'd',
    ];

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        const whitelist = Dictionary.empty(Dictionary.Keys.BigUint(256), emptyDictionaryValue);
        validSecretPhrases.forEach((e) => {
            const v = bufferToBigUint256(sha256_sync(e));
            whitelist.set(v, true);
        });

        treasury = blockchain.openContract(Treasury.createFromConfig({
            owner: deployer.address,
            jetton: {
                jettonBalance: 1000n,
                jettonMasterAddress: randomAddress(),
                jettonWalletCode: beginCell().endCell(),
            },
            whitelist: whitelist,
            enabled: true
        }, code));

        // Need initial amount of 0.5 TON to cover fees
        const deployResult = await treasury.sendDeploy(deployer.getSender(), toNano('0.5'));

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
        const res = await treasury.sendSecretPhrase(deployer.getSender(),
            toNano('0.05'),
            validSecretPhrases.at(0)!,
        );

        printTransactionFees(res.transactions);
    });
});
