import {
    Address,
    beginCell, Builder,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Dictionary, DictionaryValue,
    Sender,
    SendMode, Slice
} from '@ton/core';
import {JettonWallet} from "@ton/ton";

export type TreasuryConfig = {
    enabled: boolean;
    owner: Address;
    jetton: JettonWalletType;
    whitelist: Dictionary<bigint, boolean>;
};

export type JettonWalletType = {
    jettonWalletCode: Cell;
    jettonMasterAddress: Address;
    jettonBalance: bigint;
}

export const emptyDictionaryValue: DictionaryValue<boolean> = {
    serialize: (src: boolean, builder: Builder) => {
        builder.storeBit(src);
    },
    parse: function (src: Slice): boolean {
        return src.loadBit();
    },
}

export function treasuryConfigToCell(config: TreasuryConfig): Cell {
    return beginCell()
        .storeBit(config.enabled)
        .storeAddress(config.owner)
        .storeRef(
            beginCell()
                .storeAddress(config.jetton.jettonMasterAddress)
                .storeRef(config.jetton.jettonWalletCode)
                .endCell()
        )
        .storeDict(config.whitelist)
        .storeCoins(config.jetton.jettonBalance)
        .endCell();
}

export class Treasury implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Treasury(address);
    }

    static createFromConfig(config: TreasuryConfig, code: Cell, workchain = 0) {
        const data = treasuryConfigToCell(config);
        const init = { code, data };
        return new Treasury(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendSecretPhrase(provider: ContractProvider, via: Sender, value: bigint, phrase: string) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0, 32)
                .storeStringTail(phrase)
                .endCell(),
        });
    }
}
