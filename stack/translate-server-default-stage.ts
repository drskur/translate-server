import {Stage, StageProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {TranslateServerStack} from "./translate-server-stack";

export class TranslateServerDefaultStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        new TranslateServerStack(this, 'TranslateServerStack');
    }
}