import { CdkGraph, FilterPreset, Filters } from "@aws/pdk/cdk-graph";
import { CdkGraphDiagramPlugin } from "@aws/pdk/cdk-graph-plugin-diagram";
import { AwsPrototypingChecks, PDKNag } from "@aws/pdk/pdk-nag";
import { CodepipelineStack } from "./stacks/codepipeline-stack";
import { ApplicationStage } from "./stacks/application-stage";

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

/* eslint-disable @typescript-eslint/no-floating-promises */
(async () => {
  const app = PDKNag.app({
    nagPacks: [new AwsPrototypingChecks()],
  });

  const { pipeline } = new CodepipelineStack(
    app,
    "TranslateServerCodePipelineStack",
    {
      env: devEnv,
    },
  );
  const devStage = new ApplicationStage(app, "Dev", {
    env: devEnv,
  });
  pipeline.addStage(devStage);

  // new TranslateServerStack(app, "infra-dev", { env: devEnv });

  const graph = new CdkGraph(app, {
    plugins: [
      new CdkGraphDiagramPlugin({
        defaults: {
          filterPlan: {
            preset: FilterPreset.COMPACT,
            filters: [{ store: Filters.pruneCustomResources() }],
          },
        },
      }),
    ],
  });

  app.synth();
  await graph.report();
})();
