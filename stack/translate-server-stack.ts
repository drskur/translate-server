import {aws_lambda, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Architecture, AssetCode, Code, Runtime} from "aws-cdk-lib/aws-lambda";
import {PolicyStatement} from "aws-cdk-lib/aws-iam";
import {HttpApi} from "@aws-cdk/aws-apigatewayv2-alpha";
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export class TranslateServerStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const appFunction = this.createLambdaFunction("app", Code.fromAsset(".dist/"));
        appFunction.addToRolePolicy(new PolicyStatement({
            resources: ['*'],
            actions: ['translate:TranslateText']
        }));

        this.createApiGateway(new HttpLambdaIntegration('AppIntegration', appFunction));

    }

    private createApiGateway(defaultIntegration: HttpLambdaIntegration): HttpApi {
        return new HttpApi(this, "TranslateApi", {
            defaultIntegration,
        });
    }

    private createLambdaFunction(baseName: string, asset: AssetCode): aws_lambda.Function {
        return new aws_lambda.Function(this, baseName, {
            functionName: `${this.stackName}-${baseName}`,
            runtime: Runtime.PROVIDED_AL2,
            code: asset,
            handler: 'bootstrap',
            architecture: Architecture.ARM_64,
        });
    }
}
