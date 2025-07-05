import {test , expect} from "bun:test";
import { LiteSVM } from "litesvm";
import {
	PublicKey,
	Transaction,
	SystemProgram,
	Keypair,
	LAMPORTS_PER_SOL,
    TransactionInstruction
} from "@solana/web3.js";



//we'dy've payer
//now we have to create data accont for the counter program
test("one transfer", () => {
	const svm = new LiteSVM();
	const payer = new Keypair();
	svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL));
	const program_id = PublicKey.unique();
    svm.addProgramFromFile(program_id , "./double.so");
    const data_account = new Keypair();

	const blockhash = svm.latestBlockhash();
	const transferLamports = 1_000_000n;
    
	const ixs = [
		SystemProgram.createAccount({
            fromPubkey:payer.publicKey,
            newAccountPubkey:data_account.publicKey,
            lamports:Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space: 4,
            programId:program_id
        })
	];

	const tx = new Transaction();
	tx.recentBlockhash = blockhash;
	tx.add(...ixs);
	tx.sign(payer , data_account);
	svm.sendTransaction(tx);
    console.log("Account info: ", svm.getAccount(data_account.publicKey));

    function sendTxnToContract() {
        const ix2 = [new TransactionInstruction({
            keys: [
              {pubkey: data_account.publicKey, isSigner: false, isWritable: true},
            ],
            programId: program_id,
            data:Buffer.from(""),
        })];
        const tx2 = new Transaction();
        const blockhash = svm.latestBlockhash();
        tx2.recentBlockhash = blockhash;
        tx2.feePayer = payer.publicKey;
        tx2.add(...ix2);
        tx2.sign(payer);
        svm.sendTransaction(tx2);
    }
    sendTxnToContract();
    sendTxnToContract();
    sendTxnToContract();
    sendTxnToContract();

    console.log("data account: ",svm.getAccount(data_account.publicKey)?.data[0]);
    
});