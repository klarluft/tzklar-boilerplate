type proposer_type = address;
type voter_type = address;
type proposal_id_type = nat;

/* voter types */
type voters_list_type = set(voter_type);

/* (is allowed) lambdas */
type is_allowed_to_propose_lambda_params_type = voters_list_type;
type is_allowed_to_propose_lambda_type = (is_allowed_to_propose_lambda_params_type) => bool;
type is_allowed_to_vote_lambda_params_type = {
  voters_list: voters_list_type,
  proposal_id: proposal_id_type,
  proposal_voted_yes: voters_list_type,
  proposal_voted_no: voters_list_type,
  proposal_proposed_by: proposer_type,
  proposal_proposed_at: timestamp
}
type is_allowed_to_vote_lambda_type = (is_allowed_to_vote_lambda_params_type) => bool;
type is_allowed_to_execute_lambda_params_type = {
  voters_list: voters_list_type,
  proposal_id: proposal_id_type,
  proposal_voted_yes: voters_list_type,
  proposal_voted_no: voters_list_type,
  proposal_proposed_by: proposer_type,
  proposal_proposed_at: timestamp
}
type is_allowed_to_execute_lambda_type = (is_allowed_to_execute_lambda_params_type) => bool;

/* proposal types */
type proposal_lambda_params_type = {
  voters_list: voters_list_type,
  is_allowed_to_propose_lambda: is_allowed_to_propose_lambda_type,
  is_allowed_to_vote_lambda: is_allowed_to_vote_lambda_type,
  is_allowed_to_execute_lambda: is_allowed_to_execute_lambda_type,
  proposal_id: proposal_id_type,
  proposal_voted_yes: voters_list_type,
  proposal_voted_no: voters_list_type,
  proposal_proposed_by: proposer_type,
  proposal_proposed_at: timestamp
};
type proposal_lambda_return_operations_type = list(operation);
type proposal_lambda_return_storage_type = {
  voters_list: voters_list_type,
  is_allowed_to_propose_lambda: is_allowed_to_propose_lambda_type,
  is_allowed_to_vote_lambda: is_allowed_to_vote_lambda_type,
  is_allowed_to_execute_lambda: is_allowed_to_execute_lambda_type
};
type proposal_lambda_return_type = (proposal_lambda_return_operations_type, proposal_lambda_return_storage_type);
type proposal_lambda_type = (proposal_lambda_params_type) => proposal_lambda_return_type;
type proposal_type = [@layout:comb] {
  id: proposal_id_type,
  proposal_lambda: proposal_lambda_type,
  voted_yes: voters_list_type,
  voted_no: voters_list_type,
  is_executed: bool,
  proposed_by: proposer_type,
  proposed_at: timestamp,
  executed_at: option(timestamp)
};
type proposals_type = big_map(proposal_id_type, proposal_type);
type next_proposal_id_type = nat;

/* entrypoint params */
type propose_params_type = proposal_lambda_type;
type vote_params_type = [@layout:comb] {
  proposal_id: proposal_id_type,
  is_voting_yes: bool,
};
type execute_params_type = proposal_id_type;

/* storage */
type storage_type = {
  voters_list: voters_list_type,
  proposals: proposals_type,
  next_proposal_id: next_proposal_id_type,
  is_allowed_to_propose_lambda: is_allowed_to_propose_lambda_type,
  is_allowed_to_vote_lambda: is_allowed_to_vote_lambda_type,
  is_allowed_to_execute_lambda: is_allowed_to_execute_lambda_type
};

/* entrypoint actions */
type action_type =
  | Propose (propose_params_type)
  | Vote (vote_params_type)
  | Execute (execute_params_type);

/* return type */
type return_type = (list(operation), storage_type);

/**
  * PROPOSE - allow to propose execution of some lambda that can change the storage and can create new transactions
  */
let propose = ((params, storage): (propose_params_type, storage_type)): return_type => {
  let is_allowed_to_propose_params: is_allowed_to_propose_lambda_params_type = storage.voters_list;
  let is_allowed_to_propose: bool = storage.is_allowed_to_propose_lambda(is_allowed_to_propose_params);
  if (!is_allowed_to_propose) {
    failwith("not allowed to propose");
  };

  let proposal_id: proposal_id_type = storage.next_proposal_id;
  let proposal_lambda = params;
  let empty_voters_list: voters_list_type = Set.empty;
  let voted_yes = empty_voters_list;
  let voted_no = empty_voters_list;
  let is_executed: bool = false;
  let proposed_by: proposer_type = Tezos.sender;
  let proposed_at: timestamp = Tezos.now;
  let executed_at: option(timestamp) = None;

  let new_proposal: proposal_type = {
    id: proposal_id,
    proposal_lambda: proposal_lambda,
    voted_yes: voted_yes,
    voted_no: voted_no,
    is_executed: is_executed,
    proposed_by: proposed_by,
    proposed_at: proposed_at,
    executed_at: executed_at
  };

  let updated_proposals = Big_map.add(proposal_id, new_proposal, storage.proposals);

  let updated_next_proposal_id: proposal_id_type = proposal_id + 1n;

  let updated_storage: storage_type = {
    ...storage,
    proposals: updated_proposals,
    next_proposal_id: updated_next_proposal_id
  };

  ([]: list(operation), updated_storage);
};

/**
  * VOTE - allow for setting or changing a vote for some proposal
  */
let vote = ((params, storage): (vote_params_type, storage_type)): return_type => {
  let proposal_id = params.proposal_id;
  let is_voting_yes = params.is_voting_yes;

  let proposal = switch(Big_map.find_opt(proposal_id, storage.proposals)) {
    | Some (proposal) => proposal
    | None () => (failwith("Invalid proposal id"): proposal_type)
  };

  if (proposal.is_executed) {
    failwith("proposal already executed");
  };

  let is_allowed_to_vote_params: is_allowed_to_vote_lambda_params_type = {
    voters_list: storage.voters_list,
    proposal_id: proposal.id,
    proposal_voted_yes: proposal.voted_yes,
    proposal_voted_no: proposal.voted_no,
    proposal_proposed_by: proposal.proposed_by,
    proposal_proposed_at: proposal.proposed_at
  };
  let is_allowed_to_vote = storage.is_allowed_to_vote_lambda(is_allowed_to_vote_params);
  if (!is_allowed_to_vote) {
    failwith("not allowed to vote");
  };

  let new_voted_yes = if (is_voting_yes) {
    Set.add(Tezos.sender, proposal.voted_yes);
  } else {
    Set.remove(Tezos.sender, proposal.voted_yes);
  };

  let new_voted_no = if (!is_voting_yes) {
    Set.add(Tezos.sender, proposal.voted_no);
  } else {
    Set.remove(Tezos.sender, proposal.voted_no);
  };

  let updated_proposal: proposal_type = {
    ...proposal,
    voted_yes: new_voted_yes,
    voted_no: new_voted_no
  };

  let updated_proposals = Big_map.add(proposal_id, updated_proposal, storage.proposals);
  let updated_storage: storage_type = {
    ...storage,
    proposals: updated_proposals
  };

  ([]: list(operation), updated_storage);
};

/**
  * EXECUTE - allows to execute proposed lambda
  */
let execute = ((params, storage): (execute_params_type, storage_type)): return_type => {
  let proposal_id = params;

  let proposal = switch(Big_map.find_opt(proposal_id, storage.proposals)) {
    | Some (proposal) => proposal
    | None () => (failwith("Invalid proposal id"): proposal_type)
  };

  if (proposal.is_executed) {
    failwith("proposal already executed");
  };

  let is_allowed_to_execute_params: is_allowed_to_execute_lambda_params_type = {
    voters_list: storage.voters_list,
    proposal_id: proposal.id,
    proposal_voted_yes: proposal.voted_yes,
    proposal_voted_no: proposal.voted_no,
    proposal_proposed_by: proposal.proposed_by,
    proposal_proposed_at: proposal.proposed_at
  };
  let is_allowed_to_execute = storage.is_allowed_to_execute_lambda(is_allowed_to_execute_params);
  if (!is_allowed_to_execute) {
    failwith("not allowed to execute");
  };

  let proposal_lambda_params: proposal_lambda_params_type = {
    voters_list: storage.voters_list,
    is_allowed_to_propose_lambda: storage.is_allowed_to_propose_lambda,
    is_allowed_to_vote_lambda: storage.is_allowed_to_vote_lambda,
    is_allowed_to_execute_lambda: storage.is_allowed_to_execute_lambda,
    proposal_id: proposal.id,
    proposal_voted_yes: proposal.voted_yes,
    proposal_voted_no: proposal.voted_no,
    proposal_proposed_by: proposal.proposed_by,
    proposal_proposed_at: proposal.proposed_at
  };

  /* execute lambda */
  let (proposal_operations, proposal_storage) = proposal.proposal_lambda(proposal_lambda_params);

  let is_executed: bool = true;
  let executed_at: option(timestamp) = Some(Tezos.now);

  let updated_proposal = {
    ...proposal,
    is_executed: is_executed,
    executed_at: executed_at
  };

  let updated_proposals = Big_map.add(proposal_id, updated_proposal, storage.proposals);

  let updated_storage: storage_type = {
    voters_list: proposal_storage.voters_list,
    proposals: updated_proposals,
    next_proposal_id: storage.next_proposal_id,
    is_allowed_to_propose_lambda: proposal_storage.is_allowed_to_propose_lambda,
    is_allowed_to_vote_lambda: proposal_storage.is_allowed_to_vote_lambda,
    is_allowed_to_execute_lambda: proposal_storage.is_allowed_to_execute_lambda
  };

  (proposal_operations, updated_storage);
}

/**
  * INITIAL STORAGE
  */
let initial_storage_voters_list: set(address) = Set.literal([("tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb": address)]);
let initial_storage_proposals: big_map(nat, proposal_type) = Big_map.literal([]);
let initial_storage_next_proposal_id = 0n;
let initial_storage_is_allowed_to_propose_lambda = ((params): (voters_list_type)): bool => {
    let voters_list = params;
    Set.mem(Tezos.sender, voters_list);
};
let initial_storage_is_allowed_to_vote_lambda = ((params): (is_allowed_to_vote_lambda_params_type)): bool => {
    let voters_list = params.voters_list;
    Set.mem(Tezos.sender, voters_list);
};
let initial_storage_is_allowed_to_execute_lambda = ((params): (is_allowed_to_execute_lambda_params_type)): bool => {
    let voters_list = params.voters_list;
    let proposal_voted_yes = params.proposal_voted_yes;

    let is_a_voter = Set.mem(Tezos.sender, voters_list);

    let did_everyone_agreed: bool = Set.fold(
        ((did_everyone_agreed, voter): (bool, voter_type)): bool => {
            let did_voter_agreed = Set.mem(voter, proposal_voted_yes);
            did_everyone_agreed && did_voter_agreed;
        },
        voters_list,
        true
    );

    is_a_voter && did_everyone_agreed;
};
let initial_storage: storage_type = {
    voters_list: initial_storage_voters_list,
    proposals: initial_storage_proposals,
    next_proposal_id: initial_storage_next_proposal_id,
    is_allowed_to_propose_lambda: initial_storage_is_allowed_to_propose_lambda,
    is_allowed_to_vote_lambda: initial_storage_is_allowed_to_vote_lambda,
    is_allowed_to_execute_lambda: initial_storage_is_allowed_to_execute_lambda
}

/**
  * MAIN
  */
let main = ((action, storage): (action_type, storage_type)) : return_type => {
  switch (action) {
    | Propose (params) => propose((params, storage))
    | Vote (params) => vote((params, storage))
    | Execute (params) => execute((params, storage))
  };
};