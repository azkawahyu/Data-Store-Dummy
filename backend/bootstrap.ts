import { existsSync, readFileSync } from "fs";
import { join } from "path";

function loadLocalEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;

  const contents = readFileSync(filePath, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined || process.env[key] === "") {
      process.env[key] = value;
    }
  }
}

const isDockerRuntime =
  existsSync("/.dockerenv") ||
  existsSync("/run/.containerenv") ||
  process.env.DOCKER_CONTAINER === "true";

const envFiles = isDockerRuntime
  ? [".env.docker", ".env"]
  : [".env.local", ".env"];

for (const envFile of envFiles) {
  loadLocalEnvFile(join(process.cwd(), envFile));
}

async function main() {
  await import("./server");
}

main().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
