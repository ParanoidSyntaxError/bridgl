import { testnets } from "./networks";

export interface CcipMessage {
    blockTimestamp: string;
    sourceNetworkName: string;
    destNetworkName: string;
    transactionHash: string;
    destTransactionHash: string;
    messageId: string;
    origin: string;
    receiver: string;
    sender: string;
}

export async function getRecentBridglMessages(sender: string): Promise<CcipMessage[] | undefined> {
    try {
        const response = await fetch(`https://ccip.chain.link/api/h/atlas/transactions?first=100&offset=0&sender=${sender}`, {
            method: "GET",
        });
        if (!response.ok) {
            return undefined;
        }

        const messages: CcipMessage[] = await response.json();
        return messages.filter((m) =>
            testnets.values().toArray().findIndex((n) => n.bridglAddress === m.sender) > -1 &&
            testnets.values().toArray().findIndex((n) => n.bridglAddress === m.receiver) > -1
        );
    } catch (error) {
        console.error(error);
        return undefined;
    }
}