const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const predictionResult = await predictClassification(model, image);
  
  if (predictionResult.status === "success") {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result: predictionResult.data.result,
      suggestion: predictionResult.data.suggestion,
      createdAt,
    };

    await storeData(id, data);

    const response = h.response({
      status: "success",
      message: "Model is predicted successfully",
      data,
    });

    if (data.result === "Cancer") {
      response.code(200);
    } else {
      response.code(201);
    }
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: predictionResult.message,
    });
    response.code(400);
    return response;
  }
}

module.exports = postPredictHandler;
