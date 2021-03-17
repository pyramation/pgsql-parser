import { deparse } from "../src";
import { cleanTree, cleanLines } from "../src/utils";
import { readFileSync } from "fs";
import { sync as glob } from "glob";

const FIXTURE_DIR = `${__dirname}/../../../__future__`;

export const check = (file) => {
  const testsql = glob(`${FIXTURE_DIR}/${file}*.sql`).map((f) =>
    readFileSync(f).toString()
  )[0];
  const testjson = glob(`${FIXTURE_DIR}/${file}*.json`).map((f) =>
    JSON.parse(readFileSync(f, "utf-8"))
  )[0];

  const tree = testjson.query.stmts.map(({ stmt, stmt_len }) => ({ RawStmt: { stmt, stmt_len } }));

  console.log(JSON.stringify(tree, null, 2));
  const sql = deparse(tree);
  console.log(sql);
  expect(sql).toMatchSnapshot();
};

it("include-index", () => {
  check("include-index");
});

it("generated", () => {
  check("generated");
});