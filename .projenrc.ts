import { InfrastructureTsProject } from "@aws/pdk/infrastructure";
import { Project } from "projen";
import { MonorepoTsProject } from "@aws/pdk/monorepo";
import { NodePackageManager } from "projen/lib/javascript";

const monorepo = new MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "translate",
  packageManager: NodePackageManager.PNPM,
  projenrcTs: true,
});
monorepo.addGitIgnore(".idea");

const infraProject = new InfrastructureTsProject({
  parent: monorepo,
  outdir: "packages/infra",
  name: "infra",
  packageManager: NodePackageManager.PNPM,
  deps: [
    "@aws-cdk/aws-apigatewayv2-alpha",
    "@aws-cdk/aws-apigatewayv2-integrations-alpha",
  ],
});
infraProject.addTask("deploy:codepipeline", {
  exec: "cdk deploy TranslateServerCodePipelineStack --require-approval never",
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
