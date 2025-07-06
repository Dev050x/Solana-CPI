use solana_program::{account_info::{next_account_info, AccountInfo}, entrypoint , entrypoint::{ProgramResult}, program::invoke_signed, pubkey::Pubkey, system_instruction::create_account };



entrypoint!(process_instrcution);

pub fn process_instrcution(
    program_id: &Pubkey,
    accounts:&[AccountInfo],
    instructions:&[u8]
) -> ProgramResult{

    let mut iterator = accounts.iter();
    let user = next_account_info(&mut iterator)?;
    let pda = next_account_info(&mut iterator)?;
    let system_program = next_account_info(&mut iterator)?;
    let instruction =  create_account(
        user.key,
         pda.key,
        1000000000,
         8,
         program_id
    );

    let seed = &[user.key.as_ref(),b"div"];
    let (pdaKey , bump) = Pubkey::find_program_address(seed, program_id);
    let signer_seeds: &[&[u8]] = &[
        user.key.as_ref(),
        b"div",
        &[bump],
    ];


    invoke_signed(&instruction, accounts, &[signer_seeds]);
    Ok(())
}