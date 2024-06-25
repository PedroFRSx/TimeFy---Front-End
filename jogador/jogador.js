$(document).ready(function() {
    // Ao carregar a página, listar os jogadores existentes
    listarJogadores();
    // Carregar times para preencher o select
    carregarTimes();

    // Limpar modal ao abrir
    $("#myModal").on("show.bs.modal", function() {
        limparModal();
    });

    // Ação do botão salvar no modal
    $("#salvarBotao").click(function(event) {
        event.preventDefault();

        var jogador = {
            'id': $("#jogadorId").val(), // Adiciona o ID do jogador ao objeto
            'nome': $("#nome").val(),
            'salario': $("#salario").val(),
            'posicao': $("#posicao").val(),
            'dataNascimento': $("#dataNascimento").val(),
            'velocidade': $("#velocidade").val(),
            'forca': $("#forca").val(),
            'altura': $("#altura").val(),
            'peso': $("#peso").val(),
            'desempenho': $("#desempenho").val(),
            'time': {
                'id': $("#idTime").val()
            }
        };

        if (!jogador.id) {
            cadastrarJogador(jogador);
        } else {
            editarJogador(jogador);
        }
    });
});

// Função para listar jogadores na tabela e atualizar contador
function listarJogadores() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/jogadores",
        success: function(response) {
            $("#corpoTabela").empty();

            response.forEach(function(jogador) {
                var timeId = jogador.time ? jogador.time.id : '';

                var newRow = `<tr>
                                <td>${jogador.nome}</td>
                                <td>${jogador.salario}</td>
                                <td>${jogador.posicao}</td>
                                <td>${jogador.dataNascimento}</td>
                                <td>${jogador.velocidade}</td>
                                <td>${jogador.forca}</td>
                                <td>${jogador.altura}</td>
                                <td>${jogador.peso}</td>
                                <td>${jogador.desempenho}</td>
                                <td>${timeId}</td>
                                <td>
                                    <button type="button" class="btn btn-warning btn-sm" onclick="editarJogadorModal(${jogador.id})">Editar</button>
                                    <button type="button" class="btn btn-danger btn-sm" onclick="excluirJogador(${jogador.id})">Excluir</button>
                                </td>
                            </tr>`;
                $("#corpoTabela").append(newRow);
            });

            // Atualizar contador de jogadores
            $("#countJogadores").text(response.length);

            // Inicializar DataTable
            if ($.fn.DataTable.isDataTable("#tabelaJogadores")) {
                $('#tabelaJogadores').DataTable().destroy();
            }

            $('#tabelaJogadores').DataTable();
        },
        error: function() {
            alert("Erro ao listar jogadores.");
        }
    });
}

// Cadastrar jogador
function cadastrarJogador(jogador) {
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/jogadores",
        contentType: "application/json",
        data: JSON.stringify(jogador),
        success: function() {
            $("#myModal").modal("hide");
            listarJogadores();
            alert("Jogador cadastrado com sucesso!");
        },
        error: function() {
            alert("Erro ao cadastrar jogador.");
        }
    });
}

// Editar jogador
function editarJogador(jogador) {
    console.log("Jogador a ser atualizado:", jogador); // Verifica o objeto jogador antes de enviar a requisição PUT

    $.ajax({
        type: "PUT",
        url: `http://localhost:8080/api/jogadores/${jogador.id}`,
        contentType: "application/json",
        data: JSON.stringify(jogador),
        success: function() {
            $("#myModal").modal("hide");
            listarJogadores();
            alert("Jogador atualizado com sucesso!");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText); // Exibe detalhes do erro no console para depuração
            alert("Erro ao atualizar jogador.");
        }
    });
}

// Carregar jogador para editar
function editarJogadorModal(id) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/jogadores/${id}`,
        success: function(jogador) {
            $("#myModal").modal("show");
            $("#jogadorId").val(jogador.id); 
            $("#nome").val(jogador.nome);
            $("#salario").val(jogador.salario);
            $("#posicao").val(jogador.posicao);
            $("#dataNascimento").val(jogador.dataNascimento);
            $("#velocidade").val(jogador.velocidade);
            $("#forca").val(jogador.forca);
            $("#altura").val(jogador.altura);
            $("#peso").val(jogador.peso);
            $("#desempenho").val(jogador.desempenho);
            $("#idTime").val(jogador.time.id);
        },
        error: function() {
            alert("Erro ao carregar jogador para edição.");
        }
    });
}

// Excluir jogador
function excluirJogador(id) {
    if (confirm("Deseja realmente excluir este jogador?")) {
        $.ajax({
            type: "DELETE",
            url: `http://localhost:8080/api/jogadores/${id}`,
            success: function() {
                listarJogadores();
                alert("Jogador excluído com sucesso!");
            },
            error: function() {
                alert("Erro ao excluir jogador.");
            }
        });
    }
}

// Limpar os campos do modal
function limparModal() {
    $("#jogadorId").val("");
    $("#nome").val("");
    $("#salario").val("");
    $("#posicao").val("");
    $("#dataNascimento").val("");
    $("#velocidade").val("");
    $("#forca").val("");
    $("#altura").val("");
    $("#peso").val("");
    $("#desempenho").val("");
    $("#idTime").val("");
}

// Carregar os times
function carregarTimes() {
    $.ajax({
        url: 'http://localhost:8080/api/times',
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            var select = $("#idTime");
            select.empty();
            select.append('<option value="" disabled selected>Selecione um time</option>');

            $.each(result, function(_i, data) {
                select.append('<option value="' + data.id + '">' + data.nome + '</option>');
            });
        },
        error: function() {
            console.log('Erro ao carregar os times');
        }
    });
}
