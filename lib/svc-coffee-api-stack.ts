import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import { IDynamoDBSetup, DynamoDBSetup } from './dynamoDB-setup';

export class SvcCoffeeApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoDBSetup: IDynamoDBSetup = new DynamoDBSetup(this);

    dynamoDBSetup.setupDynamoDB();

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'SvcCoffeeApiQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
