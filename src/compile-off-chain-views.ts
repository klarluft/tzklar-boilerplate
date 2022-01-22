import child_process from "child_process";
import fs from "fs";
import util from "util";

import * as kleur from "kleur";

import { CONTRACT_SYNTAXES, OFF_CHAIN_VIEWS_TO_COMPILE } from "./configuration";

const exec = util.promisify(child_process.exec);

/**
 * This functions compiles contract written in Reason LIGO and compiles specific off-chain view functions
 * into Michelson JSON code files.
 *
 * These JSON files will be later used to populate `code` property in contract metadata.
 */
export async function compileOffChainViews(syntax: keyof typeof CONTRACT_SYNTAXES) {
  const [CONTRACT_FILE_NAME, CONTRACT_FILE_PATH] = CONTRACT_SYNTAXES[syntax];
  console.log(kleur.yellow(`compiling ${kleur.bold(CONTRACT_FILE_NAME)} contract`));
  console.log(kleur.dim(CONTRACT_FILE_PATH));

  for (const offChainViewToCompile of OFF_CHAIN_VIEWS_TO_COMPILE) {
    console.log("");
    console.log(
      kleur.yellow(`compiling off-chain view code for ${kleur.bold(offChainViewToCompile.expressionName)} function`)
    );
    const { stdout: offChainViewString } = await exec(
      [
        `docker run --rm -v "$PWD":"$PWD" -w "$PWD" ligolang/ligo:0.31.0`,
        `compile expression reasonligo ${offChainViewToCompile.expressionName}`,
        `--init-file ${CONTRACT_FILE_PATH}`,
        `--michelson-format json`,
      ].join(" ")
    );
    console.log(kleur.yellow(`off-chain view saved to ${kleur.bold(offChainViewToCompile.fileName)} file`));
    console.log(kleur.dim(offChainViewToCompile.filePath));

    await fs.promises.writeFile(offChainViewToCompile.filePath, JSON.stringify(JSON.parse(offChainViewString)));
  }
}
