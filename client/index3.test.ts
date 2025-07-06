import {test , expect} from "bun:test";
import { LiteSVM } from "litesvm";
import {
	PublicKey,
	Transaction,
	SystemProgram,
	Keypair,
	LAMPORTS_PER_SOL,
    TransactionInstruction,
} from "@solana/web3.js";


test("testing invoke sign program" , async () => {

    const svm = new LiteSVM();
    const program_id = PublicKey.unique();
    svm.addProgramFromFile(program_id , "./invoke_sign_program.so");
    const user = new Keypair();
    svm.airdrop(user.publicKey , BigInt(LAMPORTS_PER_SOL * 5));
    const [pda , bump] = PublicKey.findProgramAddressSync([user.publicKey.toBuffer(),Buffer.from("div")] , program_id);
    let ix = new TransactionInstruction({
        keys: [
          {pubkey: user.publicKey, isSigner: true, isWritable: true},
          {pubkey: pda, isSigner: false, isWritable: true},
          {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
        ],
        programId: program_id,
        data:Buffer.from(""),
    });
    const tx = new Transaction();
    tx.recentBlockhash=svm.latestBlockhash();
    tx.add(ix);
    tx.sign(user);
    const sign = await svm.sendTransaction(tx);
    console.log("singnature is:  ",sign.toString());
    expect(svm.getBalance(pda)).toBe(BigInt(1000000000));

});