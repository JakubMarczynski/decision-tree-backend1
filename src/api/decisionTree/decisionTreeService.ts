import { DecisionTreeNodeType } from "@/api/decisionTree/decisionTreeModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";

export class DecisionTreeService {
    async execute(tree: DecisionTreeNodeType): Promise<ServiceResponse<null>> {
        console.log("Decision tree execution started");
        try {
            this.executeNode(tree);
            return ServiceResponse.success("Decision tree executed successfully", null);
        } catch (ex) {
            const errorMessage = `Error executing decision tree: ${(ex as Error).message}`;
            return ServiceResponse.failure(errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    private executeNode(node: DecisionTreeNodeType) {
        switch (node.type) {
            case "SendSMS":
                console.log(`Sending SMS to ${node.phoneNumber}`);
                break;
            case "SendEmail":
                console.log(`Sending email from ${node.sender} to ${node.receiver}`);
                break;
            case "Condition":
                const result = eval(node.expression || "false");
                if (result && node.trueAction) {
                    this.executeNode(node.trueAction);
                } else if (!result && node.falseAction) {
                    this.executeNode(node.falseAction);
                }
                break;
            case "Loop":
                if (node.subtree && node.iterations) {
                    for (let i = 0; i < node.iterations; i++) {
                        this.executeNode(node.subtree);
                    }
                }
                break;
            default:
                throw new Error("Unsupported node type");
        }
    }
}

export const decisionTreeService = new DecisionTreeService();
