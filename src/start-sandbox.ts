import child_process from "child_process";
import util from "util";

import * as kleur from "kleur";

import { DOCKER_SANDBOX_IMAGE, DOCKER_SANDBOX_NAME, DOCKER_SANDBOX_SCRIPT } from "./configuration";

const exec = util.promisify(child_process.exec);

/**
 * Starts local sandbox tezos blockchain using docker
 */
export async function startSandbox() {
  console.log(kleur.yellow(`starting local sandbox tezos blockchain using docker`));
  await exec(
    [
      //
      `docker run --rm`,
      `--name ${DOCKER_SANDBOX_NAME}`,
      `--detach`,
      `-p 20000:20000`,
      `-e block_time=3`,
      `${DOCKER_SANDBOX_IMAGE} ${DOCKER_SANDBOX_SCRIPT} start`,
    ].join(" ")
  );
  console.log(kleur.yellow(`sandbox started`));
}
