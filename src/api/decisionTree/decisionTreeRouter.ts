import express, { Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { decisionTreeController } from "./decisionTreeController";
import { ExecuteDecisionTreeSchema, DecisionTreeNodeSchema } from "./decisionTreeModel";

export const decisionTreeRegistry = new OpenAPIRegistry();
export const decisionTreeRouter: Router = express.Router();

// Registering DecisionTreeNode schema
decisionTreeRegistry.register("DecisionTreeNode", DecisionTreeNodeSchema);

// Registering the /execute-tree path directly for clarity
decisionTreeRegistry.registerPath({
    method: "post",
    path: "/execute-tree",
    tags: ["Decision Tree"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: ExecuteDecisionTreeSchema.shape.body,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Tree executed successfully",
            content: {
                "application/json": {
                    schema: z.null(),
                },
            },
        },
        400: {
            description: "Invalid Request",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        error: z.string(),
                    }),
                },
            },
        },
        500: {
            description: "Internal Server Error",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        error: z.string(),
                    }),
                },
            },
        },
    },
});

// Route setup remains the same, using "/"
decisionTreeRouter.post(
    "/",
    validateRequest(ExecuteDecisionTreeSchema),
    decisionTreeController.executeTree
);
