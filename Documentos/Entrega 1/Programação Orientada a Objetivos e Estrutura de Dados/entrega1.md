# Projeto Interdisciplinar: Clínica de RPG Maya Yoshiko Yamamoto

## Entrega 1: Programação Orientada a Objetos e Estrutura de Dados

**Integrantes:**
- Luiz Henrique Zaim da Cruz
- Lúcio Vecchio
- Gustavo Diniz Froes
- Gustavo Felizardo Pires

---
```mermaid
classDiagram
    class Usuario {
        <<abstract>>
        -int id
        -String nome
        -String email
        -String senha
        +login(email String, senha String) boolean
        +logout() void
        +alterarSenha(senhaAtual String, novaSenha String) boolean
        +getId() int
        +getNome() String
        +getEmail() String
    }

    class Paciente {
        -String cpf
        -String telefone
        -Date dataNascimento
        -boolean statusAtivo
        +getCpf() String
        +getTelefone() String
        +getDataNascimento() Date
        +isStatusAtivo() boolean
        +ativar() void
        +desativar() void
    }

    class Administrador {
        -String registroProfissional
        -String nivelAcesso
        +getRegistroProfissional() String
        +getNivelAcesso() String
        +gerenciarPermissoes(usuarioId int, permissao String) void
        +promoverAdministrador(usuarioId int) void
    }

    class UsuarioController {
        -UsuarioService usuarioService
        +listarUsuarios() List~Usuario~
        +buscarPorId(id int) Usuario
        +adicionarUsuario(dados Usuario) void
        +editarUsuario(id int, dados Usuario) boolean
        +deletarUsuario(id int) boolean
        +listarPacientes() List~Paciente~
        +listarAdministradores() List~Administrador~
    }

    class UsuarioService {
        -UsuarioRepository usuarioRepository
        +validarCadastro(usuario Usuario) boolean
        +salvar(usuario Usuario) Usuario
        +atualizar(id int, dados Usuario) Usuario
        +deletar(id int) boolean
        +buscarTodos() List~Usuario~
        +buscarPorId(id int) Usuario
        +buscarPorEmail(email String) Usuario
        +hashSenha(senha String) String
    }

    class UsuarioRepository {
        +findAll() List~Usuario~
        +findById(id int) Usuario
        +findByEmail(email String) Usuario
        +save(usuario Usuario) Usuario
        +update(usuario Usuario) Usuario
        +deleteById(id int) boolean
        +existsByEmail(email String) boolean
    }

    Usuario <|-- Paciente : herança
    Usuario <|-- Administrador : herança
    UsuarioController --> UsuarioService : usa
    UsuarioService --> UsuarioRepository : usa
    UsuarioService ..> Usuario : manipula
    UsuarioRepository ..> Usuario : persiste
```
