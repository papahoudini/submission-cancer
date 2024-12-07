require("dotenv").config();

const tf = require("@tensorflow/tfjs-node");
async function loadModel() {
  return tf.loadGraphModel('https://storage.googleapis.com/buckets-skin-cancer/model.json');
}
module.exports = loadModel;
