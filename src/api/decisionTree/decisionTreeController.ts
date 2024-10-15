import { Request, Response, RequestHandler } from "express";
import { decisionTreeService } from "@/api/decisionTree/decisionTreeService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class DecisionTreeController {
    public executeTree: RequestHandler = async (req: Request, res: Response) => {
        const serviceResponse = await decisionTreeService.execute(req.body);
        return handleServiceResponse(serviceResponse, res);
    };
}

export const decisionTreeController = new DecisionTreeController();
