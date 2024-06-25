$(document).ready(function() {
    // Função para carregar a lista de times ao carregar a página
    listarTimes();

    // Função para carregar a lista de times
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
                    html += `<button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#myModal" onclick="preencherModal('${encodeURIComponent(JSON.stringify(data))}', ${data.id})">Editar</button>`;
                    html += `<button class="btn btn-sm btn-danger ml-1" onclick="removerTime(${data.id})">Excluir</button>`;
                    html += `</td>`;
                    html += `</tr>`;
                });

                $("#corpoTabela").html(html);

                // Atualiza o contador de times
                $("#countTimes").text(`Total de Times: ${result.length}`);

                // Inicialização da Tabela
                if ($.fn.dataTable.isDataTable('#tabelaTimes')) {
                    $('#tabelaTimes').DataTable().clear().destroy();
                }
                $('#tabelaTimes').DataTable();
            },
            error: function (xhr, status, error) {
                mostrarErro('Erro ao carregar a lista de times!', status, error);
            }
        });
    }

    // Função para preencher o modal com os dados do time
    window.preencherModal = function(data, id) {
        data = JSON.parse(decodeURIComponent(data));
        $("#nome").val(data.nome);
        $("#dataCriacao").val(data.dataCriacao);
        $("#cidade").val(data.cidade);
        $("#pais").val(data.pais);
        $("#torcedores").val(data.numeroTorcedores);
        $("#tecnico").val(data.tecnico);
        $("#saldo").val(data.dinheiroCaixa);
        $("#nomeEstadio").val(data.nomeEstadio);
        timeId = id;
    }

    // Função para limpar o modal
    function limparModal() {
        $("#nome").val('');
        $("#dataCriacao").val('');
        $("#cidade").val('');
        $("#pais").val('');
        $("#torcedores").val('');
        $("#tecnico").val('');
        $("#saldo").val('');
        $("#nomeEstadio").val('');
    }

    $("#modalCadastro").click(limparModal);

    var timeId = null;

    // Função para salvar ou atualizar um time
    $("#salvarBotao").click(function(event) {
        event.preventDefault();

        var time = {
            'nome': $("#nome").val(),
            'dataCriacao': $("#dataCriacao").val(),
            'cidade': $("#cidade").val(),
            'pais': $("#pais").val(),
            'numeroTorcedores': parseInt($("#torcedores").val()),
            'tecnico': $("#tecnico").val(),
            'dinheiroCaixa': parseFloat($("#saldo").val()),
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
            error: function (res) {
                var message = timeId === null ? 'Erro ao criar o time!' : 'Erro ao atualizar o time!';
                console.log (res.responseText);
                alert(message + " - " + res.responseText);
            }
        });
    });

    // Função para remover um time
    window.removerTime = function(id) {
        if (confirm('Tem certeza de que deseja remover este time?')) {
            $.ajax({
                url: 'http://localhost:8080/api/times/' + id,
                type: 'DELETE',
                success: function () {
                    alert('Time removido com sucesso!');
                    listarTimes();
                },
                error: function (xhr, status, error) {
                    mostrarErro('Erro ao remover o time!', status, error);
                }
            });
        }
    }

    // Função para exibir mensagem de erro detalhada
    function mostrarErro(mensagem, status, error) {
        var detalhes = '';
        if (status) {
            detalhes += '\nStatus: ' + status;
        }
        if (error) {
            detalhes += '\nErro: ' + error;
        }
        alert(mensagem + detalhes);
    }
});
