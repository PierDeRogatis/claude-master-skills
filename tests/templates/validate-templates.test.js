const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const TEMPLATES_DIR = path.resolve(__dirname, "../../templates");

const REQUIRED_SECTIONS = [
  "## Commands",
  "## Git & PR Conventions",
  "## Communication Style",
  "## Skills Available",
];

const TEMPLATES = fs
  .readdirSync(TEMPLATES_DIR)
  .filter((name) => fs.statSync(path.join(TEMPLATES_DIR, name)).isDirectory())
  .map((name) => ({
    name,
    file: path.join(TEMPLATES_DIR, name, "CLAUDE.md"),
    content: fs.readFileSync(path.join(TEMPLATES_DIR, name, "CLAUDE.md"), "utf8"),
  }));

// Ensure we found templates
test("templates directory contains at least 9 templates", () => {
  assert.ok(TEMPLATES.length >= 9, `Expected ≥9 templates, found ${TEMPLATES.length}`);
});

// One test per template × per required section
for (const { name, content } of TEMPLATES) {
  for (const section of REQUIRED_SECTIONS) {
    test(`template/${name}: contains "${section}"`, () => {
      assert.ok(
        content.includes(section),
        `Template "${name}" is missing section: ${section}`
      );
    });
  }

  test(`template/${name}: contains [PROJECT_NAME] placeholder`, () => {
    assert.ok(
      content.includes("[PROJECT_NAME]"),
      `Template "${name}" is missing the [PROJECT_NAME] placeholder`
    );
  });

  test(`template/${name}: Skills Available table has at least one row`, () => {
    const skillsIdx = content.indexOf("## Skills Available");
    assert.ok(skillsIdx !== -1, `"${name}" has no Skills Available section`);
    const afterSkills = content.slice(skillsIdx);
    const tableRows = afterSkills.split("\n").filter((l) => l.startsWith("|") && !l.includes("---"));
    // Table rows include header + data rows; need at least 2 (header + 1 skill)
    assert.ok(
      tableRows.length >= 2,
      `Template "${name}" Skills table has no data rows`
    );
  });
}
