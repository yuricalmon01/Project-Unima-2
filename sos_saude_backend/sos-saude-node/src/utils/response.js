// utils/response.js
function success(res, data = {}, message = '', status = 200) {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
}

function error(res, errorMessage = 'Erro interno', status = 400, extra = {}) {
  return res.status(status).json({
    success: false,
    error: errorMessage,
    ...extra, // opcional para debug/local
  });
}

module.exports = { success, error };
