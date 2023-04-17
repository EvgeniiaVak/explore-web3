import { Token } from "@uniswap/sdk-core";

export function tokenMap(tokenList: {
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  name: string;
}[]) {
  const tokens = new Map<number, Map<string, Token>>();

  for (const token of tokenList) {
    if (!tokens.has(token.chainId)) {
      tokens.set(token.chainId, new Map<string, Token>());
    }
    const chain_tokens = tokens.get(token.chainId);
    if (chain_tokens) {
      chain_tokens.set(
        token.symbol,
        new Token(token.chainId, token.address, token.decimals, token.symbol, token.name)
      );
    }
  }
  return tokens;
}