const ApiSingleton = (function () {
  let instance;

  function createInstance() {
    const urlApi = "http://51.92.30.55:3000";

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
