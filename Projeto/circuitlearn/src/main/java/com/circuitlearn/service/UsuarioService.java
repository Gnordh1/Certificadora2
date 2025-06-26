
package com.circuitlearn.service;

import com.circuitlearn.dto.CadastroRequestDTO;
import com.circuitlearn.model.Usuario;
import com.circuitlearn.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario registrar(CadastroRequestDTO cadastroRequest) {
        // 1. Verificar se o e-mail já está em uso
        if (usuarioRepository.findByEmail(cadastroRequest.getEmail()).isPresent()) {
            throw new RuntimeException("O e-mail informado já está cadastrado.");
        }

        // 2. Criar uma nova entidade de usuário
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(cadastroRequest.getNome());
        novoUsuario.setEmail(cadastroRequest.getEmail());

        // 3. Salvar a senha em texto plano (NÃO SEGURO!)
        novoUsuario.setSenha(cadastroRequest.getPassword());

        // 4. Persistir o novo usuário no banco de dados
        return usuarioRepository.save(novoUsuario);
    }
}