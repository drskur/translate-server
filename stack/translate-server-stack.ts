import {aws_certificatemanager, aws_lambda, aws_route53, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Architecture, AssetCode, Code, Runtime} from "aws-cdk-lib/aws-lambda";
import {PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {HttpApi, DomainName} from "@aws-cdk/aws-apigatewayv2-alpha";
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {HostedZone} from "aws-cdk-lib/aws-route53";

export class TranslateServerStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const appFunction = this.createLambdaFunction("app", Code.fromAsset("translate/target/release/"));
        appFunction.addToRolePolicy(new PolicyStatement({
            resources: ['*'],
            actions: ['translate:TranslateText']
        }));

        const domain = this.createDomainName();
        this.createApiGateway(new HttpLambdaIntegration('AppIntegration', appFunction), domain);

        new aws_route53.CnameRecord(this, "AppRouteRecord", {
            domainName: domain.regionalDomainName,
            zone: HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
                hostedZoneId: 'Z08267903R7OZVB2BE5UB',
                zoneName: 'drskur.xyz'
            }),
            recordName: 'translate'
        });
    }

    private createDomainName(): DomainName {
        const arn = 'arn:aws:acm:ap-northeast-1:832344807991:certificate/b1dcbdc1-5b2f-4690-a108-5ca6e38b21fe';
        return new DomainName(this, "TranslateDomainName", {
            domainName: "translate.drskur.xyz",
            certificate: aws_certificatemanager.Certificate.fromCertificateArn(this, "wild", arn),
        });

    }

    private createApiGateway(defaultIntegration: HttpLambdaIntegration, domainName: DomainName): HttpApi {
        return new HttpApi(this, "TranslateApi", {
            defaultIntegration,
            defaultDomainMapping: {
                domainName,
            }
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