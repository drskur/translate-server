import {aws_apigateway, aws_apigatewayv2, aws_certificatemanager, aws_lambda, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {DomainName, RestApi} from "aws-cdk-lib/aws-apigateway";
import {Architecture, AssetCode, Code, Runtime} from "aws-cdk-lib/aws-lambda";
import {PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";

export class TranslateServerStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const api = this.createApiGateway();
        const apiRole = this.createApiRole();
        const indexFunction = this.createLambdaFunction('index', Code.fromAsset('translate/target/lambda/index/'));
        const translateFunction = this.createLambdaFunction('translate', Code.fromAsset('translate/target/lambda/translate/'));
        translateFunction.addToRolePolicy(new PolicyStatement({
            resources: ['*'],
            actions: ['translate:TranslateText']
        }))


        api.root.addMethod("GET", new aws_apigateway.LambdaIntegration(indexFunction, { credentialsRole: apiRole }));
        
        const apiRoute = api.root.addResource("api");
        const translateRoute = apiRoute.addResource("translate");
        translateRoute.addMethod("POST", new aws_apigateway.LambdaIntegration(translateFunction, { credentialsRole: apiRole }));

        // const domain = this.createDomainName();
        // domain.addBasePathMapping(api);
    }

    private createDomainName(): DomainName {
        const arn = 'arn:aws:acm:us-east-1:832344807991:certificate/162b74ce-24e8-4982-8b7c-6002c14e1c14';
        return new aws_apigateway.DomainName(this, "TranslateDomainName", {
            domainName: "translate.drskur.xyz",
            certificate: aws_certificatemanager.Certificate.fromCertificateArn(this, "wild", arn),
        });

    }

    private createApiRole(): Role {
        const role = new Role(this, "api-role", {
            roleName: "ApiRole",
            assumedBy: new ServicePrincipal("apigateway.amazonaws.com")
        });
        role.addToPolicy(new PolicyStatement({
            resources: ['*'],
            actions: ['lambda:InvokeFunction']
        }));

        return role;
    }

    private createApiGateway(): RestApi {
        return new aws_apigateway.RestApi(this, "TranslateApi");
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