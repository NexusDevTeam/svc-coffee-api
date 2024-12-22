import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import { IDynamoDBSetup, DynamoDBSetup } from './dynamoDB-setup';
import { ILambdaSetup, LambdaSetup } from './lambda-setup';

export class SvcCoffeeApiStack extends cdk.Stack {

  /**
   * Initializes a new instance of the SvcCoffeeApiStack class.
   * This stack sets up DynamoDB and Lambda resources for the Coffee API service.
   * 
   * @param scope - The parent construct.
   * @param id - The unique identifier for this stack.
   * @param props - Optional properties for configuring the stack.
   */
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Setup DynamoDB for the Coffee API
    const dynamoDBSetup: IDynamoDBSetup = new DynamoDBSetup(this);
    dynamoDBSetup.setupDynamoDB();
    
    // Setup Lambda functions integrated with DynamoDB
    const lambdaSetup: ILambdaSetup = new LambdaSetup(this);
    lambdaSetup.setupLambda(dynamoDBSetup.getDynamoDBTable());

    // Additional stack resources can be defined below

    // Example: SQS queue resource (commented by default)
    // const queue = new sqs.Queue(this, 'SvcCoffeeApiQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
