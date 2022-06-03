# Gerador de playlist

Gera uma playlist com músicas cujas iniciais coincidam com as iniciais do nome do usuário do Spotify.

## Requisitos

- NodeJS 0.12.0

## Instalação

1. Clone este repositório localmente com o comando `git clone https://github.com/mbenford/spotify-playlist-generator`;
- Instale as dependências necessárias com o comando `npm install`.

Para testar se a aplicação foi instalada corretamente, execute o comando `npm start`. A mensagem abaixo deverá aparecer no console:

    Missing required configuration. Please be sure the config.json file exists and is valid
    
## Configuração

1. Acesse o [portal do desenvolvedor](https://developer.spotify.com/my-applications) do Spotify e crie um novo *application*;
2. Vá para a página de administração do *application* recém criado, clique no botão **Add URI** e adicione a seguinte URI: `http://localhost:8899/handle-spotify-response`;
3. Salve as alterações.
4. Crie um arquivo chamado `config.json` na raiz do diretório onde a aplicação foi clonada e adicione o seguinte conteúdo:

    ```javascript
    {
      "clientId": "<id do cliente da aplicação registrada no Spotify>",
      "clientSecret": "<chave secreta da aplicação registrada no Spotify>"
    }
    ```

5. Execute a aplicação com o comando `npm start`. A mensagem a seguir deverá aparecer no console:

        Server started. Listening on http://localhost:8899
    
## Utilização da aplicação

Abra um browser a acesse o endereço http://localhost:8899. A página abaixo será carregada:

![Imgur](http://i.imgur.com/X5zMEI4.jpg)

Ao clicar no botão **Fazer login no Spotify** vocẽ será redirecionado para o Spotify para fazer login com suas credenciais. Você deverá autorizar o *application* criado anteriormente a ter acesso a sua conta:

![Imgur](http://i.imgur.com/YA1xjUx.jpg)

Após autorizar o acesso, a aplicação irá gerar a playlist com músicas da coleção do usuário autenticado cujas letras iniciais coincidam com as letras do seu próprio nome:

![Imgur](http://i.imgur.com/Qm2bi2c.jpg)

## Desenvolvedores

Parar executar os testes automatizados da aplicação, execute o comando `npm test`.
