## Only for CPI understanding , LITESVM & Raw Rust for Solana


## Basically this contract contain mediator(cpi) which calle actual double contract
## user account (passes the data account and double contract account) -> CPI Contract(passed data account) -> double contract account
## cpi-contract having cpi contract logic
## ./src/lib.rs having double contract logic
## index.test.ts for double
## index2.test.ts for cpi
## index3.test.ts for cpi invoke_sign

