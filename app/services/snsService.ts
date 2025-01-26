import { Logger } from "@aws-lambda-powertools/logger";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns"
import { randomUUID } from "crypto";

export enum SnsCoffeeEventsType {
    COFFEE = "COFFEE",
    CATEGORY = "CATEGORY"
}

export enum SnsCoffeeEventsStatus {
    UPDATE = "UPDATE"
}

export interface CoffeeEventPayload {
    eventCreatedAt: string;
    eventId:string,
    data: any;
    eventSource: string;
    subject:string,
    eventType: SnsCoffeeEventsType;
    status: SnsCoffeeEventsStatus;
  }

export interface ISNSService {
    publishSNS(snsArn: string, payload: CoffeeEventPayload): Promise<void>;
    buildPayload(data: any, snsEventType: SnsCoffeeEventsType, snsEventStatus: SnsCoffeeEventsStatus, subject?: string): CoffeeEventPayload;
}

export class SNSService{
    private snsClient: SNSClient;
    private logger: Logger;

    constructor(snsClient: SNSClient) {
        this.logger = new Logger({
            logLevel: "DEBUG",
            serviceName: "SNSClient",
        });
        this.snsClient = snsClient;
    }

    async publishSNS(snsArn: string, payload: CoffeeEventPayload): Promise<void> {
        this.logger.info(`🔄 - Starting SNS publish process`);
    
        if (!snsArn) {
            this.logger.error(`❌ - SNS ARN is missing. Unable to publish the message.`);
            throw new Error("SNS ARN is required to publish the message.");
        }
    
        if (!payload) {
            this.logger.error(`❌ - Payload is missing. Unable to publish the message.`);
            throw new Error("Payload is required to publish the message.");
        }
    
        this.logger.info(`📤 - Preparing to publish message to SNS ARN: ${snsArn}`);
    
        try {
            const command = new PublishCommand({
                TopicArn: snsArn,
                Message: JSON.stringify(payload),
                MessageStructure: "json",
            });
    
            const result = await this.snsClient.send(command);
    
            if (result.$metadata.httpStatusCode === 200) {
                this.logger.info(`✅ - Message published successfully to SNS ARN: ${snsArn}`);
            } else {
                this.logger.warn(`⚠️ - Message published to SNS but with unexpected status code: ${result.$metadata.httpStatusCode}`);
            }
        } catch (error: any) {
            this.logger.error(`❌ - Failed to publish message to SNS ARN: ${snsArn}, error: ${error.message}`);
            throw new Error(`Error publishing message to SNS: ${error.message}`);
        }
    }
    
    buildPayload(data: any, snsEventType: SnsCoffeeEventsType, snsEventStatus: SnsCoffeeEventsStatus, subject: string = "COFFEE"): CoffeeEventPayload {
        return {
            data: JSON.stringify(data),
            eventCreatedAt: new Date().toISOString(),
            eventId: randomUUID(),
            eventSource: "svc-coffee-api",
            eventType: snsEventType,
            status: snsEventStatus,
            subject: subject,
        }
    }
}