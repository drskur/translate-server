import * as cdk from 'aws-cdk-lib';
import {TranslateServerStack} from "../stack/translate-server-stack";

const app = new cdk.App();

new TranslateServerStack(app, 'TranslateServerStack');