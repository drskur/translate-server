import { monorepo } from "@aws/pdk";
import { InfrastructureTsProject } from "@aws/pdk/infrastructure";
import { javascript } from "projen";

const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "translate",
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
});
project.addGitIgnore(".idea");

new InfrastructureTsProject({
  parent: project,
  outdir: "packages/infra",
  name: "infra",
});

project.synth();
