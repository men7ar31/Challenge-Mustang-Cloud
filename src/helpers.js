module.exports = {
    posicionColor: function (posicion) {
      if (posicion <= 4) {
        return '#4d9b4b'; 
      } else if (posicion >= 25) {
        return '#f12b2bbb'; 
      } else {
        return '';
      }
    }
  };
  