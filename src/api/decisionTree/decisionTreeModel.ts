import { z, ZodType } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

// Define a base interface for the Decision Tree Node structure
interface DecisionTreeNodeBase {
    type: "SendSMS" | "SendEmail" | "Condition" | "Loop";
    phoneNumber?: string;
    sender?: string;
    receiver?: string;
    expression?: string;
    trueAction?: DecisionTreeNodeBase;
    falseAction?: DecisionTreeNodeBase;
    subtree?: DecisionTreeNodeBase;
    iterations?: number;
}

// Define the Zod schema explicitly using ZodType and z.lazy for recursive properties
export const DecisionTreeNodeSchema: ZodType<DecisionTreeNodeBase> = z.lazy(() =>
    z.object({
        type: z.enum(["SendSMS", "SendEmail", "Condition", "Loop"]).openapi({
            description: "The type of action to execute in the decision tree node.",
        }),
        phoneNumber: z.string().optional().openapi({ example: "+1234567890" }),
        sender: z.string().optional().openapi({ example: "noreply@example.com" }),
        receiver: z.string().optional().openapi({ example: "user@example.com" }),
        expression: z.string().optional().openapi({
            description: "A JavaScript expression used for conditional evaluation.",
            example: "new Date().getFullYear() === 2024",
        }),
        trueAction: DecisionTreeNodeSchema.optional().openapi({
            description: "The action to execute if the condition evaluates to true.",
        }),
        falseAction: DecisionTreeNodeSchema.optional().openapi({
            description: "The action to execute if the condition evaluates to false.",
        }),
        subtree: DecisionTreeNodeSchema.optional().openapi({
            description: "The subtree to execute if the node is a loop.",
        }),
        iterations: z.number().optional().openapi({
            description: "The number of iterations to execute if the node is a loop.",
            example: 3,
        }),
    })
).openapi({
    type: "object",
    description: "A node in the decision tree that may contain actions or nested conditions.",
});

// Input validation schema for the 'execute decision tree' endpoint
export const ExecuteDecisionTreeSchema = z.object({
    body: DecisionTreeNodeSchema,
});

// Type inference for the decision tree node
export type DecisionTreeNodeType = z.infer<typeof DecisionTreeNodeSchema>;
