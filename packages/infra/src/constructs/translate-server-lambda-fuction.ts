import { Construct } from "constructs";
import {
  Architecture,
  Code,
  Function,
  IFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Stage } from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export class TranslateServerLambdaFuction extends Construct {
  public readonly fn: IFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.fn = new Function(this, "Function", {
      functionName: `TranslateServer-${Stage.of(this)?.stageName}`,
      runtime: Runtime.PROVIDED_AL2023,
      code: Code.fromAsset("../server/.dist/"),
      handler: "bootstrap",
      architecture: Architecture.ARM_64,
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
