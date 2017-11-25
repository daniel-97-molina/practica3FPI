$(document).ready(function() {
  $("#invisible").hide();
  cargarLigas();
});

function cargarLigas() {
  $.ajax({
    headers: {
      'X-Auth-Token': 'daba442ab4ae4fd2a5827f81f4e72095'
    },
    url: 'http://api.football-data.org/v1/competitions',
    dataType: 'json',
    type: 'GET',
  }).done(function(response) {
    $("#cmbLiga").removeAttr("disabled");
    $("#cmbLiga").html('<option label="Seleccione uno"/>');
    $.map(response, function(valor, index) {
      $("#cmbLiga").append("<option value='" + valor.id + "' label='" + valor.caption + "'/>");
    });
  });
}

$("#cmbLiga").change(function() {
  $("#invisible").hide();
  vaciarTabla();
  $("#cmbEquipo").attr("disabled", "");
  $("#cmbEquipo").html('<option label="Cargando..."');
  $.ajax({
    headers: {
      'X-Auth-Token': 'daba442ab4ae4fd2a5827f81f4e72095'
    },
    url: 'http://api.football-data.org/v1/competitions/' + this.value + '/teams',
    dataType: 'json',
    type: 'GET',
  }).done(function(response) {
    $("#cmbEquipo").html('<option label="Seleccione uno"/>');
    $("#cmbEquipo").removeAttr("disabled");
    $.map(response.teams, function(valor, index) {
      $("#cmbEquipo").append("<option value='" + valor._links.players.href + "' label='" + valor.name + "'/>");
    });
  });
});

$("#cmbEquipo").change(function() {
  vaciarTabla();
  $("#h2Jugadores").removeClass("text-muted");
  $.ajax({
    headers: {
      'X-Auth-Token': 'daba442ab4ae4fd2a5827f81f4e72095'
    },
    url: this.value,
    dataType: 'json',
    type: 'GET',
  }).done(function(response) {
    console.log(response);
    if (response.players.length > 0) {
      $("#invisible").hide();
      $("#tabla").append("<tbody>");
      $.map(response.players, function(valor, index) {
        $("#tabla").append(`<tr><td>${valor.name}</td><td>${valor.position}</td>
          <td>${valor.jerseyNumber}</td><td>${valor.dateOfBirth}</td><td>${valor.nationality}</td>
          <td>${valor.contractUntil}</td><td>${valor.marketValue}</td>`);
      });
      $("#tabla").append("</tbody>");
    }else{
      $("#invisible").show();
    }
  });
});


function vaciarTabla() {
  $("#tabla").html('<thead class="thead-dark"><tr><th>Nombre</th><th>Posición</th><th>Número</th><th>Fecha de nacimiento</th><th>Nacionalidad</th><th>Contrato hasta</th><th>Valor</th></tr></thead>');
}
