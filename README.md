# Plataforma de Cursos Interativa

Este projeto é uma plataforma web moderna e responsiva para organização, navegação e consumo de cursos online. Permite ao usuário explorar cursos, tópicos e aulas de forma intuitiva, com suporte a vídeos (YouTube, mp4), áudios (mp3) e imagens personalizadas para cada curso. O visual é escuro, tecnológico e adaptado para dispositivos móveis, com cards destacados e navegação em SPA (Single Page Application).

Os dados dos cursos são organizados em arquivos JSON, facilitando a inclusão, edição e manutenção de novos conteúdos sem necessidade de alterar o código. O sistema suporta múltiplos cursos, cada um com tópicos e aulas, e oferece fallback para links externos caso o player não seja suportado.

Ideal para quem deseja criar uma vitrine de cursos, trilhas de aprendizado ou catálogo de videoaulas de forma simples, elegante e escalável.

## Pré-requisitos
- Python 3.7+
- pip (gerenciador de pacotes Python)

## Instalação
1. Clone ou baixe este repositório.
2. No terminal, navegue até a pasta do projeto.
3. (Opcional, mas recomendado) Crie um ambiente virtual:
   ```bash
   python -m venv .venv
   # Ative o ambiente virtual:
   # No Windows:
   .venv\Scripts\activate
   # No Linux/Mac:
   source .venv/bin/activate
   ```
4. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

## Como rodar o servidor
Execute o comando abaixo na raiz do projeto:
```bash
python server.py
```
O servidor estará disponível em: http://localhost:5000

## Como adicionar cursos
- Coloque arquivos `.json` na pasta `cursos/` seguindo o modelo dos exemplos já existentes.
- Cada arquivo pode conter um único curso (objeto) ou vários cursos (array de objetos).

## Estrutura esperada do JSON
```json
{
  "titulo": "Nome do Curso",
  "descricao": "Descrição do curso.",
  "imagem": "URL da imagem (opcional)",
  "topicos": [
    {
      "titulo": "Nome do Tópico",
      "aulas": [
        {
          "titulo": "Nome da Aula",
          "descricao": "Descrição opcional",
          "video": "URL do vídeo ou áudio"
        }
      ]
    }
  ]
}
```

## Observações
- O frontend carrega todos os arquivos JSON automaticamente.
- Suporta vídeos do YouTube, arquivos mp4/mp3, links públicos e áudios.
- Para atualizar/remover cursos, basta editar/remover os arquivos JSON na pasta `cursos` e recarregar a página.

---
Dúvidas ou sugestões? Abra uma issue ou entre em contato!
