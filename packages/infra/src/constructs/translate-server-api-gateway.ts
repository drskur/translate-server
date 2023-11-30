import { HttpApi, IHttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export interface TranslateServerApiGatewayProps {
  readonly handler: IFunction;
}

export class TranslateServerApiGateway extends Construct {
  public readonly httpApi: IHttpApi;

  constructor(
    scope: Construct,
    id: string,
    props: TranslateServerApiGatewayProps,
  ) {
    super(scope, id);

    const { handler } = props;

    this.httpApi = new HttpApi(this, "HttpApi", {
      apiName: "TranslateServerApi",
      defaultIntegration: new HttpLambdaIntegration("Integration", handler),
    });
  }
}
