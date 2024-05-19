export const bufferToBigUint256 = (buffer: Buffer): bigint => {
    let result = 0n;
    for (let i = 0; i < 32; i++) {
        const byte = BigInt(buffer[i] ?? 0);
        // Left shift by 8 bits for each byte position (assuming big-endian)
        result = (result << 8n) + byte;
    }
    return result;
}
