import child_process from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

import {
  DOCKER_LIGO_IMAGE,
  GOVERNOR_CONTRACT_RELIGO_FILE_PATH,
  GOVERNOR_CONTRACT_TZ_FILE_PATH,
  SIGNER_ADDRESS,
} from "../../configuration";
import { getTezosToolkit } from "../../get-tezos-toolkit";

const exec = util.promisify(child_process.exec);

interface GetLambdaBytesProps {
  contractAddress: string;
  entrypoint: string;
  input: number;
  mutez: number;
}

const TEMPORARY_DIRECTORY_FILE_NAME = "tmp";

/**
 * Example proposal lambda that calls another contract entrypoint
 */
export async function getProposalLambda({
  contractAddress,
  entrypoint,
  input,
  mutez,
}: GetLambdaBytesProps): Promise<Record<string, unknown>> {
  const expressionToCompile = "proposal_lambda";
  const lambdaToCompile = `
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

    let ${expressionToCompile} = ((params): (proposal_lambda_params_type)): proposal_lambda_return_type => {
      let voters_list = params.voters_list;
      let is_allowed_to_propose_lambda = params.is_allowed_to_propose_lambda;
      let is_allowed_to_vote_lambda = params.is_allowed_to_vote_lambda;
      let is_allowed_to_execute_lambda = params.is_allowed_to_execute_lambda;
      let _proposal_id = params.proposal_id;
      let _proposal_voted_yes = params.proposal_voted_yes;
      let _proposal_voted_no = params.proposal_voted_no;
      let _proposal_proposed_by = params.proposal_proposed_by;
      let _proposal_proposed_at = params.proposal_proposed_at;

      let contract_to_call_option: option(contract(int)) = Tezos.get_entrypoint_opt(
        "${entrypoint}",
        ("${contractAddress}": address)
      );

      let contract_to_call: contract(int) = switch (contract_to_call_option) {
          | Some (contract_to_call) => contract_to_call
          | None () => failwith("No such contract")
      };

      let transaction_operation = Tezos.transaction(${input}, ${mutez}mutez, contract_to_call);
      let operations: proposal_lambda_return_operations_type = [transaction_operation];

      let storage: proposal_lambda_return_storage_type = {
        voters_list: voters_list,
        is_allowed_to_propose_lambda: is_allowed_to_propose_lambda,
        is_allowed_to_vote_lambda: is_allowed_to_vote_lambda,
        is_allowed_to_execute_lambda: is_allowed_to_execute_lambda,
      };

      (operations, storage);
    }

    let main = ((_action, _storage): (unit, unit)): (list(operation), unit) => {
        ([]: list(operation), unit);
    };
  `;

  const filePath = path.resolve(path.join(__dirname, TEMPORARY_DIRECTORY_FILE_NAME, "governor-proposal-lambda.religo"));

  await fs.promises.writeFile(filePath, lambdaToCompile);

  const { stdout: proposalLambdaString } = await exec(
    [
      `docker run --rm -v "$PWD":"$PWD" -w "$PWD" ${DOCKER_LIGO_IMAGE}`,
      `compile expression reasonligo ${expressionToCompile}`,
      `--init-file ${filePath}`,
      `--michelson-format json`,
    ].join(" ")
  );

  await fs.promises.unlink(filePath);

  const proposalLambda = JSON.parse(proposalLambdaString.trim());

  return proposalLambda;
}

export async function compileContract() {
  await exec(
    [
      `docker run --rm -v "$PWD":"$PWD" -w "$PWD" ${DOCKER_LIGO_IMAGE}`,
      `compile contract`,
      `${GOVERNOR_CONTRACT_RELIGO_FILE_PATH}`,
      `--entry-point main`,
      `--michelson-format text`,
      `--output-file ${GOVERNOR_CONTRACT_TZ_FILE_PATH}`,
    ].join(" ")
  );
}

export async function getInitialContractStorage(): Promise<Record<string, unknown>> {
  const { stdout: initialStorageString } = await exec(
    [
      `docker run --rm -v "$PWD":"$PWD" -w "$PWD" ${DOCKER_LIGO_IMAGE}`,
      `compile expression reasonligo initial_storage`,
      `--init-file ${GOVERNOR_CONTRACT_RELIGO_FILE_PATH}`,
      `--michelson-format json`,
    ].join(" ")
  );

  const dummyInitialStorageVoter = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb";

  /** sets current signer as the only voter and parse the JSON string */
  const initialStorage = JSON.parse(initialStorageString.trim().replace(dummyInitialStorageVoter, SIGNER_ADDRESS));

  return initialStorage;
}

export async function originateContract() {
  const initialStorage = getInitialContractStorage();

  const governorContractCode = (await fs.promises.readFile(GOVERNOR_CONTRACT_TZ_FILE_PATH)).toString();

  const tezosToolkit = await getTezosToolkit();

  const governorContractOperation = await tezosToolkit.contract.originate({
    code: governorContractCode,
    init: initialStorage,
  });

  const { address: governorContractAddress } = await governorContractOperation.contract();

  await tezosToolkit.contract.at(governorContractAddress);
}

export async function govCompile() {
  await exec(
    [
      `docker run --rm -v "$PWD":"$PWD" -w "$PWD" ${DOCKER_LIGO_IMAGE}`,
      `compile contract`,
      `${GOVERNOR_CONTRACT_RELIGO_FILE_PATH}`,
      `--entry-point main`,
      `--michelson-format text`,
      `--output-file ${GOVERNOR_CONTRACT_TZ_FILE_PATH}`,
    ].join(" ")
  );

  const { stdout: governorContractInitialStorageString } = await exec(
    [
      `docker run --rm -v "$PWD":"$PWD" -w "$PWD" ${DOCKER_LIGO_IMAGE}`,
      `compile expression reasonligo initial_storage`,
      `--init-file ${GOVERNOR_CONTRACT_RELIGO_FILE_PATH}`,
      `--michelson-format json`,
    ].join(" ")
  );

  const dummyInitialStorageVoter = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb";

  console.log("governorContractInitialStorageString", governorContractInitialStorageString);

  /** sets current signer as the only voter and parse the JSON string */
  const governorContractInitialStorage = JSON.parse(
    governorContractInitialStorageString.trim().replace(dummyInitialStorageVoter, SIGNER_ADDRESS)
  );

  const testContractCode = (await fs.promises.readFile(path.resolve(path.join(__dirname, "test.tz")))).toString();
  const governorContractCode = (
    await fs.promises.readFile(path.resolve(path.join(__dirname, "governor.tz")))
  ).toString();

  const tezosToolkit = await getTezosToolkit();

  const testContractOperation = await tezosToolkit.contract.originate({
    code: testContractCode,
    storage: 1,
  });

  const { address: testContractAddress } = await testContractOperation.contract();

  console.log("testContractAddress", testContractAddress);

  const governorContractOperation = await tezosToolkit.contract.originate({
    code: governorContractCode,
    init: governorContractInitialStorage,
  });

  const testContract = await tezosToolkit.contract.at(testContractAddress);

  const { address: governorContractAddress } = await governorContractOperation.contract();

  console.log("governorContractAddress", governorContractAddress);

  const governorContract = await tezosToolkit.contract.at(governorContractAddress);

  console.log("testContractStorage", await testContract.storage());
  console.log("governorContractStorage", await governorContract.storage());

  const proposalLambda = await getProposalLambda({
    contractAddress: testContractAddress,
    entrypoint: "%increment",
    input: 12,
    mutez: 0,
  });

  console.log("proposalLambda", proposalLambda);

  const proposeOperation = await governorContract.methods.propose(proposalLambda).send();

  await proposeOperation.confirmation(1);

  const voteOperation = await governorContract.methodsObject.vote({ proposal_id: 0, is_voting_yes: true }).send();

  await voteOperation.confirmation(1);

  const executeOperation = await governorContract.methods.execute(0).send();

  await executeOperation.confirmation(1);

  console.log("testContractStorage", await testContract.storage());
}
