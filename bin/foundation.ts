import * as cdk from 'aws-cdk-lib';
import {TranslateServerStack} from "../stack/translate-server-stack";
import {CdkPipelineStack} from "../stack/cdk-pipeline-stack";

const app = new cdk.App();

new TranslateServerStack(app, 'TranslateServerStack', {
    env: {
        region: 'ap-northeast-1'
    }
});

new CdkPipelineStack(app, 'TranslateServerCdkPipelineStack', {
    env: {
        region: 'ap-northeast-1'
    }
});

app.synth();