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
        // Base Sepolia
        const chainSelector = new BN("10344971235874465080");
        const bridglAddress = Buffer.from("44a20905AaC9FdCeCCD3eb8343287eB28905F3aa", "hex");
        // LINK on Base Sepolia
        const underlyingToken = Buffer.from("E4aB69C077896252FAFBD49EFD26B5D171A32410", "hex");

        const wrapper = PublicKey.findProgramAddressSync([
            Buffer.from("wrapper"),
            chainSelector.toBuffer("le"),
            bridglAddress,
            underlyingToken,
        ], bridgl.programId)[0];

        console.log('wrapper: ', wrapper.toBase58());

        const tx = await bridgl.methods.initializeWrapper(
            chainSelector,
            bridglAddress,
            underlyingToken,
        ).accounts({
            payer: wallet.publicKey,
        }).rpc();

        console.log('✅ ', tx);
    } catch (error) {
        console.error('❌ ', error);
    }
}

main();