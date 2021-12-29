/* ERROR CODES */
let fa2_token_undefined_error_const = "FA2_TOKEN_UNDEFINED";
let fa2_insufficient_balance_error_const = "FA2_INSUFFICIENT_BALANCE";
let fa2_tx_denied_error_const = "FA2_TX_DENIED";
let fa2_not_owner_error_const = "FA2_NOT_OWNER";
let fa2_not_operator_error_const = "FA2_NOT_OPERATOR";
let fa2_operators_not_supported_error_const = "FA2_OPERATORS_UNSUPPORTED";
let fa2_receiver_hook_failed_error_const = "FA2_RECEIVER_HOOK_FAILED";
let fa2_sender_hook_failed_error_const = "FA2_SENDER_HOOK_FAILED";
let fa2_receiver_hook_undefined_error_const = "FA2_RECEIVER_HOOK_UNDEFINED";
let fa2_sender_hook_undefined_error_const = "FA2_SENDER_HOOK_UNDEFINED";
let not_admin_error_const = "NOT_ADMIN";

/* SOME GENERAL TYPES */
type token_id_type = nat;
type nr_of_tokens_type = nat;
type amount_type = nat;
type admin_type = address;
type new_owner_type = address;
type owner_address_type = address;
type operator_address_type = address;

/* TRANSFER TYPES */
type transfer_destination_type = [@layout:comb] {
  to_: address,
  token_id: token_id_type,
  amount: amount_type
};
type transfer_type = [@layout:comb] {
  from_: address,
  txs: list(transfer_destination_type)
};
type transfer_params_type = list(transfer_type);

/* BALANCE OF TYPES */
type balance_of_request_type = [@layout:comb] {
  owner: address,
  token_id: token_id_type
};
type balance_of_response_type = [@layout:comb] {
  request: balance_of_request_type,
  balance: nat
};
type balance_of_params_type = [@layout:comb] {
  requests: list(balance_of_request_type),
  callback: contract(list(balance_of_response_type))
};

/* UPDATE OPERATORS TYPES */
type update_operator_action_params_type = [@layout:comb] {
  owner: address,
  operator: address,
  token_id: token_id_type
};
type update_operator_action_type = [@layout:comb]
  | Add_operator (update_operator_action_params_type)
  | Remove_operator (update_operator_action_params_type);
type update_operators_params_type = list(update_operator_action_type);

/* MINT TYPES */
type mint_instruction_type = [@layout:comb] {
  to_: new_owner_type,
  token_id: token_id_type,
  amount: amount_type
};
type mint_params_type = list(mint_instruction_type);

/* LEDGER TYPES */
type ledger_value_type = nat;
type ledger_key_type = (owner_address_type, token_id_type);
type ledger_type = big_map(ledger_key_type, ledger_value_type);

/* OPERATOR TYPES */
type operators_key_type = (owner_address_type, (operator_address_type, token_id_type));
type operators_type = big_map(operators_key_type, unit);

/**
 * CONTRACT METADATA TYPES
 * TZIP-16
 * @link https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-16/tzip-16.md
 */
type contract_metadata_type = big_map(string, bytes);

/**
 * TOKEN METADATA TYPES
 * TZIP-12, TZIP-21
 * @link https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md
 * @link https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-21/tzip-21.md
 */
type token_info_type = map(string, bytes);
type token_metadata_value_type = [@layout:comb] {
  token_id: token_id_type,
  token_info: token_info_type
};
type token_metadata_type = big_map(token_id_type, token_metadata_value_type);

/**
 * OFF/ON CHAIN VIEWS TYPES
 * TZIP-12, TZIP-16
 */
type all_tokens_type = list(token_id_type);
type get_balance_params_type = [@layout:comb] {
  owner: owner_address_type,
  token_id: token_id_type
};
type total_supply_type = big_map(token_id_type, nr_of_tokens_type);
type total_supply_params_type = token_id_type;
type is_operator_params_type = [@layout:comb] {
  owner: owner_address_type,
  operator: operator_address_type,
  token_id: token_id_type
}

/* STORAGE TYPES */
type storage_type = {
  ledger: ledger_type,
  operators: operators_type,
  metadata: contract_metadata_type,
  token_metadata: token_metadata_type,
  total_supply: total_supply_type,
  all_tokens: all_tokens_type,
  admin: admin_type
};

/* ACTION TYPES */
type action_type =
  | Transfer (transfer_params_type)
  | Balance_of (balance_of_params_type)
  | Update_operators (update_operators_params_type)
  | Mint (mint_params_type);

/* RETURN TYPES */
type return_type = (list(operation), storage_type);

/* TRANSFER */
let transfer = ((params, storage): (transfer_params_type, storage_type)): return_type => {
  let transaction_sender = Tezos.sender;
  let transfers: list(transfer_type) = params;

  let new_ledger = List.fold(((ledger, transfer): (ledger_type, transfer_type)): ledger_type => {
    let transfer_from: address = transfer.from_;
    let transfer_destinations: list(transfer_destination_type) = transfer.txs;

    List.fold(((ledger, transfer_destination): (ledger_type, transfer_destination_type)): ledger_type => {
      let transfer_to: address = transfer_destination.to_;
      let transfer_token_id: token_id_type = transfer_destination.token_id;
      let transfer_amount: amount_type = transfer_destination.amount;

      let is_sender_an_owner: bool = transaction_sender == transfer_from;
      let operators_key: operators_key_type = (transfer_from, (transaction_sender, transfer_token_id));
      let is_sender_an_operator: bool = Big_map.mem(operators_key, storage.operators);
      let previous_owner_ledger_key: ledger_key_type = (transfer_from, transfer_token_id);
      let new_owner_ledger_key: ledger_key_type = (transfer_to, transfer_token_id);
      let is_token_supported: bool = Big_map.mem(transfer_token_id, storage.token_metadata);
      let is_transfering_correct_amount: bool = transfer_amount <= 1n;

      /* only owner or owner's operator can make a transfer */
      let _assert = assert_with_error(
        is_sender_an_owner ||
        is_sender_an_operator,
        fa2_not_operator_error_const
      );

      /* you can't transfer token that is not supported */
      let _assert = assert_with_error(is_token_supported, fa2_token_undefined_error_const);

      /* you can't transfer more then 1 NFT */
      let _assert = assert_with_error(is_transfering_correct_amount, fa2_tx_denied_error_const);

      /* ignore empty transfers; return unchanged ledger */
      if (transfer_amount == 0n) {
        ledger
      } else {
        let previous_owner_account_balance: nat = switch (Big_map.find_opt(previous_owner_ledger_key, ledger)) {
          | Some (account_balance) => account_balance
          | None () => 0n
        };
        let new_owner_account_balance: nat = switch (Big_map.find_opt(new_owner_ledger_key, ledger)) {
          | Some (account_balance) => account_balance
          | None () => 0n
        };

        /* owner needs to have a token to transfer it */
        let _assert = assert_with_error(previous_owner_account_balance == 1n, fa2_insufficient_balance_error_const);

        /* owner can't make transfer back to the same account */
        let _assert = assert_with_error(transfer_from != transfer_to, fa2_insufficient_balance_error_const);

        /* new owner should not have a token */
        let _assert = assert_with_error(new_owner_account_balance == 0n, fa2_insufficient_balance_error_const);

        /* remove previous owner from ledger */
        let ledger_without_previous_owner: ledger_type = Big_map.remove(previous_owner_ledger_key, ledger);

        /* add new owner to ledger */
        let ledger_after_transfer: ledger_type = Big_map.add(new_owner_ledger_key, 1n, ledger_without_previous_owner);

        /* return new ledger */
        ledger_after_transfer;
      }
    }, transfer_destinations, ledger)
  }, transfers, storage.ledger);

  ([]: list(operation), { ...storage, ledger: new_ledger });
};

/* BALANCE OF */
let balance_of = ((params, storage): (balance_of_params_type, storage_type)): return_type => {
  let responses: list(balance_of_response_type) = List.map(
    ((request): (balance_of_request_type)): balance_of_response_type => {
      let account_balance: nat = switch (Big_map.find_opt((request.owner, request.token_id), storage.ledger)) {
        | None => 0n
        | Some (account_balance) => account_balance
      };

      let response: balance_of_response_type = { request: request, balance: account_balance };
      response
    },
    params.requests
  );

  let callback_operation = Tezos.transaction(responses, 0mutez, params.callback);

  ([callback_operation], storage);
};

/* UPDATE OPERATORS */
let update_operators = ((params, storage): (update_operators_params_type, storage_type)): return_type => {
  let transaction_sender: address = Tezos.sender;
  let update_operator_actions: list(update_operator_action_type) = params;

  let new_operators: operators_type = List.fold(
    ((operators, update_operator_action): (operators_type, update_operator_action_type)): operators_type => {
      let update_operator_action_params = switch (update_operator_action) {
        | Add_operator (params) => params
        | Remove_operator (params) => params
      };

      /* only owner can update operators */
      let _assert = assert_with_error(transaction_sender == update_operator_action_params.owner, fa2_not_owner_error_const);

      let operators_key: operators_key_type = (
        update_operator_action_params.owner,
        (
          update_operator_action_params.operator,
          update_operator_action_params.token_id
        )
      );

      /* Add or remove operator */
      let new_operators: operators_type = switch (update_operator_action) {
        | Add_operator (_) => Big_map.add(operators_key, unit, operators)
        | Remove_operator (_) => Big_map.remove(operators_key, operators);
      };

      /* Return new operators */
      new_operators;
    },
    update_operator_actions,
    storage.operators
  );

  ([]: list(operation), { ...storage, operators: new_operators });
};

/* MINT */
let mint = ((params, storage): (mint_params_type, storage_type)): return_type => {
  let transaction_sender: address = Tezos.sender;

  /* Only admin can mint */
  let _assert = assert_with_error(transaction_sender == storage.admin, not_admin_error_const);

  let mint_instructions: list(mint_instruction_type) = params;

  let new_storage = List.fold(
    ((storage, mint_instruction): (storage_type, mint_instruction_type)): storage_type => {
      let mint_to = mint_instruction.to_;
      let mint_token_id = mint_instruction.token_id;
      let mint_amount = mint_instruction.amount;

      let is_token_supported: bool = Big_map.mem(mint_token_id, storage.token_metadata);
      let is_minting_correct_amount: bool = mint_amount <= 1n;
      let new_owner_ledger_key: ledger_key_type = (mint_to, mint_token_id);
      
      /* you can't transfer token that is not supported */
      let _assert = assert_with_error(is_token_supported, fa2_token_undefined_error_const);

      /* you can't mint more then 1 NFT */
      let _assert = assert_with_error(is_minting_correct_amount, fa2_insufficient_balance_error_const);

      /* ignore empty mint; return unchanged ledger */
      if (mint_amount == 0n) {
        storage
      } else {
        let account_balance: nat = switch (Big_map.find_opt(new_owner_ledger_key, storage.ledger)) {
          | Some (account_balance) => account_balance
          | None () => 0n
        };

        /* new owner should not have a token */
        let _assert = assert_with_error(account_balance == 0n, fa2_insufficient_balance_error_const);

        /* add new owner to ledger */
        let ledger_after_minting: ledger_type = Big_map.add(new_owner_ledger_key, 1n, storage.ledger);

        /* update total supply */
        let total_supply_for_token: nr_of_tokens_type = switch (Big_map.find_opt(mint_token_id, storage.total_supply)) {
          | Some (nr_of_tokens) => nr_of_tokens
          | None () => (failwith(fa2_token_undefined_error_const): nr_of_tokens_type)
        };

        let total_supply_for_token_after_minting = total_supply_for_token + 1n;

        let total_supply_after_minting = Big_map.update(
          mint_token_id,
          Some(total_supply_for_token_after_minting),
          storage.total_supply
        );

        /* return updated storage */
        {
          ...storage,
          ledger: ledger_after_minting,
          total_supply: total_supply_after_minting
        };
      }
    },
    mint_instructions,
    storage
  );

  ([]: list(operation), new_storage);
};

/**
  * ON/OFF CHAIN VIEWS
  * TZIP-12, TZIP-16
  */
[@view] let get_balance = ((params, storage): (get_balance_params_type, storage_type)): amount_type => {
  let ledger_key: ledger_key_type = (params.owner, params.token_id);

  switch (Big_map.find_opt(ledger_key, storage.ledger)) {
    | Some (account_balance) => account_balance
    | None () => 0n
  };
}

let get_balance_off_chain_view = ((params, storage): (get_balance_params_type, storage_type)): amount_type => {
  get_balance(params, storage);
}

[@view] let total_supply = ((params, storage): (total_supply_params_type, storage_type)): nr_of_tokens_type => {
  switch (Big_map.find_opt(params, storage.total_supply)) {
    | Some (nr_of_tokens) => nr_of_tokens
    | None () => (failwith(fa2_token_undefined_error_const): nr_of_tokens_type)
  };
}

let total_supply_off_chain_view = ((params, storage): (total_supply_params_type, storage_type)): nr_of_tokens_type => {
  total_supply(params, storage);
}

[@view] let all_tokens = ((_params, storage): (unit, storage_type)): all_tokens_type => {
  storage.all_tokens;
};

let all_tokens_off_chain_view = ((storage): (storage_type)): all_tokens_type => {
  all_tokens(unit, storage);
};

[@view] let is_operator = ((params, storage): (is_operator_params_type, storage_type)): bool => {
  let operators_key: operators_key_type = (params.owner, (params.operator, params.token_id));

  switch (Big_map.find_opt(operators_key, storage.operators)) {
    | Some () => true
    | None () => false
  };
};

let is_operator_off_chain_view = ((params, storage): (is_operator_params_type, storage_type)): bool => {
  is_operator(params, storage);
}

[@view] let token_metadata = ((params, storage): (token_id_type, storage_type)): token_metadata_value_type => {
  switch (Big_map.find_opt(params, storage.token_metadata)) {
    | Some (token_metadata_value) => token_metadata_value
    | None () => (failwith(fa2_token_undefined_error_const): token_metadata_value_type)
  };
}

let token_metadata_off_chain_view = ((params, storage): (token_id_type, storage_type)): token_metadata_value_type => {
  token_metadata(params, storage);
}

/* MAIN */
let main = ((action, storage): (action_type, storage_type)) : return_type => {
  switch (action) {
    | Transfer (params) => transfer((params, storage))
    | Balance_of (params) => balance_of((params, storage))
    | Update_operators (params) => update_operators((params, storage))
    | Mint (params) => mint((params, storage));
  };
};
