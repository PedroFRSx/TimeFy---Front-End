$(document).ready(function() {
    // Ação ao submeter o formulário de login
    $("#formLogin").submit(function(event) {
        event.preventDefault();

        var username = $("#username").val();
        var password = $("#password").val();

        // Simulação de autenticação (substitua com lógica real)
        if (username === 'admin' && password === 'admin') {
            // Autenticação bem-sucedida
            localStorage.setItem('loggedIn', true); // Salvar o estado de login no localStorage
            window.location.href = 'index.html'; // Redirecionar para a página principal após login
        } else {
            alert('Usuário ou senha incorretos.');
        }
    });

    // Verificar se o usuário está logado ao acessar a página principal
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'login.html'; // Redirecionar para a página de login se não estiver logado
    }
});