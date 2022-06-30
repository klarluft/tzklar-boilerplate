import { credentials } from "@grpc/grpc-js";

import { CompileContractRequest, CompileExpressionRequest, Syntax } from "./generated/ligo/v1/ligo_service_pb";
import { LigoServiceClient } from "./generated/ligo/v1/ligo_service_grpc_pb";

const contractContent = `
type storage = int;

type parameter =
Increment (int)
| Decrement (int)
| Reset;

type return = (list (operation), storage);

// Two entrypoints

let add = ((store, delta) : (storage, int)) : storage => store + delta;
let sub = ((store, delta) : (storage, int)) : storage => store - delta;

/* Main access point that dispatches to the entrypoints according to
 the smart contract parameter. */
 
let main = ((action, store) : (parameter, storage)) : return => {
(([] : list (operation)),    // No operations
(switch (action) {
| Increment (n) => add ((store, n))
| Decrement (n) => sub ((store, n))
| Reset         => 0}))
};
`;

export async function testEndpoint() {
  const client = new LigoServiceClient("0.0.0.0:4000", credentials.createInsecure());

  const compileContractRequest = new CompileContractRequest();

  compileContractRequest.setContractContent(contractContent);
  compileContractRequest.setEntryPoint("main");
  compileContractRequest.setSyntax(Syntax.SYNTAX_REASONLIGO);

  await new Promise<void>((resolve, reject) => {
    client.compileContract(compileContractRequest, (error, response) => {
      if (error) reject(error);

      console.info({ compiledContractContent: response.getCompiledContractContent() });
      resolve();
    });
  });

  const compileExpressionRequest = new CompileExpressionRequest();

  compileExpressionRequest.setContractContent(contractContent);
  compileExpressionRequest.setExpressionName("main");
  compileExpressionRequest.setSyntax(Syntax.SYNTAX_REASONLIGO);

  await new Promise<void>((resolve, reject) => {
    client.compileExpression(compileExpressionRequest, (error, response) => {
      if (error) reject(error);

      console.info({ compiledExpressionContent: response.getCompiledExpressionContent() });
      resolve();
    });
  });
}
