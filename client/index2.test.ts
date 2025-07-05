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

test("Testing CPI contract" , () => {
    const svm = new LiteSVM();
    //loading the programs with so files
    const cpiProgramAddress = PublicKey.unique();
    const doubleProgramAddress = PublicKey.unique();
    svm.addProgramFromFile(cpiProgramAddress,"./cpi_contract.so");
    svm.addProgramFromFile(doubleProgramAddress , "./double.so");

    //user
    const user = new Keypair();
    svm.airdrop(user.publicKey , BigInt(LAMPORTS_PER_SOL));
    //data account creation
    const data_account = new Keypair();
    createDataAccount(user,data_account ,svm,doubleProgramAddress);

    function sendTxn() {
        const ix = new TransactionInstruction({
            keys: [
              {pubkey: data_account.publicKey, isSigner: false, isWritable: true},
              {pubkey: doubleProgramAddress, isSigner: false, isWritable: false},
            ],
            programId: cpiProgramAddress,
            data:Buffer.from(""),
        });
        
        const tx = new Transaction();
        tx.recentBlockhash=svm.latestBlockhash();
        tx.add(ix);
        tx.sign(user);
        const sign = svm.sendTransaction(tx);
        svm.expireBlockhash();
    }

    sendTxn();
    sendTxn();
    sendTxn();
    sendTxn();
    // console.log("data account: ",svm.getAccount(data_account.publicKey)?.data[0]);
    expect(svm.getAccount(data_account.publicKey)?.data[0]).toBe(8);
})


function createDataAccount(payer:Keypair , data_account:Keypair,svm:LiteSVM ,program_id:PublicKey) {
    console.log("creating data account....");
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
	tx.recentBlockhash = svm.latestBlockhash();
	tx.add(...ixs);
	tx.sign(payer , data_account);
	svm.sendTransaction(tx);
    svm.expireBlockhash();
}