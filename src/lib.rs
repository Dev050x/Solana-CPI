use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

#[derive(BorshDeserialize, BorshSerialize)]
struct Counter {
    count: u32,
}

entrypoint!(counter_program);

pub fn counter_program(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let mut account = accounts.iter();
    let account_data = next_account_info(&mut account)?;
    let mut data = Counter::try_from_slice(&account_data.data.borrow())?;
    if data.count == 0 {
        data.count += 1;
    } else {
        data.count *= 2;
    }
    data.serialize(&mut *account_data.data.borrow_mut());
    msg!("Counter Updated To: {} ", data.count);
    Ok(())
}
