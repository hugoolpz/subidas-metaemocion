const ApiSingleton = (function () {
  let instance;

  function createInstance() {
    const urlApi = "http://localhost:3000/files";

    return {
      getUrlApi: function () {
        return urlApi;
      },
    };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

const api = ApiSingleton.getInstance();

export default api.getUrlApi();
