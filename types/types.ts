import { aws_lambda as lambda } from "aws-cdk-lib"

export type LambdaFunction = {
    name: string,
    lambda: lambda.Function,
}