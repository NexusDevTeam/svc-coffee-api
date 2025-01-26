import { aws_sns as sns, Stack } from "aws-cdk-lib"
import { aws_ssm as ssm } from "aws-cdk-lib";
import { ParameterTier } from "aws-cdk-lib/aws-ssm";

export interface ISNSSetup {
    setupSNS(): void;
    getSNSTopic(): sns.Topic;
}

export class SNSSetup {
    private snsTopic: sns.Topic;
    private stack: Stack;

    constructor(stack: Stack) {
        this.stack = stack;
    }

    setupSNS() {
        this.snsTopic = new sns.Topic(this.stack, "CoffeeSNSTopic", {
            topicName: "CoffeeSNSTopic",
        });

        const apiEndpointParameter = new ssm.StringParameter(
            this.stack,
            "CoffeeSNSTopicArn",
            {
              parameterName: "/tucanto/sns/CoffeeSNSTopic",
              stringValue: this.snsTopic.topicArn,
            }
          );
    }

    getSNSTopic(): sns.Topic {
        return this.snsTopic;
    }
}