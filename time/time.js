function listarTimes() {
    $.ajax({
        url: 'http://localhost:8080/api/times',
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            console.log(result);
            var html = '';
            $.each(result, function (_i, data) {
                html += `<tr>`;
                html += `<td>${data.nome}</td>`;
                html += `<td>${data.dataCriacao}</td>`;
                html += `<td>${data.cidade}</td>`;
                html += `<td>${data.pais}</td>`;
                html += `<td>${data.numeroTorcedores}</td>`;
                html += `<td>${data.tecnico}</td>`;
                html += `<td>${data.dinheiroCaixa}</td>`;
                html += `<td>${data.nomeEstadio}</td>`;
                html += `<td>`;
                html += `<button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#myModal" onclick="preencherModal('${encodeURIComponent(JSON.stringify(data))}', ${data.id})">Editar</button>`;
                html += `<button class="btn btn-sm btn-danger ml-1" onclick="removerTime(${data.id})">Excluir</button>`;
                html += `</td>`;
                html += `</tr>`;
            });

            $("#tableTimesBody").html(html);

            // Inicialização da Tabela
            $('#tableTimes').DataTable();
        },
        error: function () {
            alert('Erro ao carregar a lista de times!');
        }
    });
}

function preencherModal(data, id) {
    data = JSON.parse(decodeURIComponent(data));
    console.log(data);
    $("#nome").val(data.nome);
    $("#dataCriacao").val(data.dataCriacao);
    $("#cidade").val(data.cidade);
    $("#pais").val(data.pais);
    $("#numeroTorcedores").val(data.numeroTorcedores);
    $("#tecnico").val(data.tecnico);
    $("#dinheiroCaixa").val(data.dinheiroCaixa);
    $("#nomeEstadio").val(data.nomeEstadio);
    timeId = id;
    console.log(timeId);
}

function limparModal() {
    $("#nome").val('');
    $("#dataCriacao").val('');
    $("#cidade").val('');
    $("#pais").val('');
    $("#numeroTorcedores").val('');
    $("#tecnico").val('');
    $("#dinheiroCaixa").val('');
    $("#nomeEstadio").val('');
}

$("#modalCadastro").click(limparModal);

$(document).ready(function () {
    listarTimes();
});

var timeId = null;

$("#salvarBotao").click(function (event) {
    event.preventDefault();

    var time = {
        'nome': $("#nome").val(),
        'dataCriacao': $("#dataCriacao").val(),
        'cidade': $("#cidade").val(),
        'pais': $("#pais").val(),
        'numeroTorcedores': parseInt($("#numeroTorcedores").val()),
        'tecnico': $("#tecnico").val(),
        'dinheiroCaixa': parseFloat($("#dinheiroCaixa").val()),
        'nomeEstadio': $("#nomeEstadio").val()
    };

    var url = 'http://localhost:8080/api/times';
    var type = 'POST';

    if (timeId !== null) {
        url += '/' + timeId;
        type = 'PUT';
    }

    $.ajax({
        url: url,
        type: type,
        contentType: 'application/json',
        data: JSON.stringify(time),
        success: function () {
            var message = timeId === null ? 'Time criado com sucesso!' : 'Time atualizado com sucesso!';
            alert(message);
            $('#myModal').modal('hide');
            listarTimes();
            timeId = null;  // Limpar o timeId após a operação bem-sucedida
        },
        error: function () {
            var message = timeId === null ? 'Erro ao criar o time!' : 'Erro ao atualizar o time!';
            alert(message);
        }
    });
});

function removerTime(id) {
    if (confirm('Tem certeza de que deseja remover este time?')) {
        $.ajax({
            url: 'http://localhost:8080/api/times/' + id,
            type: 'DELETE',
            success: function (result) {
                alert('Time removido com sucesso!');
                listarTimes();
            },
            error: function () {
                alert('Erro ao remover o time!');
            }
        });
    }
}
