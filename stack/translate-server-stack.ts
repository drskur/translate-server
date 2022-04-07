import {aws_apigateway, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {RestApi} from "aws-cdk-lib/aws-apigateway";

export class TranslateServerStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.createApiGateway();
    }

    private createApiGateway(): RestApi {
        const api = new aws_apigateway.RestApi(this, 'TranslateApi');

        const proxy = api.root.addResource('{proxy+}');
        proxy.addMethod('ANY');

        return api;
    }
}