module.exports = {

  plaintText: function(date){
    date = new Date(date);
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString("fr-FR", options);
  }

}
