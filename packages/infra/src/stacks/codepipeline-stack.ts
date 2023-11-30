import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import { ComputeType, LinuxArmBuildImage } from "aws-cdk-lib/aws-codebuild";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class CodepipelineStack extends Stack {
  public readonly pipeline: CodePipeline;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.pipeline = new CodePipeline(this, "CodePipeline", {
      pipelineName: "TranslateServerPipeline",
      synthCodeBuildDefaults: {
        buildEnvironment: {
          buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0,
          computeType: ComputeType.LARGE,
        },
      },
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("drskur/translate-server", "main", {
          authentication: SecretValue.secretsManager(
            "translate-github-access-token",
          ),
        }),
        primaryOutputDirectory: "packages/infra/cdk.out",
        commands: [
          "npm i -g aws-cdk pnpm",
          "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y",
          "source $HOME/.cargo/env",
          "pnpm i",
          "npx pdk build",
        ],
      }),
    });
  }
}
