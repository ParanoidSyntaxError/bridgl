import BridglIdl from "../target/idl/bridgl.json";
import { Bridgl } from "../target/types/bridgl";
import { Keypair, Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { Wallet, AnchorProvider, Idl, Program, BN } from "@coral-xyz/anchor";

const wallet = new Wallet(Keypair.fromSecretKey(
    Buffer.from(JSON.parse(require('fs').readFileSync(
        "./keys/authority.json", 'utf-8'
    )))
));

const solanaRpc = new Connection('https://api.devnet.solana.com', 'confirmed');
const provider = new AnchorProvider(solanaRpc, wallet, {
    commitment: 'confirmed',
});

const bridgl = new Program<Bridgl>(BridglIdl as Idl, provider);

async function main() {
    try {
        // Solana Devnet
        const ccipRouter = new PublicKey("Ccip842gzYHhvdDkSyi2YVCoAWPbYJoApMFzSxQroE9C");

        const controller = PublicKey.findProgramAddressSync(
            [Buffer.from("controller")],
            bridgl.programId
        )[0];

        console.log('controller: ', controller.toBase58());

        const accountInfo = await solanaRpc.getAccountInfo(controller);
        console.log('accountInfo: ', accountInfo);

        const tx = await bridgl.methods.initializeController(
            ccipRouter,
        ).accounts({
            payer: wallet.publicKey,
        }).rpc();

        console.log('✅ ', tx);
    } catch (error) {
        console.error('❌ ', error);
    }
}

main();