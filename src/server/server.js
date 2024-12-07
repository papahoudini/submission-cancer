require("dotenv").config();
const Hapi = require("@hapi/hapi");
const routes = require("../server/routes");
const loadModel = require("../services/loadModel");

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
      payload: {
        maxBytes: 1000000,
        parse: true,
        allow: "multipart/form-data",
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    if (response.isBoom) {
      if (response.output.statusCode === 413) {
        const newResponse = h.response({
          status: "fail",
          message: "Payload content length greater than maximum allowed: 1000000",
        });
        newResponse.code(413);
        return newResponse;
      }
      
      const newResponse = h.response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      });
      newResponse.code(400);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server started at: ${server.info.uri}`);
})();
