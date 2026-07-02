// Tiny test suite for the functions that guard the front door.
// Runs with Node's built-in runner: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateSubmission,
  validateFile,
  ACCEPTED_FILE_TYPES,
  ACCEPT_ATTR,
  MAX_FILE_SIZE,
  IDEA_MAX,
  NAME_MAX,
} from "../lib/validation.ts";
import { storagePath } from "../lib/storage-path.ts";

const VALID = {
  name: "Ion Popescu",
  email: "ion@example.com",
  phone: "",
  idea: "O aplicație care ajută vecinii să împartă unelte de grădinărit.",
  consent: true,
};

test("valid submission passes and returns trimmed data", () => {
  const { errors, data } = validateSubmission(
    { ...VALID, name: "  Ion Popescu  " },
    null,
  );
  assert.deepEqual(errors, {});
  assert.equal(data?.name, "Ion Popescu");
});

test("short idea is rejected with a Romanian message", () => {
  const { errors, data } = validateSubmission(
    { ...VALID, idea: "prea scurt" },
    null,
  );
  assert.equal(data, undefined);
  assert.match(errors.idea ?? "", /câteva cuvinte/);
});

test("idea over the max length is rejected", () => {
  const { data } = validateSubmission(
    { ...VALID, idea: "a".repeat(IDEA_MAX + 1) },
    null,
  );
  assert.equal(data, undefined);
});

test("name over the max length is rejected", () => {
  const { data } = validateSubmission(
    { ...VALID, name: "a".repeat(NAME_MAX + 1) },
    null,
  );
  assert.equal(data, undefined);
});

test("bad email is rejected", () => {
  const { errors } = validateSubmission({ ...VALID, email: "nu-e-email" }, null);
  assert.ok(errors.email);
});

test("missing consent is rejected", () => {
  const { errors } = validateSubmission({ ...VALID, consent: false }, null);
  assert.ok(errors.consent);
});

test("attachment is optional", () => {
  assert.equal(validateFile(null), null);
  assert.equal(validateFile({ size: 0, type: "" }), null);
});

test("oversized file is rejected", () => {
  const err = validateFile({ size: MAX_FILE_SIZE + 1, type: "image/jpeg" });
  assert.match(err ?? "", /prea mare/);
});

test("unaccepted file type is rejected", () => {
  const err = validateFile({ size: 1000, type: "application/zip" });
  assert.match(err ?? "", /imagini sau PDF/);
});

test("every accepted type actually validates (picker/validation aligned)", () => {
  for (const type of ACCEPTED_FILE_TYPES) {
    assert.equal(validateFile({ size: 1000, type }), null, type);
  }
  assert.equal(ACCEPT_ATTR, ACCEPTED_FILE_TYPES.join(","));
});

test("a file error blocks the submission even when fields are valid", () => {
  const { errors, data } = validateSubmission(VALID, {
    size: 1000,
    type: "application/zip",
  });
  assert.equal(data, undefined);
  assert.ok(errors.attachment);
});

// storagePath — the file name is client-supplied and lands in a URL/path.

test("storagePath sanitizes weird characters", () => {
  assert.equal(
    storagePath("id-1", "schiță finală (v2)?.png"),
    "submissions/id-1/schi_final_v2_.png",
  );
});

test("storagePath keeps simple names intact", () => {
  assert.equal(storagePath("id-1", "schita.pdf"), "submissions/id-1/schita.pdf");
});

test("storagePath caps the name at 100 chars (keeps the extension end)", () => {
  const long = "a".repeat(200) + ".png";
  const result = storagePath("id-1", long);
  const name = result.split("/").pop()!;
  assert.equal(name.length, 100);
  assert.ok(name.endsWith(".png"));
});

test("storagePath falls back when nothing safe remains", () => {
  assert.equal(storagePath("id-1", "???"), "submissions/id-1/fisier");
});
