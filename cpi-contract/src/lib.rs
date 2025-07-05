use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo}, entrypoint , entrypoint::{ ProgramResult}, instruction::{AccountMeta, Instruction}, msg, program::invoke, pubkey::Pubkey
};


entrypoint!(cpi_program);

pub fn cpi_program(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    
    let mut account_iter = accounts.iter();
    let data_account = next_account_info(&mut account_iter)?;
    let double_account = next_account_info(&mut account_iter)?;

    let instruction = Instruction{
        program_id: *double_account.key,
        accounts: vec![AccountMeta{
            pubkey:*data_account.key,
            is_signer:false,
            is_writable:true,
        }],
        data:vec![],
    };
    invoke(&instruction, &[data_account.clone()]);
    
    Ok(())
}