import { Stage } from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  Architecture,
  Code,
  Function,
  IFunction,
  LayerVersion,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class TranslateServerLambdaFuction extends Construct {
  public readonly fn: IFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const webAdapterLayer = LayerVersion.fromLayerVersionArn(
      this,
      "WebAdapterLayer",
      `arn:aws:lambda:${Stage.of(this)
        ?.region}:753240598075:layer:LambdaAdapterLayerArm64:17`,
    );

    this.fn = new Function(this, "Function", {
      functionName: `TranslateServer-${Stage.of(this)?.stageName}`,
      runtime: Runtime.PROVIDED_AL2023,
      code: Code.fromAsset("../server/.dist/"),
      handler: "bootstrap",
      architecture: Architecture.ARM_64,
      layers: [webAdapterLayer],
    });

    this.fn.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["translate:TranslateText"],
        resources: ["*"],
      }),
    );
  }
}
