import child_process from "child_process";
import util from "util";

import * as kleur from "kleur";

import {
  CONTRACT_JSON_FILE_NAME,
  CONTRACT_JSON_FILE_PATH,
  CONTRACT_SYNTAXES,
  CONTRACT_TZ_FILE_NAME,
  CONTRACT_TZ_FILE_PATH,
} from "./configuration";

const exec = util.promisify(child_process.exec);

/**
 * This function compiles contract written in Reason LIGO into Michelson (.tz and .json)
 */
export async function compileContract(syntax: keyof typeof CONTRACT_SYNTAXES) {
  /** compiling into TZ */
  const [CONTRACT_FILE_NAME, CONTRACT_FILE_PATH] = CONTRACT_SYNTAXES[syntax];
  console.log(kleur.yellow(`compiling ${kleur.bold(CONTRACT_FILE_NAME)} contract`));
  console.log(kleur.dim(CONTRACT_FILE_PATH));
  console.log("");
  await exec(
    [
      `docker run --rm -v "$PWD":"$PWD" -w "$PWD" ligolang/ligo:0.31.0`,
      `compile contract`,
      `${CONTRACT_FILE_PATH}`,
      `--entry-point main`,
      `--michelson-format text`,
      `--output-file ${CONTRACT_TZ_FILE_PATH}`,
    ].join(" ")
  );
  console.log(kleur.yellow(`compiled contract saved to ${kleur.bold(CONTRACT_TZ_FILE_NAME)} file`));
  console.log(kleur.dim(CONTRACT_TZ_FILE_PATH));
  console.log("");

  /** compiling into JSON */
  await exec(
    [
      `docker run --rm -v "$PWD":"$PWD" -w "$PWD" ligolang/ligo:0.32.0`,
      `compile contract`,
      `${CONTRACT_FILE_PATH}`,
      `--entry-point main`,
      `--michelson-format json`,
      `--output-file ${CONTRACT_JSON_FILE_PATH}`,
    ].join(" ")
  );
  console.log(kleur.yellow(`compiled contract saved to ${kleur.bold(CONTRACT_JSON_FILE_NAME)} file`));
  console.log(kleur.dim(CONTRACT_JSON_FILE_PATH));
  console.log("");
}
