const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const isCancer = confidenceScore >= 50;

    let result, suggestion;

    if (isCancer) {
      result = "Cancer";
      suggestion = "Segera periksa ke dokter!";
    } else {
      result = "Non-cancer";
      suggestion = "Penyakit kanker tidak terdeteksi.";
    }

    return {
      status: "success",
      message: "Model is predicted successfully",
      data: {
        result,
        suggestion,
        confidenceScore,
      },
    };
  } catch (error) {
    console.error("Prediction error:", error);

    return {
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    };
  }
}

module.exports = predictClassification;
