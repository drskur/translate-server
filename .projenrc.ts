import { InfrastructureTsProject } from "@aws/pdk/infrastructure";
import { javascript, Project } from "projen";
import { MonorepoTsProject } from "@aws/pdk/monorepo";

const monorepo = new MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "translate",
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
});
monorepo.addGitIgnore(".idea");

const infraProject = new InfrastructureTsProject({
  parent: monorepo,
  outdir: "packages/infra",
  name: "infra",
});

const serverProject = new Project({
  parent: monorepo,
  outdir: "packages/server",
  name: "server",
});
serverProject.compileTask.reset("make codepipeline");
serverProject.addGitIgnore(".dist");
serverProject.addGitIgnore("target");

monorepo.addImplicitDependency(infraProject, serverProject);
monorepo.synth();
