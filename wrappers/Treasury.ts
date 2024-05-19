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

export type TreasuryConfig = {
    owner: Address;
    jettonWallet: Address;
    whitelist: Dictionary<bigint, bigint>
};

export const emptyDictionaryValue: DictionaryValue<bigint> = {
    serialize: (src: bigint, builder: Builder) => {
        builder.storeCoins(src);
    },
    parse: function (src: Slice): bigint {
        return src.loadCoins();
    },
}

export function treasuryConfigToCell(config: TreasuryConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeAddress(config.jettonWallet)
        .storeDict(config.whitelist)
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

    async sendTest(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            body: beginCell()
                .storeUint(0, 32)
                .storeStringTail('Ene rgeti!cSunshineBzzwordM./# 2idnightWhiphElephrkKeyboarropTadpoleMv sd wballStarfishLaughterBlueprintSunlightows')
                .endCell(),
        });
    }
}
