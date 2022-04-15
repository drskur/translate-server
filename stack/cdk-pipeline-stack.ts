import {SecretValue, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {CodePipeline, CodePipelineSource, ShellStep} from "aws-cdk-lib/pipelines";
import {ComputeType, LinuxArmBuildImage} from "aws-cdk-lib/aws-codebuild";

export class CdkPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new CodePipeline(this, 'Pipeline', {
            pipelineName: 'TranslateServerPipeline',
            synthCodeBuildDefaults: {
                buildEnvironment: {
                    buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
                    computeType: ComputeType.LARGE,
                }
            },
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub('drskur/translate-server', 'main', {
                    authentication: SecretValue.secretsManager('github-access-token-secret')
                }),
                commands: [
                    'npm ci',
                    'curl --proto \'=https\' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y',
                    'source $HOME/.cargo/env',
                    'npm run build',
                    'npx cdk synth'
                ]
            })
        })
    }
}