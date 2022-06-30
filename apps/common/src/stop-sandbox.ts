import child_process from "child_process";
import util from "util";

import * as kleur from "kleur";

import { DOCKER_SANDBOX_NAME } from "./configuration";

const exec = util.promisify(child_process.exec);

/**
 * Stops local sandbox tezos blockchain using docker
 */
export async function stopSandbox() {
  console.log(kleur.yellow(`stopping local sandbox tezos blockchain using docker`));
  await exec(`docker stop ${DOCKER_SANDBOX_NAME}`);
  console.log(kleur.yellow(`sandbox stopped`));
}
