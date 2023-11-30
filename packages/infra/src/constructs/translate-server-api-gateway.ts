import { IRestApi, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export interface TranslateServerApiGatewayProps {
  readonly handler: IFunction;
}

export class TranslateServerApiGateway extends Construct {
  public readonly restApi: IRestApi;

  constructor(
    scope: Construct,
    id: string,
    props: TranslateServerApiGatewayProps,
  ) {
    super(scope, id);

    const { handler } = props;

    this.restApi = new LambdaRestApi(this, "RestApi", {
      restApiName: "TranslateServerApi",
      handler,
      proxy: true,
    });
  }
}
