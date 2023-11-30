import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { TranslateServerLambdaFuction } from "../constructs/translate-server-lambda-fuction";
import { TranslateServerApiGateway } from "../constructs/translate-server-api-gateway";

export class TranslateServerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const translateServerLambda = new TranslateServerLambdaFuction(
      this,
      "TranslateServerLambdaFunction",
    );

    new TranslateServerApiGateway(this, "TranslateServerApiGateway", {
      handler: translateServerLambda.fn,
    });
  }
}
